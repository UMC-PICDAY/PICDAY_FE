/**
 * Figma F-1C 예약 취소 (라우트: /mypage/reservations/:reservationId/cancel)
 * 예약 내역과 환불 안내를 확인한 뒤 예약 취소를 진행하는 화면
 */

import { useState } from 'react'
import { useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import Alert2 from '@/components/common/Alert2'
import Button from '@/components/common/Button'
import ReservationDetail from '@/components/cards/ReservationDetail'
const refundNoticeItems = [
  '환불 정책은 사진관마다 다를 수 있습니다.',
  '촬영 당일 취소는 불가합니다.',
  '예약 취소 시 해당 시간대 슬롯이 자동으로 해제됩니다.',
]

const ReservationCancelPage = () => {
  const navigate = useNavigate()
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

  return (
    <main className="className=flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar title="예약 취소" showRight={false} onBack={() => navigate(-1)} />

      <div className="pt-[10px]">
        <ReservationDetail
          receiptItems={[
            { label: '사진관', value: '데이지스튜디오' },
            { label: '날짜·시간', value: '2026.06.14 (일) 오전 11:00' },
            { label: '컨셉', value: '개인화보' },
          ]}
          totalAmount="₩70,000"
        />
      </div>

      <section className="flex h-[170px] w-full flex-col items-center gap-6 px-5 py-[10px]">
        <div className="flex w-full flex-col rounded-[8px] bg-brand-20 p-5">
          <div className="flex flex-col items-start self-stretch pb-3">
            <h2 className="font-b5 text-black">환불 안내</h2>
          </div>

          <div className="flex flex-col">
            {refundNoticeItems.map((item) => (
              <div key={item} className="flex items-center gap-2 pb-2 last:pb-0">
                <span className="h-1 w-1 shrink-0 rounded-full bg-brand-100" />
                <p className="font-b8 text-gray-80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[402px] -translate-x-1/2 bg-white px-5 pb-10">
        <Button variant="primary" onClick={() => setIsCancelModalOpen(true)}>
          예약 취소하기
        </Button>
      </div>

      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#464545]/90 px-5">
          <Alert2
            variant="variant3"
            onCancel={() => setIsCancelModalOpen(false)}
            onConfirm={() => navigate('/mypage/reservations/1/cancel/complete')}
          />
        </div>
      )}
    </main>
  )
}

export default ReservationCancelPage