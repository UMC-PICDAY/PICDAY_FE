// 5-1. GET /api/v1/studios/{studioId}/reviews
export type ReviewSort =
  | 'recent'
  | 'recommend'

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
  images: string[]
  likeCount: number
  isLiked: boolean
  isBest: boolean
  conceptName: string
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

// 리뷰 키워드
export type ReviewKeyword =
  | 'KIND_SERVICE'
  | 'DETAILED_RETOUCH'
  | 'ON_TIME'
  | 'COMFORTABLE_MOOD'
  | 'REASONABLE_PRICE'
  | 'SATISFYING_RESULT'

// 5-5 / 5-6. 추천 / 추천 취소 응답 data
export interface ReviewLikeResult {
  reviewId: number
  likeCount: number
}

// 5-2. 리뷰 작성 / 이미지 업로드
export interface UploadImageResult {
  imageUrl: string
}

export interface CreateReviewRequest {
  reservationId: number
  rating: number
  content: string
  imageUrls: string[] | null
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