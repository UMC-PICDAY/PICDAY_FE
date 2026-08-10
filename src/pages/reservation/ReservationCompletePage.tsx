/**
 * ReservationCompletePage 사용법
 *
 * 예약과 결제가 완료된 뒤 결과를 보여주는 페이지
 *
 * URL의 reservationId를 이용해
 * 예약 상세 정보를 조회한다.
 *
 * 주요 기능
 *   - 예약 사진관, 날짜·시간, 컨셉 표시
 *   - 결제 금액 표시
 *   - 새로고침 및 직접 접근 시 예약 정보 재조회
 *   - 마이페이지 이동
 *   - 홈 이동
 *
 * 예약 정보를 불러오지 못하면 안내 화면과
 * 마이페이지 이동 버튼을 표시
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
import NoticeBanner from '@/components/common/NoticeBanner'
import { IcCheck } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'
import {
  getReservationDetail,
  type ReservationDetailData,
} from '@/services/reservation'
import { formatReservationDateTimeLong } from '@/utils/formatReservationDateTime'

const ReservationCompletePage = () => {
  const navigate = useNavigate()
  const { reservationId } = useParams()

  const [reservation, setReservation] =
    useState<ReservationDetailData | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [isError, setIsError] =
    useState(false)

  useEffect(() => {
    const fetchReservation = async () => {
      if (!reservationId) {
        setIsError(true)
        setIsLoading(false)
        return
      }

      try {
        const result =
          await getReservationDetail(reservationId)

        setReservation(result)
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchReservation()
  }, [reservationId])

  const handleMyPageClick = () => {
    navigate('/mypage')
  }

  const handleHomeClick = () => {
    navigate('/home')
  }

  if (isLoading) {
    return (
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white text-black">
        <div className="sticky top-0 z-20 shrink-0 bg-white">
          <NavigationBar
            title="PICDAY"
            showLeft={false}
            showRight={false}
          />
        </div>

        <main className="flex flex-1 items-center justify-center">
          <p className="font-b6 text-gray-60">
            예약 정보를 불러오는 중이에요
          </p>
        </main>
      </div>
    )
  }

  if (isError || !reservation) {
    return (
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white text-black">
        <div className="sticky top-0 z-20 shrink-0 bg-white">
          <NavigationBar
            title="PICDAY"
            showLeft={false}
            showRight={false}
          />
        </div>

        <main className="flex flex-1 flex-col items-center justify-center px-5 text-center">
          <h1 className="font-h5 pb-2 text-black">
            예약 정보를 찾을 수 없어요
          </h1>

          <p className="font-b6 text-gray-60">
            마이페이지에서 예약 내역을 다시 확인해 주세요.
          </p>
        </main>

        <footer className="w-full shrink-0 bg-white px-5 py-[10px]">
          <Button
            variant="primary"
            onClick={handleMyPageClick}
          >
            마이페이지로 이동
          </Button>
        </footer>
      </div>
    )
  }

  const formattedTotalAmount =
    reservation.totalPrice.toLocaleString('ko-KR')

  const reservationDateTime =
    formatReservationDateTimeLong(
      reservation.timeSlot.date,
      reservation.timeSlot.startTime,
    )

  const receiptItems = [
    {
      label: '사진관',
      value: reservation.studio.name,
    },
    {
      label: '날짜·시간',
      value: reservationDateTime,
    },
    {
      label: '컨셉',
      value: reservation.studioProduct.name,
    },
  ]

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white text-black">
      <div className="sticky top-0 z-20 shrink-0 bg-white">
        <NavigationBar
          title="PICDAY"
          showLeft={false}
          showRight={false}
        />
      </div>

      <main className="flex flex-1 flex-col">
        <section className="flex h-[256px] w-full shrink-0 flex-col items-center px-5 py-[50px] text-center">
          <div className="flex pb-5">
            <div className="flex size-[70px] items-center justify-center rounded-full bg-brand-100 text-white">
              <IcCheck
                width={50}
                height={50}
              />
            </div>
          </div>

          <h1 className="font-h3 pb-2 text-black">
            예약이 완료되었습니다
          </h1>

          <p className="font-b6 w-full pb-2 text-gray-60">
            {reservation.studio.name} ·{' '}
            {reservationDateTime}
          </p>
        </section>

        <ReservationDetail
          title="예약내역"
          receiptItems={receiptItems}
          totalLabel="결제 금액"
          totalAmount={`₩${formattedTotalAmount}`}
        />

        <div className="px-5">
          <NoticeBanner label="마이페이지에서 촬영 전 체크리스트를 확인할 수 있어요" />
        </div>
      </main>

      <footer className="mt-auto flex h-[129px] w-full shrink-0 flex-col gap-3 bg-white px-5 py-[10px]">
        <Button
          variant="primary"
          onClick={handleMyPageClick}
        >
          마이페이지에서 예약 확인
        </Button>

        <Button
          variant="secondary"
          onClick={handleHomeClick}
        >
          홈으로 돌아가기
        </Button>
      </footer>
    </div>
  )
}

export default ReservationCompletePage