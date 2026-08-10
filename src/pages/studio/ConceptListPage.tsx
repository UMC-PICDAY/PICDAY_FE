import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router'

import CardStudioDetail from '@/components/cards/CardStudioDetail'
import Alert3 from '@/components/common/Alert3'
import FavoriteButton from '@/components/common/FavoriteButton'
import Toast from '@/components/common/Toast'
import { IcError } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'

import ConceptListSkeleton from '@/pages/studio/components/ConceptListSkeleton'
import DateChangeSheet from '@/pages/studio/components/DateChangeSheet'
import ErrorNotice from '@/pages/studio/components/ErrorNotice'
import { getShootingCategoryLabel } from '@/constants/shootingCategory'
import { useStudioDetail, useStudioProducts, useStudioSlots } from '@/hooks/useStudio'
import { addWishlist, removeWishlist } from '@/services/wishlist'
import { useAuthStore } from '@/stores/useAuthStore'
import type { StudioDateTimeSelection, StudioProduct } from '@/types/studio'

import type { CalendarDate } from '@/components/common/Calendar'

interface ReservationToast {
  id: number
  message: string
}

const formatDate = ({ year, month, day }: CalendarDate) =>
  [year, month, day]
    .map((value, index) =>
      index === 0 ? String(value) : String(value).padStart(2, '0'),
    )
    .join('.')

// 슬롯/상품 조회 API용 날짜 문자열 (YYYY-MM-DD)
const toApiDate = ({ year, month, day }: CalendarDate) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

/** endTime은 화면에서 쓰지 않아 URL에 담지 않는다. */
type SelectedDateTime = Omit<StudioDateTimeSelection, 'endTime'>

interface RebookingInfo {
  reserverName: string
  reserverPhone: string
}

interface ConceptListLocationState {
  openTimeSelectModal?: boolean
  rebookingInfo?: RebookingInfo
}

const DATE_PARAM = 'date'
const TIME_PARAM = 'time'
const SLOT_PARAM = 'slotId'

const parseCalendarDate = (value: string | null): CalendarDate | null => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value?.trim() ?? '')
  if (!matched) return null
  return {
    year: Number(matched[1]),
    month: Number(matched[2]),
    day: Number(matched[3]),
  }
}

/**
 * 선택한 일시를 컴포넌트 state가 아니라 URL에 둔다.
 * 컨셉 상세를 보고 돌아오거나 새로고침해도 선택이 유지되도록 하기 위함.
 * 세 값이 모두 유효할 때만 선택으로 인정한다(slotId가 상품 조회 입력이라 필수).
 */
const parseDateTimeSelection = (
  params: URLSearchParams,
): SelectedDateTime | null => {
  const date = parseCalendarDate(params.get(DATE_PARAM))
  const startTime = params.get(TIME_PARAM)?.trim()
  const slotId = Number(params.get(SLOT_PARAM))
  if (!date || !startTime || !Number.isInteger(slotId) || slotId <= 0) return null
  return { date, slotId, startTime }
}

const ConceptListPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const locationState =
  location.state as ConceptListLocationState | null

  const rebookingInfo =
    locationState?.rebookingInfo

  const [searchParams, setSearchParams] = useSearchParams()
  const { studioId } = useParams()
  const [dateSheetOpen, setDateSheetOpen] = useState(false)
  const [loginAlertOpen, setLoginAlertOpen] = useState(false)
  const dateTimeSelection = parseDateTimeSelection(searchParams)
  // 검색(B-4)에서 날짜만 고르고 넘어오면 time·slotId가 없어 위 판정은 null이다.
  // 그래도 고른 날짜는 그대로 보여주고 시간만 마저 고르게 한다.
  const selectedDate =
    dateTimeSelection?.date ?? parseCalendarDate(searchParams.get(DATE_PARAM))
  // 시트에서 선택 중인 날짜 (슬롯 조회 트리거)
  const [sheetDate, setSheetDate] = useState<CalendarDate | undefined>(undefined)
  const [reservationToast, setReservationToast] =
    useState<ReservationToast | null>(null)
  // 예약 도메인 복귀 진입(state/query) 1회만 처리
  const entryHandledRef = useRef(false)
  const [favorited, setFavorited] = useState(false)

  // 시간대가 정해지면 응답에 selectedSlot(예약 가능 여부)이 실리도록 재조회한다.
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useStudioProducts(
    studioId,
    dateTimeSelection ? { timeSlotId: dateTimeSelection.slotId } : undefined,
  )

  // 상품 목록 응답엔 찜 상태가 없어, 상세 조회(캐시 공유)에서 초기값을 가져온다.
  const { data: detail } = useStudioDetail(studioId)

  useEffect(() => {
    if (detail) setFavorited(detail.isWishlisted)
  }, [detail])

  const slotsQuery = useStudioSlots(
    studioId,
    sheetDate ? toApiDate(sheetDate) : undefined,
  )
  const slots = slotsQuery.data ?? []
  const isSlotsLoading = slotsQuery.isLoading
  const isSlotsError = slotsQuery.isError

  useEffect(() => {
    if (!reservationToast) return

    const timer = window.setTimeout(() => setReservationToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [reservationToast])

  const subtitleDate = selectedDate ? formatDate(selectedDate) : '날짜, 시간 선택'
  // 날짜만 정해진 상태에서는 시간 자리에 남은 할 일을 띄운다.
  const subtitleTime = dateTimeSelection
    ? dateTimeSelection.startTime
    : selectedDate
      ? '시간 선택'
      : ''

  const openDateSheet = () => {
    setSheetDate(selectedDate ?? undefined)
    setDateSheetOpen(true)
  }

  // 선택한 일시를 URL에 반영한다. 날짜 변경마다 히스토리가 쌓이지 않도록 replace.
  const applyDateTimeSelection = (selection: StudioDateTimeSelection) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set(DATE_PARAM, toApiDate(selection.date))
    nextParams.set(TIME_PARAM, selection.startTime)
    nextParams.set(SLOT_PARAM, String(selection.slotId))
    setSearchParams(nextParams, { 
      replace: true,
      state: locationState, })
  }

  const showReservationToast = (message: string) => {
    setReservationToast({ id: Date.now(), message })
  }

  const handleToggleFavorite = async () => {
    if (!studioId) return

    const next = !favorited
    setFavorited(next)
    try {
      if (next) {
        await addWishlist(Number(studioId))
      } else {
        await removeWishlist(Number(studioId))
      }
    } catch {
      setFavorited(!next)
      showReservationToast('찜 처리에 실패했어요. 다시 시도해 주세요')
    }
  }

  // 예약 생성 중 슬롯 충돌(RESERVATION_4091) 또는 재예약으로 C-7에 진입할 때:
  // state.openTimeSelectModal → 일시 선택 시트 자동 오픈 / ?toast=time → 안내 토스트
  useEffect(() => {
    if (entryHandledRef.current) return
    const entryState = location.state as ConceptListLocationState | null
    const showTimeToast = searchParams.get('toast') === 'time'
    if (!entryState?.openTimeSelectModal && !showTimeToast) return
    entryHandledRef.current = true

    if (showTimeToast) {
      setReservationToast({ id: Date.now(), message: '이미 예약된 시간대예요' })
    }
    if (entryState?.openTimeSelectModal) {
      setSheetDate(parseDateTimeSelection(searchParams)?.date)
      setDateSheetOpen(true)
    }

    // 새로고침·재진입 시 반복되지 않도록 소비한 query·state 제거
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('toast')
    navigate(
      {
        pathname: location.pathname,
        search: nextParams.toString() ? `?${nextParams.toString()}` : '',
      },
      { replace: true,
        state: {
          ...entryState,
          openTimeSelectModal: false,
        },
       },
    )
  }, [location, searchParams, navigate])

  const handleLogin = () => {
    navigate('/login', {
      state: {
        returnTo: `${location.pathname}${location.search}`,
      },
    })
  }

  const handleCloseLoginAlert = () => {
    setLoginAlertOpen(false)
  }

  const handleReserve = (product: StudioProduct) => {
    if (!isLoggedIn) {
      setLoginAlertOpen(true)
      return
    }

    if (!dateTimeSelection) {
      showReservationToast(
        selectedDate ? '시간을 먼저 설정해 주세요' : '날짜, 시간을 먼저 선택해 주세요',
      )
      return
    }

    // 가용 여부는 슬롯 단위. 시트에서 이미 걸러지지만, 그 사이 선점된 경우를 막는다.
    if (products?.selectedSlot?.isAvailable === false) {
      showReservationToast('선택하신 시간엔 예약할 수 없어요')
      return
    }

    setReservationToast(null)

    // 예약 생성(3-x)은 예약 도메인 담당 → 검증 통과 시 예약 화면으로 계약 데이터 전달
    const reservationDate = toApiDate(dateTimeSelection.date)
    const reservationTime = dateTimeSelection.startTime
    navigate('/reservation', {
      state: {
        reservation: {
          studioId: Number(studioId),
          studioProductId: product.studioProductId,
          timeSlotId: dateTimeSelection.slotId,
          studioName: products?.studioName ?? '',
          conceptName: product.productName,
          includedItems: product.shortDescription?.split(' · ') ?? [],
          reservationDateTime: `${reservationDate.replaceAll('-', '.')} ${reservationTime}`,
          reserverName: rebookingInfo?.reserverName ?? '',
          reserverPhone: rebookingInfo?.reserverPhone ?? '',
          price: product.price,
        },
      },
    })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {/* 목록을 내려도 사진관명·선택한 일시와 안내 토스트가 계속 보이도록 상단 고정.
          일시 변경 시트가 top-[60px](네비게이션바 높이)에서 시작하므로 겹치지 않는다. */}
      <div className="sticky top-0 z-30 bg-white">
        <NavigationBar
          variant="subtitle"
          title={products?.studioName ?? ''}
          date={subtitleDate}
          count={subtitleTime}
          rightNode={<FavoriteButton active={favorited} onClick={handleToggleFavorite} />}
          onBack={() => navigate(-1)}
          onSubtitleClick={openDateSheet}
        />

        {reservationToast && (
          <div className="flex justify-center px-5 py-2">
            <Toast
              key={reservationToast.id}
              message={reservationToast.message}
              className="flex items-center justify-center whitespace-nowrap rounded-[100px] bg-brand-60 px-4 py-2 font-b10 text-white"
            />
          </div>
        )}
      </div>

      {productsError ? (
        <div className="flex flex-1 items-center justify-center px-5 py-10">
          <ErrorNotice
            icon={<IcError width={48} height={48} className="text-brand-80" />}
            title="컨셉을 불러오지 못했어요"
            onRetry={() => refetchProducts()}
          />
        </div>
      ) : isProductsLoading ? (
        <ConceptListSkeleton />
      ) : (
        <main className="flex flex-col px-5 pb-6">
          {products?.productGroups.map((group) => (
            <section key={group.shootingCategory}>
              <h2 className="pb-3 pt-5 font-b3 text-black">
                {getShootingCategoryLabel(group.shootingCategory)}
              </h2>
              <div className="flex flex-col items-center gap-3">
                {group.products.map((product) => (
                  <CardStudioDetail
                    key={product.studioProductId}
                    name={product.productName}
                    description={`기준 ${product.basePeople}인`}
                    optionText={product.shortDescription ?? undefined}
                    price={`₩${product.price.toLocaleString()}`}
                    imageSrcs={product.imageUrls}
                    totalImages={product.imageCount}
                    onDetailClick={() =>
                      navigate(
                        `/studios/${studioId}/concepts/${product.studioProductId}`,
                      )
                    }
                    onReserveClick={() => handleReserve(product)}
                  />
                ))}
              </div>
            </section>
          ))}
        </main>
      )}

      {loginAlertOpen && (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-[390px] items-center justify-center bg-black/40 px-5">
          <div className="w-full">
            <Alert3
              variant="variant3"
              onClick={handleLogin}
              onHelperClick={handleCloseLoginAlert}
            />
          </div>
        </div>
      )}

      {dateSheetOpen && (
        <DateChangeSheet
          initialSelection={
            dateTimeSelection ?? (selectedDate ? { date: selectedDate } : null)
          }
          slots={slots}
          isSlotsLoading={isSlotsLoading}
          isSlotsError={isSlotsError}
          onDateChange={setSheetDate}
          onClose={() => setDateSheetOpen(false)}
          onApply={(selection) => {
            applyDateTimeSelection(selection)
            setDateSheetOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default ConceptListPage
