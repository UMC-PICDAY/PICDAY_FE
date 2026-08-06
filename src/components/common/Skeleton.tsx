interface SkeletonProps {
  /** 크기·모서리·여백은 사용하는 쪽에서 지정한다. 예: "h-5 w-24 rounded-lg" */
  className?: string
}

/**
 * 로딩 자리를 채우는 최소 단위 블록.
 * 실제 콘텐츠와 같은 크기를 줘야 데이터 도착 시 레이아웃이 흔들리지 않는다.
 * 모서리 반경은 기본값을 두지 않는다. 기본값을 넣으면 호출부에서 rounded-full
 * 같은 값을 넘겼을 때 어느 쪽이 이길지 CSS 순서에 좌우되기 때문이다.
 */
const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div
    aria-hidden
    className={`animate-pulse bg-gray-10 motion-reduce:animate-none ${className}`}
  />
)

export default Skeleton
