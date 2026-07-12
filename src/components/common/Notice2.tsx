/**
 * Notice2 사용법
 *
 * [reset] 결과없음 안내 + 초기화 버튼 (기본)
 *   <Notice2 onReset={handleReset} />
 *   <Notice2 title="조건에 맞는 사진관이 없어요" description="필터를 조정해 보세요" onReset={handleReset} />
 *
 * [message] 아이콘 + 단일 문구 (예: 사진 없음)
 *   <Notice2 variant="message" icon={<IcPicture width={36} height={36} />} title="아직 등록된 사진이 없어요" />
 */

import type { ReactNode } from 'react'

import BigIcon from '@/components/common/BigIcon'
import ResetButton from '@/components/common/ResetButton'
import { IcSearch } from '@/components/icons'

type Notice2Variant = 'reset' | 'message'

interface Notice2Props {
  variant?: Notice2Variant
  icon?: ReactNode
  title?: string
  description?: string
  resetLabel?: string
  onReset?: () => void
  className?: string
}

const Notice2 = ({
  variant = 'reset',
  icon,
  title,
  description,
  resetLabel = '필터 초기화',
  onReset,
  className = '',
}: Notice2Props) => {
  const resolvedIcon = icon ?? (
    <IcSearch width={36} height={36} className="text-brand-80" />
  )

  if (variant === 'message') {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-5 ${className}`}
      >
        <BigIcon>{resolvedIcon}</BigIcon>
        {title && <p className="font-b4 text-gray-60">{title}</p>}
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-5 ${className}`}
    >
      <BigIcon>{resolvedIcon}</BigIcon>
      <div className="flex flex-col items-center gap-1">
        <p className="font-b3 text-black">
          {title ?? '조건에 맞는 사진관이 없어요'}
        </p>
        <p className="font-b6 text-gray-60">
          {description ?? '필터를 조정하거나 다른 검색어로 찾아보세요'}
        </p>
      </div>
      <ResetButton label={resetLabel} onClick={onReset} />
    </div>
  )
}

export default Notice2
