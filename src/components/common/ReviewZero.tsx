import { IcRight, IcStar } from '@/components/icons'

interface ReviewZeroProps {
  label?: string
  onClick?: () => void
  className?: string
}

/** 리뷰가 없을 때 리뷰 영역의 진입점을 표시합니다. */
const ReviewZero = ({
  label = '리뷰가 아직 없습니다',
  onClick,
  className = '',
}: ReviewZeroProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center bg-white/75 px-5 pb-4 pt-5 text-left shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px] ${className}`}
  >
    <span className="flex min-w-0 flex-1 items-center gap-1">
      <IcStar
        width={20}
        height={20}
        className="shrink-0 text-gray-40"
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 pr-1 font-b6 text-gray-40">
        {label}
      </span>
    </span>
    <IcRight
      width={24}
      height={24}
      className="shrink-0 text-gray-40"
      aria-hidden="true"
    />
  </button>
)

export default ReviewZero
