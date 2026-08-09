/**
 * PinFavorite 사용법
 *
 * 지도 위 즐겨찾기 사진관 마커 (원형 핀 + 이름)
 *   <PinFavorite label="데이지스튜디오" />
 *
 * label을 생략하면 이름 없이 핀만 그린다.
 */

import { IcPinFavorite } from '@/components/icons'

interface PinFavoriteProps {
  label?: string
  className?: string
}

const PinFavorite = ({ label, className = '' }: PinFavoriteProps) => (
  <div className={`flex w-[73px] flex-col items-center gap-[5px] ${className}`}>
    <div className="relative size-[52px] shrink-0">
      <IcPinFavorite
        width={30}
        height={30}
        className="absolute left-[10.5px] top-[11px]"
      />
    </div>
    {/* MapPin과 같은 이유로 라벨을 숨겨도 자리는 남긴다. 높이가 달라지면
        오버레이의 yAnchor가 가리키는 지점이 옮겨가 핀이 좌표에서 튄다. */}
    <span className="min-h-[15.6px] text-center font-cap2 text-gray-80">{label}</span>
  </div>
)

export default PinFavorite
