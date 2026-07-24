import type { CalendarDate } from '@/components/common/Calendar'
import type { ReviewListItem, ReviewSummary } from '@/types/review'

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

export interface StudioConceptPreview {
  productId: number
  productName: string
  thumbnailUrl: string
  price: number
  isMinPrice: boolean
}

export interface StudioServiceItem {
  serviceCode: string
  serviceName: string
}

export interface StudioInfoSection {
  infoSectionId: number
  content: string
}

// data.review — 5-1 리뷰 목록 API의 요약/items와 동일 구조
export interface StudioReviewPreview {
  summary: ReviewSummary
  page: number
  size: number
  items: ReviewListItem[]
}

export interface StudioDetail {
  studioId: number
  studioName: string
  thumbnailUrl: string
  isWishlisted: boolean
  locationCategory: string
  mainAddress: string
  subAddress: string
  latitude: number
  longitude: number
  nearestStation: string
  walkingMinute: number
  stationDetail: number[] // 1~9: n호선 / 11: 공항철도 / 12: 경의중앙선 / 13: 신분당선
  conceptPreview: StudioConceptPreview[]
  studioService: StudioServiceItem[]
  hairMakeupPartnersCount: number
  introduction: string
  notice: string
  studioInfo: StudioInfoSection[]
  review: StudioReviewPreview
}

// ===== 2-5. GET /api/v1/studios/{studioId}/products =====

export interface StudioProductsParams {
  date?: string // YYYY-MM-DD
  time?: string // HH:mm
}

export interface StudioProduct {
  productId: number
  productName: string
  imageUrls: string // 명세상 단수 문자열
  imageCount: number
  price: number
  basePeople: number
  shortDescription: string
  description: string
  // date·time 둘 다 있을 때만 boolean, 하나라도 없으면 null → 예약 버튼 비활성화
  isAvailable: boolean | null
}

export interface StudioProductGroup {
  shootingCategory: string
  products: StudioProduct[]
}

export interface StudioProductsData {
  studioId: number
  studioName: string
  selectedDate: string | null
  selectedTime: string | null
  productGroups: StudioProductGroup[]
}

// ===== 2-6. GET /api/v1/studios/{studioId}/products/{productId} =====

export interface StudioProductDetail {
  studioId: number
  studioName: string
  imageList: string[]
}

// ===== 2-7. GET /api/v1/studios/{studioId}/slots =====

export interface StudioTimeSlot {
  slotId: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

// 날짜/시간 선택 화면 상태 (컨셉 목록·예약 흐름에서 사용)
export interface StudioDateTimeSelection {
  date: CalendarDate
  slotId: string
  startTime: string
  endTime: string
}

// ===== 2-8. GET /api/v1/studios/{studioId}/hairMakeupDetail =====

export interface HairMakeupPartner {
  studioServiceId: number
  partnerName: string
  additionalPrice: number
  displayOrder: number
}

export interface HairMakeupData {
  studioId: number
  hairMakeupList: HairMakeupPartner[]
}
