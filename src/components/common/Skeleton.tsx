/**
 * Skeleton 사용법
 *
 * 로딩 중 콘텐츠 자리를 표시하는 회색 펄스 블록. 화면마다 실제 콘텐츠 크기에 맞춰
 * className으로 width/height/border-radius를 지정해서 조합해 쓴다.
 *
 *   <Skeleton className="h-4 w-1/2" />
 *   <Skeleton className="h-[181px] w-[181px] rounded-[16px]" />
 */

interface SkeletonProps {
  className?: string
}

const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div className={`animate-pulse rounded-lg bg-gray-10 ${className}`} />
)

export default Skeleton
