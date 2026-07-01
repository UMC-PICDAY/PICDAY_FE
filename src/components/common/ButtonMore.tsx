import { IcRight, IcDown } from '../icons'

type ButtonMoreProps = {
  label?: string
  variant?: 'right' | 'down'
  onClick?: () => void
}

const ButtonMore = ({ label = '모든 컨셉 보기', variant = 'right', onClick }: ButtonMoreProps) => (
  <button
    className="flex items-center justify-between w-full py-3 px-5 border border-brand-100 rounded-lg bg-white cursor-pointer text-brand-100"
    onClick={onClick}
  >
    <span className="w-6 h-6 shrink-0 invisible" aria-hidden />
    <span className="text-[var(--font-b3-size)] font-[var(--font-b3-weight)] leading-[var(--font-b3-line-height)] text-brand-100">
      {label}
    </span>
    {variant === 'right' ? <IcRight width={24} height={24} /> : <IcDown width={24} height={24} />}
  </button>
)

export default ButtonMore
