import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type {
  PointerEvent as ReactPointerEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react'

export type SheetSnap = 'collapsed' | 'half' | 'expanded'

interface UseBottomSheetSnapOptions {
  snap: SheetSnap
  onSnapChange: (snap: SheetSnap) => void
}

export interface SnapOffsets {
  collapsed: number
  half: number
  expanded: number
}

const SNAP_ORDER: SheetSnap[] = ['collapsed', 'half', 'expanded']
const FLICK_VELOCITY = 0.5 // px/ms
const COLLAPSED_VISIBLE = 48
const DRAG_THRESHOLD = 6

export const step = (snap: SheetSnap, dir: number): SheetSnap => {
  const index = SNAP_ORDER.indexOf(snap)
  return SNAP_ORDER[Math.min(Math.max(index + dir, 0), SNAP_ORDER.length - 1)]
}

export const nearestSnap = (offset: number, offsets: SnapOffsets): SheetSnap =>
  (Object.entries(offsets) as [SheetSnap, number][]).reduce((best, current) =>
    Math.abs(current[1] - offset) < Math.abs(best[1] - offset) ? current : best,
  )[0]

export const decideSnap = (
  offset: number,
  velocity: number,
  offsets: SnapOffsets,
  startSnap: SheetSnap,
): SheetSnap => {
  if (velocity <= -FLICK_VELOCITY) return step(startSnap, 1)
  if (velocity >= FLICK_VELOCITY) return step(startSnap, -1)
  return nearestSnap(offset, offsets)
}

export const clampOffset = (value: number, collapsedOffset: number) =>
  Math.min(Math.max(value, 0), collapsedOffset)

/**
 * 검색 결과 바텀시트의 스냅 지오메트리와 포인터 드래그를 관리한다.
 * 스냅 상태는 호출부(페이지)가 소유하고, 이 훅은 위치 계산과 제스처만 담당한다.
 */
export const useBottomSheetSnap = ({
  snap,
  onSnapChange,
}: UseBottomSheetSnapOptions) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const [collapsedOffset, setCollapsedOffset] = useState(0)
  const [halfOffset, setHalfOffset] = useState(0)
  const [dragOffset, setDragOffset] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const recompute = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const height = el.clientHeight
    const halfVisible = Math.min(Math.max(height * 0.52, 300), height)
    setCollapsedOffset(Math.max(height - COLLAPSED_VISIBLE, 0))
    setHalfOffset(Math.max(height - halfVisible, 0))
  }, [])

  useLayoutEffect(() => {
    recompute()
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(recompute)
    observer.observe(el)
    window.addEventListener('resize', recompute)
    window.addEventListener('orientationchange', recompute)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', recompute)
      window.removeEventListener('orientationchange', recompute)
    }
  }, [recompute])

  const offsets: SnapOffsets = {
    collapsed: collapsedOffset,
    half: halfOffset,
    expanded: 0,
  }
  const targetOffset = offsets[snap]
  const translateY = dragOffset ?? targetOffset

  const drag = useRef<{
    startY: number
    startOffset: number
    lastY: number
    lastTime: number
    velocity: number
    moved: boolean
    suppressClickAfterEnd: boolean
  } | null>(null)
  const pendingList = useRef<{ startY: number } | null>(null)
  const suppressClick = useRef(false)

  const clamp = (value: number) => clampOffset(value, collapsedOffset)

  const beginDrag = (clientY: number, suppressClickAfterEnd: boolean) => {
    drag.current = {
      startY: clientY,
      startOffset: targetOffset,
      lastY: clientY,
      lastTime: performance.now(),
      velocity: 0,
      moved: false,
      suppressClickAfterEnd,
    }
    setIsDragging(true)
    setDragOffset(targetOffset)
  }

  const moveDrag = (clientY: number) => {
    const state = drag.current
    if (!state) return
    const now = performance.now()
    const dt = now - state.lastTime
    if (dt > 0) state.velocity = (clientY - state.lastY) / dt
    state.lastY = clientY
    state.lastTime = now
    if (Math.abs(clientY - state.startY) > DRAG_THRESHOLD) state.moved = true
    setDragOffset(clamp(state.startOffset + (clientY - state.startY)))
  }

  const endDrag = () => {
    const state = drag.current
    if (!state) return
    const current = clamp(state.startOffset + (state.lastY - state.startY))
    const decided = decideSnap(current, state.velocity, offsets, snap)
    suppressClick.current = state.moved && state.suppressClickAfterEnd
    drag.current = null
    pendingList.current = null
    setIsDragging(false)
    setDragOffset(null)
    onSnapChange(decided)
  }

  const cancelDrag = () => {
    drag.current = null
    pendingList.current = null
    suppressClick.current = false
    setIsDragging(false)
    setDragOffset(null)
  }

  const cycleSnap = () => {
    const next: Record<SheetSnap, SheetSnap> = {
      collapsed: 'half',
      half: 'expanded',
      expanded: 'half',
    }
    onSnapChange(next[snap])
  }

  const handleHandlers = {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      suppressClick.current = false
      event.currentTarget.setPointerCapture?.(event.pointerId)
      beginDrag(event.clientY, true)
    },
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => {
      if (drag.current) moveDrag(event.clientY)
    },
    onPointerUp: (event: ReactPointerEvent<HTMLElement>) => {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      endDrag()
    },
    onPointerCancel: cancelDrag,
    onClick: () => {
      if (suppressClick.current) {
        suppressClick.current = false
        return
      }
      cycleSnap()
    },
    onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowUp') {
        onSnapChange(step(snap, 1))
        event.preventDefault()
      } else if (event.key === 'ArrowDown') {
        onSnapChange(step(snap, -1))
        event.preventDefault()
      } else if (event.key === 'Home') {
        onSnapChange('collapsed')
        event.preventDefault()
      } else if (event.key === 'End') {
        onSnapChange('expanded')
        event.preventDefault()
      }
    },
  }

  // expanded에서는 목록 최상단에서 아래로 당길 때만 시트 드래그로 넘긴다.
  // half에서는 목록 자체가 스크롤되지 않으므로(overflow-hidden), 위/아래 어느 방향으로
  // 드래그해도 바로 시트 드래그로 넘겨 손잡이를 정확히 잡지 않아도 펼칠 수 있게 한다.
  const listHandlers = {
    onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => {
      if (snap === 'collapsed') return
      if (snap === 'half') {
        pendingList.current = { startY: event.clientY }
        return
      }
      const list = listRef.current
      if (list && list.scrollTop <= 0) {
        pendingList.current = { startY: event.clientY }
      }
    },
    onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => {
      if (drag.current) {
        moveDrag(event.clientY)
        return
      }
      const pending = pendingList.current
      if (!pending) return
      const delta = event.clientY - pending.startY

      if (snap === 'half') {
        if (Math.abs(delta) > DRAG_THRESHOLD) {
          event.currentTarget.setPointerCapture?.(event.pointerId)
          beginDrag(pending.startY, false)
          pendingList.current = null
          moveDrag(event.clientY)
        }
        return
      }

      const list = listRef.current
      if (!list) return
      if (delta > DRAG_THRESHOLD && list.scrollTop <= 0) {
        event.currentTarget.setPointerCapture?.(event.pointerId)
        beginDrag(pending.startY, false)
        pendingList.current = null
        moveDrag(event.clientY)
      } else if (delta < 0) {
        pendingList.current = null
      }
    },
    onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => {
      pendingList.current = null
      if (drag.current) {
        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }
        endDrag()
      }
    },
    onPointerCancel: () => {
      cancelDrag()
    },
  }

  return {
    containerRef,
    listRef,
    translateY,
    isDragging,
    handleHandlers,
    listHandlers,
  }
}
