import { IcPin } from '@/components/icons'

interface MapButtonProps {
  label?: string
  className?: string
  onClick?: () => void
}

const MapButton = ({
  label = '지도보기',
  className = '',
  onClick,
}: MapButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-12 w-32 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand-100 font-b5 text-white ${className}`}
  >
    <IcPin width={24} height={24} />
    {label}
  </button>
)

export default MapButton
