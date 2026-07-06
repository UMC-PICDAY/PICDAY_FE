/**
 * ButtonSelect 사용법
 *
 * studios 2개 → 칩 너비 174px / 3개 → 114px 자동 적용
 *
 * const [studios, setStudios] = useState([
 *   { id: '1', name: '데이지 스튜디오', selected: true },
 *   { id: '2', name: '타임온미', selected: false },
 * ])
 *
 * <ButtonSelect
 *   studios={studios}
 *   onSelect={(id) => setStudios(prev => prev.map(s => ({ ...s, selected: s.id === id })))}
 *   onReserve={handleReserve}
 * />
 */
interface StudioItem {
  id: string
  name: string
  selected: boolean
}

interface Props {
  studios: StudioItem[]
  onSelect?: (id: string) => void
  onReserve?: () => void
}

const ButtonSelect = ({ studios, onSelect, onReserve }: Props) => {
  const isThree = studios.length >= 3
  const chipWidth = isThree ? 'w-[114px]' : 'w-[174px]'
  const chipGap = isThree ? 'gap-[10px]' : 'gap-2'

  return (
    <div className="flex flex-col w-full border-t border-gray-10 pt-3">
      <div className={`flex ${chipGap} justify-center px-5`}>
        {studios.map((studio) => (
          <span
            key={studio.id}
            onClick={() => onSelect?.(studio.id)}
            className={`flex items-center justify-center h-[42px] ${chipWidth} rounded-[12px] whitespace-nowrap cursor-pointer ${
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
          className="w-full py-3 px-5 rounded-[12px] border-none bg-brand-100 text-white text-[var(--font-b3-size)] font-[var(--font-b3-weight)] leading-[var(--font-b3-line-height)] cursor-pointer"
          onClick={onReserve}
        >
          예약하기
        </button>
      </div>
    </div>
  )
}

export default ButtonSelect
