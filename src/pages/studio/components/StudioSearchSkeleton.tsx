import Skeleton from '@/components/common/Skeleton'

/**
 * 검색 결과 바텀시트(StudioSearchPage) 최초 로딩용 스켈레톤.
 * CardStudioPreview와 같은 치수를 써서 결과가 도착해도 목록이 흔들리지 않게 한다.
 * 비교 버튼은 확장 스냅에서만 붙는 조건부 요소라 스켈레톤에선 제외한다.
 */

const StudioCardSkeleton = () => (
  <div className="relative w-full rounded-[20px] border border-[rgba(254,228,235,0.4)] bg-white/75 p-[10px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)]">
    <div className="flex w-full flex-col items-start gap-[10px]">
      {/* 썸네일 2장 */}
      <div className="flex h-[180px] w-full items-center gap-[10px]">
        <Skeleton className="h-[180px] w-[180px] shrink-0 rounded-[16px]" />
        <Skeleton className="h-[180px] min-w-0 flex-1 rounded-[16px]" />
      </div>

      <div className="flex w-full flex-col items-start gap-[4px] py-[10px]">
        {/* 아래 네 줄의 높이는 실제 카드 실측값(24/21/20/21)을 그대로 쓴다. */}
        {/* 사진관명(font-b7) + 별점(font-cap3) */}
        <div className="flex w-full items-center gap-[8px]">
          <Skeleton className="h-6 min-w-0 flex-1 rounded" />
          <Skeleton className="h-4 w-10 shrink-0 rounded" />
        </div>
        {/* 지역 · 카테고리(font-cap3) */}
        <Skeleton className="h-[21px] w-2/3 rounded" />
        {/* 서비스 칩 */}
        <div className="flex items-center gap-[4px]">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        {/* 가격(font-cap2) */}
        <Skeleton className="h-[21px] w-24 rounded" />
      </div>
    </div>
  </div>
)

const StudioSearchSkeleton = () => (
  <div className="flex w-full flex-col gap-5 pb-14">
    <StudioCardSkeleton />
    <StudioCardSkeleton />
  </div>
)

export default StudioSearchSkeleton
