import type { ReactNode } from 'react'

import BigIcon from '@/components/common/BigIcon'
import ResetButton from '@/components/common/ResetButton'

interface ErrorNoticeProps {
  icon: ReactNode
  title: string
  retryLabel?: string
  onRetry?: () => void
}

const ErrorNotice = ({
  icon,
  title,
  retryLabel = '새로고침',
  onRetry,
}: ErrorNoticeProps) => (
  <div className="flex flex-col items-center justify-center gap-5">
    <BigIcon>{icon}</BigIcon>
    <p className="font-b3 text-black">{title}</p>
    <ResetButton label={retryLabel} tone="pink" onClick={onRetry} />
  </div>
)

export default ErrorNotice
