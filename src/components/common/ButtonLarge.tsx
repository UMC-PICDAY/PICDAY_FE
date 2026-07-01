import styles from './ButtonLarge.module.css'

type ButtonLargeProps = {
  variant?: 'pair' | 'price'
  primaryLabel?: string
  secondaryLabel?: string
  price?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}

const ButtonLarge = ({
  variant = 'pair',
  primaryLabel = '예약하기',
  secondaryLabel = '문의',
  price,
  onPrimaryClick,
  onSecondaryClick,
}: ButtonLargeProps) => {
  return (
    <div className={styles.wrapper}>
      {variant === 'price' && price ? (
        <>
          <span className={styles.priceText}>{price}</span>
          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnPrimaryOnly}`} onClick={onPrimaryClick}>
            {primaryLabel}
          </button>
        </>
      ) : (
        <>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onSecondaryClick}>
            {secondaryLabel}
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onPrimaryClick}>
            {primaryLabel}
          </button>
        </>
      )}
    </div>
  )
}

export default ButtonLarge
