import { useEffect, useState } from 'react'
import type {
  PointerEvent as ReactPointerEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  RefObject,
} from 'react'

import type { SheetSnap } from '@/pages/studio/hooks/useBottomSheetSnap'

interface HandleHandlers {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerCancel: () => void
  onClick: () => void
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void
}

interface ListHandlers {
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerCancel: () => void
  onClickCapture: (event: ReactMouseEvent<HTMLDivElement>) => void
}

interface StudioResultsBottomSheetProps {
  snap: SheetSnap
  translateY: number
  isDragging: boolean
  handleHandlers: HandleHandlers
  listHandlers: ListHandlers
  listRef: RefObject<HTMLDivElement | null>
  header: ReactNode
  footer?: ReactNode
  children: ReactNode
}

const SNAP_LABEL: Record<SheetSnap, string> = {
  collapsed: '접힘',
  half: '반 펼침',
  expanded: '펼침',
}

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

const StudioResultsBottomSheet = ({
  snap,
  translateY,
  isDragging,
  handleHandlers,
  listHandlers,
  listRef,
  header,
  footer,
  children,
}: StudioResultsBottomSheetProps) => {
  const reduceMotion = usePrefersReducedMotion()
  const isExpanded = snap === 'expanded'
  // collapsed에서는 핸들 바만 노출. 단 드래그 중에는 내용을 유지해 슬라이드를 매끄럽게.
  const showContent = snap !== 'collapsed' || isDragging

  return (
    <section
      aria-label="검색 결과"
      className="absolute inset-x-0 top-0 flex h-full flex-col rounded-t-[20px] border border-gray-10/60 bg-white shadow-[0px_-4px_24px_rgba(206,206,206,0.12)]"
      style={{
        transform: `translateY(${translateY}px)`,
        transition:
          isDragging || reduceMotion
            ? 'none'
            : 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <button
        type="button"
        aria-label={`검색 결과 시트, 현재 ${SNAP_LABEL[snap]}. 위아래 방향키로 조절`}
        className="flex w-full shrink-0 cursor-grab touch-none flex-col items-center pb-1 pt-3 active:cursor-grabbing"
        {...handleHandlers}
      >
        <span className="h-1 w-11 rounded-full bg-gray-20" />
      </button>

      {/* 헤더도 손잡이와 같은 드래그 표면으로 둬서 조작 영역을 넓힌다. */}
      {showContent ? (
        <div
          className="shrink-0 cursor-grab touch-none px-5 active:cursor-grabbing"
          {...handleHandlers}
        >
          {header}
        </div>
      ) : null}

      <div
        ref={listRef}
        className={`min-h-0 flex-1 px-5 ${
          !showContent
            ? 'hidden'
            : isExpanded
              ? 'overflow-y-auto overscroll-contain'
              : 'overflow-hidden'
        }`}
        style={{ touchAction: isExpanded ? 'pan-y' : 'none' }}
        {...listHandlers}
      >
        {children}
      </div>

      {isExpanded && footer ? <div className="shrink-0">{footer}</div> : null}
    </section>
  )
}

export default StudioResultsBottomSheet
