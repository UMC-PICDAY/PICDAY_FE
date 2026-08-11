import { useEffect, useRef, useState } from 'react'

import LikesChip from '@/components/common/LikesChip'
import { IcStar } from '@/components/icons'

interface ReviewCardProps {
  reviewId?: number
  variant?: 'summary' | 'full'
  reviewerName: string
  isBest?: boolean
  rating?: number
  date: string
  body: string
  stats?: string
  conceptTitle?: string
  photos?: (string | null)[]
  helpfulText?: string
  likeCount?: number
  liked?: boolean
  likePending?: boolean
  onLikeChange?: (reviewId: number, nextLiked: boolean) => void
  className?: string
}

const Stars = ({ rating, size }: { rating: number; size: number }) => (
  <div className="flex">
    {Array.from({ length: 5 }).map((_, index) => (
      <IcStar
        key={index}
        width={size}
        height={size}
        className={index < rating ? 'text-brand-80' : 'text-gray-20'}
      />
    ))}
  </div>
)

interface PhotosProps {
  photos: (string | null)[]
  size: number
  // 카드 좌우 패딩만큼 음수 마진으로 빼내 사진이 카드 끝까지 흘러가게 한다.
  bleed: string
}

const Photos = ({ photos, size, bleed }: PhotosProps) => (
  <div
    className={`flex gap-2 overflow-x-auto ${bleed} [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
  >
    {photos.map((src, index) =>
      src ? (
        <img
          key={src}
          src={src}
          alt=""
          style={{ width: size, height: size }}
          className="shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div
          key={`placeholder-${index}`}
          style={{ width: size, height: size }}
          className="shrink-0 rounded-lg bg-brand-60"
        />
      ),
    )}
  </div>
)

const ReviewCard = ({
  reviewId,
  variant = 'summary',
  reviewerName,
  isBest = false,
  rating = 5,
  date,
  body,
  stats,
  conceptTitle,
  photos = [],
  helpfulText,
  likeCount,
  liked = false,
  likePending = false,
  onLikeChange,
  className = '',
}: ReviewCardProps) => {
  const isFull = variant === 'full'

  const bodyRef = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)

  // 본문이 3줄을 넘길 때만 더보기를 노출한다. 펼친 뒤에는 클램프가 풀려
  // 높이 비교가 무의미하므로 접힌 상태에서만 측정한다.
  useEffect(() => {
    if (expanded) return

    const element = bodyRef.current
    if (!element) return

    // fonts.ready가 언마운트 뒤에 늦게 resolve될 수 있어 정리 플래그를 둔다.
    let alive = true
    const measure = () => {
      if (alive) setIsTruncated(element.scrollHeight > element.clientHeight + 1)
    }

    measure()

    // Pretendard가 늦게 도착하면 줄바꿈 위치가 바뀌므로 교체 후 다시 잰다.
    // 클램프로 높이가 고정돼 ResizeObserver는 이 순간을 잡지 못한다.
    document.fonts?.ready.then(measure)

    // 카드 폭이 바뀌면 줄바꿈 위치도 달라져 다시 재봐야 한다.
    const observer = new ResizeObserver(measure)
    observer.observe(element)

    return () => {
      alive = false
      observer.disconnect()
    }
  }, [body, expanded])

  const bodyBlock = (
    <div className="relative">
      <p
        ref={bodyRef}
        className={`font-b8 text-gray-80 ${expanded ? '' : 'line-clamp-3'}`}
      >
        {body}
        {expanded && isTruncated && (
          <button
            type="button"
            aria-expanded
            onClick={() => setExpanded(false)}
            className="pl-1 font-b8 text-brand-100"
          >
            닫기
          </button>
        )}
      </p>

      {/* 클램프가 3줄 끝에 만든 말줄임을 덮고 그 자리에 '…더보기'를 얹는다. */}
      {!expanded && isTruncated && (
        <button
          type="button"
          aria-expanded={false}
          onClick={() => setExpanded(true)}
          className="absolute bottom-0 right-0 bg-white pl-1 font-b8 text-brand-100"
        >
          …더보기
        </button>
      )}
    </div>
  )

  const badge = isBest && (
    <span className="rounded-lg bg-brand-20 px-2 py-0.5 font-b12 text-brand-100">
      베스트리뷰
    </span>
  )

  const photoBlock = photos.length > 0 && (
    <Photos
      photos={photos}
      size={isFull ? 148 : 120}
      bleed={isFull ? '-mx-5 px-5' : '-mx-4 px-4'}
    />
  )

  const container = isFull
    ? 'rounded-lg bg-white/75 px-5 pb-5 pt-3 shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)]'
    : 'rounded-lg border border-gray-10 bg-white px-4 py-3 shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)]'

  return (
    <div className={`flex w-full flex-col ${container} ${className}`}>
      <div className="flex items-center gap-2 pb-3">
        {isFull && <span className="size-6 shrink-0 rounded-full bg-brand-100" />}
        {isFull ? (
          <>
            {badge}
            <span className="font-b7 text-black">{reviewerName}</span>
          </>
        ) : (
          <>
            <span className="font-b7 text-black">{reviewerName}</span>
            {badge}
          </>
        )}
      </div>

      {stats && <p className="pb-1 font-b10 text-gray-60">{stats}</p>}

      <div className="flex items-center pb-3">
        <Stars rating={rating} size={isFull ? 16 : 20} />
        <span className="pl-1 font-b11 text-gray-60">{date}</span>
      </div>

      {isFull ? (
        <>
          {photoBlock}
          <div className="flex flex-col py-3">
            {conceptTitle && (
              <p className="font-b7 text-black">{conceptTitle}</p>
            )}
            <div className="pt-1">{bodyBlock}</div>
          </div>
        </>
      ) : (
        <>
          <div className="pb-2">{bodyBlock}</div>
          {photoBlock}
        </>
      )}

      {(helpfulText || likeCount !== undefined) && (
        <div className="flex items-center justify-between pt-1">
          <span className="font-cap3 text-gray-40">{helpfulText}</span>
          {likeCount !== undefined && (
            <LikesChip
              count={likeCount}
              liked={liked}
              disabled={
                likePending || reviewId === undefined || !onLikeChange
              }
              aria-busy={likePending}
              onLikedChange={(nextLiked) => {
                if (reviewId !== undefined) {
                  onLikeChange?.(reviewId, nextLiked)
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default ReviewCard
