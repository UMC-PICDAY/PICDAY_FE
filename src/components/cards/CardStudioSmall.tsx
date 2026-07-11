interface CardStudioSmallProps {
  className?: string
  imageSrc?: string | null
  name?: string
  location?: string
  category?: string
  secondaryCategory?: string
  price?: string
  rating?: string
}

const CardStudioSmall = ({
  className = '',
  imageSrc = null,
  name = '데이지 스튜디오',
  location = '홍대',
  category = '프로필',
  secondaryCategory,
  price = '₩55,000~',
  rating = '★4.9',
}: CardStudioSmallProps) => (
  <div
    className={`flex w-36 shrink-0 flex-col overflow-hidden rounded-xl border border-gray-10/60 shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] ${className}`}
  >
    <div className="h-[180px] w-full bg-gray-10">
      {imageSrc && (
        <img src={imageSrc} alt={name} className="size-full object-cover" />
      )}
    </div>
    <div className="flex w-full flex-col gap-1 bg-white/75 px-3 py-2.5">
      <p className="font-b7 text-black">{name}</p>
      <div className="flex items-center gap-1 font-cap3 text-gray-40">
        <span>{location}</span>
        <span>|</span>
        <span>{category}</span>
        {secondaryCategory && (
          <>
            <span>·</span>
            <span>{secondaryCategory}</span>
          </>
        )}
      </div>
      <div className="flex gap-1 font-cap3 text-gray-80">
        <span>{price}</span>
        <span>{rating}</span>
      </div>
    </div>
  </div>
)

export default CardStudioSmall
