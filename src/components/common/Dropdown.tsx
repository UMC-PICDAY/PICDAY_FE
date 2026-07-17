/**
 * Dropdown 사용법
 *
 * 정렬 기준처럼 하나의 값을 선택하는 옵션 목록
 *   <Dropdown value={sortValue} onChange={setSortValue} />
 *
 * [옵션 지정] 커스텀 옵션 전달
 *   <Dropdown options={SORT_OPTIONS} value={value} onChange={setValue} />
 */

import { IcCheck } from '@/components/icons'

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  options?: readonly DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  className?: string
}

const DEFAULT_OPTIONS: readonly DropdownOption[] = [
  { value: 'recommended', label: '추천순' },
  { value: 'latest', label: '최신순' },
  { value: 'rating-high', label: '평점 높은순' },
  { value: 'rating-low', label: '평점 낮은 순' },
]

const Dropdown = ({
  options = DEFAULT_OPTIONS,
  value = 'recommended',
  onChange,
  className = '',
}: DropdownProps) => (
  <div
    role="listbox"
    aria-label="정렬 기준"
    className={`flex w-[150px] flex-col items-start rounded-xl bg-white px-2.5 py-[5px] shadow-[0px_0px_5px_rgba(0,0,0,0.1)] ${className}`}
  >
    {options.map((option, index) => {
      const selected = option.value === value
      const hasDivider = index < options.length - 1

      return (
        <button
          key={option.value}
          type="button"
          role="option"
          aria-selected={selected}
          onClick={() => onChange?.(option.value)}
          className={`flex w-full items-start justify-between px-2.5 py-2 text-left ${
            hasDivider ? 'border-b border-gray-10' : ''
          } ${selected ? 'font-b7 text-brand-100' : 'font-b8 text-gray-80'}`}
        >
          <span>{option.label}</span>
          {selected && (
            <IcCheck
              width={20}
              height={20}
              className="shrink-0"
              aria-hidden="true"
            />
          )}
        </button>
      )
    })}
  </div>
)

export default Dropdown
