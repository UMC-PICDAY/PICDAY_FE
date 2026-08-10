import type { StudioSort } from '@/types/studio'

/** 백엔드 StudioSort enum 값과 표시 라벨을 한곳에서 관리합니다. */
export const STUDIO_SORT_OPTIONS = [
  { value: 'RECOMMENDED', label: '추천순' },
  { value: 'PRICE_LOW', label: '가격낮은순' },
  { value: 'RATING_HIGH', label: '별점순' },
  { value: 'REVIEW_COUNT', label: '리뷰많은순' },
] as const satisfies readonly { value: StudioSort; label: string }[]

const SORT_VALUES = new Set<string>(STUDIO_SORT_OPTIONS.map(({ value }) => value))

export const isStudioSort = (value: string): value is StudioSort =>
  SORT_VALUES.has(value)
