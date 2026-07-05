import FavoriteButton from '@/components/common/FavoriteButton'

const DEFAULT_IMAGE = 'https://www.figma.com/api/mcp/asset/6ab21597-3266-4c4c-8324-117971bd26ad'

type CardStudioFavoriteVariant = 'default' | 'active'

interface Props {
  className?: string
  variant?: CardStudioFavoriteVariant
  imageSrc?: string | null
  name?: string
  location?: string
  category?: string
  price?: string
  onFavoriteClick?: () => void
}

const CardStudioFavorite = ({
  className,
  variant = 'default',
  imageSrc = DEFAULT_IMAGE,
  name = '데이지 스튜디오',
  location = '홍대',
  category = '개인화보',
  price = '₩30,000~',
  onFavoriteClick,
}: Props) => {
  const isActive = variant === 'active'

  return (
    <div
      className={
        className ||
        'relative flex w-[173px] flex-col items-start overflow-hidden rounded-[12px] border border-[rgba(238,238,238,0.6)] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]'
      }
    >
      <div className="relative h-[173px] w-full shrink-0 overflow-hidden bg-white">
        {imageSrc ? (
          <div className="absolute left-0 top-[-26px] h-[299px] w-[200px] overflow-hidden">
            <img
              alt={name}
              className="absolute left-[0.19%] top-[-363.2%] h-[726.24%] w-full max-w-none object-fill"
              src={imageSrc}
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gray-10" />
        )}

        <div
          className={`absolute right-[10px] top-[10px] flex h-[28px] w-[28px] items-center justify-center rounded-full ${
            isActive ? 'bg-brand-20' : 'bg-white'
          }`}
        >
          <FavoriteButton active={isActive} onClick={onFavoriteClick} />
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col items-start bg-[rgba(252,252,252,0.75)] px-[12px] py-[10px]">
        <p className="w-[149px] truncate text-[var(--font-b7-size)] font-[var(--font-b7-weight)] leading-[var(--font-b7-line-height)] tracking-[var(--font-b7-letter-spacing)] text-black">
          {name}
        </p>

        <div className="flex shrink-0 items-start">
          <div className="flex shrink-0 items-center gap-[2px] whitespace-nowrap text-[var(--font-cap1-size)] font-[var(--font-cap1-weight)] leading-[var(--font-cap1-line-height)] tracking-[var(--font-cap1-letter-spacing)] text-gray-40">
            <p className="shrink-0">{location}</p>
            <p className="shrink-0">·</p>
            <p className="shrink-0">{category}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center">
          <p className="shrink-0 whitespace-nowrap text-[var(--font-b7-size)] font-[var(--font-b7-weight)] leading-[var(--font-b7-line-height)] tracking-[var(--font-b7-letter-spacing)] text-[#222]">
            {price}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CardStudioFavorite