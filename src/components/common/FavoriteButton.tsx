import { IcFavorite, IcFavoriteFill } from '../icons'
import styles from './FavoriteButton.module.css'

type FavoriteButtonProps = {
  active?: boolean
  onClick?: () => void
}

const FavoriteButton = ({ active = false, onClick }: FavoriteButtonProps) => {
  return (
    <button
      className={`${styles.button} ${active ? styles.active : styles.default}`}
      onClick={onClick}
      aria-label={active ? '찜 해제' : '찜하기'}
    >
      {active ? (
        <IcFavoriteFill width={24} height={24} />
      ) : (
        <IcFavorite width={24} height={24} />
      )}
    </button>
  )
}

export default FavoriteButton
