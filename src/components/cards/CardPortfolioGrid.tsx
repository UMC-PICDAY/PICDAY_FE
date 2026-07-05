const DEFAULT_IMAGE = 'https://www.figma.com/api/mcp/asset/843eddbc-d5aa-49cf-96ce-b12b1efb1699'

interface CardPortfolioItem {
  imageSrc?: string | null
  title?: string
  price?: string
  imageWidth?: string
  imageHeight?: string
  imageLeft?: string
  imageTop?: string
  imageCropLeft?: string
  imageCropTop?: string
}

interface Props {
  className?: string
  items?: CardPortfolioItem[]
}

const DEFAULT_ITEMS: CardPortfolioItem[] = [
  {
    imageSrc: DEFAULT_IMAGE,
    title: '개인화보',
    price: '₩55,000~',
    imageWidth: '178px',
    imageHeight: '267px',
    imageLeft: '0px',
    imageTop: '-26px',
    imageCropLeft: '-0.17%',
    imageCropTop: '-109.68%',
  },
  {
    imageSrc: DEFAULT_IMAGE,
    title: '개인화보',
    price: '₩55,000~',
    imageWidth: '179px',
    imageHeight: '268px',
    imageLeft: '0px',
    imageTop: '-26px',
    imageCropLeft: '0',
    imageCropTop: '-10.65%',
  },
]

const CardPortfolio = ({
  imageSrc = DEFAULT_IMAGE,
  title = '개인화보',
  price = '₩55,000~',
  imageWidth = '178px',
  imageHeight = '267px',
  imageLeft = '0px',
  imageTop = '-26px',
  imageCropLeft = '0',
  imageCropTop = '0',
}: CardPortfolioItem) => {
  return (
    <div className="relative flex w-[178px] shrink-0 flex-col items-start overflow-hidden rounded-[12px] border border-[rgba(238,238,238,0.6)] bg-[rgba(252,252,252,0.75)] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]">
      <div className="relative flex h-[124px] w-full shrink-0 items-center justify-center overflow-hidden bg-white">
        {imageSrc ? (
          <div
            className="absolute overflow-hidden"
            style={{
              height: imageHeight,
              left: imageLeft,
              top: imageTop,
              width: imageWidth,
            }}
          >
            <img
              alt={title}
              className="absolute h-[726.24%] w-full max-w-none object-fill"
              src={imageSrc}
              style={{
                left: imageCropLeft,
                top: imageCropTop,
              }}
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gray-10" />
        )}
      </div>

      <div className="flex w-full shrink-0 flex-col items-start gap-[4px] bg-[rgba(252,252,252,0.75)] px-[12px] py-[10px]">
        <p className="h-[20px] w-[154px] truncate text-[var(--font-b7-size)] font-[var(--font-b7-weight)] leading-[var(--font-b7-line-height)] tracking-[var(--font-b7-letter-spacing)] text-black">
          {title}
        </p>
        <p className="shrink-0 whitespace-nowrap pr-[4px] text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)] text-gray-80">
          {price}
        </p>
        <p className="shrink-0 whitespace-nowrap pr-[4px] text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)] text-brand-80">
          포트폴리오 보기
        </p>
      </div>
    </div>
  )
}

const CardPortfolioGrid = ({ className, items = DEFAULT_ITEMS }: Props) => {
  return (
    <div className={className || 'relative flex w-[402px] items-center justify-center gap-[8px] px-[20px]'}>
      {items.map((item, index) => (
        <CardPortfolio key={`${item.title ?? 'portfolio'}-${index}`} {...item} />
      ))}
    </div>
  )
}

export default CardPortfolioGrid
