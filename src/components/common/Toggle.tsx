import type { ButtonHTMLAttributes, MouseEvent } from 'react'

export type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

/** 44×24px 규격의 controlled toggle switch입니다. */
const Toggle = ({
  checked = false,
  onCheckedChange,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel = '토글',
  ...buttonProps
}: ToggleProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) onCheckedChange?.(!checked)
  }

  return (
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-100)] disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? 'bg-[var(--color-brand-100)]' : 'bg-[var(--color-gray-20)]'
      } ${className}`}
      {...buttonProps}
    >
      <span
        aria-hidden
        className={`size-5 rounded-full bg-[var(--color-white)] transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default Toggle
