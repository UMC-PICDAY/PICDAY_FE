import { useState } from 'react'

import FilterChip from '@/components/common/FilterChip'
import { IcClose } from '@/components/icons'

import { useStudioHairMakeup } from '@/hooks/useStudio'

interface HairMakeupSheetProps {
  studioId: string
  onClose?: () => void
}

const HairMakeupSheet = ({ studioId, onClose }: HairMakeupSheetProps) => {
  const { data } = useStudioHairMakeup(studioId)
  // 정렬 기준(displayOrder)이 명세에서 빠져 응답 배열 순서를 그대로 노출한다.
  const partners = data?.hairMakeupList ?? []

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const effectiveId = selectedId ?? partners[0]?.hairMakeupDetailId ?? null
  const selected = partners.find(
    (partner) => partner.hairMakeupDetailId === effectiveId,
  )

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
          {partners.map((partner) => (
            <FilterChip
              key={partner.hairMakeupDetailId}
              label={partner.partnerName}
              size="large"
              selected={partner.hairMakeupDetailId === effectiveId}
              onClick={() => setSelectedId(partner.hairMakeupDetailId)}
            />
          ))}
        </div>

        {selected && (
          <>
            <p className="pb-3 font-b3 text-black">{selected.partnerName}</p>

            <div className="flex items-center justify-between py-1">
              <span className="font-b8 text-gray-60">헤어·메이크업</span>
              <span className="font-b7 text-brand-100">
                + ₩{selected.additionalPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="font-b8 text-gray-60">예약 방식</span>
              <span className="font-b8 text-black">촬영 예약 후 별도 예약</span>
            </div>

            <p className="pt-3 font-b8 text-gray-40">
              헤어·메이크업은 예약 시 옵션으로 추가할 수 있어요.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default HairMakeupSheet
