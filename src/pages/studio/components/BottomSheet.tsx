import type { MouseEvent, ReactNode } from 'react'

interface BottomSheetProps {
  children: ReactNode
  dim?: boolean
  onClose?: () => void
  className?: string
}

const BottomSheet = ({
  children,
  dim = false,
  onClose,
  className = '',
}: BottomSheetProps) => {
  const panel = (
    <section
      className={`flex w-full flex-col items-center rounded-t-[20px] border border-gray-10/60 bg-white px-5 pt-5 ${dim ? 'max-h-[85dvh] overflow-y-auto' : ''} ${className}`}
    >
      <div className="mb-3 h-1 w-11 shrink-0 rounded-full bg-gray-20" />
      {children}
    </section>
  )

  if (!dim) return panel

  return (
    <div
      className="fixed inset-0 z-40 mx-auto flex max-w-[390px] flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <div onClick={(event: MouseEvent) => event.stopPropagation()}>
        {panel}
      </div>
    </div>
  )
}

export default BottomSheet
