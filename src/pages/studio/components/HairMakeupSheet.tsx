import { useState } from 'react'

import FilterChip from '@/components/common/FilterChip'
import NoticeBanner from '@/components/common/NoticeBanner'
import { IcClose } from '@/components/icons'

import { useStudioHairMakeup } from '@/hooks/useStudio'

interface HairMakeupSheetProps {
  studioId: string
  onClose?: () => void
}

const HairMakeupSheet = ({ studioId, onClose }: HairMakeupSheetProps) => {
  // 조회 실패 시 빈 시트로 보이지 않도록 안내를 띄운다.
  // 재시도는 시트를 닫았다 다시 열면 되므로 별도 버튼을 두지 않는다.
  const { data, isError } = useStudioHairMakeup(studioId)
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
        {isError ? (
          <NoticeBanner label="헤어메이크업 정보를 불러오지 못했어요." />
        ) : !data ? (
          // 재조회 대기 등 isLoading이 잠시 false가 되는 구간까지 덮으려면 데이터 유무로 판단해야 한다.
          <NoticeBanner label="헤어메이크업 정보를 불러오고 있어요." />
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}

export default HairMakeupSheet
