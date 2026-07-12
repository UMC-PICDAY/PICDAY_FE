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
 */

import { IcStar, IcStar2, IcStarHalf } from '@/components/icons'

interface Props {
  score?: number
}

const Review = ({ score = 5 }: Props) => {
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const starNumber = index + 1
        const isFull = score >= starNumber
        const isHalf = score >= starNumber - 0.5 && score < starNumber

        if (isFull) {
          return <IcStar key={starNumber} width={24} height={24} className="text-brand-100" />
        }

        if (isHalf) {
          return <IcStarHalf key={starNumber} width={24} height={24} className="text-brand-100" />
        }

        return <IcStar2 key={starNumber} width={24} height={24} className="text-gray-20" />
      })}

      <span className="font-b6 text-gray-40">{score.toFixed(1)}</span>
    </div>
  )
}

export default Review