import { IcBack, IcShare, IcFavorite, IcFavoriteFill } from '../icons'

interface Props {
  isFavorited?: boolean
  onBack?: () => void
  onShare?: () => void
  onFavorite?: () => void
}

const iconBtn = 'flex items-center justify-center w-9 h-9 rounded-[100px] border-none bg-white backdrop-blur-[10px] shadow-[0px_15px_40px_rgba(206,206,206,0.08)] cursor-pointer shrink-0'

const NavigationBarTransparent = ({
  isFavorited = false,
  onBack,
  onShare,
  onFavorite,
}: Props) => (
  <div className="flex items-center justify-between w-full p-5">
    <button className={iconBtn} onClick={onBack} aria-label="뒤로가기">
      <IcBack width={24} height={24} />
    </button>
    <div className="flex items-center gap-2">
      <button className={iconBtn} onClick={onShare} aria-label="공유">
        <IcShare width={24} height={24} />
      </button>
      <button className={iconBtn} onClick={onFavorite} aria-label={isFavorited ? '찜 해제' : '찜하기'}>
        {isFavorited ? <IcFavoriteFill width={24} height={24} /> : <IcFavorite width={24} height={24} />}
      </button>
    </div>
  </div>
)

export default NavigationBarTransparent
