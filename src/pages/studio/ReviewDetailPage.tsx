import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import Alert3 from '@/components/common/Alert3'
import Checkbox from '@/components/common/Checkbox'
import Dropdown from '@/components/common/Dropdown'
import Notice2 from '@/components/common/Notice2'
import { IcFilter, IcStar, IcStarHalf } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'

import ReviewCard from '@/pages/studio/components/ReviewCard'
import { useStudioReviews } from '@/hooks/useStudioReviews'
import type { ReviewSort } from '@/types/review'
import { useAuthStore } from '@/stores/useAuthStore'

const SORT_OPTIONS = [
  { value: 'recent', label: '최신순' },
  { value: 'recommend', label: '추천순' },
] as const

const ReviewDetailPage = () => {
  const navigate = useNavigate()
  const { studioId } = useParams()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const [photoOnly, setPhotoOnly] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [sortValue, setSortValue] = useState<ReviewSort>('recent')

  const { summary, reviews, toggleLike, likePending } = useStudioReviews({
    studioId,
    sort: sortValue,
    photoOnly,
    enabled: isLoggedIn,
  })

  const sortLabel =
    SORT_OPTIONS.find((option) => option.value === sortValue)?.label ?? '최신순'

  const handleLikeChange = (reviewId: number, nextLiked: boolean) => {
    toggleLike(reviewId, nextLiked)
  }

  // 리뷰는 로그인한 사용자만 볼 수 있어, 비로그인 진입 시 로그인 유도 모달만 노출한다.
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <NavigationBar variant="default" title="리얼리뷰" onBack={() => navigate(-1)} />
        <div className="fixed inset-0 z-40 mx-auto flex max-w-[390px] items-center justify-center bg-black/40 px-5">
          <div className="w-full">
            <Alert3
              variant="variant3"
              onClick={() => navigate('/login')}
              onHelperClick={() => navigate(-1)}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white pb-24">
      <NavigationBar
        variant="default"
        title="리얼리뷰"
        onBack={() => navigate(-1)}
        rightNode={
          <button
            type="button"
            onClick={() => navigate(`/studios/${studioId}/reviews/policy`)}
            className="whitespace-nowrap font-b11 text-gray-60"
          >
            운영정책
          </button>
        }
      />

      {/* 별점 요약 */}
      <div className="flex flex-col items-center px-5 py-8">
        <div className="flex items-center pb-1">
          <div className="flex">
            <IcStar width={36} height={36} className="text-brand-80" />
            <IcStar width={36} height={36} className="text-brand-80" />
            <IcStar width={36} height={36} className="text-brand-80" />
            <IcStar width={36} height={36} className="text-brand-80" />
            <IcStarHalf width={36} height={36} className="text-brand-80" />
          </div>
          <span className="pl-2 font-h2 text-black">
            {(summary?.avgRating ?? 0).toFixed(1)}
          </span>
        </div>
        <span className="font-b6 text-gray-60">
          ({summary?.totalCount ?? 0}개 평가)
        </span>
      </div>

      {/* 필터 행 */}
      <div className="flex items-center justify-between border-y border-gray-10 px-5 py-3">
        <label className="flex items-center gap-1">
          <Checkbox
            checked={photoOnly}
            onChange={() => setPhotoOnly((prev) => !prev)}
          />
          <span className="font-b6 text-gray-60">
            사진 리뷰만 보기 ({summary?.photoReviewCount ?? 0})
          </span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((prev) => !prev)}
            className="flex items-center gap-2.5"
          >
            <IcFilter width={24} height={24} />
            <span className="font-b6 text-gray-60">{sortLabel}</span>
          </button>

          {sortOpen && (
            <>
              <button
                type="button"
                aria-label="정렬 닫기"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setSortOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2">
                <Dropdown
                  options={SORT_OPTIONS}
                  value={sortValue}
                  onChange={(value) => {
                    setSortValue(value as ReviewSort)
                    setSortOpen(false)
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 리뷰 리스트 */}
      <div className="flex flex-col gap-5 pb-5">
        {reviews.map((review) => (
          <ReviewCard
            key={review.reviewId}
            reviewId={review.reviewId}
            variant="full"
            reviewerName={review.writerNickname}
            isBest={review.isBest}
            rating={review.rating}
            date={review.createdAt.slice(0, 10).replaceAll('-', '.')}
            conceptTitle={review.conceptName}
            body={review.content}
            photos={review.images}
            helpfulText={`${review.likeCount}명에게 도움이 된 리뷰예요`}
            likeCount={review.likeCount}
            liked={review.isLiked}
            likePending={likePending}
            onLikeChange={handleLikeChange}
          />
        ))}
        {reviews.length === 0 && (
          <Notice2
            variant="message"
            title="조건에 맞는 리뷰가 없어요"
            className="py-20"
          />
        )}
      </div>

      {/* 하단 고정 CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-[390px] justify-center bg-white p-5">
        <button
          type="button"
          onClick={() => navigate(`/studios/${studioId}/concepts`)}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-brand-100 font-b5 text-white"
        >
          모든 컨셉 보기
        </button>
      </div>
    </div>
  )
}

export default ReviewDetailPage
