import { IcStar } from '@/components/icons'

import ButtonDelete from '@/components/common/ButtonDelete'

const DEFAULT_IMAGE = 'https://www.figma.com/api/mcp/asset/1b424195-e27c-499f-9868-11720dde0dda'

type CardStudioCompareSize = 'default' | 'compact'

interface Props {
  className?: string
  size?: CardStudioCompareSize
  imageSrc?: string | null
  name?: string
  rating?: number
  reviewCount?: number
  onDelete?: () => void
}

const CardStudioCompare = ({
  className,
  size = 'compact',
  imageSrc = DEFAULT_IMAGE,
  name = '데이지 스튜디오',
  rating = 4.9,
  reviewCount = 128,
  onDelete,
}: Props) => {
  const isCompact = size === 'compact'

  return (
    <div
      className={
        className ||
        `relative flex flex-col items-start overflow-hidden rounded-[12px] border-[0.659px] border-[rgba(238,238,238,0.6)] ${
          isCompact
            ? 'w-[114px] shadow-[0px_9.884px_31.63px_0px_rgba(252,200,215,0.1)] backdrop-blur-[6.59px]'
            : 'w-[173px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]'
        }`
      }
    >
      <div
        className={
          isCompact
            ? 'relative h-[114px] w-full shrink-0 overflow-hidden bg-white'
            : 'relative h-[173px] w-full shrink-0 overflow-hidden bg-white'
        }
      >
        {imageSrc ? (
          <div
            className={
              isCompact
                ? 'absolute left-0 top-[-17.13px] h-[197.096px] w-[131.747px] overflow-hidden'
                : 'absolute left-0 top-[-26px] h-[299px] w-[200px] overflow-hidden'
            }
          >
            <img
              alt={name}
              className="absolute left-[0.19%] top-[-363.2%] h-[726.24%] w-full max-w-none object-fill"
              src={imageSrc}
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-10" />
        )}

        <div className={`absolute ${isCompact ? 'left-[93px] top-[7px]' : 'left-[143px] top-[10px]'}`}>
          <ButtonDelete size={isCompact ? 'mini' : 'default'} onClick={onDelete} />
        </div>
      </div>

      <div
        className={
          isCompact
            ? 'relative flex w-full shrink-0 flex-col items-start bg-[rgba(252,252,252,0.75)] px-[8px] py-[6px]'
            : 'relative flex w-full shrink-0 flex-col items-start bg-[rgba(252,252,252,0.75)] px-[12px] py-[10px]'
        }
      >
        <p
          className={
            isCompact
              ? 'w-[98.185px] shrink-0 truncate text-[var(--font-b9-size)] font-[var(--font-b9-weight)] leading-[var(--font-b9-line-height)] tracking-[var(--font-b9-letter-spacing)] text-black'
              : 'w-[149px] shrink-0 truncate text-[var(--font-b7-size)] font-[var(--font-b7-weight)] leading-[var(--font-b7-line-height)] tracking-[var(--font-b7-letter-spacing)] text-black'
          }
        >
          {name}
        </p>

        <div className={`flex shrink-0 items-center ${isCompact ? 'gap-[1.318px]' : 'gap-[2px]'}`}>
          <IcStar
            className="shrink-0 text-gray-40"
            width={isCompact ? 12 : 14}
            height={isCompact ? 12 : 14}
          />
          <p
            className={
              isCompact
                ? 'shrink-0 whitespace-nowrap text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)] text-gray-40'
                : 'shrink-0 whitespace-nowrap text-[var(--font-cap1-size)] font-[var(--font-cap1-weight)] leading-[var(--font-cap1-line-height)] tracking-[var(--font-cap1-letter-spacing)] text-gray-40'
            }
          >
            {rating}
          </p>
          <p
            className={
              isCompact
                ? 'shrink-0 whitespace-nowrap text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)] text-gray-40'
                : 'shrink-0 whitespace-nowrap text-[var(--font-cap1-size)] font-[var(--font-cap1-weight)] leading-[var(--font-cap1-line-height)] tracking-[var(--font-cap1-letter-spacing)] text-gray-40'
            }
          >
            ({reviewCount}개)
          </p>
        </div>
      </div>
    </div>
  )
}

export default CardStudioCompare
