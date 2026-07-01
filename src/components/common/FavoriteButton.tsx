import { IcFavorite, IcFavoriteFill } from '../icons'
import styles from './FavoriteButton.module.css'

type FavoriteButtonProps = {
  active?: boolean
  onClick?: () => void
}

const FavoriteButton = ({ active = false, onClick }: FavoriteButtonProps) => (
  <button
    className={`${styles.button} ${active ? styles.active : ''}`}
    onClick={onClick}
    aria-label={active ? '찜 해제' : '찜하기'}
  >
    {active
      ? <IcFavoriteFill width={28} height={28} />
      : <IcFavorite width={28} height={28} />
    }
  </button>
)

export default FavoriteButton
