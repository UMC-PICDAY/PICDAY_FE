interface TimeChipProps {
  label: string
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}

const TimeChip = ({
  label,
  selected = false,
  disabled = false,
  onClick,
  className = '',
}: TimeChipProps) => {
  const tone = disabled
    ? 'border-gray-20 bg-gray-10 font-b10 text-gray-40'
    : selected
      ? 'border-brand-80 bg-brand-20 font-b9 text-brand-80'
      : 'border-gray-10/60 bg-white/75 font-b10 text-gray-60 shadow-[0px_15px_40px_0px_rgba(206,206,206,0.08)]'

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-8 items-center justify-center whitespace-nowrap rounded-[32px] border px-4 backdrop-blur-[10px] disabled:cursor-not-allowed ${tone} ${className}`}
    >
      {label}
    </button>
  )
}

export default TimeChip
