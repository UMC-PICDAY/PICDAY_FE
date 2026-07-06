/**
 * FavoriteButton 사용법
 *
 * 기본 (회색 빈 하트)
 *   <FavoriteButton onClick={handleClick} />
 *
 * 찜 활성화 (핑크 채워진 하트)
 *   <FavoriteButton active={true} onClick={handleClick} />
 *
 * 상태 관리 예시
 *   const [isFavorited, setIsFavorited] = useState(false)
 *   <FavoriteButton active={isFavorited} onClick={() => setIsFavorited(prev => !prev)} />
 */
import { IcFavorite, IcFavoriteFill } from '@/components/icons'

interface Props {
  active?: boolean
  onClick?: () => void
}

const FavoriteButton = ({ active = false, onClick }: Props) => (
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
