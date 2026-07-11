import mapPinIcon from '@/assets/images/studio/map-pin.svg'

interface MapPinProps {
  label?: string
  className?: string
}

const MapPin = ({ label = '데이지스튜디오', className = '' }: MapPinProps) => (
  <div className={`flex w-[73px] flex-col items-center gap-[5px] ${className}`}>
    <img src={mapPinIcon} alt="" className="size-[52px] shrink-0" />
    <span className="text-center font-cap2 text-gray-80">{label}</span>
  </div>
)

export default MapPin
