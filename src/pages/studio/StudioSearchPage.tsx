import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import CardStudioSmall from '@/components/cards/CardStudioSmall'
import CompareActionBar from '@/components/common/CompareActionBar'
import FilterBar2 from '@/components/common/FilterBar2'
import MapButton from '@/components/common/MapButton'
import Notice2 from '@/components/common/Notice2'
import { IcFilter, IcPin } from '@/components/icons'
import AppTabBar from '@/components/layout/AppTabBar'
import NavigationBar from '@/components/layout/NavigationBar'

import ErrorNotice from '@/pages/studio/components/ErrorNotice'
import StudioMapCanvas from '@/pages/studio/components/StudioMapCanvas'
import StudioResultsBottomSheet from '@/pages/studio/components/StudioResultsBottomSheet'
import StudioResultsList from '@/pages/studio/components/StudioResultsList'
import { useBottomSheetSnap } from '@/pages/studio/hooks/useBottomSheetSnap'
import type { SheetSnap } from '@/pages/studio/hooks/useBottomSheetSnap'
import { studioSearchQueryKey, useStudioSearch } from '@/hooks/useStudio'
import { addWishlist, removeWishlist } from '@/services/wishlist'
import { MAX_COMPARE, useCompareStore } from '@/stores/useCompareStore'
import type { StudioSearchItem, StudioSearchResult } from '@/types/studio'
import {
  buildStudioSearchChipLabel,
  hasBaseSearchCondition,
  isStudioServiceTag,
  isStudioSort,
  parseStudioSearchParams,
  resetStudioSearchFilters,
  serializeStudioSearchParams,
  STUDIO_SERVICE_OPTIONS,
  STUDIO_SORT_OPTIONS,
  toggleStudioService,
} from '@/utils/studioSearchParams'

const QUICK_FILTER_ITEMS = [
  ...STUDIO_SORT_OPTIONS,
  ...STUDIO_SERVICE_OPTIONS
    .filter(({ value }) => value !== 'COSTUME')
    .map(({ value, quickLabel }) => ({ value, label: quickLabel })),
]

const StudioSearchPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = parseStudioSearchParams(searchParams)
  const [sdkError, setSdkError] = useState(false)
  const mapError = searchParams.get('state') === 'error' || sdkError
  const queryClient = useQueryClient()

  // 기본 검색 조건이 있을 때만 조회(B#2). 파라미터 변경 시 자동 재조회.
  const { data, isLoading } = useStudioSearch(filters)
  const result = data ?? null
  const loading = isLoading

  const studios = result?.studios ?? []
  const totalCount = result?.totalCount ?? 0
  const isEmpty =
    !loading && result !== null && (result.hasResult === false || studios.length === 0)

  const { items: compareItems, toggle: toggleCompare, remove: removeCompare } = useCompareStore()
  const selectedIds = new Set(compareItems.map((item) => item.studioId))

  const handleCompareToggle = (studio: StudioSearchItem) => {
    toggleCompare({ studioId: studio.studioId, studioName: studio.studioName })
  }

  // 검색 결과 카드의 찜하기 토글 — 목록 캐시를 낙관적으로 갱신하고 실패 시 되돌린다.
  const handleFavoriteToggle = async (studio: StudioSearchItem) => {
    const queryKey = studioSearchQueryKey(filters)
    const nextWishlisted = !studio.isWishlisted

    const patchStudios = (prev: StudioSearchResult | undefined): StudioSearchResult | undefined =>
      prev
        ? {
            ...prev,
            studios: prev.studios.map((item) =>
              item.studioId === studio.studioId ? { ...item, isWishlisted: nextWishlisted } : item,
            ),
          }
        : prev

    queryClient.setQueryData<StudioSearchResult>(queryKey, patchStudios)

    try {
      if (nextWishlisted) {
        await addWishlist(studio.studioId)
      } else {
        await removeWishlist(studio.studioId)
      }
    } catch {
      queryClient.invalidateQueries({ queryKey })
    }
  }

  const handleCompare = () => {
    if (compareItems.length < 2) return
    navigate('/compare', {
      state: { studioIds: compareItems.map((item) => item.studioId) },
    })
  }

  const [snap, setSnap] = useState<SheetSnap>('half')

  // 빈 결과일 때 시트를 펼쳐 추천 리스트가 보이도록 한다.
  useEffect(() => {
    if (isEmpty) setSnap('expanded')
  }, [isEmpty])

  useEffect(() => {
    if (!searchParams.has('snap')) return

    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('snap')
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])

  const {
    containerRef,
    listRef,
    translateY,
    isDragging,
    handleHandlers,
    listHandlers,
  } = useBottomSheetSnap({ snap, onSnapChange: setSnap })

  const sheetShellProps = {
    snap,
    translateY,
    isDragging,
    handleHandlers,
    listHandlers,
    listRef,
  }

  const handleQuickFilterChange = (value: string) => {
    if (!hasBaseSearchCondition(filters)) return

    const nextFilters = isStudioServiceTag(value)
      ? { ...filters, services: toggleStudioService(filters.services, value) }
      : isStudioSort(value)
        ? { ...filters, sort: value }
        : filters
    setSearchParams(serializeStudioSearchParams(nextFilters, searchParams))
  }

  const handleResetFilters = () => {
    setSearchParams(
      serializeStudioSearchParams(resetStudioSearchFilters(filters), searchParams),
    )
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white">
      <NavigationBar
        variant="chip"
        chipLabel={buildStudioSearchChipLabel(filters)}
        onBack={() => navigate(-1)}
        rightNode={
          <button
            type="button"
            aria-label="필터"
            onClick={() => navigate({ pathname: '/studios/filter', search: `?${searchParams.toString()}` })}
          >
            <IcFilter width={24} height={24} />
          </button>
        }
      />
      <FilterBar2
        items={QUICK_FILTER_ITEMS}
        value={[...(filters.sort ? [filters.sort] : []), ...filters.services]}
        onChange={handleQuickFilterChange}
      />

      <div ref={containerRef} className="relative flex-1 overflow-hidden">
        <StudioMapCanvas
          interactive={!isDragging}
          studios={studios}
          onLoadError={() => setSdkError(true)}
        />

        {mapError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-10">
            <ErrorNotice
              icon={<IcPin width={48} height={48} className="text-brand-80" />}
              title="지도를 불러오지 못했어요"
            />
          </div>
        ) : isEmpty ? (
          <StudioResultsBottomSheet
            {...sheetShellProps}
            header={<p className="py-2.5 font-b10 text-gray-40">검색 결과 {totalCount}곳</p>}
            footer={<AppTabBar activeTab="search" />}
          >
            <div className="flex flex-col pb-6">
              <div className="flex justify-center pb-[50px] pt-2.5">
                <Notice2 onReset={handleResetFilters} />
              </div>
              {(result?.recommendStudios?.length ?? 0) > 0 && (
                <section>
                  <h2 className="pb-3 font-b5 text-black">이런 사진관은 어때요?</h2>
                  <div className="flex gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {result?.recommendStudios?.map((studio) => (
                      <CardStudioSmall
                        key={studio.studioId}
                        name={studio.studioName}
                        imageSrc={studio.thumbnailUrl}
                        location={studio.locationCategory}
                        category={studio.shootingCategory[0] ?? ''}
                        secondaryCategory={studio.shootingCategory[1]}
                        price={`₩${studio.minPrice.toLocaleString()}~`}
                        rating={`★${studio.rating}`}
                        onClick={() => navigate(`/studios/${studio.studioId}`)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </StudioResultsBottomSheet>
        ) : (
          <StudioResultsBottomSheet
            {...sheetShellProps}
            header={
              <p className="py-2.5 text-center font-b8 text-gray-60">
                {loading && result === null
                  ? '불러오는 중…'
                  : `사진관 ${totalCount} 곳`}
              </p>
            }
            footer={
              <div className="relative">
                <div className="pointer-events-none absolute inset-x-0 -top-14 flex justify-center">
                  <div className="pointer-events-auto">
                    <MapButton onClick={() => setSnap('collapsed')} />
                  </div>
                </div>
                <CompareActionBar
                  selected={compareItems}
                  maxSlots={MAX_COMPARE}
                  disabled={compareItems.length < 2}
                  onCompare={handleCompare}
                  onRemove={removeCompare}
                  className="flex w-full flex-col items-start"
                />
                <AppTabBar activeTab="search" />
              </div>
            }
          >
            <StudioResultsList
              studios={studios}
              showCompareButton={snap === 'expanded'}
              selectedIds={selectedIds}
              onSelect={(id) => navigate(`/studios/${id}`)}
              onCompareToggle={handleCompareToggle}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </StudioResultsBottomSheet>
        )}
      </div>
    </div>
  )
}

export default StudioSearchPage
