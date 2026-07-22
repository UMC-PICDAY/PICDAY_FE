/**
 * Figma F-1R 리뷰 작성 (라우트: /mypage/reservations/:reservationId/review)
 *
 * 촬영 완료 예약 건에 대한 별점, 태그, 후기, 사진 첨부 입력 화면
 * 별점은 0.5점 단위로 선택 가능함
 * 사진은 최대 5장까지 첨부하고 삭제할 수 있음
 */
import type { ChangeEvent, MouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import InputImage from '@/components/common/InputImage'
import InputReview from '@/components/common/InputReview'
import TimeChip from '@/components/common/TimeChip'
import { IcStar, IcStar2, IcStarHalf } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'
import { uploadImage } from '@/services/review'

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
]

const ReviewWritePage = () => {
  const navigate = useNavigate()
  const { reservationId = '2' } = useParams()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const imageListRef = useRef<ReviewImage[]>([])

  const [rating, setRating] = useState(5)
  const [selectedTags, setSelectedTags] = useState<string[]>([
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
    imageListRef.current = imageList
  }, [imageList])

  useEffect(() => {
    return () => {
      imageListRef.current.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl)
      })
    }
  }, [])

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : [...prev, tag],
    )
  }

  const handleStarClick = (
    event: MouseEvent<HTMLButtonElement>,
    starIndex: number,
  ) => {
    const { left, width } =
      event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - left
    const isLeftHalf = clickX <= width / 2

    setRating(isLeftHalf ? starIndex - 0.5 : starIndex)
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
    if (!canSubmit || isUploading) {
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

      console.log(
        '업로드 완료 URL:',
        uploadedImageUrls,
      )
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
    } finally {
      setIsUploading(false)
    }
  }
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-white pb-[120px]">
      <NavigationBar title="리뷰 작성" showRight={false} onBack={() => setIsCancelModalOpen(true)} />

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
              const isFull = rating >= starIndex
              const isHalf = rating === starIndex - 0.5

              return (
                <button
                  key={starIndex}
                  type="button"
                  onClick={(event) => handleStarClick(event, starIndex)}
                >
                  {isFull && <IcStar width={36} height={36} className="text-brand-100" />}

                  {isHalf && <IcStarHalf width={36} height={36} className="text-brand-100" />}

                  {!isFull && !isHalf && (
                    <IcStar2 width={36} height={36} className="text-gray-20" />
                  )}
                </button>
              )
            })}

            <span className="font-b6 text-gray-40">{rating.toFixed(1)}</span>
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