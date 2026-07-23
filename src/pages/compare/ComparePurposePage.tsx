/**
 * ComparePurposePage 사용법
 *
 * 기본 진입
 *   navigate('/compare', {
 *     state: { studioIds }
 *   })
 *
 * 초기 로드
 *   전달받은 studioIds로 2-9 API 호출
 *   응답받은 사진관 목록을 selectedStudios 상태로 관리
 *
 * 촬영 목적 선택
 *   증명 / 프로필 / 개인화보 / 취업 / 가족 / 우정
 *
 * 사진관 관리
 *   - X 버튼: 사진관 삭제
 *   - + 버튼: 사진관 추가 (/studios 이동)
 *
 * 비교 시작
 *   - 목적 미지원 시 Alert2 표시
 *   - 2개 비교 → /compare/two
 *   - 3개 비교 → /compare/three
 *
 * 비교 결과 페이지 전달 데이터
 *   {
 *     studioIds: number[]
 *     shootingCategory: ShootingCategory
 *     purpose: PurposeType
 *     studios: Studio[]
 *   }
 *
 * 비교 버튼
 *   사진관이 1개 이하이거나 API 로딩/에러 시 비활성화
 */

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import Alert2 from '@/components/common/Alert2'
import Button from '@/components/common/Button'
import ButtonCompareSlot from '@/components/common/ButtonCompareSlot'
import CategoryButton from '@/components/common/CategoryButton'
import Title from '@/components/common/Title'
import { IcBack } from '@/components/icons'
import {
  getComparePurposes,
  type ShootingCategory,
} from '@/services/studio'

type PurposeType = '증명' | '프로필' | '개인화보' | '취업' | '가족' | '우정'

type AlertType = 'exclude' | 'reselect' | null

interface Studio {
  id: number
  name: string
  availablePurposes: PurposeType[]
}

interface CompareNavigationState {
  studioIds?: number[]
}

const PURPOSES: PurposeType[] = [
  '증명',
  '프로필',
  '개인화보',
  '취업',
  '가족',
  '우정',
]

const PURPOSE_MAP: Record<ShootingCategory, PurposeType> = {
  ID_PHOTO: '증명',
  PROFILE: '프로필',
  PERSONAL_PORTRAIT: '개인화보',
  JOB_PHOTO: '취업',
  FAMILY: '가족',
  FRIENDSHIP: '우정',
}

const PURPOSE_CATEGORY_MAP: Record<PurposeType, ShootingCategory> = {
  증명: 'ID_PHOTO',
  프로필: 'PROFILE',
  개인화보: 'PERSONAL_PORTRAIT',
  취업: 'JOB_PHOTO',
  가족: 'FAMILY',
  우정: 'FRIENDSHIP',
}

const STUDIO_LIST_PATH = '/studios'

const ComparePurposePage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navigationState = location.state as CompareNavigationState | null
  const studioIds = navigationState?.studioIds

  const [selectedPurpose, setSelectedPurpose] =
    useState<PurposeType>('프로필')

  const [selectedStudios, setSelectedStudios] = useState<Studio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [alertType, setAlertType] = useState<AlertType>(null)
  const [unavailableStudios, setUnavailableStudios] = useState<Studio[]>([])

  const selectedStudioCount = selectedStudios.length

  const isCompareDisabled =
    isLoading || errorMessage !== null || selectedStudioCount <= 1

  useEffect(() => {
    if (!studioIds || studioIds.length < 2 || studioIds.length > 3) {
      setIsLoading(false)
      setErrorMessage('비교할 사진관 목록이 올바르지 않습니다.')
      return
    }

    const hasInvalidStudioId = studioIds.some(
      (studioId) => !Number.isInteger(studioId) || studioId <= 0,
    )

    if (hasInvalidStudioId) {
      setIsLoading(false)
      setErrorMessage('올바르지 않은 사진관 ID입니다.')
      return
    }

    const fetchComparePurposes = async () => {
      try {
        setIsLoading(true)
        setErrorMessage(null)

        const data = await getComparePurposes(studioIds)

        const studios: Studio[] = data.studios.map((studio) => ({
          id: studio.studioId,
          name: studio.studioName,
          availablePurposes: studio.shootingCategories.map(
            (category) => PURPOSE_MAP[category],
          ),
        }))

        setSelectedStudios(studios)
      } catch {
        setSelectedStudios([])
        setErrorMessage('비교 정보를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchComparePurposes()
  }, [studioIds])

  const getAvailableStudios = () =>
    selectedStudios.filter((studio) =>
      studio.availablePurposes.includes(selectedPurpose),
    )

  const navigateToComparePage = (studios: Studio[]) => {
    const compareNavigationState = {
      studioIds: studios.map((studio) => studio.id),
      shootingCategory: PURPOSE_CATEGORY_MAP[selectedPurpose],
      purpose: selectedPurpose,
      studios,
    }

    if (studios.length === 2) {
      navigate('/compare/two', {
        state: compareNavigationState,
      })
      return
    }

    if (studios.length === 3) {
      navigate('/compare/three', {
        state: compareNavigationState,
      })
    }
  }

  const handleDeleteStudio = (studioId: number) => {
    setSelectedStudios((prevStudios) =>
      prevStudios.filter((studio) => studio.id !== studioId),
    )
  }

  const handleAddStudio = () => {
    navigate(STUDIO_LIST_PATH, {
      state: {
        selectedStudios,
        studioIds: selectedStudios.map((studio) => studio.id),
        purpose: selectedPurpose,
        shootingCategory: PURPOSE_CATEGORY_MAP[selectedPurpose],
      },
    })
  }

  const handleCompareStart = () => {
    if (isCompareDisabled) {
      return
    }

    const availableStudios = getAvailableStudios()

    const unavailableStudioList = selectedStudios.filter(
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
    .map((studio) => studio.name)
    .join(', ')

  const excludeAlertDescription = `${unavailableStudioNames}엔 선택하신 컨셉이 없어요.\n제외하고 비교할까요?`

  const reselectAlertDescription = `${unavailableStudioNames}엔\n선택하신 컨셉이 없어요.\n다른 컨셉을 선택해 주세요.`

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-white text-black">
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

        {isLoading ? (
          <div
            className="flex min-h-[200px] items-center justify-center"
            role="status"
          >
            <p className="font-b6 text-gray-40">
              비교 정보를 불러오는 중이에요.
            </p>
          </div>
        ) : errorMessage ? (
          <div
            className="flex min-h-[200px] items-center justify-center"
            role="alert"
          >
            <p className="font-b6 text-center text-gray-40">
              {errorMessage}
            </p>
          </div>
        ) : (
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
        )}
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white">
        <div className="flex items-center justify-between px-5 pb-4">
          <div className="flex items-center gap-[5px]">
            {selectedStudios.map((studio) => (
              <ButtonCompareSlot
                key={studio.id}
                label={studio.name}
                onDelete={() => handleDeleteStudio(studio.id)}
              />
            ))}

            {!isLoading &&
              errorMessage === null &&
              selectedStudioCount < 3 && (
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