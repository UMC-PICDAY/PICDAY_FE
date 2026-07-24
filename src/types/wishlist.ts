// PICDAY_API_Spec.md 기준
export interface WishlistItem {
  wishlistId: number
  studioId: number
  studioName: string
  thumbnail: string | null
  region: string | null
  minPrice: number | null
  rating: number
}

export interface WishlistResult {
  totalCount: number
  page: number
  size: number
  items: WishlistItem[]
}

export interface AddWishlistResult {
  wishlistId: number
  studioId: number
}
