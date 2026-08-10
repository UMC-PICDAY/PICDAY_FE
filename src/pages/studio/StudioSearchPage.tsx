import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import CardStudioSmall from '@/components/cards/CardStudioSmall'
import CompareActionBar from '@/components/common/CompareActionBar'
import FilterBar2 from '@/components/common/FilterBar2'
import MapButton from '@/components/common/MapButton'
import Notice2 from '@/components/common/Notice2'
import Toast from '@/components/common/Toast'
import { IcError, IcFilter, IcPin } from '@/components/icons'
import AppTabBar from '@/components/layout/AppTabBar'
import NavigationBar from '@/components/layout/NavigationBar'

import ErrorNotice from '@/pages/studio/components/ErrorNotice'
import StudioMapCanvas from '@/pages/studio/components/StudioMapCanvas'
import StudioResultsBottomSheet from '@/pages/studio/components/StudioResultsBottomSheet'
import StudioResultsList from '@/pages/studio/components/StudioResultsList'
import StudioSearchSkeleton from '@/pages/studio/components/StudioSearchSkeleton'
import { useBottomSheetSnap } from '@/pages/studio/hooks/useBottomSheetSnap'
import type { SheetSnap } from '@/pages/studio/hooks/useBottomSheetSnap'
import { getLocationLabel } from '@/constants/locationCategory'
import {
  getShootingCategoryLabel,
  SHOOTING_CATEGORY_LABEL,
} from '@/constants/shootingCategory'
import {
  hasBaseSearchCondition,
  studioSearchQueryKey,
  useStudioSearch,
} from '@/hooks/useStudio'
import { useToast } from '@/hooks/useToast'
import { useWishlistToggle } from '@/hooks/useWishlistToggle'
import { MAX_COMPARE, useCompareStore } from '@/stores/useCompareStore'
import type {
  StudioSearchFilters,
  StudioSearchItem,
  StudioSearchResult,
} from '@/types/studio'
import type { ShootingCategory } from '@/services/studio'
import {
  getStudioServiceShortLabel,
  isStudioServiceTag,
  STUDIO_SERVICE_FILTER_CODES,
} from '@/constants/studioService'
import { isStudioSort, STUDIO_SORT_OPTIONS } from '@/constants/studioSort'
import {
  parseStudioSearchParams,
  serializeStudioSearchParams,
} from '@/utils/studioSearchParams'

const QUICK_FILTER_ITEMS = [
  ...STUDIO_SORT_OPTIONS,
  ...STUDIO_SERVICE_FILTER_CODES
    .filter((code) => code !== 'COSTUME')
    .map((code) => ({ value: code, label: getStudioServiceShortLabel(code) })),
]

const toggle = <T extends string>(list: T[], value: T) =>
  list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]

/** 상세 필터(정렬·가격·서비스·별점)만 비우고 기본 검색조건은 유지한다(결과없음 화면의 '필터 초기화'). */
const resetStudioSearchFilters = (
  filters: StudioSearchFilters,
): StudioSearchFilters => ({
  ...filters,
  sort: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  services: [],
  minRating: undefined,
})

const formatUrlDateForChip = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return value
  return `${Number(match[2])}월${Number(match[3])}일`
}

const buildStudioSearchChipLabel = (filters: StudioSearchFilters) => {
  // 필터에는 코드가 들어 있으므로 칩에는 한글 라벨로 바꿔 보여준다.
  const labels = [
    filters.concepts.map(getShootingCategoryLabel).join(','),
    filters.studioName ??
      (filters.location ? getLocationLabel(filters.location) : undefined),
    filters.date ? formatUrlDateForChip(filters.date) : undefined,
  ].filter((label): label is string => Boolean(label))

  return labels.length > 0 ? labels.join('·') : '사진관 검색'
}

const StudioSearchPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // shootingCategory는 촬영 컨셉 enum 코드('PROFILE' 등). 받는 쪽
  // (ComparePurposePage/CompareTwoPage/CompareThreePage)이 렌더링 시점에만
  // getShootingCategoryLabel로 한글 라벨로 바꿔서 보여준다.
  const navigationState = location.state as {
    shootingCategory?: ShootingCategory
    snap?: SheetSnap
    } | null

  const navigationShootingCategory = navigationState?.shootingCategory
  const navigationSnap = navigationState?.snap

  const [searchParams, setSearchParams] = useSearchParams()
  const filters = parseStudioSearchParams(searchParams)

  const searchShootingCategory =
    filters.concepts[0] && filters.concepts[0] in SHOOTING_CATEGORY_LABEL
      ? (filters.concepts[0] as ShootingCategory)
      : undefined

  const compareShootingCategory =
    navigationShootingCategory ?? searchShootingCategory

  const [mapError, setMapError] = useState(false)
  const { toast: favoriteErrorToast, showToast: showFavoriteError } = useToast()
  const { toggleWishlist } = useWishlistToggle()
  const queryClient = useQueryClient()

  // 기본 검색 조건이 있을 때만 조회(B#2). 파라미터 변경 시 자동 재조회.
  // 필터를 바꿔도 이전 결과를 유지해, 조작할 때마다 목록이 비지 않게 한다.
  const {
    data,
    isLoading,
    isPlaceholderData,
    isError: searchError,
    refetch,
  } = useStudioSearch(filters, { keepPrevious: true })
  const result = data ?? null
  const loading = isLoading

  const studios = result?.studios ?? []
  const totalCount = result?.totalCount ?? 0
  const isEmpty =
    !loading && result !== null && (result.hasResult === false || studios.length === 0)

  // 기본 검색 조건이 없으면 퀵필터를 걸 대상이 없다. 막힌 상태를 칩에도 드러낸다.
  const canQuickFilter = hasBaseSearchCondition(filters)
  const quickFilterItems = QUICK_FILTER_ITEMS.map((item) => ({
    ...item,
    disabled: !canQuickFilter,
  }))

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

    await toggleWishlist(studio.studioId, nextWishlisted, {
      onError: () => {
        queryClient.invalidateQueries({ queryKey })
        showFavoriteError('찜 처리에 실패했어요. 다시 시도해 주세요')
      },
    })
  }

  // 검색에서 고른 날짜를 상세로 넘긴다. 상세가 컨셉 목록(C-7)까지 이어주면
  // 예약 단계에서 날짜를 다시 고르지 않고 시간만 정하면 된다.
  const goToStudio = (studioId: number) => {
    navigate(
      filters.date
        ? `/studios/${studioId}?date=${filters.date}`
        : `/studios/${studioId}`,
    )
  }

  const handleCompare = () => {
    if (compareItems.length < 2) return
    navigate('/compare', {
      state: {
        studioIds: compareItems.map((item) => item.studioId),
        shootingCategory: compareShootingCategory,
        studioSearch: location.search,
      },
    })
  }

  const [snap, setSnap] = useState<SheetSnap>(
    navigationSnap ?? 'half',
  )

  // 빈 결과일 때 시트를 펼쳐 추천 리스트가 보이도록 한다.
  useEffect(() => {
    if (isEmpty) setSnap('expanded')
  }, [isEmpty])

  useEffect(() => {
    if (navigationSnap) {
      setSnap(navigationSnap)
    }
  }, [navigationSnap])

  // 지도 핀으로 고른 사진관. 검색 조건이 바뀌면 결과 목록 자체가 달라지므로 푼다.
  const [focusedStudioId, setFocusedStudioId] = useState<number | null>(null)
  const searchKey = searchParams.toString()

  useEffect(() => {
    setFocusedStudioId(null)
  }, [searchKey])

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

  const handleMapPinSelect = (studioId: number) => {
    setFocusedStudioId(studioId)
    setSnap('half')
  }

  // 핀으로 고른 사진관을 목록에서 찾아 맨 위로 스크롤한다. 목록을 그 사진관
  // 하나로 갈아끼우면 시트를 펼치는 순간 원래 정렬로 되돌아가 선택이 사라진다.
  // 정렬은 그대로 두고 보이는 위치만 옮기면, half에서는 카드 한 장 높이라
  // 그 카드만 보이고 펼쳐도 스크롤 위치가 남아 이어서 보인다.
  useEffect(() => {
    const list = listRef.current
    if (!list) return

    if (focusedStudioId === null) {
      list.scrollTop = 0
      return
    }

    const card = list.querySelector<HTMLElement>(
      `[data-studio-id="${focusedStudioId}"]`,
    )
    if (!card) return

    // half에서는 목록이 overflow-hidden이라 scrollIntoView가 바깥 컨테이너까지
    // 건드린다. 목록 기준 상대 위치만 더해 스크롤 위치를 직접 잡는다.
    list.scrollTop +=
      card.getBoundingClientRect().top - list.getBoundingClientRect().top
    // studios는 매 렌더 새 배열이라 의존성에 넣으면 렌더마다 스크롤을 다시 잡아
    // 펼침에서 사용자가 스크롤한 위치가 튕긴다. 검색이 바뀌면 위 effect가
    // focusedStudioId를 풀어주므로 그때 다시 실행된다.
  }, [focusedStudioId, listRef])

  const handleQuickFilterChange = (value: string) => {
    if (!canQuickFilter) return

    const nextFilters = isStudioServiceTag(value)
      ? { ...filters, services: toggle(filters.services, value) }
      : isStudioSort(value)
        ? // 서비스 칩과 동일하게 같은 정렬을 다시 누르면 해제한다.
          { ...filters, sort: filters.sort === value ? undefined : value }
        : filters
    // 칩 조작은 화면 이동이 아니라 같은 화면의 조건 변경이므로 히스토리를 쌓지
    // 않는다. 쌓으면 칩을 누른 횟수만큼 뒤로가기를 눌러야 화면을 빠져나간다.
    setSearchParams(serializeStudioSearchParams(nextFilters, searchParams), {
      replace: true,
    })
  }

  const handleResetFilters = () => {
    setSearchParams(
      serializeStudioSearchParams(resetStudioSearchFilters(filters), searchParams),
      { replace: true },
    )
  }

  // 지도 재시도. 카카오 SDK 로더는 싱글턴이라 실패 후 리마운트로는 다시 받아오지
  // 못하므로 문서를 새로 로드해 스크립트부터 다시 받는다.
  const handleMapRetry = () => {
    window.location.reload()
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
        items={quickFilterItems}
        value={[...(filters.sort ? [filters.sort] : []), ...filters.services]}
        onChange={handleQuickFilterChange}
      />

      <div ref={containerRef} className="relative flex-1 overflow-hidden">
        <StudioMapCanvas
          interactive={!isDragging}
          studios={studios}
          onLoadError={() => setMapError(true)}
          onStudioSelect={handleMapPinSelect}
        />

        {/* 지도 실패는 지도 영역에만 표시한다. 시트를 덮어버리면 지도와 무관한
            결과 목록·비교까지 못 쓰게 되므로, 시트 위치(translateY)만큼만
            높이를 잡아 노출 중인 지도 영역 안에서 안내한다. */}
        {mapError && (
          <div
            className="absolute inset-x-0 top-0 flex items-center justify-center overflow-hidden bg-gray-10"
            style={{ height: translateY }}
          >
            <ErrorNotice
              icon={<IcPin width={48} height={48} className="text-brand-80" />}
              title="지도를 불러오지 못했어요"
              onRetry={handleMapRetry}
            />
          </div>
        )}

        {searchError ? (
          // 조회 실패는 '결과 0곳'과 구분해서 재시도 가능한 에러로 보여준다.
          <StudioResultsBottomSheet
            {...sheetShellProps}
            header={<p className="py-2.5 font-b10 text-gray-40">검색 결과</p>}
            footer={<AppTabBar activeTab="search" />}
          >
            <div className="flex justify-center py-[50px]">
              <ErrorNotice
                icon={<IcError width={48} height={48} className="text-brand-80" />}
                title="사진관을 불러오지 못했어요"
                onRetry={() => refetch()}
              />
            </div>
          </StudioResultsBottomSheet>
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
                        location={getLocationLabel(studio.locationCategory)}
                        category={getShootingCategoryLabel(
                          studio.shootingCategory[0] ?? '',
                        )}
                        secondaryCategory={
                          studio.shootingCategory[1] &&
                          getShootingCategoryLabel(studio.shootingCategory[1])
                        }
                        price={`₩${studio.minPrice.toLocaleString()}~`}
                        rating={`★${studio.rating}`}
                        onClick={() => goToStudio(studio.studioId)}
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
              // 반펼침에서는 탭바만 둔다. 비교는 목록을 다 펼쳐 고르는 동작이라
              // 카드 한 장만 보이는 반펼침에 비교바를 띄울 이유가 없다.
              snap === 'expanded' ? (
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
              ) : (
                <AppTabBar activeTab="search" />
              )
            }
          >
            {loading ? (
              <StudioSearchSkeleton />
            ) : (
              // 필터 전환 중에는 이전 결과를 유지하되 갱신 중임을 흐리게 알린다.
              <div
                className={
                  isPlaceholderData ? 'opacity-50 transition-opacity' : ''
                }
              >
                <StudioResultsList
                  studios={studios}
                  showCompareButton={snap === 'expanded'}
                  selectedIds={selectedIds}
                  onSelect={goToStudio}
                  onCompareToggle={handleCompareToggle}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </div>
            )}
          </StudioResultsBottomSheet>
        )}
      </div>

      {favoriteErrorToast && (
        <div className="fixed inset-x-0 bottom-24 z-40 mx-auto flex max-w-[390px] justify-center px-5">
          <Toast key={favoriteErrorToast.id} message={favoriteErrorToast.message} />
        </div>
      )}
    </div>
  )
}

export default StudioSearchPage