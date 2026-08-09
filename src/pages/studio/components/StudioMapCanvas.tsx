import { useCallback, useEffect, useRef, useState } from 'react'
import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk'

import MapPin from '@/components/common/MapPin'
import PinFavorite from '@/components/common/PinFavorite'
import { useKakaoLoader } from '@/hooks/useKakaoLoader'
import type { StudioSearchItem } from '@/types/studio'

// 표시할 스튜디오가 없을 때의 기본 중심 (서울시청)
const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 }
// 한 곳뿐이면 setBounds가 최대 배율까지 당겨버리므로 레벨을 직접 지정한다.
const SINGLE_STUDIO_LEVEL = 5

// 라벨을 그릴 최대 레벨. 카카오는 레벨이 낮을수록 확대이고 레벨 4가 2m/px라,
// 라벨 폭(73px)이 실거리 약 146m에 해당한다. 그보다 넓게 보면 밀집 상권에서는
// 어차피 라벨이 서로 겹쳐 읽을 수 없으므로 전부 숨긴다.
const LABEL_MAX_LEVEL = 4
// 핀이 몇 개 없으면 겹칠 일도 없다. 결과가 한 곳일 때 SINGLE_STUDIO_LEVEL(5)로
// 잡히는 탓에 유일한 이름까지 사라지는 것을 막는다.
const LABEL_ALWAYS_MAX_COUNT = 3
// 라벨 박스 크기(w-[73px], font-cap2 12px * 1.3). MapPin과 PinFavorite이 같다.
const LABEL_WIDTH = 73
const LABEL_HEIGHT = 16
// PinFavorite은 원(52px) 아래에 라벨이 붙어 블록 높이가 52 + 5 + 15.6px가 된다.
// 원의 중심(위에서 26px)이 좌표에 오도록 하는 비율.
const FAVORITE_PIN_Y_ANCHOR = 26 / 72.6

interface StudioMapCanvasProps {
  studios?: StudioSearchItem[]
  interactive?: boolean
  onLoadError?: () => void
  onStudioSelect?: (studioId: number) => void
  className?: string
}

/** 좌표가 확정돼 지도에 찍을 수 있는 사진관. */
type LocatedStudio = StudioSearchItem & {
  latitude: number
  longitude: number
}

/**
 * 이름 라벨을 그릴 사진관을 고른다.
 *
 * 겹침 여부는 위경도 거리가 아니라 현재 배율에서의 화면 픽셀 거리로 정해지므로,
 * 좌표를 컨테이너 픽셀로 투영한 뒤 라벨 박스끼리 사각형 충돌 검사를 한다.
 * 앞선 항목이 자리를 차지하고 뒤엣것이 양보하는데, studios가 검색 정렬 순서라
 * 상위 결과의 이름이 먼저 살아남는다.
 */
const collectLabelIds = (
  map: kakao.maps.Map,
  studios: LocatedStudio[],
): Set<number> => {
  const visible = new Set<number>()
  if (map.getLevel() > LABEL_MAX_LEVEL && studios.length > LABEL_ALWAYS_MAX_COUNT) {
    return visible
  }

  const projection = map.getProjection()
  const bounds = map.getBounds()
  // 라벨 박스의 세로 오프셋은 모든 핀이 같아 충돌 판정에서 상쇄된다.
  // 그래서 좌표를 투영한 지점을 그대로 박스 중심으로 쓴다.
  const placed: kakao.maps.Point[] = []

  for (const studio of studios) {
    const position = new kakao.maps.LatLng(studio.latitude, studio.longitude)
    // 화면 밖은 그려지지도 않으니 자리를 차지하게 두면 안 된다.
    if (!bounds.contain(position)) continue

    const point = projection.containerPointFromCoords(position)
    const overlaps = placed.some(
      (taken) =>
        Math.abs(taken.x - point.x) < LABEL_WIDTH &&
        Math.abs(taken.y - point.y) < LABEL_HEIGHT,
    )
    if (overlaps) continue

    placed.push(point)
    visible.add(studio.studioId)
  }

  return visible
}

/**
 * 검색 결과 지도. 카카오 지도 위에 스튜디오 위치를 자체 디자인 마커로 렌더한다.
 * - 찜한 스튜디오: PinFavorite / 그 외: MapPin (둘 다 이름 라벨을 단다)
 * 이름 라벨은 넓게 보거나 서로 겹칠 때 숨긴다(collectLabelIds). 라벨을 숨겨도
 * 마커 버튼의 aria-label에는 이름이 남아 스크린리더에서는 그대로 읽힌다.
 * 통합 페이지가 살아 있는 동안 언마운트되지 않도록 항상 렌더하며,
 * 시트 드래그 중(interactive=false)에는 지도 입력을 막는다.
 */
const StudioMapCanvas = ({
  studios = [],
  interactive = true,
  onLoadError,
  onStudioSelect,
  className = '',
}: StudioMapCanvasProps) => {
  const [, error] = useKakaoLoader()
  const [map, setMap] = useState<kakao.maps.Map | null>(null)

  // 좌표가 null인 스튜디오가 응답에 섞여 온다. 그대로 LatLng에 넣으면 0,0으로
  // 강제돼 지도 영역이 서울에서 적도까지 벌어지고, 그 배율에서는 카카오가
  // 타일 대신 빈 이미지를 채워 지도가 통째로 비어 보인다.
  const locatedStudios = studios.filter(
    (studio): studio is LocatedStudio =>
      Number.isFinite(studio.latitude) && Number.isFinite(studio.longitude),
  )
  // 지도를 다시 맞출지 판단하는 기준이자 계산에 쓰는 좌표 자체.
  // 찜하기처럼 목록 '내용'만 바뀌는 갱신에서는 배열 참조가 새로 생겨도
  // 이 값은 그대로라, 보고 있던 지도가 초기 영역으로 튀지 않는다.
  const fitKey = locatedStudios
    .map((studio) => `${studio.latitude},${studio.longitude}`)
    .join('|')

  // 이름 라벨을 그릴 사진관. 배율과 화면 위치에 따라 달라져 지도 이벤트에서 다시 구한다.
  const [labelIds, setLabelIds] = useState<Set<number>>(() => new Set())
  // 지도 이벤트 콜백은 리렌더마다 새로 만들지 않는 편이 안전한데, 목록은 매 렌더
  // 새 배열이라 클로저에 가둘 수 없다. 최신 목록만 ref로 건네준다.
  const locatedStudiosRef = useRef(locatedStudios)
  locatedStudiosRef.current = locatedStudios

  const refreshLabels = useCallback((target: kakao.maps.Map) => {
    setLabelIds(collectLabelIds(target, locatedStudiosRef.current))
  }, [])

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
    } else {
      const bounds = new kakao.maps.LatLngBounds()
      points.forEach((point) => bounds.extend(point))
      map.setBounds(bounds)
    }

    // 검색 결과가 바뀌면 idle을 기다리지 않고 곧바로 라벨을 다시 고른다.
    refreshLabels(map)
  }, [map, fitKey, refreshLabels])

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
        onIdle={refreshLabels}
        onZoomChanged={refreshLabels}
      >
        {locatedStudios.map((studio) =>
          studio.isWishlisted ? (
            // 원형 마커 → 이름 라벨이 붙어 블록이 세로로 길어졌으므로,
            // 원 부분만 좌표 중앙에 오도록 yAnchor를 다시 잡는다.
            // clickable을 켜야 오버레이 안의 DOM까지 클릭이 전달된다.
            <CustomOverlayMap
              key={studio.studioId}
              position={{ lat: studio.latitude, lng: studio.longitude }}
              yAnchor={FAVORITE_PIN_Y_ANCHOR}
              clickable
            >
              <button
                type="button"
                aria-label={`${studio.studioName} 선택`}
                className="cursor-pointer"
                onClick={() => onStudioSelect?.(studio.studioId)}
              >
                <PinFavorite
                  label={
                    labelIds.has(studio.studioId) ? studio.studioName : undefined
                  }
                />
              </button>
            </CustomOverlayMap>
          ) : (
            // 핀 마커 → 끝점(IcMapPin 하단)이 좌표에 오도록 yAnchor 보정
            <CustomOverlayMap
              key={studio.studioId}
              position={{ lat: studio.latitude, lng: studio.longitude }}
              yAnchor={0.85}
              clickable
            >
              <button
                type="button"
                aria-label={`${studio.studioName} 선택`}
                className="cursor-pointer"
                onClick={() => onStudioSelect?.(studio.studioId)}
              >
                <MapPin
                  label={
                    labelIds.has(studio.studioId) ? studio.studioName : undefined
                  }
                />
              </button>
            </CustomOverlayMap>
          ),
        )}
      </Map>
    </div>
  )
}

export default StudioMapCanvas
