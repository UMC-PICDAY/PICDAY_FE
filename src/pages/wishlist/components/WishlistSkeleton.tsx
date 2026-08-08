import Skeleton from '@/components/common/Skeleton'

/**
 * 위시리스트(WishlistPage) 최초 로딩용 스켈레톤.
 * CardStudioFavorite와 같은 2열 그리드 치수를 써서, 로딩 중에 "찜한 사진관 없음"
 * 빈 상태로 잘못 보이지 않고 데이터 도착 후에도 레이아웃이 흔들리지 않게 한다.
 */

const WishlistCardSkeleton = () => (
  <div className="relative flex w-full flex-col items-start overflow-hidden rounded-[12px] border border-[rgba(238,238,238,0.6)]">
    <Skeleton className="h-[173px] w-full" />
    <div className="flex w-full flex-col gap-[6px] bg-[rgba(252,252,252,0.75)] px-[12px] py-[10px]">
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-[15px] w-1/2 rounded" />
      <Skeleton className="h-4 w-1/3 rounded" />
    </div>
  </div>
)

const WishlistSkeleton = () => (
  <div className="grid w-full grid-cols-2 gap-4 px-5 py-[10px]">
    <WishlistCardSkeleton />
    <WishlistCardSkeleton />
    <WishlistCardSkeleton />
    <WishlistCardSkeleton />
  </div>
)

export default WishlistSkeleton
