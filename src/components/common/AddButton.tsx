import { IcAdd } from '../icons'

type AddButtonProps = {
  label?: string
  subLabel?: string
  onClick?: () => void
}

const AddButton = ({
  label = '사진관 추가',
  subLabel = '최대 3개까지 비교 가능해요',
  onClick,
}: AddButtonProps) => (
  <button
    className="flex flex-col items-center justify-center gap-0.5 w-full py-3 px-5 rounded-lg border border-brand-20 bg-[rgba(254,228,235,0.3)] cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center gap-0.5 text-brand-100">
      <IcAdd width={20} height={20} />
      <span className="text-[var(--font-b5-size)] font-[var(--font-b5-weight)] leading-[var(--font-b5-line-height)] tracking-[var(--font-b5-letter-spacing)] text-brand-100">
        {label}
      </span>
    </div>
    <span className="text-[var(--font-b10-size)] font-[var(--font-b10-weight)] leading-[var(--font-b10-line-height)] tracking-[var(--font-b10-letter-spacing)] text-gray-40">
      {subLabel}
    </span>
  </button>
)

export default AddButton
