/**
 * CardStudioLarge 사용법
 *
 * 기본 스튜디오 카드 목록
 *   <CardStudioLarge />
 *
 * 카드 데이터 전달
 *   <CardStudioLarge items={studioItems} />
 *
 * 가운데 카드 강조
 *   <CardStudioLarge
 *     items={[
 *       {
 *         variant: 'center',
 *       },
 *     ]}
 *   />
 *
 * 삭제 버튼 표시
 *   <CardStudioLarge
 *     items={[
 *       {
 *         onDelete: handleDelete,
 *       },
 *     ]}
 *   />
 */

import ButtonDelete from '@/components/common/ButtonDelete'
import defaultImage from '@/assets/images/CardImage1.png'

const DEFAULT_IMAGE = defaultImage

type LargeCardVariant = 'default' | 'center'

interface LargeCardItem {
  className?: string
  variant?: LargeCardVariant
  imageSrc?: string | null
  name?: string
  location?: string
  category?: string
  countCurrent?: string
  countTotal?: string
  countText?: string
  onDelete?: () => void
}

interface Props {
  className?: string
  items?: LargeCardItem[]
}

const DEFAULT_ITEMS: LargeCardItem[] = [
  {
    variant: 'default',
    imageSrc: DEFAULT_IMAGE,
    name: '데이지 스튜디오',
    location: '홍대',
    category: '프로필',
    countCurrent: '01',
    countTotal: '10',
  },
  {
    variant: 'center',
    imageSrc: DEFAULT_IMAGE,
    name: '데이지 스튜디오',
    location: '홍대',
    category: '프로필',
    countCurrent: '01',
    countTotal: '10',
  },
  {
    variant: 'default',
    imageSrc: DEFAULT_IMAGE,
    name: '데이지 스튜디오',
    location: '홍대',
    category: '프로필',
    countCurrent: '01',
    countTotal: '10',
  },
]

const splitCountText = (countText?: string) => {
  if (!countText) return null

  const [current, total] = countText.split('|').map((part) => part.trim())

  if (!current || !total) return null

  return { current, total }
}

const LargeCard = ({
  className,
  variant = 'default',
  imageSrc = DEFAULT_IMAGE,
  name = '데이지 스튜디오',
  location = '홍대',
  category = '프로필',
  countCurrent,
  countTotal,
  countText,
  onDelete,
}: LargeCardItem) => {
  const parsedCount = splitCountText(countText)
  const current = countCurrent ?? parsedCount?.current ?? '01'
  const total = countTotal ?? parsedCount?.total ?? '10'
  const isCenter = variant === 'center'

  return (
    <div
      className={
        className ||
        `relative flex shrink-0 flex-col items-start overflow-hidden rounded-[20px] border border-solid border-[rgba(238,238,238,0.6)] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px] ${
          isCenter ? 'h-[315px] w-[280px]' : 'h-[292px] w-[260px]'
        }`
      }
    >
      <div className="relative w-full min-h-px flex-[1_0_0] overflow-hidden bg-white">
        {imageSrc ? (
          <img alt={name} className="h-full w-full object-cover" src={imageSrc} />
        ) : (
          <div className="absolute inset-0 bg-gray-10" />
        )}

        {onDelete && (
          <div className="absolute right-[10px] top-[10px]">
            <ButtonDelete size="default" onClick={onDelete} />
          </div>
        )}

        <div
          className={`absolute bottom-[0.5px] left-1/2 flex -translate-x-1/2 flex-col items-center justify-end overflow-hidden bg-gradient-to-b from-[rgba(255,255,255,0)] from-[0.159%] to-[rgba(74,72,72,0.2)] to-[64.896%] px-[12px] pt-[20px] pb-[16px] ${
            isCenter ? 'h-[315px] w-[280px]' : 'h-[292px] w-[260px]'
          }`}
        >
          <div className="relative flex w-full shrink-0 items-center justify-center">
            <p className="min-w-0 flex-[1_0_0] break-words text-center font-h2 text-white">{name}</p>
          </div>

          <div className="relative flex shrink-0 items-start pb-[4px] font-b6 text-white">
            <p className="shrink-0 whitespace-nowrap pr-[4px]">{location}</p>
            <p className="shrink-0 whitespace-nowrap pr-[4px]">|</p>
            <p className="shrink-0 whitespace-nowrap pr-[4px]">{category}</p>
          </div>

          <div className="relative flex shrink-0 items-start pb-[4px] text-[12px] font-[400] leading-[1.3] text-white">
            <p className="shrink-0 whitespace-nowrap pr-[4px]">{current}</p>
            <p className="shrink-0 whitespace-nowrap pr-[4px]">|</p>
            <p className="shrink-0 whitespace-nowrap">{total}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const CardStudioLarge = ({ className, items = DEFAULT_ITEMS }: Props) => {
  return (
    <div className={className || 'relative flex w-[840px] items-center justify-center gap-[20px]'}>
      {items.map((item, index) => (
        <LargeCard key={`${item.name ?? 'studio'}-${index}`} {...item} />
      ))}
    </div>
  )
}

export default CardStudioLarge