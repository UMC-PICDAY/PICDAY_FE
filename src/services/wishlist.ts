// PICDAY_API_1st.pdf 기준 path만 확정, Request/Response DTO는 미정
import { apiDelete, apiGet, apiPost } from '@/services/client'

export const getWishlists = () => apiGet<unknown>('/api/v1/wishlists')

export const addWishlist = (body: unknown) => apiPost<unknown>('/api/v1/wishlists', body)

export const removeWishlist = (studioId: string) =>
  apiDelete<unknown>(`/api/v1/wishlists/${studioId}`)
