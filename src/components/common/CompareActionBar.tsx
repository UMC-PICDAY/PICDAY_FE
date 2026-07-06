/**
 * CompareActionBar 사용법
 *
 * 기본 비교 바
 *   <CompareActionBar />
 *
 * 선택된 스튜디오 전달
 *   <CompareActionBar
 *     selectedLabels={['데이지', '타임']}
 *   />
 *
 * 최대 슬롯 개수 변경
 *   <CompareActionBar
 *     maxSlots={4}
 *   />
 *
 * 비교하기 버튼 이벤트
 *   <CompareActionBar
 *     onCompare={handleCompare}
 *   />
 */

import ButtonCompareSlot from '@/components/common/ButtonCompareSlot'

interface Props {
  className?: string
  selectedLabels?: string[]
  maxSlots?: number
  buttonLabel?: string
  onCompare?: () => void
}

const DEFAULT_SELECTED_LABELS = ['데이지', '타임', '타임']

const CompareActionBar = ({
  className,
  selectedLabels = DEFAULT_SELECTED_LABELS,
  maxSlots = 3,
  buttonLabel = '비교하기',
  onCompare,
}: Props) => {
  const addSlotCount = Math.max(maxSlots - selectedLabels.length, 0)

  return (
    <div className={className || 'content-stretch flex w-[362px] flex-col items-start relative'}>
      <div className="backdrop-blur-[10px] bg-[rgba(252,252,252,0.9)] border border-[rgba(238,238,238,0.6)] border-solid content-stretch flex w-full items-center justify-between rounded-tl-[16px] rounded-tr-[16px] px-[20px] py-[16px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)]">
        <div className="content-stretch flex shrink-0 items-center gap-[5px]">
          {selectedLabels.map((label, index) => (
            <ButtonCompareSlot key={`${label}-${index}`} state="selected" label={label} />
          ))}
          {Array.from({ length: addSlotCount }).map((_, index) => (
            <ButtonCompareSlot key={`add-${index}`} state="add" />
          ))}
        </div>
        <button
          type="button"
          className="content-stretch flex h-[48px] shrink-0 items-center justify-center rounded-[8px] bg-brand-100 px-[32px] py-[12px]"
          onClick={onCompare}
        >
          <span className="whitespace-nowrap text-[var(--font-b5-size)] font-[var(--font-b5-weight)] leading-[var(--font-b5-line-height)] tracking-[var(--font-b5-letter-spacing)] text-white">
            {buttonLabel}
          </span>
        </button>
      </div>
    </div>
  )
}

export default CompareActionBar
