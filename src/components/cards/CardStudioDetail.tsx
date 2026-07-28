/**
 * CardStudioDetail 사용법
 *
 * 스튜디오 정보 전달
 *   <CardStudioDetail
 *     name="체리베리벌쓰데이"
 *     description="기준 1인 (최대 2인)"
 *     optionText="자연광 스튜디오 · 의상 무료대여 · 보정본 2매 · 약 40분"
 *     price="₩70,000"
 *   />
 *   값을 넘기지 않은 항목은 표시되지 않습니다.
 *   (이미지 없으면 회색 영역, optionText·가격 없으면 해당 줄 자체가 빠짐)
 *
 * 이미지 개수 표시
 *   <CardStudioDetail
 *     currentImage={1}
 *     totalImages={8}
 *   />
 *   totalImages가 없거나 0이면 개수 뱃지를 숨깁니다
 *
 * 버튼 이벤트 연결
 *   <CardStudioDetail
 *     onDetailClick={handleDetailClick}
 *     onReserveClick={handleReserveClick}
 *   />
 *   onDetailClick은 '상세보기' 버튼과 카드 이미지 탭에 함께 연결됩니다
 */

import { IcCheck, IcRight } from '@/components/icons'
import ButtonLarge from '@/components/common/ButtonLarge'

interface Props {
  className?: string
  imageSrc?: string | null
  name?: string
  description?: string
  optionText?: string
  currentImage?: number
  totalImages?: number
  price?: string
  buttonLabel?: string
  detailLabel?: string
  onDetailClick?: () => void
  onReserveClick?: () => void
}

// 데이터성 prop에는 기본값을 두지 않는다. 값이 없으면 지어내지 않고 해당 영역을 비운다.
// 버튼 문구(buttonLabel·detailLabel)는 데이터가 아니라 UI 라벨이라 기본값을 유지한다.
const CardStudioDetail = ({
  className,
  imageSrc,
  name,
  description,
  optionText,
  currentImage = 1,
  totalImages,
  price,
  buttonLabel = '예약하기',
  detailLabel = '상세보기',
  onDetailClick,
  onReserveClick,
}: Props) => {
  return (
    <div
      className={
        className ||
        'relative flex w-[345px] flex-col items-center justify-center overflow-hidden rounded-[12px] border border-[rgba(238,238,238,0.6)] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]'
      }
    >
      <button
        type="button"
        onClick={onDetailClick}
        aria-label={name ? `${name} 상세보기` : '상세보기'}
        className="relative h-[230px] w-[345px] shrink-0 cursor-pointer overflow-hidden border-none bg-white p-0"
      >
        {imageSrc ? (
          <img alt={name ?? ''} className="h-full w-full object-cover" src={imageSrc} />
        ) : (
          <div className="h-full w-full bg-gray-10" />
        )}

        {Boolean(totalImages) && (
          <div className="absolute right-[10px] bottom-[10px] flex items-center justify-center rounded-full border border-gray-60 bg-gray-60 px-[12px] py-[2px] opacity-60">
            <p className="whitespace-nowrap text-[var(--font-cap1-size)] font-[var(--font-cap1-weight)] leading-[var(--font-cap1-line-height)] tracking-[var(--font-cap1-letter-spacing)] text-gray-10">
              {currentImage}/{totalImages}
            </p>
          </div>
        )}
      </button>

      <div className="flex w-full shrink-0 flex-col items-start gap-[8px] bg-[rgba(252,252,252,0.75)] px-[12px] py-[10px]">
        <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
          <p className="w-full text-[var(--font-b5-size)] font-[var(--font-b5-weight)] leading-[var(--font-b5-line-height)] tracking-[var(--font-b5-letter-spacing)] text-black">
            {name}
          </p>

          <p className="w-full pr-[4px] text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)] text-gray-40">
            {description}
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
          {optionText && (
            <div className="flex w-full shrink-0 items-start">
              <IcCheck width={16} height={16} className="shrink-0 text-gray-80" />

              <p className="min-w-0 flex-1 pr-[4px] text-[var(--font-cap1-size)] font-[var(--font-cap1-weight)] leading-[var(--font-cap1-line-height)] tracking-[var(--font-cap1-letter-spacing)] text-gray-80">
                {optionText}
              </p>
            </div>
          )}

          <button
            className="flex w-full shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-gray-40"
            type="button"
            onClick={onDetailClick}
          >
            <p className="min-w-0 flex-1 text-right text-[var(--font-b7-size)] font-[var(--font-b7-weight)] leading-[var(--font-b7-line-height)] tracking-[var(--font-b7-letter-spacing)]">
              {detailLabel}
            </p>

            <IcRight width={20} height={20} className="shrink-0" />
          </button>
        </div>
      </div>

      <div className="w-full shrink-0 border-t border-gray-10 bg-white">
        <ButtonLarge
          variant="price"
          price={price}
          primaryLabel={buttonLabel}
          onPrimaryClick={onReserveClick}
        />
      </div>
    </div>
  )
}

export default CardStudioDetail