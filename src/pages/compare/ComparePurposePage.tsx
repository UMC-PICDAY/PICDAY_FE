/**
 * ComparePurposePage 사용법
 *
 * 기본 진입
 *   navigate('/compare', {
 *     state: {
 *       studioIds,
 *       purpose,
 *     },
 *   })
 *
 * 초기 로드
 *   전달받은 studioIds로 비교 목적 API 호출
 *   응답받은 사진관 목록과 촬영 목적별 지원 정보를 관리
 *
 * 촬영 목적 선택
 *   증명 / 프로필 / 개인화보 / 취업 / 가족 / 우정
 *
 * 사진관 관리
 *   - X 버튼: 사진관 삭제
 *   - + 버튼: 사진관 추가 (/studios 이동)
 *
 * 촬영 목적 선택
 *  - 해당 목적을 지원하는 사진관이 2개 미만이면 버튼 비활성화
 * 
 * 비교 시작
 *   - 선택한 사진관 중 일부만 지원하면 제외 확인 Alert 표시
 *   - 2개 비교 → /compare/two
 *   - 3개 비교 → /compare/three
 *
 * 비교 결과 페이지 전달 데이터
 *   {
 *     studioIds: string[]
 *     shootingCategory: ShootingCategory
 *     purpose: PurposeType
 *     studios: Studio[]
 *   }
 *
 * 비교 버튼
 *   사진관이 1개 이하이거나 API 로딩/에러 시 비활성화
 *   선택한 촬영 목적을 지원하는 사진관이 2개 미만이면 비활성화
 */

import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import Alert2 from '@/components/common/Alert2'
import Button from '@/components/common/Button'
import ButtonCompareSlot from '@/components/common/ButtonCompareSlot'
import CategoryButton from '@/components/common/CategoryButton'
import Title from '@/components/common/Title'
import { IcBack } from '@/components/icons'
import {
  getComparePurposes,
  type CompareShootingPurpose,
  type ShootingCategory,
} from '@/services/studio'
import { useCompareStore } from '@/stores/useCompareStore'

type PurposeType =
  | '증명'
  | '프로필'
  | '개인화보'
  | '취업'
  | '가족'
  | '우정'

type AlertType = 'exclude' | null

interface Studio {
  id: string
  name: string
  availablePurposes: PurposeType[]
}

interface CompareNavigationState {
  studioIds?: Array<string | number>
  purpose?: PurposeType
  studioSearch?: string
}

const PURPOSES: PurposeType[] = [
  '증명',
  '프로필',
  '개인화보',
  '취업',
  '가족',
  '우정',
]

const PURPOSE_CATEGORY_MAP: Record<PurposeType, ShootingCategory> = {
  증명: 'ID_PHOTO',
  프로필: 'PROFILE',
  개인화보: 'PERSONAL_PORTRAIT',
  취업: 'JOB_PHOTO',
  가족: 'FAMILY',
  우정: 'FRIENDSHIP',
}

const STUDIO_LIST_PATH = '/studios'

const isPurposeType = (value: unknown): value is PurposeType =>
  typeof value === 'string' &&
  PURPOSES.includes(value as PurposeType)

const ComparePurposePage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { remove: removeCompare } = useCompareStore()

  const navigationState = location.state as CompareNavigationState | null
  const rawStudioIds = navigationState?.studioIds
  const navigationPurpose = navigationState?.purpose
  const studioSearch = navigationState?.studioSearch ?? ''

  // 이전 화면에서 number로 전달되는 경우에도 API 요청 전 string으로 통일
  const studioIds = useMemo(
    () => rawStudioIds?.map((studioId) => String(studioId)),
    [rawStudioIds],
  )

  const [selectedPurpose, setSelectedPurpose] = useState<PurposeType>(
    isPurposeType(navigationPurpose) ? navigationPurpose : '프로필',
  )

  const [selectedStudios, setSelectedStudios] = useState<Studio[]>([])
  const [shootingPurposes, setShootingPurposes] = useState<
    CompareShootingPurpose[]
  >([])

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [alertType, setAlertType] = useState<AlertType>(null)
  const [unavailableStudios, setUnavailableStudios] = useState<Studio[]>([])

  const selectedStudioCount = selectedStudios.length

  useEffect(() => {
    if (isPurposeType(navigationPurpose)) {
      setSelectedPurpose(navigationPurpose)
    }
  }, [navigationPurpose])

  useEffect(() => {
    if (!studioIds || studioIds.length < 2 || studioIds.length > 3) {
      setSelectedStudios([])
      setShootingPurposes([])
      setIsLoading(false)
      setErrorMessage('비교할 사진관 목록이 올바르지 않습니다.')
      return
    }

    const hasInvalidStudioId = studioIds.some(
      (studioId) => !/^[1-9]\d*$/.test(studioId),
    )

    const hasDuplicateStudioId =
      new Set(studioIds).size !== studioIds.length

    if (hasInvalidStudioId) {
      setSelectedStudios([])
      setShootingPurposes([])
      setIsLoading(false)
      setErrorMessage('올바르지 않은 사진관 ID입니다.')
      return
    }

    if (hasDuplicateStudioId) {
      setSelectedStudios([])
      setShootingPurposes([])
      setIsLoading(false)
      setErrorMessage('비교할 사진관 목록이 올바르지 않습니다.')
      return
    }

    const fetchComparePurposes = async () => {
      try {
        setIsLoading(true)
        setErrorMessage(null)

        const data = await getComparePurposes(studioIds)

        const studios: Studio[] = data.studios.map((studio) => {
          const availablePurposes = data.shootingPurposes
            .filter((shootingPurpose) =>
              shootingPurpose.supportedStudioIds.includes(
                studio.studioId,
              ),
            )
            .map((shootingPurpose) => shootingPurpose.displayName)
            .filter(isPurposeType)

          return {
            id: studio.studioId,
            name: studio.studioName,
            availablePurposes,
          }
        })

        setSelectedStudios(studios)
        setShootingPurposes(data.shootingPurposes)
      } catch {
        setSelectedStudios([])
        setShootingPurposes([])
        setErrorMessage('비교 정보를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchComparePurposes()
  }, [studioIds])

  const getSelectedShootingPurpose = () => {
    const selectedCategory =
      PURPOSE_CATEGORY_MAP[selectedPurpose]

    return shootingPurposes.find(
      (shootingPurpose) =>
        shootingPurpose.shootingCategory === selectedCategory,
    )
  }

  const getAvailableStudios = () => {
    const selectedShootingPurpose =
      getSelectedShootingPurpose()

    if (!selectedShootingPurpose) {
      return []
    }

    return selectedStudios.filter((studio) =>
      selectedShootingPurpose.supportedStudioIds.includes(
        studio.id,
      ),
    )
  }

  const isPurposeDisabled = (purpose: PurposeType) => {
    const category = PURPOSE_CATEGORY_MAP[purpose]

    const shootingPurpose = shootingPurposes.find(
      (item) => item.shootingCategory === category,
    )

    if (!shootingPurpose) {
      return true
    }

    const supportedStudioCount = selectedStudios.filter((studio) =>
      shootingPurpose.supportedStudioIds.includes(studio.id),
    ).length

    return supportedStudioCount < 2
  }

  const isCompareDisabled =
    isLoading || 
    errorMessage !== null || 
    selectedStudioCount <= 1 ||
    isPurposeDisabled(selectedPurpose)
  

  const navigateToComparePage = (studios: Studio[]) => {
    const compareNavigationState = {
      studioIds: studios.map((studio) => studio.id),
      shootingCategory:
        PURPOSE_CATEGORY_MAP[selectedPurpose],
      purpose: selectedPurpose,
      studios,
      studioSearch,
    }

    if (studios.length === 2) {
      navigate('/compare/two', {
        replace: true,
        state: compareNavigationState,
      })
      return
    }

    if (studios.length === 3) {
      navigate('/compare/three', {
        replace: true,
        state: compareNavigationState,
      })
    }
  }

  const handleDeleteStudio = (studioId: string) => {
    setSelectedStudios((prevStudios) =>
      prevStudios.filter(
        (studio) => studio.id !== studioId,
      ),
    )
    removeCompare(Number(studioId))
  }

  const handleAddStudio = () => {
    navigate(
      {
        pathname: STUDIO_LIST_PATH,
        search: studioSearch,
      },
      {
        state: {
          selectedStudios,
          studioIds: selectedStudios.map(
            (studio) => studio.id,
          ),
          purpose: selectedPurpose,
          shootingCategory:
            PURPOSE_CATEGORY_MAP[selectedPurpose],
          studioSearch,
        },
      },
    )
  }

  //뒤로가기 버튼+사진관 재선택
  const navigateToStudioList = () => {
    navigate(
      {
        pathname: STUDIO_LIST_PATH,
        search: studioSearch,
      },
      {
        replace: true,
        state: {
          purpose: selectedPurpose,
          snap: 'expanded',
        },
      },
    )
  }

  const handleCompareStart = () => {
    if (isCompareDisabled) {
      return
    }

    const selectedShootingPurpose =
      getSelectedShootingPurpose()

    if (!selectedShootingPurpose) {
      return
    }

    const availableStudios = getAvailableStudios()

    const unavailableStudioList =
      selectedStudios.filter(
        (studio) =>
          !selectedShootingPurpose.supportedStudioIds.includes(
            studio.id,
          ),
      )

    const availableStudioCount = availableStudios.length

    setUnavailableStudios(unavailableStudioList)

    // 비교 가능한 사진관이 2개 미만이면 진행하지 않음
    if (availableStudioCount < 2) {
      return
    }

    // 2개 이상 지원하지만 미지원 사진관이 존재하는 경우
    if (unavailableStudioList.length > 0) {
      setAlertType('exclude')
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

  const excludeAlertDescription =
    `${unavailableStudioNames}엔 선택하신 컨셉이 없어요.\n` +
    '제외하고 비교할까요?'

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-white text-black">
      <header className="flex w-full items-center justify-between px-5 py-3">
        <button
          type="button"
          aria-label="뒤로가기"
          className="flex size-9 items-center justify-center border-none bg-transparent p-0"
          onClick={navigateToStudioList}
        >
          <IcBack width={24} height={24} />
        </button>

        <h1 className="font-h6 flex-1 text-center">
          사진관 비교
        </h1>

        <div className="size-9" />
      </header>

      <main
        className={`flex-1 px-5 pt-2 ${
          errorMessage ? 'pb-10' : 'pb-[220px]'
        }`}
      >
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
            className="flex min-h-[240px] flex-col items-center justify-center gap-4"
            role="alert"
          >
            <p className="font-b6 text-center text-gray-40">
              {errorMessage}
            </p>

            <div className="w-full max-w-[240px]">
              <Button
                variant="primary"
                onClick={navigateToStudioList}
              >
                사진관 다시 선택하기
              </Button>
            </div>
          </div>
        ) : (
          <section
            className="grid grid-cols-2 gap-4 py-[10px]"
            aria-label="촬영 목적 선택"
          >
            {PURPOSES.map((purpose) => {
              const disabled = isPurposeDisabled(purpose)

              return (
                <CategoryButton
                  key={purpose}
                  type={purpose}
                  active={selectedPurpose === purpose && !disabled}
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) {
                      setSelectedPurpose(purpose)
                    }
                  }
                }
              />
              )
            })}
          </section>
        )}
      </main>

      {!errorMessage && (
        <footer className="absolute inset-x-0 bottom-0 bg-white">
          <div className="flex items-center justify-between px-5 pb-4">
            <div className="flex items-center gap-[5px]">
              {selectedStudios.map((studio) => (
                <ButtonCompareSlot
                  key={studio.id}
                  label={studio.name}
                  onDelete={() =>
                    handleDeleteStudio(studio.id)
                  }
                />
              ))}

              {!isLoading && selectedStudioCount < 3 && (
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
              variant={
                isCompareDisabled
                  ? 'disabled'
                  : 'primary'
              }
              onClick={
                isCompareDisabled
                  ? undefined
                  : handleCompareStart
              }
            >
              비교 시작
            </Button>
          </div>
        </footer>
      )}

      {alertType === 'exclude' && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-gray-80/90 px-[14px]"
          role="dialog"
          aria-modal="true"
          aria-label="사진관 비교 안내"
        >
            <Alert2
              variant="alert"
              description={excludeAlertDescription}
              onCancel={handleCloseAlert}
              onConfirm={handleCompareWithoutUnavailableStudios}
            />
        </div>
      )}
    </div>
  )
}

export default ComparePurposePage