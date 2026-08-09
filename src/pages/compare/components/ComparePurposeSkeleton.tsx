/**
 * ComparePurposeSkeleton 사용법
 *
 * ComparePurposePage에서 비교 목적 정보를 불러오는 동안
 * 촬영 목적 선택 영역의 콘텐츠 자리를 스켈레톤으로 표시한다.
 *
 * 실제 CategoryButton 배치와 동일하게
 * 2열 6개 구조로 구성한다.
 */

import Skeleton from '@/components/common/Skeleton'

const ComparePurposeSkeleton = () => (
  <section
    className="grid grid-cols-2 gap-4 py-[10px]"
    role="status"
    aria-label="비교 촬영 목적 불러오는 중"
  >
    {Array.from({ length: 6 }).map((_, index) => (
      <Skeleton
        key={`purpose-${index}`}
        className="h-[98px] w-full rounded-[8px]"
      />
    ))}
  </section>
)

export default ComparePurposeSkeleton