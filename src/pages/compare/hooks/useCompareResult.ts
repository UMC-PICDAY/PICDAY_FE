/**
 * useCompareResult 사용법
 *
 * CompareTwoPage(2개 비교) / CompareThreePage(3개 비교)가 공유하는
 * 비교 결과 조회 로직. 두 화면은 studioIds 개수 검증 범위와 사진관 삭제 시
 * 동작(3개→2개는 /compare/two로 이동, 2개→1개는 화면 유지)만 다르고
 * 나머지 상태/이펙트/핸들러는 완전히 동일해 maxCount로만 구분한다.
 *
 *   const {
 *     selectedStudios,
 *     selectedStudioId,
 *     isLoading,
 *     errorMessage,
 *     shootingCategory,
 *     isConceptButtonDisabled,
 *     handleBack,
 *     handleClose,
 *     handleStudioDetail,
 *     handleSelectStudio,
 *     handleDeleteStudio,
 *     handleAddStudio,
 *     handleConceptList,
 *   } = useCompareResult(2)
 */

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import {
  getCompareResult,
  type CompareResultStudio,
  type ShootingCategory,
} from '@/services/studio'
import { useCompareStore } from '@/stores/useCompareStore'
import { getLocationLabel } from '@/constants/locationCategory'
import { getStudioServiceShortLabel } from '@/constants/studioService'

export interface CompareData {
  price: string
  description: string
  badgeLabel?: string
  services: string[]
  location: string
  reservationDate: string
}

export interface SelectedStudio {
  id: string
  name: string
  imageSrc?: string
  rating: number
  reviewCount: number
  compareData: CompareData
}

interface NavigationStudio {
  id: string
  name: string
  imageSrc?: string
  rating?: number
  reviewCount?: number
  compareData?: CompareData
}

interface NavigationState {
  studioIds?: string[]
  shootingCategory?: ShootingCategory
  studios?: NavigationStudio[]
  studioSearch?: string
}

const isValidStudioId = (studioId: string) =>
  /^[1-9]\d*$/.test(studioId)

const formatLocation = (
  location: CompareResultStudio['location'],
) => {
  if (!location) {
    return '위치 정보 없음'
  }

  const {
    locationCategory,
    nearestStation,
    walkingMinutes,
  } = location

  const locationName = getLocationLabel(locationCategory)

  if (
    nearestStation &&
    walkingMinutes !== null
  ) {
    return `${nearestStation} · 도보 ${walkingMinutes}분`
  }

  if (walkingMinutes !== null) {
    return `${locationName} · 도보 ${walkingMinutes}분`
  }

  return locationName
}

const formatReservationDate = (date: string | null) => {
  if (!date) {
    return '예약 가능일 없음'
  }

  const [year, month, day] = date.split('-').map(Number)

  if (!year || !month || !day) {
    return date
  }

  const parsedDate = new Date(year, month - 1, day)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

const formatPrice = (
  minimumPrice: number,
  hasPriceRange: boolean,
) =>
  `₩${minimumPrice.toLocaleString('ko-KR')}${
    hasPriceRange ? '~' : ''
  }`

const convertStudio = (
  studio: CompareResultStudio,
): SelectedStudio => ({
  id: studio.studioId,
  name: studio.studioName,
  imageSrc: studio.thumbnailUrl ?? undefined,
  rating: studio.rating,
  reviewCount: studio.reviewCount,
  compareData: {
    price: formatPrice(
      studio.productInformation.minimumPrice,
      studio.productInformation.hasPriceRange,
    ),
    description:
      studio.productInformation.comparisonSummary,
    badgeLabel: studio.productInformation
      .hasAdditionalPrice
      ? undefined
      : '추가금 없음',
    services: studio.serviceTags.map(getStudioServiceShortLabel),
    location: formatLocation(studio.location),
    reservationDate: formatReservationDate(
      studio.earliestReservationDate,
    ),
  },
})

// 2개 비교는 1~2개, 3개 비교는 정확히 3개만 유효
const isValidCount = (maxCount: 2 | 3, count: number) =>
  maxCount === 3 ? count === 3 : count >= 1 && count <= 2

// navigation state 자체가 잘못된 경우는 API 호출 전에 걸러야 해서
// 쿼리 enabled와 별개로 먼저 계산한다.
const getValidationError = (
  maxCount: 2 | 3,
  initialStudioIds: string[] | undefined,
  shootingCategory: ShootingCategory | undefined,
) => {
  if (
    !initialStudioIds ||
    !isValidCount(maxCount, initialStudioIds.length)
  ) {
    return '비교할 사진관 목록이 올바르지 않습니다.'
  }

  if (initialStudioIds.some((studioId) => !isValidStudioId(studioId))) {
    return '올바르지 않은 사진관 ID입니다.'
  }

  if (new Set(initialStudioIds).size !== initialStudioIds.length) {
    return '비교할 사진관 목록이 올바르지 않습니다.'
  }

  if (!shootingCategory) {
    return '비교할 촬영 컨셉이 올바르지 않습니다.'
  }

  return null
}

export const useCompareResult = (maxCount: 2 | 3) => {
  const location = useLocation()
  const navigate = useNavigate()

  const {
    remove: removeCompare,
    clear: clearCompare,
  } = useCompareStore()

  const navigationState =
    location.state as NavigationState | null

  const initialStudioIds = navigationState?.studioIds
  const shootingCategory =
    navigationState?.shootingCategory
  const studioSearch = navigationState?.studioSearch ?? ''

  const validationError = getValidationError(
    maxCount,
    initialStudioIds,
    shootingCategory,
  )

  const query = useQuery({
    queryKey: [
      'compareResult',
      maxCount,
      initialStudioIds,
      shootingCategory,
    ],
    queryFn: () =>
      getCompareResult({
        studioIds: initialStudioIds ?? [],
        shootingCategory: shootingCategory as ShootingCategory,
      }),
    enabled: validationError === null,
  })

  const hasValidResponseCount =
    query.data !== undefined &&
    isValidCount(maxCount, query.data.studios.length)

  const errorMessage =
    validationError ??
    (query.isError
      ? '사진관 비교 정보를 불러오지 못했습니다.'
      : query.data && !hasValidResponseCount
        ? '비교할 사진관 정보를 불러오지 못했습니다.'
        : null)

  const [selectedStudios, setSelectedStudios] = useState<
    SelectedStudio[]
  >([])

  const [selectedStudioId, setSelectedStudioId] = useState<
    string | null
  >(null)

  // 조회 결과를 로컬 상태로 복사한다. 사진관 삭제는 서버에 반영되는 동작이
  // 아니라 이 화면 안에서만 목록을 줄이는 것이라 쿼리 캐시가 아니라 로컬
  // 상태로 관리한다.
  useEffect(() => {
    if (!query.data || !hasValidResponseCount) return

    const studios = query.data.studios.map(convertStudio)

    setSelectedStudios(studios)
    setSelectedStudioId(studios[0]?.id ?? null)
  }, [query.data, hasValidResponseCount])

  const currentStudioIds = selectedStudios.map(
    (studio) => studio.id,
  )

  const hasSelectedStudio = selectedStudios.some(
    (studio) => studio.id === selectedStudioId,
  )

  const handleBack = () => {
    navigate('/compare', {
      replace: true,
      state: {
        studioIds:
          currentStudioIds.length > 0
            ? currentStudioIds
            : initialStudioIds,
        shootingCategory,
        studioSearch,
      },
    })
  }

  const handleClose = () => {
    clearCompare()

    navigate(
      {
        pathname: '/studios',
        search: studioSearch,
      },
      {
        replace: true,
      },
    )
  }

  const handleStudioDetail = (studioId: string) => {
    navigate(`/studios/${studioId}`)
  }

  const handleSelectStudio = (studioId: string) => {
    setSelectedStudioId(studioId)
  }

  const handleDeleteStudio = (studioId: string) => {
    const remainingStudios = selectedStudios.filter(
      (studio) => studio.id !== studioId,
    )

    removeCompare(Number(studioId))

    // 3개 → 2개: D-2 레이아웃으로 전환
    if (maxCount === 3) {
      navigate('/compare/two', {
        replace: true,
        state: {
          studioIds: remainingStudios.map(
            (studio) => studio.id,
          ),
          shootingCategory,
          studios: remainingStudios,
          studioSearch,
        },
      })
      return
    }

    //1개 -> 0개
    if (remainingStudios.length === 0) {
      //비교 대상 없으므로 트레이 전체 초기화
      clearCompare()

      navigate(
        {
          pathname: '/studios',
          search: studioSearch,
        },
        {
          replace: true,
        },
      )
      return
    }

    //2개 -> 1개: D-2 화면 유지
    setSelectedStudios(remainingStudios)

    if (selectedStudioId === studioId) {
      setSelectedStudioId(
        remainingStudios[0]?.id ?? null,
      )
    }
  }

  const handleAddStudio = () => {
    navigate(
      {
        pathname: '/studios',
        search: studioSearch,
      },
      {
        state: {
          studioIds: currentStudioIds,
          selectedStudios,
          shootingCategory,
          studioSearch,
        },
      },
    )
  }

  const handleConceptList = () => {
    if (
      !hasSelectedStudio ||
      selectedStudioId === null
    ) {
      return
    }

    navigate(
      `/studios/${selectedStudioId}/concepts`,
    )
  }

  const isConceptButtonDisabled =
    query.isLoading ||
    errorMessage !== null ||
    !hasSelectedStudio

  return {
    selectedStudios,
    selectedStudioId,
    isLoading: query.isLoading,
    errorMessage,
    shootingCategory,
    isConceptButtonDisabled,
    handleBack,
    handleClose,
    handleStudioDetail,
    handleSelectStudio,
    handleDeleteStudio,
    handleAddStudio,
    handleConceptList,
  }
}
