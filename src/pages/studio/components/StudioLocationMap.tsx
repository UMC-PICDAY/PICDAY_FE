import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk'

import MapPin from '@/components/common/MapPin'
import { IcPin } from '@/components/icons'
import { useKakaoLoader } from '@/hooks/useKakaoLoader'

interface StudioLocationMapProps {
  latitude: number
  longitude: number
  studioName: string
}

/**
 * 상세 페이지 '위치 및 주변 정보'의 단일 좌표 미니 지도.
 * 드래그·줌을 막아 정적으로 표시하고, 스튜디오 위치를 자체 디자인 마커로 찍는다.
 * SDK 로드 실패 시 회색 박스 + 핀 아이콘 fallback을 그대로 유지한다.
 */
const StudioLocationMap = ({
  latitude,
  longitude,
  studioName,
}: StudioLocationMapProps) => {
  const [, error] = useKakaoLoader()

  if (error) {
    return (
      <div className="relative flex h-[180px] w-full items-center justify-center rounded-xl bg-gray-20">
        <IcPin width={48} height={48} className="text-brand-100" />
      </div>
    )
  }

  const position = { lat: latitude, lng: longitude }

  return (
    <Map
      center={position}
      level={4}
      draggable={false}
      zoomable={false}
      className="h-[180px] w-full overflow-hidden rounded-xl"
    >
      <CustomOverlayMap position={position} yAnchor={0.85}>
        <MapPin label={studioName} />
      </CustomOverlayMap>
    </Map>
  )
}

export default StudioLocationMap
