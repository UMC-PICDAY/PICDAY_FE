import { useState } from 'react'

import FilterChip from '@/components/common/FilterChip'
import { IcClose } from '@/components/icons'

const SHOPS = ['무드바이', '메이크업바이블', '캐씨씨', 'm_up_ihyeon', '제니헤어']

interface HairMakeupSheetProps {
  onClose?: () => void
}

const HairMakeupSheet = ({ onClose }: HairMakeupSheetProps) => {
  const [selected, setSelected] = useState('무드바이')

  return (
    <div className="w-full">
      <div className="-mx-5 flex items-center border-b border-gray-10 px-5 py-3">
        <p className="flex-1 font-b3 text-black">헤어메이크업 연계</p>
        <button type="button" onClick={onClose} aria-label="닫기">
          <IcClose width={24} height={24} />
        </button>
      </div>

      <div className="py-4">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SHOPS.map((shop) => (
            <FilterChip
              key={shop}
              label={shop}
              size="large"
              selected={shop === selected}
              onClick={() => setSelected(shop)}
            />
          ))}
        </div>

        <p className="pb-3 font-b3 text-black">{selected}</p>

        <div className="flex items-center justify-between py-1">
          <span className="font-b8 text-gray-60">헤어·메이크업</span>
          <span className="font-b7 text-brand-100">+ ₩80,000</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="font-b8 text-gray-60">예약 방식</span>
          <span className="font-b8 text-black">촬영 예약 후 별도 예약</span>
        </div>

        <p className="pt-3 font-b8 text-gray-40">
          헤어·메이크업은 예약 시 옵션으로 추가할 수 있어요.
        </p>
      </div>
    </div>
  )
}

export default HairMakeupSheet
