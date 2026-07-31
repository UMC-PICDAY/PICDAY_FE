import { useEffect, useState } from 'react'
import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk'

import MapPin from '@/components/common/MapPin'
import PinFavorite from '@/components/common/PinFavorite'
import { useKakaoLoader } from '@/hooks/useKakaoLoader'
import type { StudioSearchItem } from '@/types/studio'

// 표시할 스튜디오가 없을 때의 기본 중심 (서울시청)
const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 }
// 한 곳뿐이면 setBounds가 최대 배율까지 당겨버리므로 레벨을 직접 지정한다.
const SINGLE_STUDIO_LEVEL = 5

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
  const [map, setMap] = useState<kakao.maps.Map | null>(null)

  // 좌표가 null인 스튜디오가 응답에 섞여 온다. 그대로 LatLng에 넣으면 0,0으로
  // 강제돼 지도 영역이 서울에서 적도까지 벌어지고, 그 배율에서는 카카오가
  // 타일 대신 빈 이미지를 채워 지도가 통째로 비어 보인다.
  const locatedStudios = studios.filter(
    (studio) =>
      Number.isFinite(studio.latitude) && Number.isFinite(studio.longitude),
  )
  // 지도를 다시 맞출지 판단하는 기준이자 계산에 쓰는 좌표 자체.
  // 찜하기처럼 목록 '내용'만 바뀌는 갱신에서는 배열 참조가 새로 생겨도
  // 이 값은 그대로라, 보고 있던 지도가 초기 영역으로 튀지 않는다.
  const fitKey = locatedStudios
    .map((studio) => `${studio.latitude},${studio.longitude}`)
    .join('|')

  useEffect(() => {
    if (error) onLoadError?.()
  }, [error, onLoadError])

  // 영역 맞추기를 Map의 onCreate에 두면 안 된다. SDK가 onCreate를 콜백 신원이
  // 바뀔 때마다 다시 호출해서, 리렌더될 때마다 지도가 초기 영역으로 튄다.
  useEffect(() => {
    if (!map || !fitKey) return

    const points = fitKey.split('|').map((pair) => {
      const [lat, lng] = pair.split(',').map(Number)
      return new kakao.maps.LatLng(lat, lng)
    })

    if (points.length === 1) {
      map.setLevel(SINGLE_STUDIO_LEVEL)
      map.setCenter(points[0])
      return
    }

    const bounds = new kakao.maps.LatLngBounds()
    points.forEach((point) => bounds.extend(point))
    map.setBounds(bounds)
  }, [map, fitKey])

  // SDK 로드 실패 시 회색 fallback (상위에서 에러 UI를 덮어씌운다)
  if (error) {
    return <div className={`absolute inset-0 bg-gray-10 ${className}`} />
  }

  const center = locatedStudios[0]
    ? { lat: locatedStudios[0].latitude, lng: locatedStudios[0].longitude }
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
        onCreate={setMap}
      >
        {locatedStudios.map((studio) =>
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
