/**
 * Figma F-1R 리뷰 작성 (라우트: /mypage/reservations/:reservationId/review)
 *
 * 촬영 완료 예약 건에 대한 별점, 태그, 후기, 사진 첨부 입력 화면
 * 별점은 1점 단위로 선택 가능함
 * 사진은 최대 5장까지 첨부하고 삭제할 수 있음
 */
import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import InputImage from '@/components/common/InputImage'
import InputReview from '@/components/common/InputReview'
import TimeChip from '@/components/common/TimeChip'
import { IcStar, IcStar2 } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'
import {
  getReservationDetail,
  type ReservationDetailData,
} from '@/services/reservation'
import {
  createReview,
  uploadImage,
} from '@/services/review'
import type { ReviewKeyword } from '@/types/review'


const formatShootingDate = (
  reservationDate: string,
  reservationTime: string,
) => {
  const [year, month, day] = reservationDate
    .split('-')
    .map(Number)

  const date = new Date(year, month - 1, day)

  const weekday = new Intl.DateTimeFormat('ko-KR', {
    weekday: 'short',
  }).format(date)

  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} (${weekday}) ${reservationTime} 촬영`
}

interface ReviewImage {
  id: string
  file: File
  previewUrl: string
}

const MAX_IMAGE_COUNT = 5
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

const reviewTags = [
  '친절한 응대',
  '꼼꼼한 보정',
  '시간 엄수',
  '편안한 분위기',
  '합리적인 가격',
  '만족스러운 결과물',
] as const

type ReviewTag =
  (typeof reviewTags)[number]

const REVIEW_KEYWORD_MAP: Record<
  ReviewTag,
  ReviewKeyword
> = {
  '친절한 응대': 'KIND_SERVICE',
  '꼼꼼한 보정': 'DETAILED_RETOUCH',
  '시간 엄수': 'ON_TIME',
  '편안한 분위기': 'COMFORTABLE_MOOD',
  '합리적인 가격': 'REASONABLE_PRICE',
  '만족스러운 결과물':
    'SATISFYING_RESULT',
}

const ReviewWritePage = () => {
  const navigate = useNavigate()
  const { reservationId } = useParams<{
    reservationId: string
  }>()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const imageListRef = useRef<ReviewImage[]>([])

  const [reservation, setReservation] =
    useState<ReservationDetailData | null>(null)

  const [rating, setRating] = useState(5)
  const [selectedTags, setSelectedTags] = useState<ReviewTag[]>([
    '친절한 응대',
    '꼼꼼한 보정',
  ])
  const [review, setReview] = useState('')
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [imageList, setImageList] = useState<ReviewImage[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const trimmedReview = review.trim()
  const isReviewError =
    review.length > 0 && trimmedReview.length < 10

  const canSubmit =
    rating >= 1 &&
    trimmedReview.length >= 10 &&
    trimmedReview.length <= 500

  useEffect(() => {
    if (!reservationId) {
      navigate('/mypage', { replace: true })
      return
    }

    const fetchReservationDetail = async () => {
      try {
        const result = await getReservationDetail(reservationId)
        setReservation(result)
      } catch (error) {
        console.error('예약 정보 조회에 실패했습니다.', error)
        navigate('/mypage', { replace: true })
      }
    }

    void fetchReservationDetail()
  }, [navigate, reservationId])

  useEffect(() => {
    imageListRef.current = imageList
  }, [imageList])

  useEffect(() => {
    return () => {
      imageListRef.current.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl)
      })
    }
  }, [])

  const handleTagClick = (tag: ReviewTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : [...prev, tag],
    )
  }

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex)
  }

  const handleImageButtonClick = () => {
    if (imageList.length >= MAX_IMAGE_COUNT) {
      return
    }

    fileInputRef.current?.click()
  }

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(
      event.target.files ?? [],
    )
    const remainingCount =
      MAX_IMAGE_COUNT - imageList.length

    const validFiles = selectedFiles
      .filter((file) => {
        const isAllowedType =
          ALLOWED_IMAGE_TYPES.includes(file.type)
        const isAllowedSize =
          file.size <= MAX_IMAGE_SIZE

        return isAllowedType && isAllowedSize
      })
      .slice(0, remainingCount)

    if (validFiles.length === 0) {
      event.target.value = ''
      return
    }

    const newImages: ReviewImage[] = validFiles.map(
      (file) => ({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }),
    )

    setImageList((prev) => [...prev, ...newImages])
    event.target.value = ''
  }

  const handleImageRemove = (imageId: string) => {
    setImageList((prev) => {
      const targetImage = prev.find(
        (image) => image.id === imageId,
      )

      if (targetImage) {
        URL.revokeObjectURL(targetImage.previewUrl)
      }

      return prev.filter(
        (image) => image.id !== imageId,
      )
    })
  }

  const handleSubmit = async () => {
    if (!canSubmit || isUploading || !reservation) {
      return
    }

    try {
      setIsUploading(true)

      const uploadResults = await Promise.all(
        imageList.map((image) =>
          uploadImage(image.file),
        ),
      )

      const uploadedImageUrls = uploadResults.map(
        (result) => result.imageUrl,
      )

      const mappedKeywords =
        selectedTags.map(
          (tag) => REVIEW_KEYWORD_MAP[tag],
        )

      await createReview({
        reservationId: Number(reservationId),
        rating,
        content: trimmedReview,
        keywords: mappedKeywords,
        imageUrls:
          uploadedImageUrls.length > 0
            ? uploadedImageUrls
            : null,
      })

      navigate(
        `/mypage/reservations/${reservationId}/review/complete`,
        {
          //리뷰 완료 페이지로 넘기는 값
          state: {
            review: {
              studioName: reservation.studio.name,
              conceptName:
                reservation.studioProduct.name,
              rating,
            },
          },
        },
      )
    } catch (error) {
      console.error('리뷰 등록 실패:', error)
    } finally {
      setIsUploading(false)
    }
  }

  if (!reservation) {
    return (
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-white">
        <NavigationBar title="리뷰 작성" showRight={false} onBack={() => navigate(-1)} />
      </div>
    )
  }

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-white pb-[120px]">
      <NavigationBar title="리뷰 작성" showRight={false} onBack={() => setIsCancelModalOpen(true)} />

      <section className="flex w-full flex-col items-start gap-[15px] p-5">
        <div className="flex w-full flex-col items-start rounded-[8px] bg-[rgba(254,228,235,0.3)] px-4 py-3">
          <div className="flex w-full flex-col items-start gap-0.5">
            <h2 className="font-b3 text-gray-80">{reservation.studio.name}</h2>
            <p className="font-b8 text-gray-60">
              {reservation.studioProduct.name} ·{' '}
              {formatShootingDate(
                reservation.timeSlot.date,
                reservation.timeSlot.startTime,
              )}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-1 py-[10px]">
          <div className="flex h-[21px] w-full items-center justify-center gap-[10px] px-1">
            <p className="flex-1 font-b5 text-black">만족스러우셨나요?</p>
          </div>

          <div className="flex items-center gap-[5px]">
            {Array.from({ length: 5 }).map((_, index) => {
              const starIndex = index + 1
              const isSelected = rating >= starIndex

              return (
                <button
                  key={starIndex}
                  type="button"
                  onClick={() => handleStarClick(starIndex)}
                >
                  {isSelected ? (
                    <IcStar
                      width={36}
                      height={36}
                      className="text-brand-100"
                    />
                  ) : (
                    <IcStar2
                      width={36}
                      height={36}
                      className="text-gray-20"
                    />
                  )}
                </button>
              )
            })}

            <span className="font-b6 text-gray-40">
              {rating.toFixed(1)}
            </span>
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />

            <InputImage count={imageList.length} onClick={handleImageButtonClick} />

            {imageList.map((image) => (
              <InputImage
                key={image.id}
                imageSrc={image.previewUrl}
                count={imageList.length}
                onRemove={() => handleImageRemove(image.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[402px] -translate-x-1/2 bg-white px-5 pb-10">
        <Button
          variant={canSubmit && !isUploading ? 'primary' : 'disabled'}
          onClick={canSubmit && !isUploading ? handleSubmit : undefined}
        >
          {isUploading ? '업로드 중...' : '등록하기'}
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
    </div>
  )
}

export default ReviewWritePage