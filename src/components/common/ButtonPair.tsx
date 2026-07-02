/**
 * ButtonPair 사용법
 *
 * 좌우 버튼이 반반 나눠지는 구조 (좌: 회색, 우: 핑크)
 *   <ButtonPair leftLabel="취소" rightLabel="확인" />
 *   <ButtonPair leftLabel="닫기" rightLabel="예약하기" onLeftClick={handleClose} onRightClick={handleReserve} />
 */
interface Props {
  leftLabel: string
  rightLabel: string
  onLeftClick?: () => void
  onRightClick?: () => void
}

const ButtonPair = ({ leftLabel, rightLabel, onLeftClick, onRightClick }: Props) => (
  <div className="flex gap-2 items-center w-full">
    <button
      className="flex-1 h-10 rounded-[12px] bg-white border border-gray-20 text-gray-60 text-[var(--font-b8-size)] font-[var(--font-b8-weight)] leading-[var(--font-b8-line-height)] cursor-pointer whitespace-nowrap"
      onClick={onLeftClick}
    >
      {leftLabel}
    </button>
    <button
      className="flex-1 h-10 rounded-[12px] bg-brand-100 border-none text-white text-[var(--font-b8-size)] font-[var(--font-b7-weight)] leading-[var(--font-b8-line-height)] cursor-pointer whitespace-nowrap"
      onClick={onRightClick}
    >
      {rightLabel}
    </button>
  </div>
)

export default ButtonPair
