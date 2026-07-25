/**
 * CardStudioPreview 사용법
 *
 * 기본 스튜디오 미리보기 카드
 *   <CardStudioPreview />
 *
 * 이미지 변경
 *   <CardStudioPreview
 *     imageSrc={firstImage}
 *     secondImageSrc={secondImage}
 *   />
 *
 * 스튜디오 정보 전달
 *   <CardStudioPreview
 *     name="데이지스튜디오"
 *     location="홍대"
 *     category="개인화보"
 *     secondaryCategory="프로필"
 *     price="₩30,000~"
 *   />
 *
 * 연계 서비스 변경
 *   <CardStudioPreview
 *     services={['헤어·메이크업', '주차']}
 *   />
 *
 * 찜 상태 및 이벤트 연결
 *   <CardStudioPreview
 *     isFavorite={true}
 *     onFavoriteClick={handleFavoriteClick}
 *   />
 *
 * 비교 추가 버튼 표시
 *   <CardStudioPreview
 *     showCompareButton={true}
 *     isCompareSelected={true}
 *     onCompareClick={handleCompareClick}
 *   />
 */

import { IcStar } from '@/components/icons'
import FavoriteButton from '@/components/common/FavoriteButton'

import firstImage from '@/assets/images/CardImage1.png'
import secondImage from '@/assets/images/CardImage2.png'

const DEFAULT_FIRST_IMAGE = firstImage
const DEFAULT_SECOND_IMAGE = secondImage
const DEFAULT_SERVICES = ['헤어·메이크업', '주차']

interface Props {
  className?: string
  imageSrc?: string | null
  secondImageSrc?: string | null
  name?: string
  location?: string
  category?: string
  secondaryCategory?: string
  services?: string[]
  price?: string
  rating?: string
  reviewCount?: string
  isFavorite?: boolean
  showCompareButton?: boolean
  compareButtonLabel?: string
  isCompareSelected?: boolean
  onClick?: () => void
  onFavoriteClick?: () => void
  onCompareClick?: () => void
}

const CardStudioPreview = ({
  className,
  imageSrc = DEFAULT_FIRST_IMAGE,
  secondImageSrc = DEFAULT_SECOND_IMAGE,
  name = '데이지스튜디오',
  location = '홍대',
  category = '개인화보',
  secondaryCategory = '프로필',
  services = DEFAULT_SERVICES,
  price = '₩30,000~',
  rating = '4.9',
  reviewCount = '128',
  isFavorite = true,
  showCompareButton = false,
  compareButtonLabel = '비교추가',
  isCompareSelected = false,
  onClick,
  onFavoriteClick,
  onCompareClick,
}: Props) => {
  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`${
        className ||
        'relative w-[362px] rounded-[20px] border border-[rgba(254,228,235,0.4)] bg-[rgba(252,252,252,0.75)] p-[10px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]'
      }${onClick ? ' cursor-pointer' : ''}`}
    >
      <div className="flex w-full flex-col items-start gap-[10px]">
        <div className="flex h-[180px] w-full items-center gap-[10px]">
          <div className="h-[180px] w-[180px] shrink-0 overflow-hidden rounded-[16px] bg-brand-60">
            {imageSrc ? (
              <img alt={name} className="h-full w-full object-cover" src={imageSrc} />
            ) : (
              <div className="h-full w-full bg-gray-10" />
            )}
          </div>

          <div className="relative h-[180px] min-w-0 flex-1 overflow-hidden rounded-[16px] bg-brand-60">
            {secondImageSrc ? (
              <img alt={name} className="h-full w-full object-cover" src={secondImageSrc} />
            ) : (
              <div className="h-full w-full bg-gray-10" />
            )}

            <div
              className="absolute right-[10px] top-[10px] flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[rgba(252,252,252,0.75)]"
              onClick={(event) => event.stopPropagation()}
            >
              <FavoriteButton active={isFavorite} onClick={onFavoriteClick} />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-[4px] rounded-[12px] py-[10px]">
          <div className="flex w-full items-start gap-[8px]">
            <p className="min-w-0 flex-1 truncate text-[var(--font-b7-size)] font-[var(--font-b7-weight)] leading-[var(--font-b7-line-height)] tracking-[var(--font-b7-letter-spacing)] text-black">
              {name}
            </p>

            <div className="flex shrink-0 items-center text-gray-80">
              <IcStar width={12} height={12} className="shrink-0" />

              <p className="whitespace-nowrap text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)]">
                {rating}({reviewCount})
              </p>
            </div>
          </div>

          <div className="flex max-w-full items-start gap-[4px] overflow-hidden text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)] text-gray-40">
            <p className="shrink-0 whitespace-nowrap">{location}</p>
            {category && (
              <>
                <p className="shrink-0 whitespace-nowrap">|</p>
                <p className="min-w-0 truncate">{category}</p>
                {secondaryCategory && (
                  <>
                    <p className="shrink-0 whitespace-nowrap">·</p>
                    <p className="min-w-0 truncate">{secondaryCategory}</p>
                  </>
                )}
              </>
            )}
          </div>

          {services.length > 0 && (
            <div className="flex max-w-full flex-wrap items-start gap-[4px]">
              {services.map((service) => (
                <div
                  key={service}
                  className="flex shrink-0 items-center justify-center rounded-full border border-gray-10 px-[8px] py-[2px]"
                >
                  <p className="whitespace-nowrap text-[11px] font-[400] leading-[1.3] tracking-[0] text-gray-40">
                    {service}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex w-full items-end justify-between">
            <p className="shrink-0 whitespace-nowrap pr-[4px] text-[var(--font-cap2-size)] font-[var(--font-cap2-weight)] leading-[var(--font-cap2-line-height)] tracking-[var(--font-cap2-letter-spacing)] text-gray-80">
              {price}
            </p>

            {showCompareButton && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onCompareClick?.()
                }}
                className={`flex w-[89px] shrink-0 items-center justify-center rounded-[8px] px-[20px] py-[10px] ${
                  isCompareSelected
                    ? 'bg-brand-100 font-b7 text-white'
                    : 'border border-gray-20 bg-white font-b8 text-gray-40'
                }`}
              >
                {compareButtonLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardStudioPreview