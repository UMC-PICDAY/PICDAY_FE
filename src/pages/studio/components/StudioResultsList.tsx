import CardStudioPreview from '@/components/cards/CardStudioPreview'

const STUDIOS = [
  '데이지스튜디오',
  '타임스튜디오',
  '보노스튜디오',
  '레이스튜디오',
  '무드스튜디오',
]

interface StudioResultsListProps {
  showCompareButton?: boolean
  onSelect?: (id: number) => void
}

/**
 * C-1(half)과 C-3(expanded)이 공유하는 단일 결과 목록.
 * 스냅 전환 시 카드 key/데이터 참조를 유지하고 비교 액션 노출만 바꾼다.
 */
const StudioResultsList = ({
  showCompareButton = false,
  onSelect,
}: StudioResultsListProps) => (
  <div className="flex w-full flex-col gap-5 pb-14">
    {STUDIOS.map((name, index) => (
      <CardStudioPreview
        key={name}
        name={name}
        category=""
        secondaryCategory=""
        showCompareButton={showCompareButton}
        onClick={() => onSelect?.(index + 1)}
        className="relative w-full rounded-[20px] border border-[rgba(254,228,235,0.4)] bg-white/75 p-[10px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]"
      />
    ))}
  </div>
)

export default StudioResultsList
