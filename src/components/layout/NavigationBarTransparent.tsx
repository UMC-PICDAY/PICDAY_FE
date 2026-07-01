import { IcBack, IcShare, IcFavorite, IcFavoriteFill } from '../icons'
import styles from './NavigationBarTransparent.module.css'

type NavigationBarTransparentProps = {
  isFavorited?: boolean
  onBack?: () => void
  onShare?: () => void
  onFavorite?: () => void
}

const NavigationBarTransparent = ({
  isFavorited = false,
  onBack,
  onShare,
  onFavorite,
}: NavigationBarTransparentProps) => (
  <div className={styles.wrapper}>
    <button className={styles.iconBtn} onClick={onBack} aria-label="뒤로가기">
      <IcBack width={24} height={24} />
    </button>
    <div className={styles.rightGroup}>
      <button className={styles.iconBtn} onClick={onShare} aria-label="공유">
        <IcShare width={24} height={24} />
      </button>
      <button className={styles.iconBtn} onClick={onFavorite} aria-label={isFavorited ? '찜 해제' : '찜하기'}>
        {isFavorited
          ? <IcFavoriteFill width={24} height={24} />
          : <IcFavorite width={24} height={24} />
        }
      </button>
    </div>
  </div>
)

export default NavigationBarTransparent
