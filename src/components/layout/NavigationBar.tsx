/**
 * NavigationBar 사용법
 *
 * [Default] 제목 + 좌우 아이콘
 *   <NavigationBar title="예약 내역" onBack={handleBack} onClose={handleClose} />
 *
 * [chip] 중앙에 필터 칩 (프로필·홍대·6월25일)
 *   <NavigationBar variant="chip" chipLabel="프로필·홍대·6월25일" onBack={handleBack} onClose={handleClose} />
 *
 * [subtitle] 스튜디오 이름 + 날짜/인원 서브타이틀
 *   <NavigationBar variant="subtitle" title="스튜디오 이름" date="2026.06.18" count="인원 1" onBack={handleBack} onClose={handleClose} />
 */
import type { ReactNode } from 'react'
import { IcBack, IcClose, IcDown } from '@/components/icons'

interface Props {
  variant?: 'default' | 'chip' | 'subtitle'
  title?: string
  chipLabel?: string
  date?: string
  count?: string
  showLeft?: boolean
  showRight?: boolean
  leftNode?: ReactNode
  rightNode?: ReactNode
  onBack?: () => void
  onClose?: () => void
  onSubtitleClick?: () => void
}

const NavigationBar = ({
  variant = 'default',
  title,
  chipLabel,
  date,
  count,
  showLeft = true,
  showRight = true,
  leftNode,
  rightNode,
  onBack,
  onClose,
  onSubtitleClick,
}: Props) => (
  <div
    className={`flex items-center justify-between w-full px-5 border-b border-gray-10 ${
      variant === 'subtitle' ? 'h-[60px]' : 'py-3'
    }`}
  >
    <div className="w-8 h-8 flex items-center justify-center overflow-hidden shrink-0">
      {showLeft && (leftNode ?? <button className="border-none bg-transparent cursor-pointer p-0" onClick={onBack}><IcBack width={24} height={24} /></button>)}
    </div>

    <div className={`flex items-center justify-center ${variant === 'subtitle' ? 'flex-1 flex-col gap-1 min-w-0' : 'flex-1 min-w-0'}`}>
      {variant === 'default' && title && (
        <span className="text-[18px] font-semibold text-black whitespace-nowrap">{title}</span>
      )}
      {variant === 'chip' && chipLabel && (
        <span className="flex items-center justify-center h-8 px-4 rounded-[32px] backdrop-blur-[10px] bg-[rgba(252,252,252,0.75)] border border-[rgba(238,238,238,0.6)] shadow-[0px_15px_40px_0px_rgba(206,206,206,0.08)] text-[var(--font-b10-size)] font-[var(--font-b10-weight)] text-gray-60 tracking-[var(--font-b10-letter-spacing)] whitespace-nowrap">
          {chipLabel}
        </span>
      )}
      {variant === 'subtitle' && (
        <>
          <span className="text-[18px] font-semibold text-black whitespace-nowrap">{title}</span>
          <button type="button" className="flex items-center gap-1 border-none bg-transparent p-0" onClick={onSubtitleClick}>
            <span className="text-[11px] font-normal text-gray-60 tracking-[-0.22px] whitespace-nowrap">{date}</span>
            <span className="text-[11px] font-normal text-gray-60 tracking-[-0.22px] whitespace-nowrap">{count}</span>
            <IcDown width={20} height={20} className="text-gray-60" />
          </button>
        </>
      )}
    </div>

    <div className="min-w-9 h-9 flex items-center justify-center shrink-0">
      {showRight && (rightNode ?? <button className="border-none bg-transparent cursor-pointer p-0" onClick={onClose}><IcClose width={24} height={24} /></button>)}
    </div>
  </div>
)

export default NavigationBar
