type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  onClick?: () => void
}

const Button = ({ children, variant = 'primary', disabled = false, onClick }: ButtonProps) => (
  <button
    className={`flex items-center justify-center w-full py-3 px-5 border-none rounded-lg cursor-pointer transition-opacity duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
      variant === 'primary'
        ? 'bg-brand-100 text-white text-[var(--font-b3-size)] font-[var(--font-b3-weight)] leading-[var(--font-b3-line-height)]'
        : 'bg-gray-10 text-gray-80 text-[var(--font-b6-size)] font-[var(--font-b6-weight)] leading-[var(--font-b6-line-height)]'
    }`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
)

export default Button
