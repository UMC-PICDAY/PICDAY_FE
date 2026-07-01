type ButtonLargeProps = {
  variant?: 'pair' | 'price'
  primaryLabel?: string
  secondaryLabel?: string
  price?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}

const btn = 'flex items-center justify-center py-3 px-5 rounded-lg border-none cursor-pointer text-[var(--font-b3-size)] font-[var(--font-b3-weight)] leading-[var(--font-b3-line-height)] whitespace-nowrap'

const ButtonLarge = ({
  variant = 'pair',
  primaryLabel = '예약하기',
  secondaryLabel = '문의',
  price,
  onPrimaryClick,
  onSecondaryClick,
}: ButtonLargeProps) => (
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
        <button className={`${btn} bg-gray-10 text-gray-80 w-[72px] shrink-0`} onClick={onSecondaryClick}>
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
