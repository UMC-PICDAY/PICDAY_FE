/**
 * SectionStudioCompare 사용법
 *
 * 기본 스튜디오 비교 섹션
 *   <SectionStudioCompare />
 *
 * 비교할 스튜디오 정보 전달
 *   <SectionStudioCompare
 *     compareItems={compareItems}
 *   />
 *
 * 하단 버튼 표시
 *   <SectionStudioCompare
 *     footerMode="add"
 *   />
 *
 * 하단 안내 문구 표시
 *   <SectionStudioCompare
 *     footerMode="notice"
 *     noticeText="최대 3개까지 비교 가능합니다"
 *   />
 */

import AddButton from '@/components/common/AddButton'
import StudioCompareItem from '@/components/cards/StudioCompareItem'

interface CompareItem {
  price?: string
  description?: string
  badgeLabel?: string
  services?: string[]
  location?: string
  reservationDate?: string
}

interface Props {
  className?: string
  compareItems?: CompareItem[]
  footerMode?: 'auto' | 'add' | 'notice'
  addButtonLabel?: string
  addButtonSubLabel?: string
  noticeText?: string
}

const DEFAULT_COMPARE_ITEMS: Required<CompareItem>[] = [
  {
    price: '₩30,000',
    description: '보정 2장 · 의상 포함',
    badgeLabel: '추가금 없음',
    services: ['헤어·메이크업', '주차'],
    location: '홍대 · 도보 3분',
    reservationDate: '6월 27일 (목)',
  },
  {
    price: '₩35,000',
    description: '보정 3장',
    badgeLabel: '추가금 없음',
    services: ['헤어·메이크업', '의상 비치'],
    location: '홍대 · 도보 5분',
    reservationDate: '6월 28일 (금)',
  },
]

const SectionStudioCompare = ({
  className,
  compareItems = DEFAULT_COMPARE_ITEMS,
  footerMode = 'auto',
  addButtonLabel = '사진관 추가',
  addButtonSubLabel = '최대 3개까지 비교 가능해요',
  noticeText = '최대 3개까지 비교 가능합니다',
}: Props) => {
  const isThreeCompare = compareItems.length >= 3
  const resolvedFooterMode =
    footerMode === 'auto' ? (isThreeCompare ? 'notice' : 'add') : footerMode
  const displayItems = compareItems.length > 0 ? compareItems : DEFAULT_COMPARE_ITEMS
  const columnSize = isThreeCompare ? 'compact' : 'default'
  const columnWidthClass = isThreeCompare ? 'w-[114px]' : 'w-[173px]'
  const rowGapClass = isThreeCompare ? 'gap-[16px]' : 'gap-[10px]'

  return (
    <div className={className || 'content-stretch flex w-[402px] flex-col items-start gap-[12px] relative'}>
      <div className="backdrop-blur-[10px] bg-[rgba(252,252,252,0.75)] content-stretch flex flex-col items-start relative shrink-0 shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] w-full">
        <div className="[word-break:break-word] content-stretch flex flex-col items-start not-italic px-[20px] py-[10px] relative shrink-0 w-full whitespace-nowrap">
          <p className="relative shrink-0 text-[var(--font-b7-size)] font-[var(--font-b7-weight)] leading-[var(--font-b7-line-height)] tracking-[var(--font-b7-letter-spacing)] text-brand-100">
            촬영일 기준 가격
          </p>
          <p className="relative shrink-0 text-[var(--font-b10-size)] font-[var(--font-b10-weight)] leading-[var(--font-cap3-line-height)] tracking-normal text-gray-40">
            프로필 기본 패키지
          </p>
        </div>
        <div className={`content-stretch flex items-center pb-[10px] px-[20px] relative shrink-0 w-full ${rowGapClass}`}>
          {displayItems.map((item, index) => (
            <StudioCompareItem
              key={`${item.price ?? 'price'}-${index}`}
              size={columnSize}
              price={item.price}
              description={item.description}
              badgeLabel={item.badgeLabel}
              className={`content-stretch flex flex-col gap-[4px] items-start relative shrink-0 ${columnWidthClass}`}
            />
          ))}
        </div>
      </div>

      <div className="backdrop-blur-[10px] bg-[rgba(252,252,252,0.75)] content-stretch flex flex-col items-start py-[5px] relative shrink-0 shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] w-full">
        <div className="content-stretch flex flex-col items-start px-[20px] py-[5px] relative shrink-0 w-full">
          <p className="relative shrink-0 whitespace-nowrap text-[var(--font-b7-size)] font-[var(--font-b7-weight)] leading-[var(--font-b7-line-height)] tracking-[var(--font-b7-letter-spacing)] text-brand-100">
            연계 서비스
          </p>
        </div>
        <div className={`content-stretch flex px-[20px] py-[5px] relative shrink-0 w-full ${isThreeCompare ? 'items-center gap-[16px]' : 'items-start gap-[10px]'}`}>
          {displayItems.map((item, index) => (
            <div
              key={`services-${item.price ?? 'price'}-${index}`}
              className={`flex gap-[5px] items-center relative shrink-0 ${
                isThreeCompare ? 'content-stretch flex-wrap w-[114px]' : 'content-center w-[173px]'
              }`}
            >
              {(item.services ?? []).map((service) => (
                <div
                  key={service}
                  className="bg-white border border-gray-10 content-stretch flex h-[22px] shrink-0 items-center justify-center rounded-[100px] px-[8px] py-[2px]"
                >
                  <p className="relative shrink-0 whitespace-nowrap text-[var(--font-b10-size)] font-[var(--font-b10-weight)] leading-[var(--font-cap3-line-height)] tracking-normal text-gray-80">
                    {service}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="backdrop-blur-[10px] bg-[rgba(252,252,252,0.75)] content-stretch flex flex-col items-start py-[5px] relative shrink-0 shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] w-full">
        <div className="content-stretch flex flex-col items-start px-[20px] py-[5px] relative shrink-0 w-full">
          <p className="relative shrink-0 whitespace-nowrap text-[var(--font-b7-size)] font-[var(--font-b7-weight)] leading-[var(--font-b7-line-height)] tracking-[var(--font-b7-letter-spacing)] text-brand-100">
            위치
          </p>
        </div>
        <div className={`content-stretch flex items-center px-[20px] py-[5px] relative shrink-0 w-full ${rowGapClass}`}>
          {displayItems.map((item, index) => (
            <div key={`location-${item.price ?? 'price'}-${index}`} className={`content-stretch flex items-center relative shrink-0 ${columnWidthClass}`}>
              <div className="content-stretch flex items-start relative shrink-0">
                <div className="[word-break:break-word] content-stretch flex items-center gap-[2px] font-[var(--font-b8-weight)] leading-[var(--font-b8-line-height)] not-italic relative shrink-0 whitespace-nowrap text-[var(--font-b8-size)] tracking-[var(--font-b8-letter-spacing)] text-gray-60">
                  <p className="relative shrink-0">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="backdrop-blur-[10px] bg-[rgba(252,252,252,0.75)] content-stretch flex flex-col items-start py-[5px] relative shrink-0 shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] w-full">
        <div className="content-stretch flex flex-col items-start px-[20px] py-[5px] relative shrink-0 w-full">
          <p className="relative shrink-0 whitespace-nowrap text-[var(--font-b7-size)] font-[var(--font-b7-weight)] leading-[var(--font-b7-line-height)] tracking-[var(--font-b7-letter-spacing)] text-brand-100">
            가장 빠른 예약일
          </p>
        </div>
        <div className={`content-stretch flex items-center px-[20px] py-[5px] relative shrink-0 w-full ${rowGapClass}`}>
          {displayItems.map((item, index) => (
            <div key={`reservation-${item.price ?? 'price'}-${index}`} className={`content-stretch flex items-center relative shrink-0 ${columnWidthClass}`}>
              <div className="content-stretch flex items-start relative shrink-0">
                <div className="content-stretch flex items-center relative shrink-0">
                  <p className="relative shrink-0 whitespace-nowrap text-[var(--font-b8-size)] font-[var(--font-b8-weight)] leading-[var(--font-b8-line-height)] tracking-[var(--font-b8-letter-spacing)] text-gray-60">
                    {item.reservationDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {resolvedFooterMode === 'add' && (
        <AddButton label={addButtonLabel} subLabel={addButtonSubLabel} />
      )}
      {resolvedFooterMode === 'notice' && (
        <div className="bg-brand-20 content-stretch flex min-h-[44px] items-center justify-center rounded-[8px] px-[20px] py-[12px]">
          <p className="relative shrink-0 whitespace-nowrap text-[var(--font-b8-size)] font-[var(--font-b8-weight)] leading-[var(--font-b8-line-height)] tracking-[var(--font-b8-letter-spacing)] text-brand-100">
            {noticeText}
          </p>
        </div>
      )}
    </div>
  )
}

export default SectionStudioCompare
