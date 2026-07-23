import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import CardStudioDetail from '@/components/cards/CardStudioDetail'
import Toast from '@/components/common/Toast'
import { IcFavorite } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'

import DateChangeSheet from '@/pages/studio/components/DateChangeSheet'
import { useStudioProducts, useStudioSlots } from '@/hooks/useStudio'
import type { StudioDateTimeSelection, StudioProduct } from '@/types/studio'

import type { CalendarDate } from '@/components/common/Calendar'

interface ReservationToast {
  id: number
  message: string
}

// 촬영 컨셉 ENUM → 표시 라벨
const SHOOTING_CATEGORY_LABEL: Record<string, string> = {
  ID_PHOTO: '증명',
  PROFILE: '프로필',
  PERSONAL_PORTRAIT: '개인화보',
  JOB_PHOTO: '취업',
  FAMILY: '가족',
  FRIEND: '우정',
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

const ConceptListPage = () => {
  const navigate = useNavigate()
  const { studioId } = useParams()
  const [dateSheetOpen, setDateSheetOpen] = useState(false)
  const [dateTimeSelection, setDateTimeSelection] =
    useState<StudioDateTimeSelection | null>(null)
  // 시트에서 선택 중인 날짜 (슬롯 조회 트리거)
  const [sheetDate, setSheetDate] = useState<CalendarDate | undefined>(undefined)
  const [reservationToast, setReservationToast] =
    useState<ReservationToast | null>(null)

  const apiDate = dateTimeSelection ? toApiDate(dateTimeSelection.date) : undefined
  const apiTime = dateTimeSelection?.startTime

  // 날짜·시간이 정해지면 상품별 isAvailable이 반영되도록 재조회한다.
  const { data: products } = useStudioProducts(
    studioId,
    apiDate && apiTime ? { date: apiDate, time: apiTime } : undefined,
  )

  const slotsQuery = useStudioSlots(
    studioId,
    sheetDate ? toApiDate(sheetDate) : undefined,
  )
  const slots = slotsQuery.data ?? []
  const isSlotsLoading = slotsQuery.isLoading

  useEffect(() => {
    if (!reservationToast) return

    const timer = window.setTimeout(() => setReservationToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [reservationToast])

  const subtitleDate = dateTimeSelection
    ? formatDate(dateTimeSelection.date)
    : '날짜, 시간 선택'
  const subtitleTime = dateTimeSelection?.startTime ?? ''

  const openDateSheet = () => {
    setSheetDate(dateTimeSelection?.date)
    setDateSheetOpen(true)
  }

  const showReservationToast = (message: string) => {
    setReservationToast({ id: Date.now(), message })
  }

  const handleReserve = (product: StudioProduct) => {
    if (!dateTimeSelection) {
      showReservationToast('날짜, 시간을 먼저 선택해 주세요')
      return
    }

    if (product.isAvailable === false) {
      showReservationToast('선택하신 시간엔 예약할 수 없어요')
      return
    }

    setReservationToast(null)
    // 예약 생성(3-x)은 예약 도메인 담당 → 여기선 조건 검증까지 처리
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <NavigationBar
        variant="subtitle"
        title={products?.studioName ?? ''}
        date={subtitleDate}
        count={subtitleTime}
        rightNode={<IcFavorite width={24} height={24} />}
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

      <main className="flex flex-col px-5 pb-6">
        {products?.productGroups.map((group) => (
          <section key={group.shootingCategory}>
            <h2 className="pb-3 pt-5 font-b3 text-black">
              {SHOOTING_CATEGORY_LABEL[group.shootingCategory] ??
                group.shootingCategory}
            </h2>
            <div className="flex flex-col items-center gap-3">
              {group.products.map((product) => (
                <CardStudioDetail
                  key={product.productId}
                  name={product.productName}
                  description={`기준 ${product.basePeople}인`}
                  optionText={product.shortDescription}
                  price={`₩${product.price.toLocaleString()}`}
                  imageSrc={product.imageUrls}
                  totalImages={product.imageCount}
                  onDetailClick={() =>
                    navigate(`/studios/${studioId}/concepts/${product.productId}`)
                  }
                  onReserveClick={() => handleReserve(product)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {dateSheetOpen && (
        <DateChangeSheet
          initialSelection={dateTimeSelection}
          slots={slots}
          isSlotsLoading={isSlotsLoading}
          onDateChange={setSheetDate}
          onClose={() => setDateSheetOpen(false)}
          onApply={(selection) => {
            setDateTimeSelection(selection)
            setDateSheetOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default ConceptListPage
