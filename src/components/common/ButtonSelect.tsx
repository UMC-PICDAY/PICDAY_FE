type StudioItem = {
  id: string
  name: string
  selected: boolean
}

type ButtonSelectProps = {
  studios: StudioItem[]
  onReserve?: () => void
}

const ButtonSelect = ({ studios, onReserve }: ButtonSelectProps) => (
  <div className="flex flex-col w-full border-t border-gray-10 pt-3">
    <div className="flex gap-2 justify-center px-5">
      {studios.map((studio) => (
        <span
          key={studio.id}
          className={`flex items-center justify-center h-[42px] w-[174px] px-5 rounded-lg whitespace-nowrap ${
            studio.selected
              ? 'border border-brand-60 bg-[rgba(254,228,235,0.3)] text-[var(--font-b7-size)] font-[var(--font-b7-weight)] text-brand-80'
              : 'border border-gray-20 bg-white text-[var(--font-b8-size)] font-[var(--font-b8-weight)] text-gray-40'
          }`}
        >
          {studio.name}
        </span>
      ))}
    </div>
    <div className="pt-[10px] px-5 pb-5">
      <button
        className="w-full py-3 px-5 rounded-xl border-none bg-brand-100 text-white text-[var(--font-b3-size)] font-[var(--font-b3-weight)] leading-[var(--font-b3-line-height)] cursor-pointer"
        onClick={onReserve}
      >
        예약하기
      </button>
    </div>
  </div>
)

export default ButtonSelect
