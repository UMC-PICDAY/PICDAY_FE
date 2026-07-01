type ButtonPairProps = {
  leftLabel: string
  rightLabel: string
  onLeftClick?: () => void
  onRightClick?: () => void
}

const ButtonPair = ({ leftLabel, rightLabel, onLeftClick, onRightClick }: ButtonPairProps) => (
  <div className="flex gap-2 items-center w-full">
    <button
      className="flex-1 h-10 rounded-lg bg-white border border-gray-20 text-gray-60 text-[var(--font-b8-size)] font-[var(--font-b8-weight)] leading-[var(--font-b8-line-height)] cursor-pointer whitespace-nowrap"
      onClick={onLeftClick}
    >
      {leftLabel}
    </button>
    <button
      className="flex-1 h-10 rounded-lg bg-brand-100 border-none text-white text-[var(--font-b8-size)] font-[var(--font-b7-weight)] leading-[var(--font-b8-line-height)] cursor-pointer whitespace-nowrap"
      onClick={onRightClick}
    >
      {rightLabel}
    </button>
  </div>
)

export default ButtonPair
