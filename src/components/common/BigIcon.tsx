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
