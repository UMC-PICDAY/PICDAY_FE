import Skeleton from '@/components/common/Skeleton'

/**
 * 리얼리뷰(ReviewDetailPage) 최초 로딩용 스켈레톤.
 * ReviewCard variant="full"과 같은 컨테이너·치수를 써서 데이터가 도착해도
 * 레이아웃이 흔들리지 않게 한다.
 */

export const ReviewSummarySkeleton = () => (
  <div className="flex flex-col items-center px-5 py-8">
    <div className="flex items-center gap-2 pb-1">
      {/* 별 5개(36px) + 평점 숫자 */}
      <Skeleton className="h-9 w-[180px] rounded-lg" />
      <Skeleton className="h-8 w-12 rounded-lg" />
    </div>
    {/* (n개 평가) 줄. font-b6 실측 높이가 24px이라 h-6으로 맞춘다. */}
    <Skeleton className="h-6 w-24 rounded" />
  </div>
)

const ReviewCardSkeleton = () => (
  <div className="flex w-full flex-col rounded-lg bg-white/75 px-5 pb-5 pt-3 shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)]">
    <div className="flex items-center gap-2 pb-3">
      <Skeleton className="size-6 shrink-0 rounded-full" />
      <Skeleton className="h-5 w-24 rounded" />
    </div>

    <div className="flex items-center gap-1 pb-3">
      <Skeleton className="h-4 w-20 rounded" />
      <Skeleton className="h-4 w-16 rounded" />
    </div>

    {/* 사진 영역도 카드 끝까지 흐르게 해 실제 카드와 폭을 맞춘다. */}
    <div className="-mx-5 flex gap-2 overflow-hidden px-5">
      <Skeleton className="size-[148px] shrink-0 rounded-lg" />
      <Skeleton className="size-[148px] shrink-0 rounded-lg" />
    </div>

    <div className="flex flex-col gap-2 py-3">
      <Skeleton className="h-5 w-20 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-2/3 rounded" />
    </div>

    <div className="flex items-center justify-between pt-1">
      <Skeleton className="h-4 w-40 rounded" />
      <Skeleton className="h-7 w-14 rounded-full" />
    </div>
  </div>
)

export const ReviewListSkeleton = () => (
  <>
    {Array.from({ length: 3 }).map((_, index) => (
      <ReviewCardSkeleton key={index} />
    ))}
  </>
)
