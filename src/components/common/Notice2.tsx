import type { ReactNode } from 'react'

import BigIcon from '@/components/common/BigIcon'
import ResetButton from '@/components/common/ResetButton'
import { IcSearch } from '@/components/icons'

interface Notice2Props {
  icon?: ReactNode
  title?: string
  description?: string
  resetLabel?: string
  onReset?: () => void
  className?: string
}

const Notice2 = ({
  icon = <IcSearch width={36} height={36} className="text-brand-80" />,
  title = '조건에 맞는 사진관이 없어요',
  description = '필터를 조정하거나 다른 검색어로 찾아보세요',
  resetLabel = '필터 초기화',
  onReset,
  className = '',
}: Notice2Props) => (
  <div
    className={`flex flex-col items-center justify-center gap-5 ${className}`}
  >
    <BigIcon>{icon}</BigIcon>
    <div className="flex flex-col items-center gap-1">
      <p className="font-b3 text-black">{title}</p>
      {description && <p className="font-b6 text-gray-60">{description}</p>}
    </div>
    <ResetButton label={resetLabel} onClick={onReset} />
  </div>
)

export default Notice2
