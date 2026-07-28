// 리뷰 태그 ENUM
export type ReviewKeyword =
  | 'KIND_SERVICE'
  | 'DETAILED_RETOUCH'
  | 'ON_TIME'
  | 'COMFORTABLE_MOOD'
  | 'REASONABLE_PRICE'
  | 'SATISFYING_RESULT'

// 5-1. GET /api/v1/studios/{studioId}/reviews
export type ReviewSort =
  | 'recent'
  | 'recommend'
  | 'ratingHigh'
  | 'ratingLow'

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
  keywords: ReviewKeyword[]
  images: string[]
  likeCount: number
  isLiked: boolean
  isBest: boolean
  createdAt: string
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

// 5-2. 리뷰 작성 요청
export interface CreateReviewRequest {
  reservationId: number
  rating: number
  content: string
  keywords?: ReviewKeyword[]
  imageUrls: string[] | null
}

// 5-2. 리뷰 작성 응답
export interface CreateReviewResult {
  reviewId: number
}

// 리뷰 이미지 업로드 응답
export interface UploadImageResult {
  imageUrl: string
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
  imageUrls?: string[] | null
}

// 5-3. 리뷰 수정 응답
export interface UpdateReviewResult {
  reviewId: number
}

// 5-5 / 5-6. 추천 / 추천 취소 응답
export interface ReviewLikeResult {
  reviewId: number
  likeCount: number
}