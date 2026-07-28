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
  // 촬영 컨셉명. 백엔드에 추가 요청해 둔 상태로 아직 응답에 없어 optional.
  // 필드가 내려오기 시작하면 리뷰 카드에 자동으로 노출된다.
  conceptName?: string
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

// 5-2. 리뷰 작성 / 이미지 업로드
export interface UploadImageResult {
  imageUrl: string
}

export type ReviewKeyword =
  | 'KIND_SERVICE'
  | 'DETAILED_RETOUCH'
  | 'ON_TIME'
  | 'COMFORTABLE_MOOD'
  | 'REASONABLE_PRICE'
  | 'SATISFYING_RESULT'

export interface CreateReviewRequest {
  reservationId: number
  rating: number
  content: string
  keywords: ReviewKeyword[]
  imageUrls: string[] | null
}