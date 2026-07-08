/**
 * OptionListItem 사용법
 *
 * 예약 옵션 목록 아이템
 *   <OptionListItem />
 *
 * 선택 상태 표시
 *   <OptionListItem label="무드바이" price="+₩80,000" selected />
 *
 * 옵션 선택 동작 연결
 *   <OptionListItem
 *     label="무드바이"
 *     price="+₩80,000"
 *     selected={selected}
 *     onClick={handleSelect}
 *   />
 */

import { IcCheckBox, IcCheckBoxFill } from '@/components/icons'

interface Props {
  label?: string
  price?: string
  selected?: boolean
  onClick?: () => void
}

const OptionListItem = ({
  label = '무드바이',
  price = '+₩80,000',
  selected = false,
  onClick,
}: Props) => (
  <button
    type="button"
    className="flex w-full items-center justify-between border-b border-gray-10 px-5 py-3"
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <span className={selected ? 'text-brand-100' : 'text-gray-10'}>
        {selected ? (
          <IcCheckBoxFill width={24} height={24} />
        ) : (
          <IcCheckBox width={24} height={24} />
        )}
      </span>

      <span className={`${selected ? 'font-b5' : 'font-b6'} text-gray-80`}>
        {label}
      </span>
    </div>

    <span className={`${selected ? 'font-b5' : 'font-b6'} text-black`}>
      {price}
    </span>
  </button>
)

export default OptionListItem