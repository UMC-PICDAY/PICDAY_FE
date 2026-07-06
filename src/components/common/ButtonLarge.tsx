/**
 * ButtonLarge 사용법
 *
 * [pair] 좌: 보조버튼 / 우: 주버튼 (secondaryWidth로 좌측 너비 조절)
 *   <ButtonLarge variant="pair" secondaryLabel="문의" primaryLabel="예약하기" secondaryWidth={72} />
 *   <ButtonLarge variant="pair" secondaryLabel="문의" primaryLabel="예약하기" secondaryWidth={100} />
 *
 * [price] 좌: 가격 텍스트 / 우: 버튼
 *   <ButtonLarge variant="price" price="₩70,000" primaryLabel="예약하기" />
 *   <ButtonLarge variant="price" price="₩70,000" primaryLabel="문의" />
 */
interface Props {
  variant?: 'pair' | 'price'
  primaryLabel?: string
  secondaryLabel?: string
  secondaryWidth?: number
  price?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}

const btn = 'flex items-center justify-center py-3 px-5 rounded-[12px] border-none cursor-pointer text-[var(--font-b3-size)] font-[var(--font-b3-weight)] leading-[var(--font-b3-line-height)] whitespace-nowrap'

const ButtonLarge = ({
  variant = 'pair',
  primaryLabel = '예약하기',
  secondaryLabel = '문의',
  secondaryWidth = 72,
  price,
  onPrimaryClick,
  onSecondaryClick,
}: Props) => (
  <div className="flex gap-5 items-center w-full p-5">
    {variant === 'price' && price ? (
      <>
        <span className="flex-1 text-[var(--font-b3-size)] font-[var(--font-b3-weight)] text-[#3d1a24] whitespace-nowrap">
          {price}
        </span>
        <button className={`${btn} bg-brand-100 text-white`} onClick={onPrimaryClick}>
          {primaryLabel}
        </button>
      </>
    ) : (
      <>
        <button
          className={`${btn} bg-gray-10 text-gray-80 shrink-0`}
          style={{ width: secondaryWidth }}
          onClick={onSecondaryClick}
        >
          {secondaryLabel}
        </button>
        <button className={`${btn} bg-brand-100 text-white flex-1`} onClick={onPrimaryClick}>
          {primaryLabel}
        </button>
      </>
    )}
  </div>
)

export default ButtonLarge
