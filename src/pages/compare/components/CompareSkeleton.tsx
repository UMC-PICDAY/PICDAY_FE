/**
 * CompareSkeleton 사용법
 *
 * CompareTwoPage / CompareThreePage에서 비교 결과 API를
 * 불러오는 동안 실제 비교 화면과 유사한 형태의 스켈레톤 UI를 표시한다.
 *
 * count 값에 따라 2개 비교 / 3개 비교 레이아웃을 구분한다.
 *
 * 사용 예시
 *   <CompareSkeleton count={2} />
 *   <CompareSkeleton count={3} />
 *
 * 공통 Skeleton 컴포넌트에 실제 콘텐츠 크기와 유사한
 * width / height / border-radius를 지정하여 사용한다.
 */

import Skeleton from '@/components/common/Skeleton'

interface CompareSkeletonProps {
  count: 2 | 3
}

const CompareSkeleton = ({ count }: CompareSkeletonProps) => {
  const gridClass =
    count === 2
      ? 'grid-cols-2 gap-4'
      : 'grid-cols-3 gap-[10px]'

  return (
    <div
      role="status"
      aria-label="비교 정보 불러오는 중"
    >
      {/* 사진관 카드 */}
      <section
        className={`grid w-full ${gridClass} px-5 py-[10px]`}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={`studio-${index}`}
            className="flex min-w-0 flex-col"
          >
            {/* 사진관 이미지 */}
            <Skeleton
              className={
                count === 2
                  ? 'h-[173px] w-full rounded-t-[12px]'
                  : 'aspect-square w-full rounded-t-[12px]'
              }
            />

            {/* 사진관 이름 / 별점 */}
            <div className="flex flex-col gap-[2px] px-[10px] py-[10px]">
              <Skeleton
                className={
                  count === 2
                    ? 'h-[24px] w-[70%] rounded-[4px]'
                    : 'h-[18px] w-[70%] rounded-[4px]'
                }
              />

              <Skeleton
                className={
                  count === 2
                    ? 'h-[21px] w-[50%] rounded-[4px]'
                    : 'h-[14px] w-[50%] rounded-[4px]'
                }
              />
            </div>
          </div>
        ))}
      </section>

      <section className="flex w-full flex-col gap-3">
        {/* 비교하는 컨셉 */}
        <div className="flex w-full flex-col bg-[rgba(252,252,252,0.75)] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]">
          {/* 섹션 제목 / 촬영 목적 */}
          <div className="px-5 py-[10px]">
            <Skeleton className="h-[18px] w-[90px] rounded-[4px]" />

            <Skeleton className="mt-1 h-[14px] w-[50px] rounded-[4px]" />
          </div>

          {/* 가격 */}
          <div
            className={`grid ${gridClass} px-5 pb-[10px]`}
          >
            {Array.from({ length: count }).map(
              (_, index) => (
                <Skeleton
                  key={`price-${index}`}
                  className="h-[29px] w-[75%] rounded-[4px]"
                />
              ),
            )}
          </div>
        </div>

        {/* 연계 서비스 */}
        <SkeletonRow
          count={count}
          variant="service"
        />

        {/* 위치 */}
        <SkeletonRow count={count} />

        {/* 예약 가능일 */}
        <SkeletonRow count={count} />

        {/* 사진관 추가 / 최대 비교 안내 */}
        <div className="px-5 py-5">
            <Skeleton
                className={
                    count === 3
                        ? 'h-[45px] w-full rounded-[8px]'
                        : 'h-[74px] w-full rounded-xl'
                }
            />
        </div>
      </section>
    </div>
  )
}

interface SkeletonRowProps {
  count: 2 | 3
  variant?: 'default' | 'service'
}

const SkeletonRow = ({
  count,
  variant = 'default',
}: SkeletonRowProps) => {
  const isService = variant === 'service'

  return (
    <div
      className={`flex w-full flex-col bg-[rgba(252,252,252,0.75)] px-5 py-[10px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px] ${
        isService ? 'h-[100px]' : 'h-[72px]'
      }`}
    >
      {/* 섹션 제목 */}
      <Skeleton className="mb-[10px] h-[18px] w-[72px] rounded-[4px]" />

      {/* 사진관별 데이터 */}
      <div
        className={`grid ${
          count === 2
            ? 'grid-cols-2 gap-4'
            : 'grid-cols-3 gap-[10px]'
        }`}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={`row-${index}`}
            className="flex min-w-0 flex-col gap-[5px]"
          >
            <Skeleton className="h-[21px] w-[75%] rounded-[4px]" />

            {isService && (
              <Skeleton className="h-[21px] w-[55%] rounded-[4px]" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompareSkeleton