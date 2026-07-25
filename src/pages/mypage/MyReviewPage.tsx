import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import Alert from '@/components/common/Alert'
import Button from '@/components/common/Button'
import InputImage from '@/components/common/InputImage'
import InputReview from '@/components/common/InputReview'
import Review from '@/components/common/Review'
import TimeChip from '@/components/common/TimeChip'
import { IcStar, IcStar2 } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'
import { deleteReview, updateReview, uploadImage } from '@/services/review'

type PageMode = 'view' | 'edit'
type ModalType = 'delete' | 'leave' | null

interface NewReviewImage {
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

const REVIEW_TAGS = [
  '친절한 응대',
  '꼼꼼한 보정',
  '시간 엄수',
  '편안한 분위기',
  '합리적인 가격',
  '만족스러운 결과물',
] as const

type ReviewTag = (typeof REVIEW_TAGS)[number]

interface ReviewSnapshot {
  score: number
  selectedTags: ReviewTag[]
  review: string
  existingImageUrls: string[]
}

const INITIAL_REVIEW =
  '스튜디오 분위기가 너무 예뻐서 촬영하는 내내 설레었어요. 작가님도 친절하시고 포즈 가이드도 상세하게 해주셔서 어색함 없이 자연스럽게 찍을 수 있었습니다.'

const INITIAL_IMAGE_URLS: string[] = []

const INITIAL_SELECTED_TAGS: ReviewTag[] = [
  '친절한 응대',
  '꼼꼼한 보정',
  '시간 엄수',
]

const StudioSummary = ({ editing }: { editing: boolean }) => (
  <div className="rounded-[8px] bg-brand-20/30 px-4 py-3">
    <p className="font-h6 text-gray-80">
      {editing ? '데이지 스튜디오' : '스튜디오 하루'}
    </p>

    <p className="mt-0.5 font-b8 text-gray-60">
      개인화보 · {editing ? '2025.06.14' : '2025.07.10'} (일) 촬영
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

  const [pageMode, setPageMode] = useState<PageMode>('view')
  const [modal, setModal] = useState<ModalType>(null)
  const [score, setScore] = useState(5)

  const [selectedTags, setSelectedTags] = useState<ReviewTag[]>(
    INITIAL_SELECTED_TAGS,
  )

  const [review, setReview] = useState(INITIAL_REVIEW)

  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    INITIAL_IMAGE_URLS,
  )

  const [newImageList, setNewImageList] = useState<NewReviewImage[]>([])
  const [originalReview, setOriginalReview] =
    useState<ReviewSnapshot | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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
      navigate('/mypage', { replace: true })
    }
  }, [isValidReviewId, navigate])

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

  const toggleTag = (tag: ReviewTag) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    )
  }

  const handleEditStart = () => {
    setOriginalReview({
      score,
      selectedTags: [...selectedTags],
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
        imageUrls: nextImageUrls.length > 0 ? nextImageUrls : null,
      })

      revokeNewImageUrls(newImageList)
      setExistingImageUrls(nextImageUrls)
      setNewImageList([])
      setOriginalReview(null)
      setPageMode('view')
    } catch (error) {
      console.error('리뷰 수정 실패:', error)
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
      navigate('/mypage', { replace: true })
    } catch (error) {
      console.error('리뷰 삭제 실패:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLeaveEdit = () => {
    revokeNewImageUrls(newImageList)

    if (originalReview) {
      setScore(originalReview.score)
      setSelectedTags([...originalReview.selectedTags])
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
            <StudioSummary editing />

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
                {REVIEW_TAGS.map((tag) => (
                  <TimeChip
                    key={tag}
                    label={tag}
                    property1={
                      selectedTags.includes(tag)
                        ? 'selected'
                        : 'default'
                    }
                    onClick={() => toggleTag(tag)}
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
            <StudioSummary editing={false} />
          </div>

          <article className="mx-5 mt-3 rounded-[8px] px-0 pb-5 pt-2 shadow-[0_15px_48px_rgba(252,200,215,0.1)] backdrop-blur-[10px]">
            <Review score={score} />

            <p className="mt-1 font-b8 text-gray-60">
              2026.07.12 작성
            </p>

            <div className="my-3 flex flex-wrap gap-2.5">
              {selectedTags.map((tag) => (
                <TimeChip
                  key={tag}
                  label={tag}
                  property1="selected"
                />
              ))}
            </div>

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
              <Button onClick={handleEditStart}>수정하기</Button>
            </div>
          </div>
        </>
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