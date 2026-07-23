import type { CalendarDate } from '@/components/common/Calendar'
import type { StudioSort } from '@/types/studio'

export const STUDIO_PURPOSES = ['증명', '프로필', '개인화보', '취업', '가족', '우정'] as const

/** 백엔드 StudioSort enum 값과 표시 라벨을 한곳에서 관리합니다. */
export const STUDIO_SORT_OPTIONS = [
  { value: 'RECOMMENDED', label: '추천순' },
  { value: 'PRICE_LOW', label: '가격낮은순' },
  { value: 'RATING_HIGH', label: '별점순' },
  { value: 'REVIEW_COUNT', label: '리뷰많은순' },
] as const satisfies readonly { value: StudioSort; label: string }[]

export const STUDIO_SERVICE_OPTIONS = [
  { value: 'HAIR_MAKEUP', label: '헤어·메이크업 연계', quickLabel: '헤어·메이크업' },
  { value: 'COSTUME', label: '의상비치', quickLabel: '의상' },
  { value: 'PARKING', label: '주차가능', quickLabel: '주차' },
] as const

export type StudioServiceTag = (typeof STUDIO_SERVICE_OPTIONS)[number]['value']

export interface StudioSearchFilters {
  location?: string
  date?: string
  concepts: string[]
  name?: string
  sort?: StudioSort
  minPrice?: number
  maxPrice?: number
  services: StudioServiceTag[]
  minRating?: number
}

const OWNED_PARAM_KEYS = [
  'location',
  'date',
  'concept',
  'name',
  'sort',
  'minPrice',
  'maxPrice',
  'service',
  'minRating',
] as const

const SERVICE_VALUES = new Set<string>(STUDIO_SERVICE_OPTIONS.map(({ value }) => value))
const SORT_VALUES = new Set<string>(STUDIO_SORT_OPTIONS.map(({ value }) => value))

const uniqueNonEmpty = (values: string[]) =>
  [...new Set(values.map((value) => value.trim()).filter(Boolean))]

const parseOptionalNumber = (value: string | null) => {
  if (value === null || value.trim() === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const parseSort = (value: string | null): StudioSort | undefined => {
  const trimmed = value?.trim()
  return trimmed && SORT_VALUES.has(trimmed) ? (trimmed as StudioSort) : undefined
}

export const parseStudioSearchParams = (params: URLSearchParams): StudioSearchFilters => ({
  location: params.get('location')?.trim() || undefined,
  date: params.get('date')?.trim() || undefined,
  concepts: uniqueNonEmpty(params.getAll('concept')),
  name: params.get('name')?.trim() || undefined,
  sort: parseSort(params.get('sort')),
  minPrice: parseOptionalNumber(params.get('minPrice')),
  maxPrice: parseOptionalNumber(params.get('maxPrice')),
  services: uniqueNonEmpty(params.getAll('service')).filter((value): value is StudioServiceTag =>
    SERVICE_VALUES.has(value),
  ),
  minRating: parseOptionalNumber(params.get('minRating')),
})

/** 알 수 없는 데모/화면 파라미터는 보존하고 검색 파라미터만 교체합니다. */
export const serializeStudioSearchParams = (
  filters: StudioSearchFilters,
  baseParams: URLSearchParams = new URLSearchParams(),
) => {
  const params = new URLSearchParams(baseParams)
  OWNED_PARAM_KEYS.forEach((key) => params.delete(key))

  if (filters.location && filters.location !== '전체') params.set('location', filters.location)
  if (filters.date) params.set('date', filters.date)
  filters.concepts.forEach((concept) => params.append('concept', concept))
  if (filters.name) params.set('name', filters.name)
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
  filters.services.forEach((service) => params.append('service', service))
  if (filters.minRating !== undefined) params.set('minRating', String(filters.minRating))

  return params
}

export const hasBaseSearchCondition = (filters: StudioSearchFilters) =>
  Boolean(filters.location || filters.date || filters.concepts.length > 0 || filters.name)

export const isStudioServiceTag = (value: string): value is StudioServiceTag =>
  SERVICE_VALUES.has(value)

export const isStudioSort = (value: string): value is StudioSort =>
  SORT_VALUES.has(value)

export const toggleStudioService = (
  services: StudioServiceTag[],
  service: StudioServiceTag,
) => services.includes(service)
  ? services.filter((value) => value !== service)
  : [...services, service]

export const formatCalendarDateForUrl = ({ year, month, day }: CalendarDate) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

export const formatCalendarDateForDisplay = ({ year, month, day }: CalendarDate) => {
  const yy = String(year).slice(2)
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${yy}.${mm}.${dd}`
}

const formatUrlDateForChip = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return value
  return `${Number(match[2])}월${Number(match[3])}일`
}

export const buildStudioSearchChipLabel = (filters: StudioSearchFilters) => {
  const labels = [
    filters.concepts.join(','),
    filters.name ?? filters.location,
    filters.date ? formatUrlDateForChip(filters.date) : undefined,
  ].filter((label): label is string => Boolean(label))

  return labels.length > 0 ? labels.join('·') : '사진관 검색'
}
