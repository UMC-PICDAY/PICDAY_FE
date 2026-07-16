/**
 * Figma F-1R 리뷰 등록 완료 (라우트: /mypage/reservations/:reservationId/review/complete)
 * 리뷰 등록 완료 안내와 마이페이지 이동 버튼을 제공함
 */

import { useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import Button from '@/components/common/Button'
import Review from '@/components/common/Review'
import { IcCheck } from '@/components/icons'

const ReviewCompletePage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar title="위시리스트" showLeft={false} showRight={false} />

      <section className="flex h-[633px] w-full shrink-0 flex-col items-center justify-center">
        <div className="flex w-full flex-col items-start gap-4 p-5">
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full items-center justify-center gap-[10px] pb-5">
              <div className="flex items-center gap-[10px] rounded-[100px] bg-brand-100 p-[10px]">
                <IcCheck width={50} height={50} className="text-white" />
              </div>
            </div>

            <div className="flex w-full items-center justify-center gap-[10px] pb-5">
              <h1 className="font-h3 text-black">리뷰가 등록되었어요</h1>
            </div>

            <div className="flex w-full items-center justify-center gap-[10px] pb-2">
              <p className="font-b6 text-gray-60">소중한 후기 감사합니다</p>
            </div>
          </div>

          <div className="flex w-full flex-col items-start rounded-[8px] bg-brand-20 px-4 py-3">
            <div className="flex w-full flex-col items-center">
              <div className="flex w-full flex-col items-center pb-2">
                <p className="font-b3 text-black">데이지 스튜디오 · 개인화보</p>
              </div>

              <Review score={5} />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-auto px-5 pb-10">
        <Button variant="primary" onClick={() => navigate('/mypage')}>
          마이페이지로
        </Button>
      </div>
    </div>
  )
}

export default ReviewCompletePage