import { IcClose } from '../icons'
import styles from './ButtonDelete.module.css'

type ButtonDeleteProps = {
  size?: 'default' | 'mini'
  onClick?: () => void
}

const ButtonDelete = ({ size = 'default', onClick }: ButtonDeleteProps) => {
  const iconSize = size === 'mini' ? 14 : 20

  return (
    <button
      className={`${styles.button} ${size === 'mini' ? styles.mini : styles.default}`}
      onClick={onClick}
      aria-label="삭제"
    >
      <IcClose width={iconSize} height={iconSize} />
    </button>
  )
}

export default ButtonDelete
