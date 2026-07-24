// PICDAY_API_Spec.md 기준
import { apiDelete, apiGet, apiPost, withMockFallback } from '@/services/client'
import type { AddWishlistResult, WishlistResult } from '@/types/wishlist'

import cardImage1 from '@/assets/images/CardImage1.png'
import cardImage4 from '@/assets/images/CardImage4.png'

// 백엔드 미배포 데모용 mock (main 전용) — services/client.ts의 withMockFallback 참고
const MOCK_WISHLIST_RESULT: WishlistResult = {
  totalCount: 2,
  page: 1,
  size: 10,
  items: [
    {
      wishlistId: 1,
      studioId: 1,
      studioName: '데이지 스튜디오',
      thumbnail: cardImage1,
      region: '홍대',
      minPrice: 55000,
      rating: 4.9,
    },
    {
      wishlistId: 2,
      studioId: 4,
      studioName: '스펙플렉스',
      thumbnail: cardImage4,
      region: '연남',
      minPrice: 55000,
      rating: 4.9,
    },
  ],
}

export const getWishlists = (page = 1, size = 10) =>
  withMockFallback(
    () => apiGet<WishlistResult>('/api/v1/wishlists', { page, size }),
    { ...MOCK_WISHLIST_RESULT, page, size },
  )

export const addWishlist = (studioId: number) =>
  withMockFallback(
    () => apiPost<AddWishlistResult>('/api/v1/wishlists', { studioId }),
    { wishlistId: studioId, studioId },
  )

export const removeWishlist = (studioId: number) =>
  withMockFallback(() => apiDelete<null>(`/api/v1/wishlists/${studioId}`), null)
