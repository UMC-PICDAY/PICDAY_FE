/**
 * CompareActionBar 사용법
 *
 * 선택된 스튜디오 전달
 *   <CompareActionBar
 *     selected={[{ studioId: 1, studioName: '데이지' }]}
 *   />
 *
 * 슬롯 삭제 이벤트
 *   <CompareActionBar
 *     selected={selected}
 *     onRemove={handleRemove}
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
import type { CompareStudio } from '@/types/studio'

interface Props {
  className?: string
  selected?: CompareStudio[]
  maxSlots?: number
  buttonLabel?: string
  disabled?: boolean
  onCompare?: () => void
  onRemove?: (studioId: number) => void
}

const CompareActionBar = ({
  className,
  selected = [],
  maxSlots = 3,
  buttonLabel = '비교하기',
  disabled = false,
  onCompare,
  onRemove,
}: Props) => {
  const addSlotCount = Math.max(maxSlots - selected.length, 0)

  return (
    <div className={className || 'content-stretch flex w-[362px] flex-col items-start relative'}>
      <div className="backdrop-blur-[10px] bg-[rgba(252,252,252,0.9)] border border-[rgba(238,238,238,0.6)] border-solid content-stretch flex w-full items-center justify-between rounded-tl-[16px] rounded-tr-[16px] px-[20px] py-[16px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)]">
        <div className="content-stretch flex shrink-0 items-center gap-[5px]">
          {selected.map((studio) => (
            <ButtonCompareSlot
              key={studio.studioId}
              state="selected"
              label={studio.studioName}
              onDelete={onRemove ? () => onRemove(studio.studioId) : undefined}
            />
          ))}
          {Array.from({ length: addSlotCount }).map((_, index) => (
            <ButtonCompareSlot key={`add-${index}`} state="add" />
          ))}
        </div>
        <button
          type="button"
          disabled={disabled}
          className="content-stretch flex h-[48px] shrink-0 items-center justify-center rounded-[8px] bg-brand-100 px-[32px] py-[12px] disabled:opacity-40"
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
