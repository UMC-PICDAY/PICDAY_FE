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

const Photos = ({ photos, size }: { photos: (string | null)[]; size: number }) => (
  <div className="flex gap-2">
    {photos.map((src, index) =>
      src ? (
        <img
          key={index}
          src={src}
          alt=""
          style={{ width: size, height: size }}
          className="shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div
          key={index}
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

  const badge = isBest && (
    <span className="rounded-lg bg-brand-20 px-2 py-0.5 font-b12 text-brand-100">
      베스트리뷰
    </span>
  )

  const photoBlock = photos.length > 0 && (
    <Photos photos={photos} size={isFull ? 148 : 120} />
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
            <p className="pt-1 font-b8 text-gray-80">{body}</p>
          </div>
        </>
      ) : (
        <>
          <p className="pb-2 font-b8 text-gray-80">{body}</p>
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
