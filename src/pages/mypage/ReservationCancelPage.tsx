/**
 * Figma F-1C 예약 취소 (라우트: /mypage/reservations/:reservationId/cancel)
 * 예약 내역과 환불 안내를 확인한 뒤 예약 취소를 진행하는 화면
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
import Alert2 from '@/components/common/Alert2'
import Button from '@/components/common/Button'
import Toast from '@/components/common/Toast'
import NavigationBar from '@/components/layout/NavigationBar'
import {
  cancelReservation,
  getReservationDetail,
  type ReservationDetailData,
} from '@/services/reservation'
import { ApiError } from '@/types/common'
import { formatReservationDateTimeDotted } from '@/utils/formatReservationDateTime'

const refundNoticeItems = [
  '환불 정책은 사진관마다 다를 수 있습니다.',
  '촬영 당일 취소는 불가합니다.',
  '예약 취소 시 해당 시간대 슬롯이 자동으로 해제됩니다.',
]

const ReservationCancelPage = () => {
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
    isCancelModalOpen,
    setIsCancelModalOpen,
  ] = useState(false)

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 3000)
  }

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
        } catch (error) {
          console.error(
            '예약 상세 조회에 실패했습니다.',
            error,
          )

          navigate('/mypage', {
            replace: true,
            state: {
              toastMessage:
                '예약 정보를 불러오지 못했습니다.',
            },
          })
        }
      }

    void fetchReservationDetail()
  }, [navigate, reservationId])

  const handleCancelReservation =
    async () => {
      if (
        !reservationId ||
        !reservation ||
        isSubmitting
      ) {
        return
      }

      setIsSubmitting(true)

      try {
        const result =
          await cancelReservation(
            reservationId,
          )

        navigate(
          `/mypage/reservations/${reservationId}/cancel/complete`,
          {
            replace: true,

            //취소 완료 화면으로 넘기는 state
            state: {
              reservation: {
                reservationId:
                  result.reservationId,
                studioName:
                  reservation.studio.name,
                reservationDate:
                  reservation.timeSlot.date,
                reservationTime:
                  reservation.timeSlot.startTime,
                conceptName:
                  reservation.studioProduct.name,
                totalPrice:
                  reservation.totalPrice,
                canceledAt:
                  result.canceledAt,
              },
            },
          },
        )
      } catch (error) {
        if (error instanceof ApiError) {
          switch (error.code) {
            case 'RESERVATION_4002':
              showToast(
                '촬영 당일은 예약 취소가 불가합니다.',
              )
              break

            case 'RESERVATION_4092':
              showToast(
                '이미 취소된 예약입니다.',
              )
              break

            case 'RESERVATION_4093':
              showToast(
                '취소할 수 없는 예약 상태입니다.',
              )
              break

            case 'RESERVATION_4041':
              showToast(
                '예약 정보를 찾을 수 없습니다.',
              )
              break

            default:
              showToast(
                '예약 취소에 실패했습니다. 다시 시도해 주세요.',
              )
              break
          }
        } else {
          showToast(
            '예약 취소에 실패했습니다. 다시 시도해 주세요.',
          )
        }
      } finally {
        setIsSubmitting(false)
        setIsCancelModalOpen(false)
      }
    }

  if (!reservation) {
    return (
      <main className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white">
        <NavigationBar
          title="예약 취소"
          showRight={false}
          onBack={() => navigate(-1)}
        />
      </main>
    )
  }

  //날짜 포맷
  const formattedTotalPrice =
    reservation.totalPrice.toLocaleString(
      'ko-KR',
    )

  const formattedReservationDate =
    formatReservationDateTimeDotted(
      reservation.timeSlot.date,
      reservation.timeSlot.startTime,
    )

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white">
      <NavigationBar
        title="예약 취소"
        showRight={false}
        onBack={() => navigate(-1)}
      />

      <div className="pt-[10px]">
        <ReservationDetail
          //화면 표시 필드
          receiptItems={[
            {
              label: '사진관',
              value: reservation.studio.name,
            },
            {
              label: '날짜·시간',
              value:
                formattedReservationDate,
            },
            {
              label: '컨셉',
              value:
                reservation.studioProduct.name,
            },
          ]}
          totalAmount={`₩${formattedTotalPrice}`}
        />
      </div>

      <section className="flex h-[170px] w-full flex-col items-center gap-6 px-5 py-[10px]">
        <div className="flex w-full flex-col rounded-[8px] bg-brand-20 p-5">
          <div className="flex flex-col items-start self-stretch pb-3">
            <h2 className="font-b5 text-black">
              환불 안내
            </h2>
          </div>

          <div className="flex flex-col">
            {refundNoticeItems.map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 pb-2 last:pb-0"
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-brand-100" />

                  <p className="font-b8 text-gray-80">
                    {item}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[402px] -translate-x-1/2 bg-white px-5 pb-10">
        <Button
          variant={
            isSubmitting
              ? 'disabled'
              : 'primary'
          }
          onClick={
            isSubmitting
              ? undefined
              : () =>
                setIsCancelModalOpen(
                  true,
                )
          }
        >
          {isSubmitting
            ? '예약 취소 중'
            : '예약 취소하기'}
        </Button>
      </div>

      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#464545]/90 px-5">
          <Alert2
            variant="variant3"
            onCancel={() =>
              setIsCancelModalOpen(false)
            }
            onConfirm={() => {
              void handleCancelReservation()
            }}
          />
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2">
          <Toast message={toastMessage} />
        </div>
      )}
    </main>
  )
}

export default ReservationCancelPage