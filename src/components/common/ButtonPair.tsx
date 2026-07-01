import styles from './ButtonPair.module.css'

type ButtonPairProps = {
  leftLabel: string
  rightLabel: string
  onLeftClick?: () => void
  onRightClick?: () => void
}

const ButtonPair = ({ leftLabel, rightLabel, onLeftClick, onRightClick }: ButtonPairProps) => {
  return (
    <div className={styles.wrapper}>
      <button className={styles.leftBtn} onClick={onLeftClick}>
        {leftLabel}
      </button>
      <button className={styles.rightBtn} onClick={onRightClick}>
        {rightLabel}
      </button>
    </div>
  )
}

export default ButtonPair
