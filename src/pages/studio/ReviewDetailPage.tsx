import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import Alert3 from '@/components/common/Alert3'
import Checkbox from '@/components/common/Checkbox'
import Dropdown from '@/components/common/Dropdown'
import { IcFilter, IcStar, IcStarHalf } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'

import ReviewCard from '@/pages/studio/components/ReviewCard'

const SORT_OPTIONS = [
  { value: 'recommended', label: '추천순' },
  { value: 'latest', label: '최신순' },
  { value: 'rating-high', label: '평점 높은순' },
  { value: 'rating-low', label: '평점 낮은 순' },
] as const

const REVIEWS = [
  {
    reviewerName: '봄_핑크',
    date: '2개월 전',
    stats: '리뷰 32 · 사진 84 · 장소 23',
    conceptTitle: '개인화보',
    body: '스튜디오 분위기가 너무 예뻐서 촬영하는 내내 설레었어요. 작가님도 친절하시고 포즈 가이드도 상세하게 해주셔서 어색함 없이 자연스럽게 찍을 수 있었습니다.',
    likeCount: 0,
    liked: false,
  },
  {
    reviewerName: '봄_핑크',
    date: '3개월 전',
    stats: '리뷰 11 · 사진 37 · 장소 8',
    conceptTitle: '체리베리벌쓰데이',
    body: '컨셉 소품 구성이 풍부하고 의상도 퀄리티가 높았어요. 보정본 퀄리티도 만족스럽고 당일 현장에서 바로 가이드받으며...',
    likeCount: 3,
    liked: true,
  },
]

const ReviewDetailPage = () => {
  const navigate = useNavigate()
  const { studioId } = useParams()
  const [searchParams] = useSearchParams()
  const [photoOnly, setPhotoOnly] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [sortValue, setSortValue] = useState('recommended')
  const [loginOpen, setLoginOpen] = useState(searchParams.get('login') === '1')

  const sortLabel =
    SORT_OPTIONS.find((option) => option.value === sortValue)?.label ?? '추천순'

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
          <span className="pl-2 font-h2 text-black">4.9</span>
        </div>
        <span className="font-b6 text-gray-60">(721개 평가)</span>
      </div>

      {/* 필터 행 */}
      <div className="flex items-center justify-between border-y border-gray-10 px-5 py-3">
        <label className="flex items-center gap-1">
          <Checkbox
            checked={photoOnly}
            onChange={() => setPhotoOnly((prev) => !prev)}
          />
          <span className="font-b6 text-gray-60">사진 리뷰만 보기 (198)</span>
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
                    setSortValue(value)
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
        {REVIEWS.map((review, index) => (
          <ReviewCard
            key={index}
            variant="full"
            reviewerName={review.reviewerName}
            isBest
            rating={5}
            date={review.date}
            stats={review.stats}
            conceptTitle={review.conceptTitle}
            body={review.body}
            photos={[null, null]}
            helpfulText="1명에게 도움이 된 리뷰예요"
            likeCount={review.likeCount}
            liked={review.liked}
          />
        ))}
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

      {loginOpen && (
        <div
          className="fixed inset-0 z-40 mx-auto flex max-w-[390px] items-center justify-center bg-black/40 px-5"
          onClick={() => setLoginOpen(false)}
        >
          <div className="w-full" onClick={(event) => event.stopPropagation()}>
            <Alert3 variant="variant3" onHelperClick={() => setLoginOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewDetailPage
