// 홈(2-1)·자동완성(2-2)은 PICDAY_API_Spec.md 확정본 기준 (김이준 담당분)
// 비교(2-9, 2-10)는 전지혜 담당분. 검색·상세·상품·슬롯·헤어메이크업(2-3~2-8)은 남현준 담당분.
import { apiGet, apiPost } from '@/services/client'
import type {
  AutocompleteResult,
  HairMakeupData,
  HomeResult,
  StudioDetail,
  StudioProductDetail,
  StudioProductsData,
  StudioProductsParams,
  StudioSearchByNameParams,
  StudioSearchParams,
  StudioSearchResult,
  StudioTimeSlot,
} from '@/types/studio'

// ===== 2-1. 홈 / 2-2. 자동완성 (김이준) =====

export interface HomeParams {
  latitude?: number
  longitude?: number
}

// latitude·longitude가 모두 있으면 위치 기준, 없으면 기본 지역(홍대) 기준으로 응답
export const getHome = (params?: HomeParams) => apiGet<HomeResult>('/api/v1/home', params)

export const autocompleteStudios = (keyword: string) =>
  apiGet<AutocompleteResult>('/api/v1/studios/autocomplete', { keyword })

// ===== 2-3 ~ 2-8. 사진관 검색/상세/상품/슬롯/헤어메이크업 (남현준) =====

// 2-3. 사진관 통합 검색 (위치·날짜·컨셉)
// 배열 파라미터는 반복키(shootingCategory=A&shootingCategory=B)로 보내야 한다.
// axios 기본 직렬화(shootingCategory[]=A)는 백엔드가 조건 없음으로 처리해 400을 낸다.
export const searchStudios = ({
  locationCategory,
  date,
  shootingCategory,
  sort,
  minPrice,
  maxPrice,
  serviceCode,
  minRating,
}: StudioSearchParams): Promise<StudioSearchResult> => {
  const searchParams = new URLSearchParams()
  if (locationCategory) searchParams.set('locationCategory', locationCategory)
  if (date) searchParams.set('date', date)
  shootingCategory?.forEach((code) => searchParams.append('shootingCategory', code))
  if (sort) searchParams.set('sort', sort)
  if (minPrice !== undefined) searchParams.set('minPrice', String(minPrice))
  if (maxPrice !== undefined) searchParams.set('maxPrice', String(maxPrice))
  serviceCode?.forEach((code) => searchParams.append('serviceCode', code))
  if (minRating !== undefined) searchParams.set('minRating', String(minRating))

  return apiGet<StudioSearchResult>(
    `/api/v1/studios/search?${searchParams.toString()}`,
  )
}

// 2-3-2. 사진관 이름 선택 검색 (자동완성에서 고른 studioId 기준)
// 배열 파라미터(serviceCode)를 반복키로 보내야 해서 쿼리를 직접 조립한다.
// axios 기본 직렬화(serviceCode[]=A)는 백엔드가 인식하지 못한다.
export const searchStudiosByName = ({
  studioId,
  sort,
  minPrice,
  maxPrice,
  serviceCode,
  minRating,
}: StudioSearchByNameParams): Promise<StudioSearchResult> => {
  const searchParams = new URLSearchParams()
  searchParams.set('studioId', String(studioId))
  if (sort) searchParams.set('sort', sort)
  if (minPrice !== undefined) searchParams.set('minPrice', String(minPrice))
  if (maxPrice !== undefined) searchParams.set('maxPrice', String(maxPrice))
  serviceCode?.forEach((code) => searchParams.append('serviceCode', code))
  if (minRating !== undefined) searchParams.set('minRating', String(minRating))

  return apiGet<StudioSearchResult>(
    `/api/v1/studios/search/name?${searchParams.toString()}`,
  )
}

// 2-4. 사진관 상세
export const getStudioDetail = (studioId: string): Promise<StudioDetail> =>
  apiGet<StudioDetail>(`/api/v1/studios/${studioId}`)

// 2-5. 컨셉(상품) 목록 조회
export const getStudioProducts = (
  studioId: string,
  params?: StudioProductsParams,
): Promise<StudioProductsData> =>
  apiGet<StudioProductsData>(`/api/v1/studios/${studioId}/products`, params)

// 2-6. 컨셉 사진 상세
export const getStudioProductDetail = (
  studioId: string,
  productId: string,
): Promise<StudioProductDetail> =>
  apiGet<StudioProductDetail>(
    `/api/v1/studios/${studioId}/products/${productId}`,
  )

// 2-7. 예약 가능 시간 조회
export const getStudioSlots = (
  studioId: string,
  date: string,
): Promise<StudioTimeSlot[]> =>
  apiGet<StudioTimeSlot[]>(`/api/v1/studios/${studioId}/slots`, { date })

// 2-8. 헤어메이크업 연계 상세
export const getStudioHairMakeup = (studioId: string): Promise<HairMakeupData> =>
  apiGet<HairMakeupData>(`/api/v1/studios/${studioId}/hair-makeup`)

// 최근 본 사진관 기록 — 로그인 사용자가 상세 페이지에 진입할 때만 호출
export interface RecentStudioViewResult {
  studioId: number
  viewedAt: string
}

export const saveRecentStudioView = (studioId: string): Promise<RecentStudioViewResult> =>
  apiPost<RecentStudioViewResult>(`/api/v1/studios/${studioId}/recent-view`)

// ===== 2-9. 비교 목적 / 2-10. 비교 결과 (전지혜) =====

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
