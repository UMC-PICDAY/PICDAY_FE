/**
 * Tap 사용법
 *
 * TabBarUser / TabBarGuest 내부에서만 사용하는 탭 아이템
 *   <Tap icon={IcSearch} label="검색" active={true} onClick={handleClick} />
 */
import type { FC, SVGProps } from 'react'

interface Props {
  icon: FC<SVGProps<SVGSVGElement>>
  label: string
  active?: boolean
  onClick?: () => void
}

const Tap = ({ icon: Icon, label, active = false, onClick }: Props) => (
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
