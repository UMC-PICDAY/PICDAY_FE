// 5-1. GET /api/v1/studios/{studioId}/reviews
export type ReviewSort = 'recent' | 'recommend'

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

// 5-5 / 5-6. 추천 / 추천 취소 응답 data
export interface ReviewLikeResult {
  reviewId: number
  likeCount: number
}
