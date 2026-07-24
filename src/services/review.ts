import { apiDelete, apiGet, apiPost } from '@/services/client'
import type {
  CreateReviewRequest,
  ReviewLikeResult,
  ReviewListData,
  ReviewListParams,
  UploadImageResult,
} from '@/types/review'

// 5-1. 리뷰 목록 조회
export const getStudioReviews = (
  studioId: string,
  params: ReviewListParams,
): Promise<ReviewListData> =>
  apiGet<ReviewListData>(`/api/v1/studios/${studioId}/reviews`, params)

// 5-5. 리뷰 추천(도움돼요)
export const likeReview = (reviewId: number): Promise<ReviewLikeResult> =>
  apiPost<ReviewLikeResult>(`/api/v1/reviews/${reviewId}/like`)

// 5-6. 리뷰 추천 취소
export const unlikeReview = (reviewId: number): Promise<ReviewLikeResult> =>
  apiDelete<ReviewLikeResult>(`/api/v1/reviews/${reviewId}/like`)

// 5-2. 리뷰 작성 / 이미지 업로드
export const createReview = (body: CreateReviewRequest) =>
  apiPost<unknown>('/api/v1/reviews', body)

export const uploadImage = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiPost<UploadImageResult>('/api/v1/images', formData)
}
