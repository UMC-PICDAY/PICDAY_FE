/**
 * MapPin 사용법
 *
 * 지도 위 선택된 사진관 마커 (카메라 핀 + 이름)
 *   <MapPin label="데이지스튜디오" />
 *
 * label을 생략하면 이름 없이 핀만 그린다.
 */

import { IcMapPin } from '@/components/icons'

interface MapPinProps {
  label?: string
  className?: string
}

const MapPin = ({ label, className = '' }: MapPinProps) => (
  <div className={`flex w-[73px] flex-col items-center gap-[5px] ${className}`}>
    <IcMapPin width={52} height={52} className="shrink-0" />
    {/* 라벨을 숨겨도 자리는 남긴다. 높이가 줄면 오버레이의 yAnchor가 가리키는
        지점이 달라져, 라벨이 켜지고 꺼질 때 핀이 좌표 위아래로 튄다. */}
    <span className="min-h-[15.6px] text-center font-cap2 text-gray-80">{label}</span>
  </div>
)

export default MapPin
