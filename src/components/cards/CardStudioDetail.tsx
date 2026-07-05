import { IcCheck, IcRight } from '@/components/icons'

const DEFAULT_IMAGE = 'https://www.figma.com/api/mcp/asset/5f4287c4-ca0d-49c5-b894-0e0504b7e71e'

interface Props {
  className?: string
  imageSrc?: string | null
  name?: string
  description?: string
  optionText?: string
  currentImage?: number
  totalImages?: number
  price?: string
  buttonLabel?: string
  detailLabel?: string
  onDetailClick?: () => void
  onReserveClick?: () => void
}

const CardStudioDetail = ({
  className,
  imageSrc = DEFAULT_IMAGE,
  name = '체리베리벌쓰데이',
  description = '기준 1인 (최대 2인)',
  optionText = '자연광 스튜디오 · 의상 무료대여 · 보정본 2매 · 약 40분',
  currentImage = 1,
  totalImages = 8,
  price = '₩70,000',
  buttonLabel = '예약하기',
  detailLabel = '상세보기',
  onDetailClick,
  onReserveClick,
}: Props) => {
  return (
    <div
      className={
        className ||
        'relative flex w-[345px] flex-col items-center justify-center overflow-hidden rounded-[12px] border border-[rgba(238,238,238,0.6)] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]'
      }
    >
      <div className="relative h-[230px] w-[345px] shrink-0 overflow-hidden bg-white">
        {imageSrc ? (
          <div className="absolute left-0 top-[-87px] h-[521px] w-[348px] overflow-hidden">
            <img
              alt={name}
              className="absolute left-0 top-0 h-[726.24%] w-full max-w-none object-fill"
              src={imageSrc}
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gray-10" />
        )}

        <div className="absolute right-[10px] bottom-[10px] flex items-center justify-center rounded-full border border-gray-60 bg-gray-60 px-[12px] py-[2px] opacity-60">
          <p className="whitespace-nowrap text-[var(--font-cap1-size)] font-[var(--font-cap1-weight)] leading-[var(--font-cap1-line-height)] tracking-[var(--font-cap1-letter-spacing)] text-gray-10">
            {currentImage}/{totalImages}
          </p>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col items-start gap-[8px] bg-[rgba(252,252,252,0.75)] px-[12px] py-[10px]">
        <div className="flex shrink-0 flex-col items-start gap-[4px]">
          <p className="h-[21px] w-[321px] truncate text-[var(--font-b5-size)] font-[var(--font-b5-weight)] leading-[var(--font-b5-line-height)] tracking-[var(--font-b5-letter-spacing)] text-black">
            {name}
          </p>
          <p className="whitespace-nowrap pr-[4px] text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)] text-gray-40">
            {description}
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
          <div className="flex w-full shrink-0 items-start">
            <IcCheck width={16} height={16} className="shrink-0 text-gray-80" />
            <p className="min-w-0 truncate pr-[4px] text-[var(--font-cap1-size)] font-[var(--font-cap1-weight)] leading-[var(--font-cap1-line-height)] tracking-[var(--font-cap1-letter-spacing)] text-gray-80">
              {optionText}
            </p>
          </div>

          <button
            className="flex w-full shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-gray-40"
            type="button"
            onClick={onDetailClick}
          >
            <p className="min-w-0 flex-1 text-right text-[var(--font-b7-size)] font-[var(--font-b7-weight)] leading-[var(--font-b7-line-height)] tracking-[var(--font-b7-letter-spacing)]">
              {detailLabel}
            </p>
            <IcRight width={20} height={20} className="shrink-0" />
          </button>
        </div>
      </div>

      <div className="flex w-full shrink-0 itFems-start gap-[20px] border-t border-gray-10 bg-white px-[20px] py-[10px]">
        <div className="flex min-w-0 flex-1 items-center rounded-[8px] py-[12px]">
          <p className="shrink-0 whitespace-nowrap text-[var(--font-b3-size)] font-[var(--font-b3-weight)] leading-[var(--font-b3-line-height)] tracking-[var(--font-b3-letter-spacing)] text-[#3d1a24]">
            {price}
          </p>
        </div>
        <button
          className="flex shrink-0 cursor-pointer items-center justify-center rounded-[8px] border-none bg-brand-100 px-[20px] py-[12px]"
          type="button"
          onClick={onReserveClick}
        >
          <p className="shrink-0 whitespace-nowrap text-[var(--font-b3-size)] font-[var(--font-b3-weight)] leading-[var(--font-b3-line-height)] tracking-[var(--font-b3-letter-spacing)] text-white">
            {buttonLabel}
          </p>
        </button>
      </div>
    </div>
  )
}

export default CardStudioDetail
