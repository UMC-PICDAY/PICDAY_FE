import type { StudioServiceCode } from '@/types/studio'

// serviceCode enum 4종 전부에 대한 표시 라벨.
// 필터 옵션(STUDIO_SERVICE_OPTIONS)은 WIFI를 노출하지 않지만 응답에는 내려오므로,
// 표시용 맵은 필터 목록과 분리해서 4종을 모두 담는다.
export const STUDIO_SERVICE_LABEL: Record<StudioServiceCode, string> = {
  HAIR_MAKEUP: '헤어·메이크업 연계',
  PARKING: '주차 가능',
  COSTUME: '의상비치',
  WIFI: '와이파이',
}

// 검색 결과 카드처럼 폭이 좁은 영역에서 쓰는 축약 표기
export const STUDIO_SERVICE_SHORT_LABEL: Record<StudioServiceCode, string> = {
  HAIR_MAKEUP: '헤어·메이크업',
  PARKING: '주차',
  COSTUME: '의상',
  WIFI: '와이파이',
}

// 매핑에 없는 코드는 원문을 그대로 노출한다(백엔드가 enum을 추가한 경우 대비).
export const getStudioServiceLabel = (code: string) =>
  STUDIO_SERVICE_LABEL[code as StudioServiceCode] ?? code

export const getStudioServiceShortLabel = (code: string) =>
  STUDIO_SERVICE_SHORT_LABEL[code as StudioServiceCode] ?? code
