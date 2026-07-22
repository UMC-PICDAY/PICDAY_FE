import type {
  ReviewListItem,
  ReviewListParams,
} from '@/pages/studio/types/review'

export const selectReviews = (
  reviews: readonly ReviewListItem[],
  { sort, photoOnly, page, size }: ReviewListParams,
) => {
  const filtered = photoOnly
    ? reviews.filter((review) => review.images.length > 0)
    : [...reviews]

  filtered.sort((left, right) =>
    sort === 'recommend'
      ? right.likeCount - left.likeCount
      : Date.parse(right.createdAt) - Date.parse(left.createdAt),
  )

  const start = Math.max(page - 1, 0) * size
  return filtered.slice(start, start + size)
}

export const formatReviewDate = (createdAt: string) =>
  createdAt.slice(0, 10).replaceAll('-', '.')
