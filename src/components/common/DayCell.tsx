import type { ButtonHTMLAttributes } from 'react'

export type DayCellProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  day: number | string
  selected?: boolean
}

/** Calendar에서 사용하는 28×28px 날짜 셀입니다. */
const DayCell = ({
  day,
  selected = false,
  disabled = false,
  className = '',
  type = 'button',
  ...buttonProps
}: DayCellProps) => (
  <button
    type={type}
    className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full font-b8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-100)] disabled:cursor-not-allowed disabled:text-[var(--color-gray-20)] ${
      selected
        ? 'bg-[var(--color-brand-100)] text-[var(--color-white)]'
        : 'bg-transparent text-[var(--color-black)]'
    } ${className}`}
    aria-pressed={selected}
    disabled={disabled}
    {...buttonProps}
  >
    {day}
  </button>
)

export default DayCell
