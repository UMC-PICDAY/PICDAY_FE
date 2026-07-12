type ResetButtonTone = 'gray' | 'pink'

interface ResetButtonProps {
  label?: string
  tone?: ResetButtonTone
  className?: string
  onClick?: () => void
}

const toneStyles: Record<ResetButtonTone, string> = {
  gray: 'border-gray-40 text-gray-60',
  pink: 'border-brand-20 text-brand-80',
}

const ResetButton = ({
  label = '필터 초기화',
  tone = 'gray',
  className = '',
  onClick,
}: ResetButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center whitespace-nowrap rounded-lg border bg-white px-6 py-2 font-b7 ${toneStyles[tone]} ${className}`}
  >
    {label}
  </button>
)

export default ResetButton
