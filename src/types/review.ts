// 리뷰 태그 ENUM
export type ReviewKeyword =
  | 'KIND_SERVICE'
  | 'DETAILED_RETOUCH'
  | 'ON_TIME'
  | 'COMFORTABLE_MOOD'
  | 'REASONABLE_PRICE'
  | 'SATISFYING_RESULT'

// 5-1. GET /api/v1/studios/{studioId}/reviews
export type ReviewSort = 'recent' | 'recommend' | 'ratingHigh' | 'ratingLow'

export interface ReviewListParams {
  sort?: ReviewSort
  photoOnly?: boolean
  page?: number
  size?: number
}

export interface ReviewListItem {
  reviewId: number
  writerNickname: string
  rating: number
  content: string
  keywords: ReviewKeyword[] // 태그가 없으면 빈 배열
  conceptName: string // 촬영 컨셉명
  images: string[]
  likeCount: number
  isLiked: boolean
  // 해당 사진관에서 추천 수가 가장 많은 리뷰 1건
  isBest: boolean
  createdAt: string // ISO 8601
}

export interface ReviewSummary {
  avgRating: number
  totalCount: number
  photoReviewCount: number
}

export interface ReviewListData {
  summary: ReviewSummary
  page: number
  size: number
  items: ReviewListItem[]
}

// 5-5 / 5-6. 추천 / 추천 취소 응답 data
export interface ReviewLikeResult {
  reviewId: number
  likeCount: number
}

// 리뷰 이미지 업로드 응답
export interface UploadImageResult {
  imageUrl: string
}

// 5-2. 리뷰 작성 요청
export interface CreateReviewRequest {
  reservationId: number
  rating: number
  content: string
  keywords: ReviewKeyword[]
  imageUrls: string[]
}

// 5-2. 리뷰 작성 응답
export interface CreateReviewResult {
  reviewId: number
}

// 리뷰 단건 조회 응답
export interface ReviewDetailData {
  reviewId: number
  studioName: string
  conceptName: string
  shootingDate: string
  rating: number
  keywords: ReviewKeyword[]
  images: string[]
  content: string
  createdAt: string
}

// 5-3. 리뷰 수정 요청
export interface UpdateReviewRequest {
  rating?: number
  content?: string
  keywords?: ReviewKeyword[]
  imageUrls?: string[]
}

// 5-3. 리뷰 수정 응답
export interface UpdateReviewResult {
  reviewId: number
}