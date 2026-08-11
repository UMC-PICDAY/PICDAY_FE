import { useQuery } from '@tanstack/react-query'

import { getReview } from '@/services/review'

export const reviewDetailQueryKey = (reviewId: number) =>
  ['reviewDetail', reviewId] as const

export const useReviewDetail = (
  reviewId: number,
  enabled: boolean,
) =>
  useQuery({
    queryKey: reviewDetailQueryKey(reviewId),
    queryFn: () => getReview(reviewId),
    enabled,
  })
