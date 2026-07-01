import styles from './ButtonSelect.module.css'

type StudioItem = {
  id: string
  name: string
  selected: boolean
}

type ButtonSelectProps = {
  studios: StudioItem[]
  onReserve?: () => void
}

const ButtonSelect = ({ studios, onReserve }: ButtonSelectProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.chips}>
        {studios.map((studio) => (
          <span
            key={studio.id}
            className={studio.selected ? styles.chipSelected : styles.chipDefault}
          >
            {studio.name}
          </span>
        ))}
      </div>
      <div className={styles.reserveWrapper}>
        <button className={styles.reserveBtn} onClick={onReserve}>
          예약하기
        </button>
      </div>
    </div>
  )
}

export default ButtonSelect
