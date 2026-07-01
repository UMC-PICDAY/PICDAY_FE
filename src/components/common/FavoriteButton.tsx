import { IcFavorite, IcFavoriteFill } from '../icons'

type FavoriteButtonProps = {
  active?: boolean
  onClick?: () => void
}

const FavoriteButton = ({ active = false, onClick }: FavoriteButtonProps) => (
  <button
    className={`flex items-center justify-center w-7 h-7 border-none bg-transparent cursor-pointer p-0 ${
      active ? 'text-brand-100' : 'text-gray-60'
    }`}
    onClick={onClick}
    aria-label={active ? '찜 해제' : '찜하기'}
  >
    {active ? <IcFavoriteFill width={28} height={28} /> : <IcFavorite width={28} height={28} />}
  </button>
)

export default FavoriteButton
