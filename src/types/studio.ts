import type { CalendarDate } from '@/components/common/Calendar'

// ===== 2-1. 홈 / 2-2. 자동완성 (김이준 담당분) =====
// PICDAY_API_Spec.md 기준. 홈(2-1)·자동완성(2-2) 응답 정의
export interface StudioSummary {
  studioId: number
  studioName: string
  thumbnailUrl: string | null
  locationCategory: string
  minPrice: number | null
  rating: number
}

export interface BannerStudio {
  studioId: number
  studioName: string
  thumbnailUrl: string | null
  locationCategory: string
}

export interface HomeResult {
  bannerStudios: BannerStudio[]
  recentStudios?: StudioSummary[]
  popularStudios: StudioSummary[]
  regionalStudios: {
    locationCategory: string
    studios: StudioSummary[]
  }
}

export interface AutocompleteSuggestion {
  studioId: number
  studioName: string
  locationCategory: string
}

export interface AutocompleteResult {
  keyword: string
  suggestions: AutocompleteSuggestion[]
}

// ===== 2-3. GET /api/v1/studios/search =====

/**
 * 정렬 기준 (백엔드 `StudioSort` enum 확정값).
 * RECOMMENDED: 추천순 / PRICE_LOW: 가격낮은순 / RATING_HIGH: 별점순 / REVIEW_COUNT: 리뷰많은순
 */
export type StudioSort = 'RECOMMENDED' | 'PRICE_LOW' | 'RATING_HIGH' | 'REVIEW_COUNT'

export interface StudioSearchParams {
  location?: string
  date?: string // YYYY-MM-DD
  concept?: string[]
  name?: string
  sort?: StudioSort
  minPrice?: number
  maxPrice?: number
  service?: string[]
  minRating?: number
}

export interface StudioSearchProductSummary {
  productId: number
  productName: string
  shootingCategory: string
  price: number
}

export interface StudioSearchItem {
  studioId: number
  studioName: string
  thumbnailUrls: string[]
  locationCategory: string
  latitude: number
  longitude: number
  minPrice: number
  rating: number
  reviewCount: number
  shootingCategory: string[]
  serviceTags: string[]
  isWishlisted: boolean
  productSummaries: StudioSearchProductSummary[]
}

export interface StudioRecommendItem {
  studioId: number
  studioName: string
  thumbnailUrl: string
  locationCategory: string
  minPrice: number
  rating: number
  shootingCategory: string[]
}

export interface StudioSearchAppliedFilters {
  location: string | null
  date: string | null
  concept: string[]
  name: string | null
  sort: StudioSort | null
  minPrice: number | null
  maxPrice: number | null
  serviceTags: string[]
  minRating: number | null
}

// 결과 있음: hasResult 생략/true, studios 채워짐
// 결과 없음: hasResult false, studios 빈 배열 + recommendStudios
export interface StudioSearchResult {
  hasResult?: boolean
  totalCount: number
  appliedFilters: StudioSearchAppliedFilters
  studios: StudioSearchItem[]
  recommendStudios?: StudioRecommendItem[]
}

// ===== 비교(compare) 선택 항목 =====

/** 비교 바에 담기는 사진관 최소 식별 정보. 검색/비교 화면이 공유한다. */
export interface CompareStudio {
  studioId: number
  studioName: string
}

// ===== 2-4. GET /api/v1/studios/{studioId} =====

export interface StudioRepresentativeProduct {
  studioProductId?: number
  productName: string
  thumbnailUrl?: string | null
  price: number
}

// 실제 응답 enum(swagger 기준). FE에서 아이콘/라벨을 매핑해서 씀 (StudioDetailPage 참고)
export type StudioServiceCode = 'HAIR_MAKEUP' | 'PARKING' | 'COSTUME' | 'WIFI'

export interface StudioLocationDetail {
  locationCategory: string
  district: string
  address: string
  latitude: number
  longitude: number
  nearestStation: string
  walkingMinutes: number
  stationLineCodes: number[] // 1~9: n호선 / 11: 공항철도 / 12: 경의중앙선 / 13: 신분당선
}

export interface StudioInfoDetail {
  operation: string[]
  parking: string[]
  shootingGuide: string[]
  refundGuide: string[]
}

export interface StudioNotice {
  title: string
  items: string[]
}

export interface StudioReviewPreviewItem {
  reviewId?: number
  writerNickname: string
  rating: number
  content: string
  imageUrls: string[]
  isBest: boolean
  createdAt?: string
}

export interface StudioReviewSummaryPreview {
  averageRating?: number | null
  reviewCount: number
  previewReview?: StudioReviewPreviewItem | null
}

export interface StudioDetail {
  studioId: number
  studioName: string
  imageUrls: string[]
  isWishlisted: boolean
  location: StudioLocationDetail
  representativeProducts: StudioRepresentativeProduct[]
  serviceCodes: StudioServiceCode[]
  introduction?: string | null
  notice?: StudioNotice | null
  studioInfo: StudioInfoDetail
  hairMakeupPartnerCount: number
  reviewSummary: StudioReviewSummaryPreview
}

// ===== 2-5. GET /api/v1/studios/{studioId}/products =====

export interface StudioProductsParams {
  timeSlotId?: number
}

export interface StudioProduct {
  studioProductId: number
  productName: string
  imageUrls: string[]
  imageCount: number
  price: number
  basePeople: number
  // 서버가 null을 내려주는 상품이 있어 nullable
  shortDescription: string | null
}

export interface StudioProductGroup {
  shootingCategory: string
  products: StudioProduct[]
}

// 예약 가능 여부는 상품이 아니라 슬롯 단위다.
// 같은 timeSlot을 예약하면 그 사진관의 해당 시간대가 통째로 점유되기 때문.
export interface StudioSelectedSlot {
  timeSlotId: number
  date: string // YYYY-MM-DD
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface StudioProductsData {
  studioId: number
  studioName: string
  // timeSlotId 없이 조회하면 null
  selectedSlot: StudioSelectedSlot | null
  productGroups: StudioProductGroup[]
}

// ===== 2-6. GET /api/v1/studios/{studioId}/products/{studioProductId} =====

export interface StudioProductDetail {
  studioId: number
  studioName: string
  studioProductId: number
  productName: string
  imageUrls: string[]
  imageCount: number
}

// ===== 2-7. GET /api/v1/studios/{studioId}/slots =====

export interface StudioTimeSlot {
  // 2-5의 timeSlotId와 같은 값 (엔드포인트마다 이름만 다름)
  slotId: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

// 날짜/시간 선택 화면 상태 (컨셉 목록·예약 흐름에서 사용)
export interface StudioDateTimeSelection {
  date: CalendarDate
  slotId: number
  startTime: string
  endTime: string
}

// ===== 2-8. GET /api/v1/studios/{studioId}/hair-makeup =====

export interface HairMakeupPartner {
  hairMakeupDetailId: number
  partnerName: string
  additionalPrice: number
}

export interface HairMakeupData {
  studioId: number
  hairMakeupList: HairMakeupPartner[]
}
