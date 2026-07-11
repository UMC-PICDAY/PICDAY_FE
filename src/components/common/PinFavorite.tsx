import pinFavorite from '@/assets/images/studio/pin-favorite.svg'

interface PinFavoriteProps {
  className?: string
}

const PinFavorite = ({ className = '' }: PinFavoriteProps) => (
  <div className={`relative size-[52px] ${className}`}>
    <img
      src={pinFavorite}
      alt=""
      className="absolute left-[10.5px] top-[11px] size-[30px]"
    />
  </div>
)

export default PinFavorite
