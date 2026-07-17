/**
 * Figma F-1C 취소 완료 (라우트: /mypage/reservations/:reservationId/cancel/complete)
 * 예약 취소 완료 안내와 마이페이지/홈 이동 버튼을 제공함
 */

import { useNavigate } from 'react-router'

import Button from '@/components/common/Button'
import { IcCheck } from '@/components/icons'

const CancelCompletePage = () => {
  const navigate = useNavigate()

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[402px] flex-col bg-white">
      <section className="flex h-[653px] w-full flex-col items-center justify-center gap-[10px] px-5 py-5">
        <div className="flex w-full flex-col items-center">
          <div className="flex items-center gap-[10px] rounded-[100px] p-[10px]">
            <IcCheck width={50} height={50} className="text-gray-80" />
          </div>

          <div className="flex items-center justify-center gap-[10px] pb-2">
            <h1 className="font-h3 text-black">예약이 취소되었습니다</h1>
          </div>

          <div className="flex w-full items-center justify-center gap-[10px] pb-2">
            <p className="font-b6 text-gray-60">데이지스튜디오 · 2025.06.14 오전 11:00</p>
          </div>

          <div className="mt-[10px] flex w-[250px] flex-col items-center justify-center rounded-[12px] bg-brand-20 p-[10px]">
            <p className="font-b8 text-brand-100">환불은 사진관 정책에 따라 진행됩니다.</p>
          </div>
        </div>
      </section>

      <div className="mt-auto flex flex-col gap-[10px] px-5 pb-10">
        <Button variant="primary" onClick={() => navigate('/mypage')}>
          마이페이지로
        </Button>

        <Button variant="secondary" onClick={() => navigate('/')}>
          홈으로 돌아가기
        </Button>
      </div>
    </main>
  )
}

export default CancelCompletePage