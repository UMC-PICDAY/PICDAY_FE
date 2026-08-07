/**
 * MyPageSkeleton 사용법
 *
 * MyReservationPage, MyReviewPage, ProfileSettingPage 전용 로딩 스켈레톤.
 * 카드/본문의 실제 레이아웃(CardReservationHistory, MyReviewPage 뷰 모드, Profile
 * userInfo 영역)을 그대로 따라가되, 내용물(이미지·텍스트·버튼) 자리만 공용 Skeleton
 * 블록으로 채워서 로딩 중임을 표시함.
 *
 *   <ReservationListSkeleton />
 *   <ReviewDetailSkeleton />
 *   <ProfileHeaderSkeleton />
 */
import Skeleton from '@/components/common/Skeleton'

export const ProfileHeaderSkeleton = () => (
  <div className="flex w-full max-w-[402px] flex-col items-start gap-5">
    <div className="flex w-full items-center gap-[15px] px-5 py-[10px]">
      <Skeleton className="h-[40px] w-[40px] shrink-0 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="h-3 w-16 rounded-lg" />
      </div>
    </div>
  </div>
)

const ReservationCardSkeleton = () => (
  <div className="relative flex w-[362px] flex-col items-center gap-[10px] rounded-[20px] border border-[rgba(254,228,235,0.3)] bg-[rgba(252,252,252,0.75)] py-[10px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]">
    <div className="flex shrink-0 items-center gap-[10px]">
      <Skeleton className="h-[181px] w-[181px] rounded-[16px]" />
      <Skeleton className="h-[181px] w-[149px] rounded-[16px]" />
    </div>

    <div className="flex w-full flex-col gap-[10px] px-[12px] py-[8px]">
      <Skeleton className="h-5 w-2/3 rounded-lg" />
      <Skeleton className="h-4 w-1/2 rounded-lg" />
      <Skeleton className="h-4 w-1/3 rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
)

export const ReservationListSkeleton = () => (
  <div className="flex flex-col items-center gap-5">
    {Array.from({ length: 3 }).map((_, index) => (
      <ReservationCardSkeleton key={index} />
    ))}
  </div>
)

export const ReviewDetailSkeleton = () => (
  <>
    <div className="px-5 pt-5">
      <div className="rounded-[8px] bg-brand-20/30 px-4 py-3">
        <Skeleton className="h-5 w-1/2 rounded-lg" />
        <Skeleton className="mt-2 h-4 w-2/3 rounded-lg" />
      </div>
    </div>

    <article className="mx-5 mt-3 flex flex-col gap-3 rounded-[8px] px-0 pb-5 pt-2 shadow-[0_15px_48px_rgba(252,200,215,0.1)] backdrop-blur-[10px]">
      <Skeleton className="h-6 w-1/3 rounded-lg" />
      <Skeleton className="h-4 w-1/4 rounded-lg" />
      <Skeleton className="h-8 w-2/3 rounded-[32px]" />
      <Skeleton className="h-4 w-full rounded-lg" />
      <Skeleton className="h-4 w-full rounded-lg" />
      <Skeleton className="h-4 w-2/3 rounded-lg" />
      <Skeleton className="h-[88px] w-full rounded-[8px]" />
    </article>

    <div className="mt-auto flex gap-3 p-5">
      <Skeleton className="h-12 flex-1 rounded-lg" />
      <Skeleton className="h-12 w-[220px] rounded-lg" />
    </div>
  </>
)
