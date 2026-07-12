import { IcMapPin } from '@/components/icons'

interface MapPinProps {
  label?: string
  className?: string
}

const MapPin = ({ label = '데이지스튜디오', className = '' }: MapPinProps) => (
  <div className={`flex w-[73px] flex-col items-center gap-[5px] ${className}`}>
    <IcMapPin width={52} height={52} className="shrink-0" />
    <span className="text-center font-cap2 text-gray-80">{label}</span>
  </div>
)

export default MapPin
