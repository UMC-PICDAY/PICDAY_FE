/**
 * Figma F-1D 예약 상세 (라우트: /mypage/reservations/:reservationId)
 * 예약완료/촬영완료/취소 상태에 따라 예약 상세 화면을 분기해서 표시함
 */

import {
  useEffect,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router'

import ReservationDetail from '@/components/cards/ReservationDetail'
import Button from '@/components/common/Button'
import Profile from '@/components/common/Profile'
import {
  IcCheck,
  IcCheckBox,
  IcCheckBoxFill,
} from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'
import {
  getReservationDetail,
  type ReservationDetailData,
} from '@/services/reservation'

interface ChecklistItem {
  id: string
  label: string
  checked: boolean
}

const formatReservationDateTime = (
  reservationDate: string,
  reservationTime: string,
) => {
  const [year, month, day] = reservationDate
    .split('-')
    .map(Number)

  const date = new Date(
    year,
    month - 1,
    day,
  )

  const weekday = new Intl.DateTimeFormat(
    'ko-KR',
    {
      weekday: 'short',
    },
  ).format(date)

  return `${year}년 ${month}월 ${day}일 (${weekday}) ${reservationTime}`
}

interface CancelDetailCardProps {
  totalPrice: number
}

const CancelDetailCard = ({
  totalPrice,
}: CancelDetailCardProps) => {
  const formattedTotalPrice =
    totalPrice.toLocaleString('ko-KR')

  return (
    <section className="flex w-full flex-col items-start px-5 py-[10px]">
      <div className="flex w-full flex-col items-start justify-center gap-5 rounded-[8px] border border-gray-10 bg-white p-5">
        <div className="flex w-full flex-col items-start gap-[10px]">
          <h2 className="font-b5 text-black">
            예약내역
          </h2>

          <div className="flex w-full items-start border-b border-gray-10 px-[5px] py-2">
            <div className="flex flex-1 items-center gap-[10px]">
              <p className="font-b8 text-gray-60">
                취소 사유
              </p>
            </div>

            <p className="font-b8 text-black">
              고객 요청
            </p>
          </div>

          <div className="flex w-full items-start px-[5px] py-2">
            <div className="flex flex-1 items-center gap-[10px]">
              <p className="font-b8 text-gray-60">
                취소 일시
              </p>
            </div>

            <p className="font-b8 text-black">
              -
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start">
          <div className="flex w-full items-start pb-1">
            <div className="flex flex-1 items-center gap-[10px]">
              <p className="font-b5 text-black">
                결제 금액
              </p>
            </div>

            <p className="font-b5 text-gray-80">
              ₩{formattedTotalPrice}
            </p>
          </div>

          <p className="font-b10 text-gray-40">
            환불 금액은 사진관 정책에 따라
            산정됩니다.
          </p>
        </div>
      </div>
    </section>
  )
}

interface ChecklistCardProps {
  items: ChecklistItem[]
  onToggleItem: (id: string) => void
}

const ChecklistCard = ({
  items,
  onToggleItem,
}: ChecklistCardProps) => {
  return (
    <section className="flex h-[267px] w-full flex-col items-start gap-5 px-5 py-[10px]">
      <div className="flex w-full flex-col items-start justify-center gap-5 rounded-[8px] border border-gray-10 bg-white p-5">
        <div className="flex items-center justify-center gap-[5px]">
          <IcCheck
            width={16}
            height={16}
            className="text-black"
          />

          <h2 className="font-b5 text-black">
            촬영 전 체크리스트
          </h2>
        </div>

        <div className="flex w-full flex-col items-start">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex w-full items-center gap-[10px] py-[10px] text-left"
              onClick={() =>
                onToggleItem(item.id)
              }
            >
              {item.checked ? (
                <IcCheckBoxFill
                  width={20}
                  height={20}
                  className="text-brand-100"
                />
              ) : (
                <IcCheckBox
                  width={20}
                  height={20}
                  className="text-gray-20"
                />
              )}

              <span
                className={`font-b8 ${
                  item.checked
                    ? 'text-gray-80'
                    : 'text-gray-40'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

const ReservationDetailPage = () => {
  const navigate = useNavigate()

  const { reservationId } = useParams<{
    reservationId: string
  }>()

  const [
    reservation,
    setReservation,
  ] = useState<ReservationDetailData | null>(
    null,
  )

  const [
    checklistItems,
    setChecklistItems,
  ] = useState<ChecklistItem[]>([])

  useEffect(() => {
    if (!reservationId) {
      navigate('/mypage', {
        replace: true,
      })

      return
    }

    const fetchReservationDetail =
      async () => {
        try {
          const result =
            await getReservationDetail(
              reservationId,
            )

          setReservation(result)

          setChecklistItems(
            result.checklist.map(
              (label, index) => ({
                id: `checklist-${index}`,
                label,
                checked: false,
              }),
            ),
          )
        } catch (error) {
          console.error(
            '예약 상세 조회에 실패했습니다.',
            error,
          )

          navigate('/mypage', {
            replace: true,
          })
        }
      }

    void fetchReservationDetail()
  }, [navigate, reservationId])

  const handleChecklistItemClick = (
    id: string,
  ) => {
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              checked: !item.checked,
            }
          : item,
      ),
    )
  }

  if (!reservation) {
    return (
      <div className="flex min-h-dvh w-full flex-col bg-white">
        <NavigationBar
          title="예약 상세"
          showRight={false}
          onBack={() => navigate(-1)}
        />
      </div>
    )
  }

  const isReserved =
    reservation.status === 'RESERVED'

  const isShooting =
    reservation.status === 'COMPLETED'

  const isCanceled =
    reservation.status === 'CANCELLED'

  const statusLabel = isReserved
    ? '예약 완료'
    : isShooting
      ? '촬영 완료'
      : '취소'

  const formattedReservationDate =
    formatReservationDateTime(
      reservation.timeSlot.date,
      reservation.timeSlot.startTime,
    )

  const formattedTotalPrice =
    reservation.totalPrice.toLocaleString(
      'ko-KR',
    )

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar
        title="예약 상세"
        showRight={false}
        onBack={() => navigate(-1)}
      />

      <Profile
        variant="bookingInfo"
        studioName={reservation.studio.name}
        reservationDate={
          formattedReservationDate
        }
        statusLabel={statusLabel}
      />

      <div className="flex w-full flex-col items-start py-[10px]">
        <ReservationDetail
          receiptItems={[
            {
              label: '컨셉',
              value:
                reservation.studioProduct
                  .name,
            },
          ]}
          totalAmount={`₩${formattedTotalPrice}`}
        />

        {isReserved && (
          <ChecklistCard
            items={checklistItems}
            onToggleItem={
              handleChecklistItemClick
            }
          />
        )}

        {isCanceled && (
          <CancelDetailCard
            totalPrice={
              reservation.totalPrice
            }
          />
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[402px] -translate-x-1/2 bg-white px-5 pb-10">
        {isReserved && (
          <Button
            variant="primary"
            onClick={() =>
              navigate(
                `/mypage/reservations/${reservationId}/cancel`,
              )
            }
          >
            예약 취소
          </Button>
        )}

        {isShooting && (
          <Button
            variant="primary"
            onClick={() => {
              if (
                reservation.reviewId !==
                null
              ) {
                navigate(
                  `/mypage/reviews/${reservation.reviewId}`,
                )
                return
              }

              navigate(
                `/mypage/reservations/${reservationId}/review`,
              )
            }}
          >
            {reservation.reviewId !== null
              ? '내 리뷰 보기'
              : '리뷰 작성'}
          </Button>
        )}

        {isCanceled && (
          <Button
            variant="primary"
            onClick={() =>
              navigate('/reservation')
            }
          >
            재예약
          </Button>
        )}
      </div>
    </div>
  )
}

export default ReservationDetailPage