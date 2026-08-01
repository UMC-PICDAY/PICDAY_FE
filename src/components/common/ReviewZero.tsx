/**
 * ReviewZero 사용법
 *
 * 리뷰가 없을 때 리뷰 영역에 표시
 *   <ReviewZero />
 *   onClick을 넘기지 않으면 눌리지 않는 안내 영역으로 렌더됩니다
 *
 * [이동 연결]
 *   <ReviewZero onClick={goToReview} />
 *
 * [텍스트 변경]
 *   <ReviewZero label="리뷰가 아직 없습니다" />
 */

import { IcRight, IcStar } from '@/components/icons'

interface ReviewZeroProps {
  label?: string
  onClick?: () => void
  className?: string
}

const ReviewZero = ({
  label = '리뷰가 아직 없습니다',
  onClick,
  className = '',
}: ReviewZeroProps) => {
  const shellClassName = `flex w-full items-center bg-white/75 px-5 pb-4 pt-5 text-left shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px] ${className}`

  const content = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-1">
        <IcStar
          width={20}
          height={20}
          className="shrink-0 text-brand-100"
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 pr-1 font-b6 text-gray-40">
          {label}
        </span>
      </span>
      <IcRight
        width={24}
        height={24}
        className="shrink-0 text-gray-20"
        aria-hidden="true"
      />
    </>
  )

  // 이동할 곳이 없으면 버튼으로 두지 않는다. 눌리지 않는데 버튼으로 읽히면
  // 키보드 포커스도 잡히고 스크린리더도 동작이 있는 것처럼 안내한다.
  if (!onClick) {
    return <div className={shellClassName}>{content}</div>
  }

  return (
    <button type="button" onClick={onClick} className={shellClassName}>
      {content}
    </button>
  )
}

export default ReviewZero
