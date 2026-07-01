import { IcAdd } from '../icons'
import styles from './AddButton.module.css'

type AddButtonProps = {
  label?: string
  subLabel?: string
  onClick?: () => void
}

const AddButton = ({
  label = '사진관 추가',
  subLabel = '최대 3개까지 비교 가능해요',
  onClick,
}: AddButtonProps) => {
  return (
    <button className={styles.button} onClick={onClick}>
      <div className={styles.main}>
        <IcAdd width={20} height={20} />
        <span className={styles.label}>{label}</span>
      </div>
      <span className={styles.subLabel}>{subLabel}</span>
    </button>
  )
}

export default AddButton
