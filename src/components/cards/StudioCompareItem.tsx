/**
 * StudioCompareItem 사용법
 *
 * 기본 비교 정보
 *   <StudioCompareItem />
 *
 * 가격 및 정보 변경
 *   <StudioCompareItem
 *     price="₩55,000"
 *     description="보정 3장 · 의상 2벌"
 *     badgeLabel="원본 제공"
 *   />
 *
 * 작은 사이즈 사용
 *   <StudioCompareItem
 *     size="compact"
 *   />
 */

interface Props {
  className?: string
  size?: 'default' | 'compact'
  price?: string
  description?: string
  badgeLabel?: string
}

const StudioCompareItem = ({
  className,
  size = 'default',
  price = '₩30,000',
  description = '보정 2장 · 의상 포함',
  badgeLabel = '추가금 없음',
}: Props) => {
  const isCompact = size === 'compact'

  return (
    <div
      className={
        className ||
        `content-stretch relative flex flex-col items-start gap-[4px] ${
          isCompact ? 'w-[114px]' : 'w-[173px]'
        }`
      }
    >
      <p
        className={
          isCompact
            ? 'relative shrink-0 whitespace-nowrap text-[var(--font-b5-size)] font-[var(--font-b5-weight)] leading-[var(--font-b5-line-height)] tracking-[var(--font-b5-letter-spacing)] text-black'
            : 'relative shrink-0 whitespace-nowrap text-[var(--font-b3-size)] font-[var(--font-b3-weight)] leading-[var(--font-b3-line-height)] tracking-[var(--font-b3-letter-spacing)] text-black'
        }
      >
        {price}
      </p>
      <p className="relative min-w-full shrink-0 whitespace-nowrap text-[var(--font-b10-size)] font-[var(--font-b10-weight)] leading-[var(--font-cap3-line-height)] tracking-normal text-gray-60">
        {description}
      </p>
      <div className="bg-brand-20 border border-gray-10 content-stretch flex h-[22px] shrink-0 items-center justify-center rounded-[100px] px-[6px] py-[2px]">
        <p className="relative shrink-0 whitespace-nowrap text-[var(--font-b10-size)] font-[var(--font-b10-weight)] leading-[var(--font-cap3-line-height)] tracking-normal text-gray-60">
          {badgeLabel}
        </p>
      </div>
    </div>
  )
}

export default StudioCompareItem
