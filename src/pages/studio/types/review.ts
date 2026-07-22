export type ReviewSort = 'recent' | 'recommend'

export interface ReviewListParams {
  sort: ReviewSort
  photoOnly: boolean
  page: number
  size: number
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
