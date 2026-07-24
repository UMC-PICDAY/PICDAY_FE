// 홈(2-1)·자동완성(2-2)은 PICDAY_API_Spec.md 확정본 기준으로 타입 반영됨 (김이준 담당분)
// 비교(2-9, 2-10)는 전지혜 담당분. 나머지는 PICDAY_API_1st.pdf 초안 기준 path만 확정된 상태 — 남현준이 채울 예정
import { apiGet } from '@/services/client'
import type { AutocompleteResult, HomeResult } from '@/types/studio'

export interface StudioSearchParams {
  name?: string
  location?: string
  date?: string
  concept?: string
  minPrice?: number
  maxPrice?: number
  service?: string[]
  minRating?: number
}

export type ShootingCategory =
  | 'ID_PHOTO'
  | 'PROFILE'
  | 'PERSONAL_PORTRAIT'
  | 'JOB_PHOTO'
  | 'FAMILY'
  | 'FRIENDSHIP'

export interface ComparePurposeStudio {
  studioId: number
  studioName: string
  shootingCategories: ShootingCategory[]
}

export interface ComparePurposeResponse {
  studios: ComparePurposeStudio[]
}

export interface CompareResultParams {
  studioIds: number[]
  shootingCategory: ShootingCategory
}

export interface CompareProductInformation {
  price: number
  isMine: boolean
  comparisonSummary: string
  hasAdditionalPrice: boolean
}

export interface CompareStudioLocation {
  locationCategory: string
  nearestStation: string
  walkingMinutes: number
}

export interface CompareResultStudio {
  studioId: number
  studioName: string
  thumbnailUrl: string
  rating: number
  reviewCount: number
  productsInformation: CompareProductInformation
  serviceTags: string[]
  location: CompareStudioLocation
  earliestReservationDate: string
}

export interface CompareResultResponse {
  shootingCategory: ShootingCategory
  shootingCategoryName: string
  studios: CompareResultStudio[]
}

export const getHome = () => apiGet<HomeResult>('/api/v1/home')

export const autocompleteStudios = (keyword: string) =>
  apiGet<AutocompleteResult>('/api/v1/studios/autocomplete', { keyword })

export const searchStudios = (params: StudioSearchParams) =>
  apiGet<unknown>('/api/v1/studios/search', params)

export const getStudioDetail = (studioId: string) =>
  apiGet<unknown>(`/api/v1/studios/${studioId}`)

export const getStudioConcepts = (studioId: string) =>
  apiGet<unknown>(`/api/v1/studios/${studioId}/concepts`)

export const getStudioConceptDetail = (
  studioId: string,
  conceptId: string,
) =>
  apiGet<unknown>(
    `/api/v1/studios/${studioId}/concepts/${conceptId}`,
  )

export const getStudioSlots = (studioId: string) =>
  apiGet<unknown>(`/api/v1/studios/${studioId}/slots`)

export const getComparePurposes = (studioIds: number[]) => {
  const searchParams = new URLSearchParams()

  studioIds.forEach((studioId) => {
    searchParams.append('studioIds', String(studioId))
  })

  return apiGet<ComparePurposeResponse>(
    `/api/v1/studios/compare?${searchParams.toString()}`,
  )
}

export const getCompareResult = ({
  studioIds,
  shootingCategory,
}: CompareResultParams) => {
  const searchParams = new URLSearchParams()

  studioIds.forEach((studioId) => {
    searchParams.append('studioIds', String(studioId))
  })

  searchParams.append('shootingCategory', shootingCategory)

  return apiGet<CompareResultResponse>(
    `/api/v1/studios/compare/result?${searchParams.toString()}`,
  )
}
