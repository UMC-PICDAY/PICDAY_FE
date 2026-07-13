/**
 * ReservationCompletePage 사용법
 *
 * 예약과 결제가 완료된 뒤 결과를 보여주는 페이지
 *
 * 진입 시 location state로 예약 정보를 전달
 *
 * 전달 데이터
 *   {
 *     reservation: {
 *       studioName,
 *       reservationDateTime,
 *       conceptName,
 *       totalAmount,
 *     },
 *   }
 *
 * 주요 기능
 *   - 예약 사진관, 날짜·시간, 컨셉 표시
 *   - 결제 금액 표시
 *   - 마이페이지 이동
 *   - 홈 이동
 *
 * 예약 정보가 없으면 안내 화면과
 * 마이페이지 이동 버튼을 표시
 *
 * TODO
 *   - API 연결 후 예약 ID로 상세 정보 조회
 *   - 새로고침 및 직접 접근 처리
 */

import { useLocation, useNavigate } from 'react-router'

import ReservationDetail from '@/components/cards/ReservationDetail'
import Button from '@/components/common/Button'
import NoticeBanner from '@/components/common/NoticeBanner'
import { IcCheck } from '@/components/icons'
import HomeBar from '@/components/layout/HomeBar'
import NavigationBar from '@/components/layout/NavigationBar'
import StatusBar from '@/components/layout/StatusBar'

interface ReservationCompleteData {
  studioName: string
  reservationDateTime: string
  conceptName: string
  totalAmount: number
}

interface LocationState {
  reservation?: ReservationCompleteData
}

const ReservationCompletePage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const locationState = location.state as LocationState | null
  const reservation = locationState?.reservation

  const handleMyPageClick = () => {
    navigate('/mypage')
  }

  const handleHomeClick = () => {
    navigate('/home')
  }

  if (!reservation) {
    return (
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white text-black">
        <div className="sticky top-0 z-20 shrink-0 bg-white">
          <StatusBar />

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

        <div className="shrink-0">
          <HomeBar />
        </div>
      </div>
    )
  }

  const formattedTotalAmount =
    reservation.totalAmount.toLocaleString('ko-KR')

  const receiptItems = [
    {
      label: '사진관',
      value: reservation.studioName,
    },
    {
      label: '날짜·시간',
      value: reservation.reservationDateTime,
    },
    {
      label: '컨셉',
      value: reservation.conceptName,
    },
  ]

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white text-black">
      <div className="sticky top-0 z-20 shrink-0 bg-white">
        <StatusBar />

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
              <IcCheck width={50} height={50} />
            </div>
          </div>

          <h1 className="font-h3 pb-2 text-black">
            예약이 완료되었습니다
          </h1>

          <p className="font-b6 w-full pb-2 text-gray-60">
            {reservation.studioName} ·{' '}
            {reservation.reservationDateTime}
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

      <div className="shrink-0">
        <HomeBar />
      </div>
    </div>
  )
}

export default ReservationCompletePage