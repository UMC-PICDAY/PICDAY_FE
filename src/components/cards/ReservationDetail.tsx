/**
 * ReservationDetail 사용법
 *
 * 기본 예약내역 카드
 *   <ReservationDetail />
 *
 * 체크리스트 카드
 *   <ReservationDetail
 *     property1="checklistCard"
 *   />
 *
 * 예약내역 정보 전달
 *   <ReservationDetail
 *     receiptItems={receiptItems}
 *     totalAmount="₩65,000"
 *   />
 *
 * 체크리스트 정보 전달
 *   <ReservationDetail
 *     property1="checklistCard"
 *     checklistItems={checklistItems}
 *   />
 */

import { IcCheck, IcCheckBox } from '@/components/icons'

type ReservationDetailVariant = 'receiptCard' | 'checklistCard'

interface ReservationInfoItem {
  label: string
  value: string
}

interface ChecklistItem {
  id: string
  label: string
  checked?: boolean
}

interface Props {
  className?: string
  property1?: ReservationDetailVariant
  title?: string
  receiptItems?: ReservationInfoItem[]
  totalLabel?: string
  totalAmount?: string
  checklistTitle?: string
  checklistItems?: ChecklistItem[]
}

const DEFAULT_RECEIPT_ITEMS: ReservationInfoItem[] = [
  {
    label: '패키지',
    value: '1인 기본 패키지',
  },
  {
    label: '추가 옵션',
    value: '추가 보정본 1장',
  },
  {
    label: '연계 서비스',
    value: '헤어·메이크업',
  },
]

const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'concept-outfit',
    label: '촬영 컨셉 및 의상 (컨셉·의상) 준비 확인',
  },
  {
    id: 'hair-makeup-time',
    label: '헤어·메이크업 예약 시간 확인',
  },
  {
    id: 'studio-location',
    label: '스튜디오 위치 및 오시는 길 확인',
  },
  {
    id: 'props-outfit',
    label: '촬영 당일 소품·의상 챙기기',
  },
]

const ReservationDetail = ({
  className,
  property1 = 'receiptCard',
  title = '예약내역',
  receiptItems = DEFAULT_RECEIPT_ITEMS,
  totalLabel = '결제 금액',
  totalAmount = '₩65,000',
  checklistTitle = '촬영 전 체크리스트',
  checklistItems = DEFAULT_CHECKLIST_ITEMS,
}: Props) => {
  const isChecklistCard = property1 === 'checklistCard'

  return (
    <section className={className || 'flex w-full flex-col items-start px-[20px] py-[10px]'}>
      <div
        className={`flex w-full flex-col items-start justify-center rounded-[8px] border border-gray-10 bg-white p-[20px] ${
          isChecklistCard ? '' : 'gap-[20px]'
        }`}
      >
        <div className="flex w-full flex-col items-start gap-[10px]">
          <div className={`flex shrink-0 items-center justify-center ${isChecklistCard ? 'gap-[5px]' : ''}`}>
            {isChecklistCard ? (
              <>
                <IcCheck width={16} height={16} className="shrink-0 text-black" />
                <h2 className="shrink-0 whitespace-nowrap font-b5 text-black">{checklistTitle}</h2>
              </>
            ) : (
              <h2 className="shrink-0 whitespace-nowrap font-b5 text-black">{title}</h2>
            )}
          </div>

          {isChecklistCard ? (
            <div className="flex w-full flex-col items-start">
              {checklistItems.map((item, index) => {
                const isLastItem = index === checklistItems.length - 1

                return (
                  <div
                    key={item.id}
                    className={`flex w-full flex-col items-start px-[5px] py-[10px] ${
                      isLastItem ? '' : 'border-b border-gray-10'
                    }`}
                  >
                    <div className="flex w-full shrink-0 items-center gap-[5px]">
                      {item.checked ? (
                        <span className="flex size-[24px] shrink-0 items-center justify-center text-brand-100">
                          <IcCheck width={16} height={16} />
                        </span>
                      ) : (
                        <IcCheckBox width={24} height={24} className="shrink-0 text-gray-10" />
                      )}
                      <p className="min-w-0 flex-1 font-b8 text-gray-60">{item.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex w-full flex-col items-start">
              {receiptItems.map((item) => (
                <div
                  key={item.label}
                  className="flex w-full shrink-0 items-start border-b border-gray-10 px-[5px] py-[8px]"
                >
                  <div className="flex min-w-0 flex-1 items-center">
                    <p className="shrink-0 whitespace-nowrap font-b8 text-gray-60">{item.label}</p>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <p className="shrink-0 whitespace-nowrap font-b8 text-black">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isChecklistCard && (
          <div className="flex w-full shrink-0 items-start">
            <div className="flex min-w-0 flex-1 items-center">
              <p className="shrink-0 whitespace-nowrap font-b5 text-black">{totalLabel}</p>
            </div>
            <div className="flex shrink-0 items-center">
              <p className="shrink-0 whitespace-nowrap font-b5 text-gray-80">{totalAmount}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ReservationDetail
