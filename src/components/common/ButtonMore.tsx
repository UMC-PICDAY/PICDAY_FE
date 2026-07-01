import { IcRight, IcDown } from '../icons'
import styles from './ButtonMore.module.css'

type ButtonMoreProps = {
  label?: string
  variant?: 'right' | 'down'
  onClick?: () => void
}

const ButtonMore = ({ label = '모든 컨셉 보기', variant = 'right', onClick }: ButtonMoreProps) => {
  return (
    <button className={styles.button} onClick={onClick}>
      <span className={styles.spacer} aria-hidden />
      <span className={styles.label}>{label}</span>
      {variant === 'right' ? <IcRight width={24} height={24} /> : <IcDown width={24} height={24} />}
    </button>
  )
}

export default ButtonMore
