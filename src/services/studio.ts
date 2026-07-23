import { apiGet } from '@/services/client'

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

export const getHome = () => apiGet<unknown>('/api/v1/home')

export const autocompleteStudios = (keyword: string) =>
  apiGet<unknown>('/api/v1/studios/autocomplete', { keyword })

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