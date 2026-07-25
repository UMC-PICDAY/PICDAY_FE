import { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '@/components/common/Button'
import Alert from '@/components/common/Alert'
import InputImage from '@/components/common/InputImage'
import InputReview from '@/components/common/InputReview'
import Review from '@/components/common/Review'
import TimeChip from '@/components/common/TimeChip'
import NavigationBar from '@/components/layout/NavigationBar'
import { IcStar, IcStar2 } from '@/components/icons'
import reviewImage from '@/assets/images/CardImage1.png'

type PageMode = 'view' | 'edit'
type ModalType = 'delete' | 'leave' | null

const REVIEW_TAGS = [
  '친절한 응대',
  '꼼꼼한 보정',
  '시간 엄수',
  '편안한 분위기',
  '합리적인 가격',
  '만족스러운 결과물',
] as const

const INITIAL_REVIEW =
  '스튜디오 분위기가 너무 예뻐서 촬영하는 내내 설레었어요. 작가님도 친절하시고 포즈 가이드도 상세하게 해주셔서 어색함 없이 자연스럽게 찍을 수 있었습니다.'

const StudioSummary = ({ editing }: { editing: boolean }) => (
  <div className="rounded-[8px] bg-brand-20/30 px-4 py-3">
    <p className="font-h6 text-gray-80">{editing ? '데이지 스튜디오' : '스튜디오 하루'}</p>
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

  const [pageMode, setPageMode] = useState<PageMode>('view')
  const [modal, setModal] = useState<ModalType>(null)
  const [score, setScore] = useState(5)
  const [selectedTags, setSelectedTags] = useState<string[]>([
    '친절한 응대',
    '꼼꼼한 보정',
    '시간 엄수',
  ])
  const [review, setReview] = useState(INITIAL_REVIEW)
  const [hasImage, setHasImage] = useState(true)

  const isEditing = pageMode === 'edit'

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    )
  }

  const handleBack = () => {
    if (isEditing) {
      setModal('leave')
      return
    }

    navigate(-1)
  }

  const handleSubmit = () => {
    setPageMode('view')
  }

  const handleDelete = () => {
    setModal(null)
  }

  return (
    <main className="relative flex min-h-dvh flex-col bg-white">
      <NavigationBar
        title={isEditing ? '리뷰 수정' : '내 리뷰'}
        showRight={false}
        onBack={handleBack}
      />

      {isEditing ? (
        <>
          <div className="flex flex-1 flex-col gap-[15px] px-5 pb-[108px] pt-5">
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
                          <IcStar2 width={36} height={36} className="text-gray-20" />
                        )}
                      </button>
                    )
                  })}
                </div>
                <span className="font-b6 text-gray-40">{score.toFixed(1)}</span>
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <SectionTitle>어떤점이 좋았나요? (복수 선택 가능)</SectionTitle>
              <div className="flex flex-wrap gap-2.5">
                {REVIEW_TAGS.map((tag) => (
                  <TimeChip
                    key={tag}
                    label={tag}
                    property1={selectedTags.includes(tag) ? 'selected' : 'default'}
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
              />
            </section>

            <section className="flex flex-col gap-2">
              <SectionTitle>사진 첨부</SectionTitle>
              <div className="flex items-center gap-3">
                <InputImage count={hasImage ? 1 : 0} />
                {hasImage && (
                  <InputImage imageSrc={reviewImage} count={1} onRemove={() => setHasImage(false)} />
                )}
              </div>
            </section>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-[390px] bg-white p-5">
            <Button onClick={handleSubmit}>등록하기</Button>
          </div>
        </>
      ) : (
        <>
          <div className="px-5 pt-5">
            <StudioSummary editing={false} />
          </div>

          <article className="mx-5 mt-3 rounded-[8px] px-0 pb-5 pt-2 shadow-[0_15px_48px_rgba(252,200,215,0.1)] backdrop-blur-[10px]">
            <Review score={score} />
            <p className="mt-1 font-b8 text-gray-60">2026.07.12 작성</p>

            <div className="my-3 flex flex-wrap gap-2.5">
              {selectedTags.map((tag) => (
                <TimeChip key={tag} label={tag} property1="selected" />
              ))}
            </div>

            <p className="font-b8 text-gray-80">{review}</p>
          </article>

          <div className="mt-auto flex gap-3 p-5">
            <div className="flex-1">
              <Button variant="outline" onClick={() => setModal('delete')}>
                삭제하기
              </Button>
            </div>
            <div className="w-[220px]">
              <Button onClick={() => setPageMode('edit')}>수정하기</Button>
            </div>
          </div>
        </>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-80/90 px-[14px]">
          <Alert
            variant="default"
            title={modal === 'delete' ? '리뷰를 삭제할까요?' : '수정을 그만두시겠어요?'}
            description={
              modal === 'delete'
                ? '삭제하나 리뷰는 복구 할 수 없어요.'
                : '수정한 내용은 저장되지 않아요.'
            }
            cancelText={modal === 'delete' ? '취소' : '나가기'}
            confirmText={modal === 'delete' ? '삭제하기' : '계속 작성'}
            onCancel={() => {
              if (modal === 'leave') {
                setPageMode('view')
              }
              setModal(null)
            }}
            onConfirm={modal === 'delete' ? handleDelete : () => setModal(null)}
          />
        </div>
      )}
    </main>
  )
}

export default MyReviewPage
