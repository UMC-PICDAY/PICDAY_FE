import { useCallback, useEffect } from 'react'
import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk'

import MapPin from '@/components/common/MapPin'
import PinFavorite from '@/components/common/PinFavorite'
import { useKakaoLoader } from '@/hooks/useKakaoLoader'
import type { StudioSearchItem } from '@/types/studio'

// 표시할 스튜디오가 없을 때의 기본 중심 (서울시청)
const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 }

interface StudioMapCanvasProps {
  studios?: StudioSearchItem[]
  interactive?: boolean
  onLoadError?: () => void
  className?: string
}

/**
 * 검색 결과 지도. 카카오 지도 위에 스튜디오 위치를 자체 디자인 마커로 렌더한다.
 * - 찜한 스튜디오: PinFavorite / 그 외: MapPin(이름 라벨)
 * 통합 페이지가 살아 있는 동안 언마운트되지 않도록 항상 렌더하며,
 * 시트 드래그 중(interactive=false)에는 지도 입력을 막는다.
 */
const StudioMapCanvas = ({
  studios = [],
  interactive = true,
  onLoadError,
  className = '',
}: StudioMapCanvasProps) => {
  const [, error] = useKakaoLoader()

  useEffect(() => {
    if (error) onLoadError?.()
  }, [error, onLoadError])

  const handleMapCreate = useCallback((map: kakao.maps.Map) => {
    if (studios.length === 0) return

    const bounds = new kakao.maps.LatLngBounds()
    studios.forEach((studio) =>
      bounds.extend(new kakao.maps.LatLng(studio.latitude, studio.longitude)),
    )
    map.setBounds(bounds)
  }, [studios])

  // SDK 로드 실패 시 회색 fallback (상위에서 에러 UI를 덮어씌운다)
  if (error) {
    return <div className={`absolute inset-0 bg-gray-10 ${className}`} />
  }

  const center = studios[0]
    ? { lat: studios[0].latitude, lng: studios[0].longitude }
    : DEFAULT_CENTER

  return (
    <div
      className={`absolute inset-0 z-0 ${interactive ? '' : 'pointer-events-none'} ${className}`}
    >
      <Map
        center={center}
        level={5}
        draggable
        zoomable
        className="h-full w-full"
        onCreate={handleMapCreate}
      >
        {studios.map((studio) =>
          studio.isWishlisted ? (
            // 원형 마커 → 좌표에 중앙 정렬
            <CustomOverlayMap
              key={studio.studioId}
              position={{ lat: studio.latitude, lng: studio.longitude }}
            >
              <PinFavorite />
            </CustomOverlayMap>
          ) : (
            // 핀 마커 → 끝점(IcMapPin 하단)이 좌표에 오도록 yAnchor 보정
            <CustomOverlayMap
              key={studio.studioId}
              position={{ lat: studio.latitude, lng: studio.longitude }}
              yAnchor={0.85}
            >
              <MapPin label={studio.studioName} />
            </CustomOverlayMap>
          ),
        )}
      </Map>
    </div>
  )
}

export default StudioMapCanvas
