import type { FC, SVGProps } from 'react'
import styles from './Tap.module.css'

type TapProps = {
  icon: FC<SVGProps<SVGSVGElement>>
  label: string
  active?: boolean
  onClick?: () => void
}

const Tap = ({ icon: Icon, label, active = false, onClick }: TapProps) => (
  <button
    className={`${styles.tap}${active ? ` ${styles.active}` : ''}`}
    onClick={onClick}
  >
    <Icon width={24} height={24} />
    <span className={styles.label}>{label}</span>
  </button>
)

export default Tap
