import Skeleton from '@/components/common/Skeleton'

/**
 * 컨셉 목록(ConceptListPage) 최초 로딩용 스켈레톤.
 * CardStudioDetail과 같은 폭·치수를 써서 데이터가 도착해도 레이아웃이
 * 흔들리지 않게 한다. 카드 하나가 400px대라 첫 화면엔 2장이면 충분하다.
 */

const ConceptCardSkeleton = () => (
  <div className="relative flex w-[345px] flex-col overflow-hidden rounded-[12px] border border-[rgba(238,238,238,0.6)] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)]">
    {/* 이미지 캐러셀 자리 */}
    <Skeleton className="h-[230px] w-[345px] shrink-0" />

    <div className="flex w-full shrink-0 flex-col items-start gap-[8px] bg-[rgba(252,252,252,0.75)] px-[12px] py-[10px]">
      <div className="flex w-full flex-col items-start gap-[4px]">
        {/* 컨셉명(font-b5) / 기준 인원(font-cap3), 실측 각 21px */}
        <Skeleton className="h-[21px] w-32 rounded" />
        <Skeleton className="h-[21px] w-20 rounded" />
      </div>

      {/* 상세보기(font-b7 + IcRight), 실측 24px.
          옵션 문구(optionText)는 있을 때만 렌더되는 줄이라 스켈레톤에선 뺀다. */}
      <div className="flex w-full items-center justify-end gap-1">
        <Skeleton className="h-6 w-16 rounded" />
        <Skeleton className="size-5 shrink-0 rounded" />
      </div>
    </div>

    {/* 가격 + 예약하기 (ButtonLarge variant="price") */}
    <div className="w-full shrink-0 border-t border-gray-10 bg-white">
      <div className="flex w-full items-center gap-5 p-5">
        <Skeleton className="h-6 flex-1 rounded" />
        <Skeleton className="h-[49px] w-24 rounded-[12px]" />
      </div>
    </div>
  </div>
)

const ConceptListSkeleton = () => (
  <main className="flex flex-col px-5 pb-6">
    <section>
      {/* 촬영 카테고리 제목(font-b3) */}
      <div className="pb-3 pt-5">
        <Skeleton className="h-[25px] w-20 rounded" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <ConceptCardSkeleton />
        <ConceptCardSkeleton />
      </div>
    </section>
  </main>
)

export default ConceptListSkeleton
