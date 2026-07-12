/**
 * Figma F-1R 리뷰 작성 (라우트: /mypage/reservations/:reservationId/review)
 *
 * 촬영 완료 예약 건에 대한 별점, 태그, 후기, 사진 첨부 입력 화면
 *
 * TODO: 현재 별점은 1점 단위 클릭만 지원함
 * TODO: 추후 반 별점 클릭/표시가 필요하면 IcStarHalf를 활용해 0.5점 단위 선택 로직 추가 예정
 */

import { useState } from 'react'
import { useNavigate } from 'react-router'

import cardImage1 from '@/assets/images/CardImage1.png'
import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import InputImage from '@/components/common/InputImage'
import InputReview from '@/components/common/InputReview'
import TimeChip from '@/components/common/TimeChip'
import { IcBack, IcStar } from '@/components/icons'

const reviewTags = [
  '친절한 응대',
  '꼼꼼한 보정',
  '시간 엄수',
  '편안한 분위기',
  '합리적인 가격',
  '만족스러운 결과물',
]

const ReviewWritePage = () => {
  const navigate = useNavigate()

  const [rating, setRating] = useState(5)
  const [selectedTags, setSelectedTags] = useState<string[]>(['친절한 응대', '꼼꼼한 보정'])
  const [review, setReview] = useState('')
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [hasImage, setHasImage] = useState(true)

  const isReviewError = review.length > 0 && review.length < 10
  const canSubmit = review.length >= 10

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    )
  }

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-[402px] bg-white pb-[120px]">
      <header className="flex w-full items-center justify-between border-b border-gray-10 bg-white px-5 py-3">
        <button
          type="button"
          aria-label="뒤로가기"
          className="flex h-9 w-9 items-center justify-start"
          onClick={() => setIsCancelModalOpen(true)}
        >
          <IcBack width={24} height={24} />
        </button>

        <div className="flex flex-1 items-center justify-center">
          <h1 className="font-h6 text-black">리뷰 작성</h1>
        </div>

        <div className="h-9 w-9" />
      </header>

      <section className="flex w-full flex-col items-start gap-[15px] p-5">
        <div className="flex w-full flex-col items-start rounded-[8px] bg-[rgba(254,228,235,0.3)] px-4 py-3">
          <div className="flex w-full flex-col items-start gap-0.5">
            <h2 className="font-b3 text-gray-80">데이지 스튜디오</h2>
            <p className="font-b8 text-gray-60">개인화보 · 2025.06.14 (일) 촬영</p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-1 py-[10px]">
          <div className="flex h-[21px] w-full items-center justify-center gap-[10px] px-1">
            <p className="flex-1 font-b5 text-black">만족스러우셨나요?</p>
          </div>

          <div className="flex items-center gap-[5px]">
            {Array.from({ length: 5 }).map((_, index) => {
              const starIndex = index + 1
              const isActive = starIndex <= rating

              return (
                <button key={starIndex} type="button" onClick={() => setRating(starIndex)}>
                  <IcStar
                    width={36}
                    height={36}
                    className={isActive ? 'text-brand-100' : 'text-gray-20'}
                  />
                </button>
              )
            })}

            <span className="font-b6 text-gray-40">5.0</span>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-2 py-[10px]">
          <div className="flex h-[21px] w-full items-center justify-center gap-[10px] px-1">
            <p className="flex-1 font-b5 text-black">어떤점이 좋았나요? (복수 선택 가능)</p>
          </div>

          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full items-center gap-[10px]">
              {reviewTags.slice(0, 3).map((tag) => (
                <TimeChip
                  key={tag}
                  label={tag}
                  property1={selectedTags.includes(tag) ? 'selected' : 'default'}
                  onClick={() => handleTagClick(tag)}
                />
              ))}
            </div>

            <div className="flex w-full items-center gap-[10px]">
              {reviewTags.slice(3).map((tag) => (
                <TimeChip
                  key={tag}
                  label={tag}
                  property1={selectedTags.includes(tag) ? 'selected' : 'default'}
                  onClick={() => handleTagClick(tag)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex h-[21px] w-full items-center justify-center gap-[10px] px-1">
            <p className="flex-1 font-b5 text-black">후기를 남겨주세요</p>
          </div>

          <InputReview value={review} onChange={setReview} isError={isReviewError} />
        </div>

        <div className="flex w-full flex-col items-start gap-2">
          <p className="font-b5 text-black">사진 첨부</p>

          <div className="flex items-start gap-3">
            <InputImage count={0} />
            {hasImage && (
              <InputImage imageSrc={cardImage1} count={1} onRemove={() => setHasImage(false)} />
            )}
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[402px] -translate-x-1/2 bg-white px-5 pb-10">
        <Button
          variant={canSubmit ? 'primary' : 'disabled'}
          onClick={canSubmit ? () => navigate('/mypage/reservations/2/review/complete') : undefined}
        >
          등록하기
        </Button>
      </div>

      {isCancelModalOpen && (
        <div className="fixed left-1/2 top-0 z-50 flex h-dvh w-full max-w-[402px] -translate-x-1/2 items-center justify-center bg-[#464545]/90 px-5">
          <Alert
            variant="variant2"
            onCancel={() => navigate('/mypage')}
            onConfirm={() => setIsCancelModalOpen(false)}
          />
        </div>
      )}
    </main>
  )
}

export default ReviewWritePage