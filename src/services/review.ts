import { apiDelete, apiGet, apiPatch, apiPost, withMockFallback } from '@/services/client'
import type {
  CreateReviewRequest,
  CreateReviewResult,
  ReviewDetailData,
  ReviewLikeResult,
  ReviewListData,
  ReviewListParams,
  UpdateReviewRequest,
  UpdateReviewResult,
  UploadImageResult,
} from '@/types/review'

import cardImage2 from '@/assets/images/CardImage2.png'

// 백엔드 미배포 데모용 mock (main 전용) — services/client.ts의 withMockFallback 참고
const MOCK_REVIEW_LIST: ReviewListData = {
  summary: { avgRating: 4.9, totalCount: 2, photoReviewCount: 1 },
  page: 1,
  size: 10,
  items: [
    {
      reviewId: 1,
      writerNickname: '즐거운사진사1204',
      rating: 5,
      content: '사진이 너무 잘 나왔어요! 작가님도 친절하시고 공간도 예뻐요.',
      keywords: [],
      images: [cardImage2],
      likeCount: 12,
      isLiked: false,
      isBest: true,
      conceptName: '체리베리벌쓰데이',
      createdAt: '2026-06-20T12:00:00Z',
    },
    {
      reviewId: 2,
      writerNickname: '햇살가득',
      rating: 4.8,
      content: '분위기가 좋고 보정도 자연스러웠습니다.',
      keywords: [],
      images: [],
      likeCount: 3,
      isLiked: false,
      isBest: false,
      conceptName: '프로필 기본',
      createdAt: '2026-05-02T09:30:00Z',
    },
  ],
}

// 5-1. 리뷰 목록 조회
export const getStudioReviews = (
  studioId: string,
  params: ReviewListParams,
): Promise<ReviewListData> => {
  const mockItems = params.photoOnly
    ? MOCK_REVIEW_LIST.items.filter((item) => item.images.length > 0)
    : MOCK_REVIEW_LIST.items

  return withMockFallback(
    () => apiGet<ReviewListData>(`/api/v1/studios/${studioId}/reviews`, params),
    { ...MOCK_REVIEW_LIST, items: mockItems },
  )
}

// 5-5. 리뷰 추천(도움돼요)
export const likeReview = (reviewId: number): Promise<ReviewLikeResult> =>
  withMockFallback(
    () => apiPost<ReviewLikeResult>(`/api/v1/reviews/${reviewId}/like`),
    { reviewId, likeCount: 1 },
  )

// 5-6. 리뷰 추천 취소
export const unlikeReview = (reviewId: number): Promise<ReviewLikeResult> =>
  withMockFallback(
    () => apiDelete<ReviewLikeResult>(`/api/v1/reviews/${reviewId}/like`),
    { reviewId, likeCount: 0 },
  )

// 5-2. 리뷰 작성
export const createReview = (body: CreateReviewRequest): Promise<CreateReviewResult> =>
  withMockFallback(() => apiPost<CreateReviewResult>('/api/v1/reviews', body), { reviewId: 1 })

// 리뷰 이미지 업로드
export const uploadImage = (file: File): Promise<UploadImageResult> => {
  const formData = new FormData()
  formData.append('file', file)
  return withMockFallback(
    () => apiPost<UploadImageResult>('/api/v1/images', formData),
    { imageUrl: URL.createObjectURL(file) },
  )
}

// 리뷰 단건 조회
const MOCK_REVIEW_DETAIL: ReviewDetailData = {
  reviewId: 1,
  studioName: '데이지 스튜디오',
  conceptName: '체리베리벌쓰데이',
  shootingDate: '2026-06-20',
  rating: 5,
  keywords: [],
  images: [cardImage2],
  content: '사진이 너무 잘 나왔어요! 작가님도 친절하시고 공간도 예뻐요.',
  createdAt: '2026-06-20T12:00:00Z',
}

export const getReview = (reviewId: number): Promise<ReviewDetailData> =>
  withMockFallback(
    () => apiGet<ReviewDetailData>(`/api/v1/reviews/${reviewId}`),
    { ...MOCK_REVIEW_DETAIL, reviewId },
  )

// 5-3. 리뷰 수정
export const updateReview = (
  reviewId: number,
  body: UpdateReviewRequest,
): Promise<UpdateReviewResult> =>
  withMockFallback(
    () => apiPatch<UpdateReviewResult>(`/api/v1/reviews/${reviewId}`, body),
    { reviewId },
  )

// 5-4. 리뷰 삭제
export const deleteReview = (reviewId: number): Promise<null> =>
  withMockFallback(() => apiDelete<null>(`/api/v1/reviews/${reviewId}`), null)