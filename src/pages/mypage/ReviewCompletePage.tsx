/**
 * Figma F-1R 리뷰 등록 완료 (라우트: /mypage/reservations/:reservationId/review/complete)
 * 리뷰 등록 완료 안내와 마이페이지 이동 버튼을 제공함
 */

import { useLocation, useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import Button from '@/components/common/Button'
import Review from '@/components/common/Review'
import { IcCheck } from '@/components/icons'

interface ReviewCompleteData {
  studioName: string
  conceptName: string
  rating: number
}

interface ReviewCompleteLocationState {
  review?: ReviewCompleteData
}

const ReviewCompletePage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const locationState =
    location.state as ReviewCompleteLocationState | null

  const review = locationState?.review

  if (!review) {
    return (
      <div className="relative flex min-h-dvh w-full flex-col bg-white">
        <NavigationBar title="PICDAY" showLeft={false} showRight={false} />

        <section className="flex flex-1 flex-col items-center justify-center px-5 text-center">
          <h1 className="font-h5 pb-2 text-black">
            리뷰 정보를 찾을 수 없어요
          </h1>

          <p className="font-b6 text-gray-60">
            마이페이지에서 리뷰 등록 여부를 다시 확인해 주세요.
          </p>
        </section>

        <div className="mt-auto px-5 pb-10">
          <Button variant="primary" onClick={() => navigate('/mypage')}>
            마이페이지로
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar title="PICDAY" showLeft={false} showRight={false} />

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
                <p className="font-b3 text-black">
                  {review.studioName} · {review.conceptName}
                </p>
              </div>

              <Review score={review.rating} />
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