/**
 * ResetChip 사용법
 *
 * 기본 (필터 등 초기화용 작은 pill 버튼)
 *   <ResetChip onClick={handleReset} />
 *
 * 라벨 변경
 *   <ResetChip label="필터 초기화" onClick={handleReset} />
 */
import { IcReset } from '@/components/icons'

interface ResetChipProps {
  label?: string
  className?: string
  onClick?: () => void
}

const ResetChip = ({
  label = '초기화',
  className,
  onClick,
}: ResetChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={
      className ||
      'flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[32px] border border-[rgba(238,238,238,0.6)] bg-[rgba(252,252,252,0.75)] px-[10px] py-[5px] shadow-[0px_15px_40px_0px_rgba(206,206,206,0.08)] backdrop-blur-[10px]'
    }
  >
    <IcReset width={20} height={20} className="shrink-0 text-gray-40" />
    <span className="whitespace-nowrap font-b10 text-gray-60">{label}</span>
  </button>
)

export default ResetChip
