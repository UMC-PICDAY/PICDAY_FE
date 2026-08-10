import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import InputImage from '@/components/common/InputImage'
import InputReview from '@/components/common/InputReview'
import Review from '@/components/common/Review'
import TimeChip from '@/components/common/TimeChip'
import Toast from '@/components/common/Toast'
import { IcStar, IcStar2 } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'
import { ReviewDetailSkeleton } from '@/pages/mypage/components/MyPageSkeleton'
import { deleteReview, getReview, updateReview, uploadImage,} from '@/services/review'
import { ApiError } from '@/types/common'
import type { ReviewDetailData, ReviewKeyword,} from '@/types/review'

type PageMode = 'view' | 'edit'
type ModalType = 'delete' | 'leave' | null

interface NewReviewImage {
  id: string
  file: File
  previewUrl: string
}

interface ReviewSnapshot {
  score: number
  selectedKeywords: ReviewKeyword[]
  review: string
  existingImageUrls: string[]
}

interface ReviewTagItem {
  keyword: ReviewKeyword
  label: string
}

interface StudioSummaryProps {
  studioName: string
  conceptName: string
  shootingDate: string
}

const MAX_IMAGE_COUNT = 5
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

const REVIEW_TAGS: ReviewTagItem[] = [
  {
    keyword: 'KIND_SERVICE',
    label: '친절한 응대',
  },
  {
    keyword: 'DETAILED_RETOUCH',
    label: '꼼꼼한 보정',
  },
  {
    keyword: 'ON_TIME',
    label: '시간 엄수',
  },
  {
    keyword: 'COMFORTABLE_MOOD',
    label: '편안한 분위기',
  },
  {
    keyword: 'REASONABLE_PRICE',
    label: '합리적인 가격',
  },
  {
    keyword: 'SATISFYING_RESULT',
    label: '만족스러운 결과물',
  },
]

const formatShootingDate = (shootingDate: string) => {
  const [year, month, day] = shootingDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  const weekday = new Intl.DateTimeFormat('ko-KR', {
    weekday: 'short',
  }).format(date)

  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(
    2,
    '0',
  )} (${weekday}) 촬영`
}

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day} 작성`
}

const getReviewTagLabel = (keyword: ReviewKeyword) =>
  REVIEW_TAGS.find((tag) => tag.keyword === keyword)?.label ?? keyword

const StudioSummary = ({
  studioName,
  conceptName,
  shootingDate,
}: StudioSummaryProps) => (
  <div className="rounded-[8px] bg-brand-20/30 px-4 py-3">
    <p className="font-h6 text-gray-80">{studioName}</p>

    <p className="mt-0.5 font-b8 text-gray-60">
      {conceptName} · {formatShootingDate(shootingDate)}
    </p>
  </div>
)

const SectionTitle = ({ children }: { children: string }) => (
  <h2 className="px-1 font-b5 text-black">{children}</h2>
)

const MyReviewPage = () => {
  const navigate = useNavigate()
  const { reviewId } = useParams<{ reviewId: string }>()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const newImageListRef = useRef<NewReviewImage[]>([])

  const parsedReviewId = Number(reviewId)
  const isValidReviewId =
    Number.isInteger(parsedReviewId) && parsedReviewId > 0

  const [reviewData, setReviewData] = useState<ReviewDetailData | null>(
    null,
  )
  const [pageMode, setPageMode] = useState<PageMode>('view')
  const [modal, setModal] = useState<ModalType>(null)
  const [score, setScore] = useState(5)
  const [selectedKeywords, setSelectedKeywords] = useState<
    ReviewKeyword[]
  >([])
  const [review, setReview] = useState('')
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    [],
  )
  const [newImageList, setNewImageList] = useState<NewReviewImage[]>([])
  const [originalReview, setOriginalReview] =
    useState<ReviewSnapshot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!errorMessage) return

    const timer = setTimeout(() => setErrorMessage(null), 3000)

    return () => clearTimeout(timer)
  }, [errorMessage])

  const isEditing = pageMode === 'edit'
  const trimmedReview = review.trim()

  const totalImageCount =
    existingImageUrls.length + newImageList.length

  const isReviewError =
    review.length > 0 && trimmedReview.length < 10

  const canSubmit =
    score >= 1 &&
    score <= 5 &&
    trimmedReview.length >= 10 &&
    trimmedReview.length <= 500 &&
    totalImageCount <= MAX_IMAGE_COUNT &&
    !isSubmitting

  useEffect(() => {
    if (!isValidReviewId) {
      navigate('/mypage', {
        replace: true,
      })
      return
    }

    const fetchReview = async () => {
      try {
        setIsLoading(true)
        setHasError(false)

        const result = await getReview(parsedReviewId)

        setReviewData(result)
        setScore(result.rating)
        setSelectedKeywords(result.keywords)
        setReview(result.content)
        setExistingImageUrls(result.images)
      } catch (error) {
        console.error('리뷰 조회 실패:', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchReview()
  }, [isValidReviewId, navigate, parsedReviewId])

  useEffect(() => {
    newImageListRef.current = newImageList
  }, [newImageList])

  useEffect(() => {
    return () => {
      newImageListRef.current.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl)
      })
    }
  }, [])

  const revokeNewImageUrls = (images: NewReviewImage[]) => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.previewUrl)
    })
  }

  const toggleKeyword = (keyword: ReviewKeyword) => {
    setSelectedKeywords((current) =>
      current.includes(keyword)
        ? current.filter((item) => item !== keyword)
        : [...current, keyword],
    )
  }

  const handleEditStart = () => {
    setOriginalReview({
      score,
      selectedKeywords: [...selectedKeywords],
      review,
      existingImageUrls: [...existingImageUrls],
    })

    setPageMode('edit')
  }

  const handleBack = () => {
    if (isEditing) {
      setModal('leave')
      return
    }

    navigate(-1)
  }

  const handleImageButtonClick = () => {
    if (totalImageCount >= MAX_IMAGE_COUNT) {
      return
    }

    fileInputRef.current?.click()
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])
    const remainingCount = MAX_IMAGE_COUNT - totalImageCount

    const validFiles = selectedFiles
      .filter((file) => {
        const isAllowedType = ALLOWED_IMAGE_TYPES.includes(file.type)
        const isAllowedSize = file.size <= MAX_IMAGE_SIZE

        return isAllowedType && isAllowedSize
      })
      .slice(0, remainingCount)

    if (validFiles.length === 0) {
      event.target.value = ''
      return
    }

    const newImages: NewReviewImage[] = validFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setNewImageList((current) => [...current, ...newImages])
    event.target.value = ''
  }

  const handleExistingImageRemove = (targetImageUrl: string) => {
    setExistingImageUrls((current) =>
      current.filter((imageUrl) => imageUrl !== targetImageUrl),
    )
  }

  const handleNewImageRemove = (imageId: string) => {
    setNewImageList((current) => {
      const targetImage = current.find((image) => image.id === imageId)

      if (targetImage) {
        URL.revokeObjectURL(targetImage.previewUrl)
      }

      return current.filter((image) => image.id !== imageId)
    })
  }

  const handleSubmit = async () => {
    if (!isValidReviewId || !canSubmit) {
      return
    }

    try {
      setIsSubmitting(true)

      const uploadResults = await Promise.all(
        newImageList.map((image) => uploadImage(image.file)),
      )

      const uploadedImageUrls = uploadResults.map(
        (result) => result.imageUrl,
      )

      const nextImageUrls = [
        ...existingImageUrls,
        ...uploadedImageUrls,
      ]

      await updateReview(parsedReviewId, {
        rating: score,
        content: trimmedReview,
        keywords: selectedKeywords,
        imageUrls: nextImageUrls,
      })

      revokeNewImageUrls(newImageList)

      setExistingImageUrls(nextImageUrls)

      setReviewData((current) =>
        current
          ? {
              ...current,
              rating: score,
              content: trimmedReview,
              keywords: [...selectedKeywords],
              images: nextImageUrls,
            }
          : current,
      )

      setNewImageList([])
      setOriginalReview(null)
      setPageMode('view')
    } catch (error) {
      console.error('리뷰 수정 실패:', error)

      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : '리뷰 수정에 실패했습니다. 다시 시도해 주세요.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!isValidReviewId || isDeleting) {
      return
    }

    try {
      setIsDeleting(true)

      await deleteReview(parsedReviewId)

      setModal(null)
      navigate('/mypage', {
        replace: true,
      })
    } catch (error) {
      console.error('리뷰 삭제 실패:', error)

      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : '리뷰 삭제에 실패했습니다. 다시 시도해 주세요.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLeaveEdit = () => {
    revokeNewImageUrls(newImageList)

    if (originalReview) {
      setScore(originalReview.score)
      setSelectedKeywords([...originalReview.selectedKeywords])
      setReview(originalReview.review)
      setExistingImageUrls([...originalReview.existingImageUrls])
    }

    setNewImageList([])
    setOriginalReview(null)
    setPageMode('view')
    setModal(null)
  }

  if (!isValidReviewId) {
    return null
  }

  if (isLoading) {
    return (
      <main className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-white">
        <NavigationBar
          title="내 리뷰"
          showRight={false}
          onBack={() => navigate(-1)}
        />

        <ReviewDetailSkeleton />
      </main>
    )
  }

  if (hasError || !reviewData) {
    return (
      <main className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-white">
        <NavigationBar
          title="내 리뷰"
          showRight={false}
          onBack={() => navigate(-1)}
        />

        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5">
          <p className="font-b5 text-black">
            리뷰를 불러오지 못했어요
          </p>

          <Button
            variant="outline"
            onClick={() =>
              navigate('/mypage', {
                replace: true,
              })
            }
          >
            마이페이지로
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-white">
      <NavigationBar
        title={isEditing ? '리뷰 수정' : '내 리뷰'}
        showRight={false}
        onBack={handleBack}
      />

      {isEditing ? (
        <>
          <div className="flex flex-1 flex-col gap-[15px] px-5 pb-[120px] pt-5">
            <StudioSummary
              studioName={reviewData.studioName}
              conceptName={reviewData.conceptName}
              shootingDate={reviewData.shootingDate}
            />

            <section className="flex flex-col gap-2">
              <SectionTitle>만족스러우셨나요?</SectionTitle>

              <div className="flex items-center gap-1">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, index) => {
                    const value = index + 1

                    return (
                      <button
                        key={value}
                        type="button"
                        aria-label={`${value}점`}
                        className="flex h-9 w-9 items-center justify-center text-brand-100"
                        onClick={() => setScore(value)}
                      >
                        {value <= score ? (
                          <IcStar width={36} height={36} />
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
                </div>

                <span className="font-b6 text-gray-40">
                  {score.toFixed(1)}
                </span>
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <SectionTitle>
                어떤점이 좋았나요? (복수 선택 가능)
              </SectionTitle>

              <div className="flex flex-wrap gap-2.5">
                {REVIEW_TAGS.map(({ keyword, label }) => (
                  <TimeChip
                    key={keyword}
                    label={label}
                    property1={
                      selectedKeywords.includes(keyword)
                        ? 'selected'
                        : 'default'
                    }
                    onClick={() => toggleKeyword(keyword)}
                  />
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <SectionTitle>후기를 남겨주세요</SectionTitle>

              <InputReview
                value={review}
                placeholder="촬영 경험을 자유롭게 남겨주세요. (최소 10자)"
                onChange={setReview}
                isError={isReviewError}
              />
            </section>

            <section className="flex flex-col gap-2">
              <SectionTitle>사진 첨부</SectionTitle>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />

              <div className="flex items-start gap-3 overflow-x-auto">
                <InputImage
                  count={totalImageCount}
                  onClick={handleImageButtonClick}
                />

                {existingImageUrls.map((imageUrl) => (
                  <InputImage
                    key={imageUrl}
                    imageSrc={imageUrl}
                    count={totalImageCount}
                    onRemove={() =>
                      handleExistingImageRemove(imageUrl)
                    }
                  />
                ))}

                {newImageList.map((image) => (
                  <InputImage
                    key={image.id}
                    imageSrc={image.previewUrl}
                    count={totalImageCount}
                    onRemove={() => handleNewImageRemove(image.id)}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[402px] -translate-x-1/2 bg-white px-5 pb-10 pt-5">
            <Button
              variant={canSubmit ? 'primary' : 'disabled'}
              onClick={canSubmit ? handleSubmit : undefined}
            >
              {isSubmitting ? '수정 중...' : '등록하기'}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="px-5 pt-5">
            <StudioSummary
              studioName={reviewData.studioName}
              conceptName={reviewData.conceptName}
              shootingDate={reviewData.shootingDate}
            />
          </div>

          <article className="mx-5 mt-3 rounded-[8px] px-0 pb-5 pt-2 shadow-[0_15px_48px_rgba(252,200,215,0.1)] backdrop-blur-[10px]">
            <Review score={score} />

            <p className="mt-1 font-b8 text-gray-60">
              {formatCreatedAt(reviewData.createdAt)}
            </p>

            {selectedKeywords.length > 0 && (
              <div className="my-3 flex flex-wrap gap-2.5">
                {selectedKeywords.map((keyword) => (
                  <TimeChip
                    key={keyword}
                    label={getReviewTagLabel(keyword)}
                    property1="selected"
                  />
                ))}
              </div>
            )}

            <p className="font-b8 text-gray-80">{review}</p>

            {existingImageUrls.length > 0 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {existingImageUrls.map((imageUrl) => (
                  <img
                    key={imageUrl}
                    src={imageUrl}
                    alt="리뷰 첨부 이미지"
                    className="h-[88px] w-[88px] shrink-0 rounded-[8px] object-cover"
                  />
                ))}
              </div>
            )}
          </article>

          <div className="mt-auto flex gap-3 p-5">
            <div className="flex-1">
              <Button
                variant="outline"
                onClick={() => setModal('delete')}
              >
                삭제하기
              </Button>
            </div>

            <div className="w-[220px]">
              <Button onClick={handleEditStart}>
                수정하기
              </Button>
            </div>
          </div>
        </>
      )}

      {errorMessage && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[100px] z-10 flex justify-center px-5">
          <Toast message={errorMessage} />
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-80/90 px-[14px]">
          <Alert
            variant="default"
            title={
              modal === 'delete'
                ? '리뷰를 삭제할까요?'
                : '수정을 그만두시겠어요?'
            }
            description={
              modal === 'delete'
                ? '삭제한 리뷰는 복구할 수 없어요.'
                : '수정한 내용은 저장되지 않아요.'
            }
            cancelText={modal === 'delete' ? '취소' : '나가기'}
            confirmText={
              modal === 'delete'
                ? isDeleting
                  ? '삭제 중...'
                  : '삭제하기'
                : '계속 작성'
            }
            onCancel={() => {
              if (modal === 'leave') {
                handleLeaveEdit()
                return
              }

              setModal(null)
            }}
            onConfirm={
              modal === 'delete'
                ? handleDelete
                : () => setModal(null)
            }
          />
        </div>
      )}
    </main>
  )
}

export default MyReviewPage