import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { IcCheck, IcEvent } from '@/components/icons'

export type SelectFieldProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  variant?: 'date' | 'purpose'
  value?: string
  placeholder?: string
  icon?: ReactNode
}

/** 날짜 또는 촬영 목적 선택 화면을 여는 field trigger입니다. */
const SelectField = ({
  variant = 'date',
  value,
  placeholder = variant === 'date' ? '날짜 선택' : '목적 선택',
  icon,
  className = '',
  type = 'button',
  ...buttonProps
}: SelectFieldProps) => (
  <button
    type={type}
    className={`flex h-12 w-full items-center gap-2.5 rounded-lg border bg-[var(--color-white)]/75 px-4 text-left shadow-[0_15px_40px_rgba(206,206,206,0.08)] backdrop-blur-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-100)] disabled:cursor-not-allowed disabled:opacity-40 ${
      value
        ? 'border-[var(--color-black)] text-[var(--color-gray-80)]'
        : 'border-[var(--color-gray-10)]/60 text-[var(--color-gray-40)]'
    } ${className}`}
    {...buttonProps}
  >
    <span className="inline-flex size-6 shrink-0 items-center justify-center" aria-hidden>
      {icon ?? (variant === 'date' ? <IcEvent /> : <IcCheck />)}
    </span>
    <span className="font-b6">{value || placeholder}</span>
  </button>
)

export default SelectField
