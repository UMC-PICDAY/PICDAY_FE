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
import Button from '@/components/common/Button'

interface Props {
  variant?: 'pair' | 'price'
  primaryLabel?: string
  secondaryLabel?: string
  secondaryWidth?: number
  price?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}

const ButtonLarge = ({
  variant = 'pair',
  primaryLabel = '예약하기',
  secondaryLabel = '문의',
  secondaryWidth = 72,
  price,
  onPrimaryClick,
  onSecondaryClick,
}: Props) => (
  <div className="flex w-full items-center gap-5 p-5">
    {variant === 'price' && price ? (
      <>
        <span className="flex-1 whitespace-nowrap text-[var(--font-b3-size)] font-[var(--font-b3-weight)] text-[#3d1a24]">
          {price}
        </span>
        <Button variant="primary" fullWidth={false} onClick={onPrimaryClick}>
          {primaryLabel}
        </Button>
      </>
    ) : (
      <>
        <div className="shrink-0" style={{ width: secondaryWidth }}>
          <Button variant="secondary" onClick={onSecondaryClick}>
            {secondaryLabel}
          </Button>
        </div>
        <div className="flex-1">
          <Button variant="primary" onClick={onPrimaryClick}>
            {primaryLabel}
          </Button>
        </div>
      </>
    )}
  </div>
)

export default ButtonLarge
