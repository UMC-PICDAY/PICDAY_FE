import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  getStudioDetail,
  getStudioHairMakeup,
  getStudioProductDetail,
  getStudioProducts,
  getStudioSlots,
  searchStudios,
  searchStudiosByName,
} from '@/services/studio'
import type {
  StudioProductsParams,
  StudioSearchByNameParams,
  StudioSearchParams,
} from '@/types/studio'
import { serializeStudioSearchParams } from '@/utils/studioSearchParams'
import type { StudioSearchFilters } from '@/utils/studioSearchParams'

type StudioNameSearchFilters = StudioSearchFilters & { studioId: number }

/**
 * 이름 검색(2-3-2)은 studioId 하나로 조회 가능하고,
 * 통합 검색(2-3)은 위치·날짜·컨셉 중 최소 1개가 필요하다(없으면 STUDIO_40012).
 * UI 활성화 조건과 useStudioSearch의 enabled가 이 판정 하나를 공유한다.
 */
export const isStudioNameSearch = (
  filters: StudioSearchFilters,
): filters is StudioNameSearchFilters => filters.studioId !== undefined

export const hasBaseSearchCondition = (filters: StudioSearchFilters) =>
  isStudioNameSearch(filters) ||
  Boolean(filters.location || filters.date || filters.concepts.length > 0)

const toSearchParams = (filters: StudioSearchFilters): StudioSearchParams => ({
  locationCategory: filters.location,
  date: filters.date,
  shootingCategory: filters.concepts.length ? filters.concepts : undefined,
  sort: filters.sort,
  minPrice: filters.minPrice,
  maxPrice: filters.maxPrice,
  serviceCode: filters.services.length ? filters.services : undefined,
  minRating: filters.minRating,
})

const toSearchByNameParams = (
  filters: StudioNameSearchFilters,
): StudioSearchByNameParams => ({
  studioId: filters.studioId,
  sort: filters.sort,
  minPrice: filters.minPrice,
  maxPrice: filters.maxPrice,
  serviceCode: filters.services.length ? filters.services : undefined,
  minRating: filters.minRating,
})

export const studioSearchQueryKey = (filters: StudioSearchFilters) =>
  ['studioSearch', serializeStudioSearchParams(filters).toString()] as const

// 2-3. 사진관 검색 — studioId가 있으면 이름 검색(2-3-2), 없으면 통합 검색을 호출한다.
// 통합 검색은 기본 조건(location/date/concept)이 하나라도 있어야 한다.
// keepPrevious는 옵트인이다. 결과 목록 화면에선 필터를 바꿔도 목록이 사라지지
// 않게 켜지만, FilterPage는 이전 필터의 개수가 버튼에 남으면 안 되므로 끈다.
export const useStudioSearch = (
  filters: StudioSearchFilters,
  { keepPrevious = false }: { keepPrevious?: boolean } = {},
) =>
  useQuery({
    queryKey: studioSearchQueryKey(filters),
    queryFn: () =>
      isStudioNameSearch(filters)
        ? searchStudiosByName(toSearchByNameParams(filters))
        : searchStudios(toSearchParams(filters)),
    enabled: hasBaseSearchCondition(filters),
    placeholderData: keepPrevious ? keepPreviousData : undefined,
  })

// 2-4. 사진관 상세
export const useStudioDetail = (studioId: string | undefined) =>
  useQuery({
    queryKey: ['studioDetail', studioId],
    queryFn: () => getStudioDetail(studioId ?? ''),
    enabled: Boolean(studioId),
  })

// 2-5. 컨셉(상품) 목록 — timeSlotId를 넘기면 응답에 selectedSlot이 실린다.
export const useStudioProducts = (
  studioId: string | undefined,
  params?: StudioProductsParams,
) =>
  useQuery({
    queryKey: ['studioProducts', studioId, params?.timeSlotId ?? null],
    queryFn: () => getStudioProducts(studioId ?? '', params),
    enabled: Boolean(studioId),
  })

// 2-6. 컨셉 사진 상세
export const useStudioProductDetail = (
  studioId: string | undefined,
  productId: string | undefined,
) =>
  useQuery({
    queryKey: ['studioProductDetail', studioId, productId],
    queryFn: () => getStudioProductDetail(studioId ?? '', productId ?? ''),
    enabled: Boolean(studioId) && Boolean(productId),
  })

// 2-7. 예약 가능 시간 — 날짜(date)가 있을 때만 조회.
export const useStudioSlots = (
  studioId: string | undefined,
  date: string | undefined,
) =>
  useQuery({
    queryKey: ['studioSlots', studioId, date],
    queryFn: () => getStudioSlots(studioId ?? '', date ?? ''),
    enabled: Boolean(studioId) && Boolean(date),
  })

// 2-8. 헤어메이크업 연계 상세
export const useStudioHairMakeup = (studioId: string | undefined) =>
  useQuery({
    queryKey: ['studioHairMakeup', studioId],
    queryFn: () => getStudioHairMakeup(studioId ?? ''),
    enabled: Boolean(studioId),
  })
