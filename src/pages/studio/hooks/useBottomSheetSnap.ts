import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type {
  PointerEvent as ReactPointerEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react'

export type SheetSnap = 'collapsed' | 'half' | 'expanded'

/** 드래그를 시작한 표면. 끝난 뒤 어떤 클릭을 막을지 판단하는 데 쓴다. */
type DragSource = 'handle' | 'list'

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
// 반펼침은 사진관 카드 한 장이 딱 떨어지는 높이로 맞춘다.
// 손잡이 20 + 헤더 41 + 카드 328.6 + 탭바 63.4 + 시트 위아래 테두리 2
const HALF_VISIBLE = 455
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
    const halfVisible = Math.min(HALF_VISIBLE, height)
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
    source: DragSource
  } | null>(null)
  const pendingList = useRef<{ startY: number } | null>(null)
  const suppressClick = useRef(false)
  const suppressListClick = useRef(false)

  const clamp = (value: number) => clampOffset(value, collapsedOffset)

  const beginDrag = (clientY: number, source: DragSource) => {
    drag.current = {
      startY: clientY,
      startOffset: targetOffset,
      lastY: clientY,
      lastTime: performance.now(),
      velocity: 0,
      moved: false,
      source,
    }
  }

  const moveDrag = (clientY: number) => {
    const state = drag.current
    if (!state) return
    const now = performance.now()
    const dt = now - state.lastTime
    if (dt > 0) state.velocity = (clientY - state.lastY) / dt
    state.lastY = clientY
    state.lastTime = now

    if (!state.moved) {
      if (Math.abs(clientY - state.startY) <= DRAG_THRESHOLD) return
      state.moved = true
      // 단순 터치만으로 지도의 입력 상태가 바뀌지 않도록 실제 드래그가
      // 시작되는 시점에만 지도 상호작용을 잠근다.
      setIsDragging(true)
    }

    setDragOffset(clamp(state.startOffset + (clientY - state.startY)))
  }

  const endDrag = () => {
    const state = drag.current
    if (!state) return
    const current = clamp(state.startOffset + (state.lastY - state.startY))
    const decided = decideSnap(current, state.velocity, offsets, snap)
    suppressClick.current = state.moved && state.source === 'handle'
    // 카드 위에서 드래그를 끝내면 브라우저가 click을 이어 발생시키므로,
    // 의도치 않은 사진관 상세 이동을 막는다.
    suppressListClick.current = state.moved && state.source === 'list'
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
      beginDrag(event.clientY, 'handle')
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

  // 목록도 시트 조작 표면으로 쓴다. half·expanded 모두 전체 목록을 담고
  // 스크롤되므로, 스크롤이 우선이고 최상단에서 아래로 당길 때만 시트로 넘긴다.
  // collapsed에서는 목록이 숨겨져 이 표면 자체가 노출되지 않는다.
  const listScrolls = snap !== 'collapsed'

  const listHandlers = {
    onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => {
      suppressListClick.current = false
      const list = listRef.current
      if (!list) return
      if (listScrolls && list.scrollTop > 0) return
      pendingList.current = { startY: event.clientY }
    },
    onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => {
      if (drag.current) {
        moveDrag(event.clientY)
        return
      }
      const pending = pendingList.current
      const list = listRef.current
      if (!pending || !list) return
      const delta = event.clientY - pending.startY
      const shouldDrag = listScrolls
        ? delta > DRAG_THRESHOLD && list.scrollTop <= 0
        : Math.abs(delta) > DRAG_THRESHOLD

      if (shouldDrag) {
        event.currentTarget.setPointerCapture?.(event.pointerId)
        beginDrag(pending.startY, 'list')
        pendingList.current = null
        moveDrag(event.clientY)
      } else if (listScrolls && delta < 0) {
        // 위로 미는 제스처는 스크롤에 넘긴다.
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
    onClickCapture: (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!suppressListClick.current) return
      suppressListClick.current = false
      event.preventDefault()
      event.stopPropagation()
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
