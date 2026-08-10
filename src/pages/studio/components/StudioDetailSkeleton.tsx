import Skeleton from '@/components/common/Skeleton'
import NavigationBarTransparent from '@/components/layout/NavigationBarTransparent'

interface StudioDetailSkeletonProps {
  onBack: () => void
}

/**
 * 사진관 상세(StudioDetailPage) 최초 로딩용 스켈레톤.
 * 히어로·이름·촬영 컨셉까지만 그린다. 그 아래(소개·리뷰 요약 등)는 첫 화면
 * 밖이라, 사용자가 스크롤하기 전에 데이터가 도착한다.
 * 상단바는 로딩 상태에서도 히어로 위에 겹쳐 둬야 데이터 도착 시 아래 내용이
 * 밀리지 않는다.
 */

const ConceptCardSkeleton = () => (
  <div className="flex w-[178px] shrink-0 flex-col overflow-hidden rounded-[12px] border border-[rgba(238,238,238,0.6)] bg-[rgba(252,252,252,0.75)]">
    <Skeleton className="h-[124px] w-full" />
    <div className="flex w-full flex-col gap-[4px] px-[12px] py-[10px]">
      <Skeleton className="h-5 w-full rounded" />
      <Skeleton className="h-4 w-16 rounded" />
      <Skeleton className="h-4 w-20 rounded" />
    </div>
  </div>
)

const StudioDetailSkeleton = ({ onBack }: StudioDetailSkeletonProps) => (
  <>
    {/* 히어로 */}
    <div className="relative h-[302px] w-full shrink-0">
      <Skeleton className="size-full" />
      <div className="absolute inset-x-0 top-0">
        <NavigationBarTransparent onBack={onBack} />
      </div>
    </div>

    {/* 이름 / 위치 / 별점 */}
    <div className="px-5 py-3">
      <div className="py-2">
        {/* font-h3 실측 라인박스가 32px */}
        <Skeleton className="h-8 w-2/3 rounded" />
      </div>
      <div className="flex items-center gap-1 pb-1">
        <Skeleton className="size-5 shrink-0 rounded-full" />
        <Skeleton className="h-6 w-40 rounded" />
      </div>
      <div className="flex items-center gap-1 pb-2">
        <Skeleton className="size-5 shrink-0 rounded-full" />
        <Skeleton className="h-[21px] w-28 rounded" />
      </div>
    </div>

    {/* Divider */}
    <div className="h-1.5 w-full bg-gray-10" />

    {/* 촬영 컨셉 */}
    <section className="px-5 pb-5">
      <div className="pb-3 pt-5">
        <Skeleton className="h-[25px] w-24 rounded" />
      </div>
      <div className="flex w-full items-center justify-center gap-2">
        <ConceptCardSkeleton />
        <ConceptCardSkeleton />
      </div>
    </section>
  </>
)

export default StudioDetailSkeleton
