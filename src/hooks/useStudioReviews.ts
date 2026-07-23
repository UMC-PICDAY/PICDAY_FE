import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getStudioReviews, likeReview, unlikeReview } from '@/services/review'
import type { ReviewListData, ReviewSort } from '@/types/review'

interface UseStudioReviewsParams {
  studioId: string | undefined
  sort: ReviewSort
  photoOnly: boolean
}

interface LikeVariables {
  reviewId: number
  nextLiked: boolean
}

const reviewListKey = (
  studioId: string | undefined,
  sort: ReviewSort,
  photoOnly: boolean,
) => ['studioReviews', studioId, sort, photoOnly] as const

// 리뷰 목록 조회(useQuery) + 도움돼요 토글(useMutation, 낙관적 업데이트)을 한곳에서 제공.
export const useStudioReviews = ({
  studioId,
  sort,
  photoOnly,
}: UseStudioReviewsParams) => {
  const queryClient = useQueryClient()
  const queryKey = reviewListKey(studioId, sort, photoOnly)

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getStudioReviews(studioId ?? '', { sort, photoOnly, page: 1, size: 10 }),
    enabled: Boolean(studioId),
  })

  // 캐시된 목록에서 특정 리뷰의 좋아요 상태/카운트만 갱신
  const patchReview = (
    data: ReviewListData | undefined,
    reviewId: number,
    patch: (likeCount: number) => { isLiked: boolean; likeCount: number },
  ): ReviewListData | undefined =>
    data
      ? {
          ...data,
          items: data.items.map((review) =>
            review.reviewId === reviewId
              ? { ...review, ...patch(review.likeCount) }
              : review,
          ),
        }
      : data

  const likeMutation = useMutation({
    mutationFn: ({ reviewId, nextLiked }: LikeVariables) =>
      nextLiked ? likeReview(reviewId) : unlikeReview(reviewId),
    onMutate: async ({ reviewId, nextLiked }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<ReviewListData>(queryKey)
      queryClient.setQueryData<ReviewListData>(queryKey, (old) =>
        patchReview(old, reviewId, (likeCount) => ({
          isLiked: nextLiked,
          likeCount: Math.max(0, likeCount + (nextLiked ? 1 : -1)),
        })),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
    },
    // 서버가 확정한 likeCount로 보정
    onSuccess: (result, { nextLiked }) => {
      queryClient.setQueryData<ReviewListData>(queryKey, (old) =>
        patchReview(old, result.reviewId, () => ({
          isLiked: nextLiked,
          likeCount: result.likeCount,
        })),
      )
    },
  })

  return {
    summary: query.data?.summary ?? null,
    reviews: query.data?.items ?? [],
    isPending: query.isPending,
    isError: query.isError,
    toggleLike: (reviewId: number, nextLiked: boolean) =>
      likeMutation.mutate({ reviewId, nextLiked }),
    likePending: likeMutation.isPending,
  }
}
