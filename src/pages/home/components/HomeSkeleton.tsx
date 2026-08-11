import Skeleton from '@/components/common/Skeleton'

/**
 * 홈(HomeFeed) 최초 로딩용 스켈레톤.
 * 배너 캐러셀(default/center/default)과 "지금 인기 있는 사진관" 행만 그린다.
 * 최근 본 사진관·지역 추천 행은 로그인 여부·데이터 유무에 따라 아예 안 보일 수도
 * 있는 조건부 섹션이라, 스켈레톤에 넣으면 로딩 후 사라지면서 레이아웃이 흔들린다.
 */

const LargeCardSkeleton = ({ isCenter = false }: { isCenter?: boolean }) => (
  <Skeleton
    className={`shrink-0 rounded-[20px] ${isCenter ? 'h-[315px] w-[280px]' : 'h-[292px] w-[260px]'}`}
  />
)

const StudioCardSkeleton = () => (
  <div className="flex w-[200px] shrink-0 flex-col overflow-hidden rounded-[12px] border border-[rgba(238,238,238,0.6)] bg-[rgba(252,252,252,0.75)]">
    <Skeleton className="h-[180px] w-full" />
    <div className="flex w-full flex-col gap-[4px] px-[12px] py-[10px]">
      <Skeleton className="h-5 w-3/4 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
      <Skeleton className="h-4 w-1/3 rounded" />
    </div>
  </div>
)

const HomeSkeleton = () => (
  <>
    {/* 실제 캐러셀은 마운트 시 center 카드를 화면 중앙으로 스크롤하므로, 스켈레톤도 justify-center여야 로딩 후 안 밀린다 */}
    <div className="flex w-full items-center justify-center gap-[20px] overflow-hidden py-[10px]">
      <LargeCardSkeleton />
      <LargeCardSkeleton isCenter />
      <LargeCardSkeleton />
    </div>

    <div className="flex w-full flex-col items-start gap-1 px-5 py-[10px]">
      <Skeleton className="h-[21px] w-32 rounded" />
    </div>

    <div className="flex w-full gap-3 overflow-hidden px-5 pb-[10px]">
      <StudioCardSkeleton />
      <StudioCardSkeleton />
      <StudioCardSkeleton />
    </div>
  </>
)

export default HomeSkeleton
