/**
 * PinFavorite 사용법
 *
 * 지도 위 즐겨찾기 사진관 마커
 *   <PinFavorite />
 */

import { IcPinFavorite } from '@/components/icons'

interface PinFavoriteProps {
  className?: string
}

const PinFavorite = ({ className = '' }: PinFavoriteProps) => (
  <div className={`relative size-[52px] ${className}`}>
    <IcPinFavorite
      width={30}
      height={30}
      className="absolute left-[10.5px] top-[11px]"
    />
  </div>
)

export default PinFavorite
