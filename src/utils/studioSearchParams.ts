import type { CalendarDate } from '@/components/common/Calendar'
import { SHOOTING_CATEGORY_LABEL } from '@/constants/shootingCategory'
import { LOCATION_CATEGORY_LABEL } from '@/constants/locationCategory'
import { isStudioServiceTag } from '@/constants/studioService'
import { isStudioSort } from '@/constants/studioSort'
import type { StudioSearchFilters, StudioSort } from '@/types/studio'

const OWNED_PARAM_KEYS = [
  'locationCategory',
  'date',
  'shootingCategory',
  'studioId',
  'studioName',
  'sort',
  'minPrice',
  'maxPrice',
  'serviceCode',
  'minRating',
] as const

/**
 * 검색 위저드(B-2~B-5)는 한글 라벨('홍대')을 넘기고 API는 코드('HONGDAE')를 받는다.
 * 코드면 그대로, 라벨이면 코드로 바꾸고, 어느 쪽도 아니면(지역칩 '전체') undefined.
 */
const toCode = (value: string, labels: Record<string, string>) =>
  value in labels
    ? value
    : Object.keys(labels).find((code) => labels[code] === value)

const uniqueNonEmpty = (values: string[]) =>
  [...new Set(values.map((value) => value.trim()).filter(Boolean))]

const parseOptionalNumber = (value: string | null) => {
  if (value === null || value.trim() === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const parseSort = (value: string | null): StudioSort | undefined => {
  const trimmed = value?.trim()
  return trimmed && isStudioSort(trimmed) ? trimmed : undefined
}

export const parseStudioSearchParams = (params: URLSearchParams): StudioSearchFilters => ({
  location: params.get('locationCategory')?.trim() || undefined,
  date: params.get('date')?.trim() || undefined,
  concepts: uniqueNonEmpty(params.getAll('shootingCategory')).filter(
    (value) => value in SHOOTING_CATEGORY_LABEL,
  ),
  studioId: parseOptionalNumber(params.get('studioId')),
  studioName: params.get('studioName')?.trim() || undefined,
  sort: parseSort(params.get('sort')),
  minPrice: parseOptionalNumber(params.get('minPrice')),
  maxPrice: parseOptionalNumber(params.get('maxPrice')),
  services: uniqueNonEmpty(params.getAll('serviceCode')).filter(isStudioServiceTag),
  minRating: parseOptionalNumber(params.get('minRating')),
})

/** 알 수 없는 데모/화면 파라미터는 보존하고 검색 파라미터만 교체합니다. */
export const serializeStudioSearchParams = (
  filters: StudioSearchFilters,
  baseParams: URLSearchParams = new URLSearchParams(),
) => {
  const params = new URLSearchParams(baseParams)
  OWNED_PARAM_KEYS.forEach((key) => params.delete(key))

  const locationCategory = filters.location
    ? toCode(filters.location, LOCATION_CATEGORY_LABEL)
    : undefined
  if (locationCategory) params.set('locationCategory', locationCategory)
  if (filters.date) params.set('date', filters.date)
  filters.concepts
    .map((concept) => toCode(concept, SHOOTING_CATEGORY_LABEL))
    .forEach((code) => {
      if (code) params.append('shootingCategory', code)
    })
  if (filters.studioId !== undefined) params.set('studioId', String(filters.studioId))
  if (filters.studioName) params.set('studioName', filters.studioName)
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
  filters.services.forEach((service) => params.append('serviceCode', service))
  if (filters.minRating !== undefined) params.set('minRating', String(filters.minRating))

  return params
}

/** URL·API가 쓰는 YYYY-MM-DD 포맷의 정의부. parse가 이 포맷을 전제한다. */
export const formatCalendarDateForUrl = ({ year, month, day }: CalendarDate) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
