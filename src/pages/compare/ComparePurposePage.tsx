import { useState } from 'react'
import { useNavigate } from 'react-router'

import cardImage5 from '@/assets/images/CardImage5.png'
import Alert2 from '@/components/common/Alert2'
import Button from '@/components/common/Button'
import ButtonCompareSlot from '@/components/common/ButtonCompareSlot'
import CategoryButton from '@/components/common/CategoryButton'
import Title from '@/components/common/Title'
import { IcBack } from '@/components/icons'
import HomeBar from '@/components/layout/HomeBar'
import StatusBar from '@/components/layout/StatusBar'

type PurposeType = '증명' | '프로필' | '개인화보' | '취업' | '가족' | '우정'

type AlertType = 'exclude' | 'reselect' | null

interface Studio {
  id: number
  name: string
  imageSrc?: string
  rating: number
  reviewCount: number
  availablePurposes: PurposeType[]
}

const PURPOSES: PurposeType[] = [
  '증명',
  '프로필',
  '개인화보',
  '취업',
  '가족',
  '우정',
]

const STUDIO_LIST_PATH = '/studios/list'

const MOCK_SELECTED_STUDIOS: Studio[] = [
  {
    id: 1,
    name: '데이지',
    rating: 4.9,
    reviewCount: 128,
    availablePurposes: ['증명', '프로필', '개인화보'],
  },
  {
    id: 2,
    name: '타임온미',
    imageSrc: cardImage5,
    rating: 4.9,
    reviewCount: 128,
    availablePurposes: ['증명', '개인화보'],
  },
  {
    id: 3,
    name: '데이',
    rating: 4.8,
    reviewCount: 96,
    availablePurposes: ['증명', '취업'],
  },
]

const ComparePurposePage = () => {
  const navigate = useNavigate()

  const [selectedPurpose, setSelectedPurpose] =
    useState<PurposeType>('프로필')
  const [alertType, setAlertType] = useState<AlertType>(null)
  const [unavailableStudios, setUnavailableStudios] = useState<Studio[]>([])

  const selectedStudioCount = MOCK_SELECTED_STUDIOS.length
  const isCompareDisabled = selectedStudioCount <= 1

  const getAvailableStudios = () =>
    MOCK_SELECTED_STUDIOS.filter((studio) =>
      studio.availablePurposes.includes(selectedPurpose),
    )

  const navigateToComparePage = (studios: Studio[]) => {
    const navigationState = {
      purpose: selectedPurpose,
      studios,
    }

    if (studios.length === 2) {
      navigate('/compare/two', {
        state: navigationState,
      })
      return
    }

    if (studios.length === 3) {
      navigate('/compare/three', {
        state: navigationState,
      })
    }
  }

  const handleAddStudio = () => {
    navigate(STUDIO_LIST_PATH, {
      state: {
        selectedStudios: MOCK_SELECTED_STUDIOS,
        purpose: selectedPurpose,
      },
    })
  }

  const handleCompareStart = () => {
    if (isCompareDisabled) {
      return
    }

    const availableStudios = getAvailableStudios()

    const unavailableStudioList = MOCK_SELECTED_STUDIOS.filter(
      (studio) => !studio.availablePurposes.includes(selectedPurpose),
    )

    const availableStudioCount = availableStudios.length

    setUnavailableStudios(unavailableStudioList)

    if (selectedStudioCount === 3 && availableStudioCount === 2) {
      setAlertType('exclude')
      return
    }

    if (
      (selectedStudioCount === 2 && availableStudioCount === 1) ||
      (selectedStudioCount === 3 && availableStudioCount <= 1)
    ) {
      setAlertType('reselect')
      return
    }

    navigateToComparePage(availableStudios)
  }

  const handleCloseAlert = () => {
    setAlertType(null)
  }

  const handleCompareWithoutUnavailableStudios = () => {
    const availableStudios = getAvailableStudios()

    setAlertType(null)
    navigateToComparePage(availableStudios)
  }

  const unavailableStudioNames = unavailableStudios
    .map((studio) => `${studio.name} 스튜디오`)
    .join(', ')

  const excludeAlertDescription = `${unavailableStudioNames}엔 선택하신 컨셉이 없어요.\n제외하고 비교할까요?`

  const reselectAlertDescription = `${unavailableStudioNames}엔\n선택하신 컨셉이 없어요.\n다른 컨셉을 선택해 주세요.`

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-white text-black">
      <StatusBar />

      <header className="flex w-full items-center justify-between px-5 py-3">
        <button
          type="button"
          aria-label="뒤로가기"
          className="flex size-9 items-center justify-center border-none bg-transparent p-0"
          onClick={() => navigate(-1)}
        >
          <IcBack width={24} height={24} />
        </button>

        <h1 className="font-h6 flex-1 text-center">사진관 비교</h1>

        <div className="size-9" />
      </header>

      <main className="flex-1 px-5 pt-2 pb-[220px]">
        <section className="-mx-5">
          <Title
            variant="large"
            title="어떤 촬영으로 비교할까요?"
            description="같은 촬영 기준으로 가격과 포트폴리오를 비교해 드려요"
          />
        </section>

        <section
          className="grid grid-cols-2 gap-4 py-[10px]"
          aria-label="촬영 목적 선택"
        >
          {PURPOSES.map((purpose) => (
            <CategoryButton
              key={purpose}
              type={purpose}
              active={selectedPurpose === purpose}
              onClick={() => setSelectedPurpose(purpose)}
            />
          ))}
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white">
        <div className="flex items-center justify-between px-5 pb-4">
          <div className="flex items-center gap-[5px]">
            {MOCK_SELECTED_STUDIOS.map((studio) => (
              <ButtonCompareSlot key={studio.id} label={studio.name} />
            ))}

            {selectedStudioCount < 3 && (
              <ButtonCompareSlot
                state="add"
                onClick={handleAddStudio}
              />
            )}
          </div>

          <span className="font-b6 whitespace-nowrap text-gray-20">
            {selectedStudioCount}개 선택됨
          </span>
        </div>

        <div className="px-5 pb-[9px]">
          <Button
            variant={isCompareDisabled ? 'disabled' : 'primary'}
            onClick={isCompareDisabled ? undefined : handleCompareStart}
          >
            비교 시작
          </Button>
        </div>

        <HomeBar />
      </footer>

      {alertType && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-gray-80/90 px-[14px]"
          role="dialog"
          aria-modal="true"
          aria-label="사진관 비교 안내"
        >
          {alertType === 'exclude' ? (
            <Alert2
              variant="alert"
              description={excludeAlertDescription}
              onCancel={handleCloseAlert}
              onConfirm={handleCompareWithoutUnavailableStudios}
            />
          ) : (
            <Alert2
              variant="alert2"
              description={reselectAlertDescription}
              onConfirm={handleCloseAlert}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default ComparePurposePage