import type { ReactNode } from 'react'
import { IcBack, IcClose } from '../icons'
import styles from './NavigationBar.module.css'

type NavigationBarProps = {
  title?: string
  showLeft?: boolean
  showRight?: boolean
  leftNode?: ReactNode
  rightNode?: ReactNode
}

const NavigationBar = ({
  title,
  showLeft = true,
  showRight = true,
  leftNode,
  rightNode,
}: NavigationBarProps) => (
  <div className={styles.wrapper}>
    <div className={styles.left}>
      {showLeft && (leftNode ?? <IcBack width={24} height={24} />)}
    </div>
    <div className={styles.center}>
      {title && <span className={styles.title}>{title}</span>}
    </div>
    <div className={styles.right}>
      {showRight && (rightNode ?? <IcClose width={24} height={24} />)}
    </div>
  </div>
)

export default NavigationBar
