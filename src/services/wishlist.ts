// PICDAY_API_Spec.md 기준
import { apiDelete, apiGet, apiPost } from '@/services/client'
import type { AddWishlistResult, WishlistResult } from '@/types/wishlist'

export const getWishlists = (page = 1, size = 10) =>
  apiGet<WishlistResult>('/api/v1/wishlists', { page, size })

export const addWishlist = (studioId: number) =>
  apiPost<AddWishlistResult>('/api/v1/wishlists', { studioId })

export const removeWishlist = (studioId: number) =>
  apiDelete<null>(`/api/v1/wishlists/${studioId}`)
