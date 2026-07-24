/**
 * Figma F-1C 취소 완료 (라우트: /mypage/reservations/:reservationId/cancel/complete)
 * 예약 취소 완료 안내와 마이페이지/홈 이동 버튼을 제공함
 */

import {
  useEffect,
  useState,
} from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router'

import Button from '@/components/common/Button'
import { IcCheck } from '@/components/icons'
import {
  getReservationDetail,
  type ReservationDetailData,
} from '@/services/reservation'

interface CancelCompleteReservation {
  reservationId: number
  studioName: string
  reservationDate: string
  reservationTime: string
  conceptName: string
  totalPrice: number
  cancelledAt: string
}

interface CancelCompleteLocationState {
  reservation?: CancelCompleteReservation
}

const formatReservationDateTime = (
  reservationDate: string,
  reservationTime: string,
) => {
  const [year, month, day] = reservationDate
    .split('-')
    .map(Number)

  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} ${reservationTime}`
}

const CancelCompletePage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { reservationId } = useParams<{
    reservationId: string
  }>()

  const locationState =
    location.state as CancelCompleteLocationState | null

  const [
    reservation,
    setReservation,
  ] = useState<
    CancelCompleteReservation | ReservationDetailData | null
  >(locationState?.reservation ?? null)

  useEffect(() => {
    if (reservation || !reservationId) {
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
            '취소된 예약 정보 조회에 실패했습니다.',
            error,
          )
        }
      }

    void fetchReservationDetail()
  }, [reservation, reservationId])

  const reservationSummary = reservation
    ? `${reservation.studioName} · ${formatReservationDateTime(
        reservation.reservationDate,
        reservation.reservationTime,
      )}`
    : '예약 취소가 완료되었습니다.'

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[402px] flex-col bg-white">
      <section className="flex h-[653px] w-full flex-col items-center justify-center gap-[10px] px-5 py-5">
        <div className="flex w-full flex-col items-center">
          <div className="flex items-center gap-[10px] rounded-[100px] p-[10px]">
            <IcCheck
              width={50}
              height={50}
              className="text-gray-80"
            />
          </div>

          <div className="flex items-center justify-center gap-[10px] pb-2">
            <h1 className="font-h3 text-black">
              예약이 취소되었습니다
            </h1>
          </div>

          <div className="flex w-full items-center justify-center gap-[10px] pb-2">
            <p className="font-b6 text-gray-60">
              {reservationSummary}
            </p>
          </div>

          <div className="mt-[10px] flex w-[250px] flex-col items-center justify-center rounded-[12px] bg-brand-20 p-[10px]">
            <p className="font-b8 text-brand-100">
              환불은 사진관 정책에 따라 진행됩니다.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-auto flex flex-col gap-[10px] px-5 pb-10">
        <Button
          variant="primary"
          onClick={() =>
            navigate('/mypage')
          }
        >
          마이페이지로
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate('/home')}
        >
          홈으로 돌아가기
        </Button>
      </div>
    </main>
  )
}

export default CancelCompletePage