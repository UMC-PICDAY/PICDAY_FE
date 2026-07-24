import { useQuery } from '@tanstack/react-query'

import {
  getStudioDetail,
  getStudioHairMakeup,
  getStudioProductDetail,
  getStudioProducts,
  getStudioSlots,
  searchStudios,
} from '@/services/studio'
import type { StudioProductsParams, StudioSearchParams } from '@/types/studio'
import {
  hasBaseSearchCondition,
  serializeStudioSearchParams,
} from '@/utils/studioSearchParams'
import type { StudioSearchFilters } from '@/utils/studioSearchParams'

const toSearchParams = (filters: StudioSearchFilters): StudioSearchParams => ({
  location: filters.location,
  date: filters.date,
  concept: filters.concepts.length ? filters.concepts : undefined,
  name: filters.name,
  sort: filters.sort,
  minPrice: filters.minPrice,
  maxPrice: filters.maxPrice,
  service: filters.services.length ? filters.services : undefined,
  minRating: filters.minRating,
})

// 2-3. 사진관 검색 — 기본 조건(location/date/concept/name)이 하나라도 있어야 호출.
export const useStudioSearch = (filters: StudioSearchFilters) =>
  useQuery({
    queryKey: ['studioSearch', serializeStudioSearchParams(filters).toString()],
    queryFn: () => searchStudios(toSearchParams(filters)),
    enabled: hasBaseSearchCondition(filters),
  })

// 2-4. 사진관 상세
export const useStudioDetail = (studioId: string | undefined) =>
  useQuery({
    queryKey: ['studioDetail', studioId],
    queryFn: () => getStudioDetail(studioId ?? ''),
    enabled: Boolean(studioId),
  })

// 2-5. 컨셉(상품) 목록 — date·time이 둘 다 있으면 상품별 isAvailable 반영.
export const useStudioProducts = (
  studioId: string | undefined,
  params?: StudioProductsParams,
) =>
  useQuery({
    queryKey: ['studioProducts', studioId, params?.date ?? null, params?.time ?? null],
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
