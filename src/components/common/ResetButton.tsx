interface ResetButtonProps {
  label?: string
  className?: string
  onClick?: () => void
}

const ResetButton = ({
  label = '필터 초기화',
  className = '',
  onClick,
}: ResetButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center whitespace-nowrap rounded-lg border border-gray-40 bg-white px-6 py-2 font-b7 text-gray-60 ${className}`}
  >
    {label}
  </button>
)

export default ResetButton
