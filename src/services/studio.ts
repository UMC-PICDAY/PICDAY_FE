import { apiGet } from '@/services/client'
import type {
  HairMakeupData,
  StudioDetail,
  StudioProductDetail,
  StudioProductsData,
  StudioProductsParams,
  StudioSearchParams,
  StudioSearchResult,
  StudioTimeSlot,
} from '@/types/studio'

// 2-3. 사진관 검색
export const searchStudios = (
  params: StudioSearchParams,
): Promise<StudioSearchResult> =>
  apiGet<StudioSearchResult>('/api/v1/studios/search', params)

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
  apiGet<HairMakeupData>(`/api/v1/studios/${studioId}/hairMakeupDetail`)
