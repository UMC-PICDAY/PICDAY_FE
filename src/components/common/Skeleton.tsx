/**
 * Skeleton 사용법
 *
 * 로딩 중 콘텐츠 자리를 표시하는 회색 펄스 블록. 화면마다 실제 콘텐츠 크기에 맞춰
 * className으로 width/height/border-radius를 지정해서 조합해 쓴다.
 *
 * 모서리는 기본값을 두지 않는다. 기본값을 넣으면 Tailwind가 임의값 유틸을
 * 이름값보다 먼저 출력하는 탓에, 호출부가 넘긴 rounded-[16px] 같은 값이
 * 뒤에 오는 기본값에 밀려 무시된다. 필요한 곳에서 직접 지정한다.
 *
 *   <Skeleton className="h-4 w-1/2 rounded-lg" />
 *   <Skeleton className="h-[181px] w-[181px] rounded-[16px]" />
 */

interface SkeletonProps {
  className?: string
}

const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div className={`animate-pulse bg-gray-10 ${className}`} />
)

export default Skeleton
