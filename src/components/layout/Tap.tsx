import type { FC, SVGProps } from 'react'

type TapProps = {
  icon: FC<SVGProps<SVGSVGElement>>
  label: string
  active?: boolean
  onClick?: () => void
}

const Tap = ({ icon: Icon, label, active = false, onClick }: TapProps) => (
  <button
    className={`flex flex-col items-center justify-center gap-1 w-[68px] h-12 bg-transparent border-none cursor-pointer ${active ? 'text-brand-100' : 'text-gray-60'}`}
    onClick={onClick}
  >
    <Icon width={24} height={24} />
    <span className="text-[var(--font-b10-size)] font-[var(--font-b10-weight)] leading-[var(--font-b10-line-height)] tracking-[var(--font-b10-letter-spacing)] whitespace-nowrap">
      {label}
    </span>
  </button>
)

export default Tap
