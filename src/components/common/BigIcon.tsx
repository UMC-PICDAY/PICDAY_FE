/**
 * BigIcon 사용법
 *
 * 결과없음/안내 화면의 큰 원형 아이콘 래퍼 (76px 연한 핑크 원)
 *   <BigIcon>
 *     <IcSearch width={36} height={36} className="text-brand-80" />
 *   </BigIcon>
 */

import type { ReactNode } from 'react'

interface BigIconProps {
  children: ReactNode
  className?: string
}

const BigIcon = ({ children, className = '' }: BigIconProps) => (
  <div
    className={`flex size-[76px] items-center justify-center rounded-full bg-brand-20/40 ${className}`}
  >
    {children}
  </div>
)

export default BigIcon
