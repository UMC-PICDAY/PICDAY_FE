import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from '@/services/client'

import type {
  CreateReviewRequest,
  ReviewLikeResult,
  ReviewListData,
  ReviewListParams,
  UpdateReviewRequest,
  UpdateReviewResult,
  UploadImageResult,
} from '@/types/review'

// 5-1. 리뷰 목록 조회
export const getStudioReviews = (
  studioId: string,
  params: ReviewListParams,
): Promise<ReviewListData> =>
  apiGet<ReviewListData>(
    `/api/v1/studios/${studioId}/reviews`,
    params,
  )

// 5-2. 리뷰 작성
export const createReview = (
  body: CreateReviewRequest,
): Promise<unknown> =>
  apiPost<unknown>('/api/v1/reviews', body)

// 리뷰 이미지 업로드
export const uploadImage = (
  file: File,
): Promise<UploadImageResult> => {
  const formData = new FormData()
  formData.append('file', file)

  return apiPost<UploadImageResult>(
    '/api/v1/images',
    formData,
  )
}

// 5-3. 리뷰 수정
export const updateReview = (
  reviewId: number,
  body: UpdateReviewRequest,
): Promise<UpdateReviewResult> =>
  apiPatch<UpdateReviewResult>(
    `/api/v1/reviews/${reviewId}`,
    body,
  )

// 5-4. 리뷰 삭제
export const deleteReview = (
  reviewId: number,
): Promise<null> =>
  apiDelete<null>(
    `/api/v1/reviews/${reviewId}`,
  )

// 5-5. 리뷰 추천(도움돼요)
export const likeReview = (
  reviewId: number,
): Promise<ReviewLikeResult> =>
  apiPost<ReviewLikeResult>(
    `/api/v1/reviews/${reviewId}/like`,
  )

// 5-6. 리뷰 추천 취소
export const unlikeReview = (
  reviewId: number,
): Promise<ReviewLikeResult> =>
  apiDelete<ReviewLikeResult>(
    `/api/v1/reviews/${reviewId}/like`,
  )