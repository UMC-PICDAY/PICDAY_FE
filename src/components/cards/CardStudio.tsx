import { IcStar } from '@/components/icons'

const DEFAULT_IMAGE = 'https://www.figma.com/api/mcp/asset/1db05c60-d240-4865-9868-f14ba5bb54d6'
const DEFAULT_SERVICES = ['헤어·메이크업', '주차']

type CardStudioVariant = 'Default' | '2' | '3' | 'Variant5'

interface Props {
  className?: string
  variant?: CardStudioVariant
  imageSrc?: string | null
  name?: string
  location?: string
  category?: string
  secondaryCategory?: string
  price?: string
  rating?: string
  reviewCount?: string | null
  services?: string[]
}

const CardStudio = ({
  className,
  variant = 'Default',
  imageSrc = DEFAULT_IMAGE,
  name = '데이지 스튜디오',
  location = '홍대',
  category = '프로필',
  secondaryCategory,
  price = '₩55,000~',
  rating = '4.9',
  reviewCount = '128',
  services = DEFAULT_SERVICES,
}: Props) => {
  const isVariantTwo = variant === '2'
  const isDetailed = variant === '3' || variant === 'Variant5'
  const extraCategory = secondaryCategory ?? category
  const imagePositionClass = isVariantTwo ? 'left-[0.388px] top-[-1085.971px]' : 'left-0 top-0'

  return (
    <div
      className={
        className ||
        'relative flex w-[200px] flex-col items-start overflow-hidden rounded-[12px] border border-[rgba(238,238,238,0.6)] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]'
      }
    >
      <div className="relative h-[180px] w-full shrink-0 overflow-hidden bg-white">
        {imageSrc ? (
          <div className="absolute left-0 top-[-26px] h-[299px] w-[200px] overflow-hidden">
            <img
              alt={name}
              className={`absolute ${imagePositionClass} h-[726.24%] w-full max-w-none object-fill`}
              src={imageSrc}
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-10" />
        )}
      </div>

      <div className="relative flex w-full shrink-0 flex-col items-start gap-[4px] bg-[rgba(252,252,252,0.75)] px-[12px] py-[10px]">
        {isDetailed ? (
          <>
            <div className="flex w-full shrink-0 items-start justify-between gap-[8px]">
              <p className="min-w-0 flex-1 truncate font-b7 text-black">{name}</p>

              <div className="flex shrink-0 items-center text-gray-80">
                <IcStar width={12} height={12} className="shrink-0" />
                <p className="whitespace-nowrap text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)]">
                  {reviewCount ? `${rating}(${reviewCount})` : rating}
                </p>
              </div>
            </div>

            <div className="flex max-w-full shrink-0 items-start gap-[4px] overflow-hidden text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)] text-gray-40">
              <p className="shrink-0 whitespace-nowrap">{location}</p>
              <p className="shrink-0 whitespace-nowrap">|</p>
              <p className="shrink-0 whitespace-nowrap">{category}</p>
              <p className="shrink-0 whitespace-nowrap">·</p>
              <p className="min-w-0 truncate">{extraCategory}</p>
              {variant === 'Variant5' && (
                <>
                  <p className="shrink-0 whitespace-nowrap">·</p>
                  <p className="min-w-0 truncate">{extraCategory}</p>
                </>
              )}
            </div>

            {services.length > 0 && (
              <div className="flex max-w-full shrink-0 flex-wrap items-start gap-[4px]">
                {services.map((service) => (
                  <div
                    key={service}
                    className="flex shrink-0 items-center justify-center rounded-full border border-gray-20 px-[8px] py-[2px]"
                  >
                    <p className="whitespace-nowrap text-[11px] font-[400] leading-[1.3] tracking-[0] text-gray-40">
                      {service}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <p className="shrink-0 whitespace-nowrap font-cap2 text-gray-80">{price}</p>
          </>
        ) : (
          <>
            <p className="w-full shrink-0 truncate font-b7 text-black">{name}</p>

            <div className="flex max-w-full shrink-0 items-start gap-[4px] overflow-hidden text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)] text-gray-40">
              <p className="shrink-0 whitespace-nowrap">{location}</p>
              <p className="shrink-0 whitespace-nowrap">|</p>
              <p className="shrink-0 whitespace-nowrap">{category}</p>
              {isVariantTwo && (
                <>
                  <p className="shrink-0 whitespace-nowrap">·</p>
                  <p className="min-w-0 truncate">{extraCategory}</p>
                </>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-[4px] text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)] text-gray-80">
              <p className="shrink-0 whitespace-nowrap">{price}</p>
              <div className="flex shrink-0 items-center gap-[1px]">
                <IcStar className="shrink-0 text-gray-80" width={12} height={12} />
                <p className="shrink-0 whitespace-nowrap">{rating}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CardStudio