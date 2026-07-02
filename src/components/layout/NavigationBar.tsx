import type { ReactNode } from 'react'
import { IcBack, IcClose } from '../icons'

interface Props {
  title?: string
  showLeft?: boolean
  showRight?: boolean
  leftNode?: ReactNode
  rightNode?: ReactNode
}

const NavigationBar = ({
  title,
  showLeft = true,
  showRight = true,
  leftNode,
  rightNode,
}: Props) => (
  <div className="flex items-center justify-between w-full px-5 py-3 border-b border-gray-10">
    <div className="w-8 h-8 flex items-center justify-center overflow-hidden shrink-0">
      {showLeft && (leftNode ?? <IcBack width={24} height={24} />)}
    </div>
    <div className="flex-1 flex items-center justify-center">
      {title && <span className="text-[18px] font-semibold text-black whitespace-nowrap">{title}</span>}
    </div>
    <div className="w-9 h-9 flex items-center justify-center overflow-hidden shrink-0">
      {showRight && (rightNode ?? <IcClose width={24} height={24} />)}
    </div>
  </div>
)

export default NavigationBar
