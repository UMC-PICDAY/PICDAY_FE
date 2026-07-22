import type { ReviewListData } from '@/pages/studio/types/review'

import cardImage1 from '@/assets/images/CardImage1.png'
import cardImage2 from '@/assets/images/CardImage2.png'
import cardImage3 from '@/assets/images/CardImage3.png'

/** GET /api/v1/studios/{studioId}/reviews 응답의 data fixture입니다. */
export const MOCK_STUDIO_REVIEW_DATA: ReviewListData = {
  summary: {
    avgRating: 4.9,
    totalCount: 721,
    photoReviewCount: 198,
  },
  page: 1,
  size: 10,
  items: [
    {
      reviewId: 31,
      writerNickname: '봄_핑크',
      rating: 5,
      content:
        '스튜디오 분위기가 너무 예뻐서 촬영하는 내내 설레었어요. 작가님도 친절하시고 포즈 가이드도 상세하게 해주셔서 어색함 없이 자연스럽게 찍을 수 있었습니다.',
      images: [cardImage1, cardImage2],
      likeCount: 12,
      isLiked: false,
      isBest: true,
      conceptName: '개인화보',
      createdAt: '2026-07-01T14:20:00',
    },
    {
      reviewId: 32,
      writerNickname: '여름빛',
      rating: 5,
      content:
        '컨셉 소품 구성이 풍부하고 의상도 퀄리티가 높았어요. 보정본도 만족스럽고 현장에서 편하게 촬영했습니다.',
      images: [],
      likeCount: 3,
      isLiked: true,
      isBest: false,
      conceptName: '체리베리벌쓰데이',
      createdAt: '2026-07-20T10:30:00',
    },
    {
      reviewId: 33,
      writerNickname: '사진산책',
      rating: 4,
      content:
        '자연광이 예쁘게 들어오고 촬영 동선이 편했어요. 원하는 분위기를 잘 반영해 주셔서 만족합니다.',
      images: [cardImage3],
      likeCount: 7,
      isLiked: false,
      isBest: false,
      conceptName: '프로필 사진',
      createdAt: '2026-06-15T16:10:00',
    },
  ],
}
