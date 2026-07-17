// PICDAY_API_1st.pdf 기준 path만 확정, Request/Response DTO는 미정
// 리뷰 수정/삭제/추천취소는 명세서에 아직 없음 (팀 확인 필요)
import { apiGet, apiPost } from '@/services/client'

export interface ReviewListParams {
  sort?: string
  photoOnly?: boolean
  page?: number
}

export const getReviews = (studioId: string, params?: ReviewListParams) =>
  apiGet<unknown>(`/api/v1/studios/${studioId}/reviews`, params)

export const createReview = (body: unknown) => apiPost<unknown>('/api/v1/reviews', body)

export const likeReview = (reviewId: string) =>
  apiPost<unknown>(`/api/v1/reviews/${reviewId}/like`)

export const uploadImage = (file: File) => {
  const formData = new FormData()
  formData.append('image', file)
  return apiPost<unknown>('/api/v1/images', formData)
}
