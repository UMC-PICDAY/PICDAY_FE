/**
 * Review 사용법
 *
 * [default] 별점 5점
 *   <Review />
 *
 * [score] 별점 점수 변경
 *   <Review score={4} />
 *
 * [half] 반 별 포함
 *   <Review score={4.5} />
 *
 * [size] 별 크기 변경 (기본 24)
 *   <Review score={4.5} size={36} />
 *
 * [starClassName] 채워진 별 색 변경 (기본 text-brand-100)
 *   <Review score={4.5} starClassName="text-brand-80" />
 *
 * [showScore] 점수 텍스트를 숨기고 별만 노출 (호출부가 직접 배치)
 *   <Review score={4.5} showScore={false} />
 */

import { IcStar, IcStar2, IcStarHalf } from '@/components/icons'

interface ReviewProps {
  score?: number
  size?: number
  /** 채워진 별과 반 별의 색상. 빈 별은 항상 text-gray-20 */
  starClassName?: string
  /** 별과 점수를 감싸는 컨테이너 클래스. 별 간격을 조절할 때 교체한다 */
  className?: string
  showScore?: boolean
}

const Review = ({
  score = 5,
  size = 24,
  starClassName = 'text-brand-100',
  className = 'inline-flex items-center gap-1',
  showScore = true,
}: ReviewProps) => {
  return (
    <div className={className}>
      {Array.from({ length: 5 }).map((_, index) => {
        const starNumber = index + 1
        const isFull = score >= starNumber
        const isHalf = score >= starNumber - 0.5 && score < starNumber

        if (isFull) {
          return (
            <IcStar
              key={starNumber}
              width={size}
              height={size}
              className={starClassName}
            />
          )
        }

        if (isHalf) {
          return (
            <IcStarHalf
              key={starNumber}
              width={size}
              height={size}
              className={starClassName}
            />
          )
        }

        return (
          <IcStar2
            key={starNumber}
            width={size}
            height={size}
            className="text-gray-20"
          />
        )
      })}

      {showScore && (
        <span className="font-b6 text-gray-40">{score.toFixed(1)}</span>
      )}
    </div>
  )
}

export default Review
