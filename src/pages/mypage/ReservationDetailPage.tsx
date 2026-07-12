/**
 * Figma F-1D 예약 상세 (라우트: /mypage/reservations/:reservationId)
 * 예약완료/촬영완료/취소 상태에 따라 예약 상세 화면을 분기해서 표시함
 */

import { useNavigate, useParams } from 'react-router'

import Button from '@/components/common/Button'
import Profile from '@/components/common/Profile'
import ReservationDetail from '@/components/cards/ReservationDetail'
import { IcBack, IcCheck, IcCheckBox } from '@/components/icons'

type ReservationDetailType = 'reserved' | 'shooting' | 'canceled'

const getReservationType = (reservationId?: string): ReservationDetailType => {
  if (reservationId === '2') {
    return 'shooting'
  }

  if (reservationId === '3') {
    return 'canceled'
  }

  return 'reserved'
}

const reservationInfo = {
  reserved: {
    studioName: '스튜디오 아롬',
    reservationDate: '2026년 3월 15일 (토) 14:00',
    statusLabel: '예약 완료',
    concept: '증명사진',
  },
  shooting: {
    studioName: '포토그래피 by J',
    reservationDate: '2026년 4월 20일 (월) 11:00',
    statusLabel: '촬영 완료',
    concept: '개인화보',
  },
  canceled: {
    studioName: '타임온미',
    reservationDate: '2026년 5월 10일 (일) 13:00',
    statusLabel: '취소',
    concept: '프로필',
  },
} as const

const checklistItems = [
  '촬영 컨셉 및 의상 (컨셉·의상) 준비 확인',
  '헤어·메이크업 예약 시간 확인',
  '스튜디오 위치 및 오시는 길 확인',
  '촬영 당일 소품·의상 챙기기',
]

const CancelDetailCard = () => {
  return (
    <section className="flex w-full flex-col items-start px-5 py-[10px]">
      <div className="flex w-full flex-col items-start justify-center gap-5 rounded-[8px] border border-gray-10 bg-white p-5">
        <div className="flex w-full flex-col items-start gap-[10px]">
          <h2 className="font-b5 text-black">예약내역</h2>

          <div className="flex w-full items-start border-b border-gray-10 px-[5px] py-2">
            <div className="flex flex-1 items-center gap-[10px]">
              <p className="font-b8 text-gray-60">취소 사유</p>
            </div>
            <p className="font-b8 text-black">고객 요청</p>
          </div>

          <div className="flex w-full items-start px-[5px] py-2">
            <div className="flex flex-1 items-center gap-[10px]">
              <p className="font-b8 text-gray-60">취소 일시</p>
            </div>
            <p className="font-b8 text-black">2026.05.01 10:30</p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start">
          <div className="flex w-full items-start pb-1">
            <div className="flex flex-1 items-center gap-[10px]">
              <p className="font-b5 text-black">결제 금액</p>
            </div>
            <p className="font-b5 text-gray-80">₩70,000</p>
          </div>

          <p className="font-b10 text-gray-40">환불 금액은 사진관 정책에 따라 산정됩니다.</p>
        </div>
      </div>
    </section>
  )
}

const ChecklistCard = () => {
  return (
    <section className="flex h-[267px] w-full flex-col items-start gap-5 px-5 py-[10px]">
      <div className="flex w-full flex-col items-start justify-center gap-5 rounded-[8px] border border-gray-10 bg-white p-5">
        <div className="flex items-center justify-center gap-[5px]">
          <IcCheck width={16} height={16} className="text-black" />
          <h2 className="font-b5 text-black">촬영 전 체크리스트</h2>
        </div>

        <div className="flex w-full flex-col items-start">
          {checklistItems.map((item, index) => {
            const isLast = index === checklistItems.length - 1

            return (
              <div
                key={item}
                className={`flex w-full flex-col items-start gap-[10px] px-[5px] py-[10px] ${
                  isLast ? '' : 'border-b border-gray-10'
                }`}
              >
                <div className="flex w-full items-center gap-[5px]">
                  <IcCheckBox width={24} height={24} className="shrink-0 text-gray-10" />
                  <p className="font-b8 text-gray-60">{item}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const ReservationDetailPage = () => {
  const navigate = useNavigate()
  const { reservationId } = useParams()

  const reservationType = getReservationType(reservationId)
  const info = reservationInfo[reservationType]

  const isReserved = reservationType === 'reserved'
  const isShooting = reservationType === 'shooting'
  const isCanceled = reservationType === 'canceled'

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[402px] flex-col bg-white pb-[120px]">
      <header className="flex w-full items-center justify-between border-b border-gray-10 bg-white px-5 py-3">
        <button
          type="button"
          aria-label="뒤로가기"
          className="flex h-9 w-9 items-center justify-start"
          onClick={() => navigate(-1)}
        >
          <IcBack width={24} height={24} />
        </button>

        <div className="flex flex-1 items-center justify-center">
          <h1 className="font-h6 text-black">예약 상세</h1>
        </div>

        <div className="h-9 w-9" />
      </header>

      <Profile
        variant="bookingInfo"
        studioName={info.studioName}
        reservationDate={info.reservationDate}
        statusLabel={info.statusLabel}
      />

      <div className="flex w-full flex-col items-start py-[10px]">
        <ReservationDetail
          receiptItems={[{ label: '컨셉', value: info.concept }]}
          totalAmount="₩70,000"
        />

        {isReserved && <ChecklistCard />}
        {isCanceled && <CancelDetailCard />}
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[402px] -translate-x-1/2 bg-white px-5 pb-10">
        {isReserved && <Button variant="disabled">예약 취소</Button>}

        {isShooting && (
          <Button variant="primary" onClick={() => navigate('/mypage/reservations/2/review')}>
            리뷰 작성
          </Button>
        )}

        {isCanceled && (
          <Button variant="primary" onClick={() => navigate('/reservation')}>
            재예약
          </Button>
        )}
      </div>
    </main>
  )
}

export default ReservationDetailPage