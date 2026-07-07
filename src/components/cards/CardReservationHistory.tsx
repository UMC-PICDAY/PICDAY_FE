/**
 * CardReservationHistory 사용법
 *
 * 기본 예약 내역 카드
 *   <CardReservationHistory />
 *
 * 예약 상태 변경
 *   <CardReservationHistory
 *     statusTag="촬영 완료"
 *   />
 *
 * 예약 정보 전달
 *   <CardReservationHistory
 *     studioName="데이지스튜디오"
 *     dateTime="2026년 3월 15일 (토) 14:00"
 *     packageName="1인 기본 패키지"
 *   />
 *
 * 버튼 이벤트 연결
 *   <CardReservationHistory
 *     onLeftButtonClick={handleLeftButtonClick}
 *     onRightButtonClick={handleRightButtonClick}
 *   />
 */

import defaultImage from '@/assets/CardImage1.png'
import defaultSecondImage from '@/assets/CardImage2.png'

const DEFAULT_IMAGE = defaultImage
const DEFAULT_SECOND_IMAGE = defaultSecondImage

type ReservationStatusTag = '예약 완료' | '촬영 완료' | '취소'

interface Props {
  className?: string
  imageSrc?: string | null
  secondImageSrc?: string | null
  statusTag?: ReservationStatusTag
  studioName?: string
  dateTime?: string
  packageName?: string
  onLeftButtonClick?: () => void
  onRightButtonClick?: () => void
}

const getStatusTagClassName = (statusTag: ReservationStatusTag) => {
  if (statusTag === '촬영 완료') {
    return 'border-brand-100 bg-brand-80 text-white'
  }

  if (statusTag === '취소') {
    return 'border-[#D1D0D1] bg-[#EEE] text-gray-80'
  }

  return 'border-brand-40 bg-brand-20 text-gray-80'
}

const getButtonLabels = (statusTag: ReservationStatusTag) => {
  if (statusTag === '촬영 완료') {
    return {
      leftButtonLabel: '예약 상세',
      rightButtonLabel: '리뷰 작성',
    }
  }

  if (statusTag === '취소') {
    return {
      leftButtonLabel: '취소 상세',
      rightButtonLabel: '재예약',
    }
  }

  return {
    leftButtonLabel: '예약 취소',
    rightButtonLabel: '예약 상세',
  }
}

const CardReservationHistory = ({
  className,
  imageSrc = DEFAULT_IMAGE,
  secondImageSrc = DEFAULT_SECOND_IMAGE,
  statusTag = '예약 완료',
  studioName = '데이지스튜디오',
  dateTime = '2026년 3월 15일 (토) 14:00',
  packageName = '1인 기본 패키지',
  onLeftButtonClick,
  onRightButtonClick,
}: Props) => {
  const { leftButtonLabel, rightButtonLabel } = getButtonLabels(statusTag)

  return (
    <div
      className={
        className ||
        'relative flex w-[362px] flex-col items-center gap-[10px] rounded-[20px] border border-[rgba(254,228,235,0.3)] bg-[rgba(252,252,252,0.75)] py-[10px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]'
      }
    >
      <div className="flex shrink-0 items-center gap-[10px]">
        <div className="relative h-[181px] w-[181px] shrink-0 overflow-hidden rounded-[16px] bg-brand-60">
          {imageSrc ? (
            <img alt={studioName} className="h-full w-full object-cover" src={imageSrc} />
          ) : (
            <div className="h-full w-full bg-gray-10" />
          )}
        </div>

        <div className="relative h-[181px] w-[149px] shrink-0 overflow-hidden rounded-[16px] bg-brand-60">
          {secondImageSrc ? (
            <img alt={studioName} className="h-full w-full object-cover" src={secondImageSrc} />
          ) : (
            <div className="h-full w-full bg-gray-10" />
          )}
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col items-start gap-[10px] rounded-[12px] px-[12px] py-[8px]">
        <div className="flex shrink-0 flex-col items-start gap-[5px]">
          <div className="flex w-[338px] shrink-0 items-center gap-[5px]">
            <div
              className={`flex h-[22px] shrink-0 items-center justify-center gap-[10px] rounded-[32px] border px-[16px] py-[4px] ${getStatusTagClassName(
                statusTag,
              )}`}
            >
              <p className="shrink-0 whitespace-nowrap text-[var(--font-cap2-size)] font-[var(--font-cap2-weight)] leading-[var(--font-cap2-line-height)] tracking-[var(--font-cap2-letter-spacing)]">
                {statusTag}
              </p>
            </div>

            <p className="min-w-0 flex-1 truncate text-[var(--font-b5-size)] font-[var(--font-b5-weight)] leading-[var(--font-b5-line-height)] tracking-[var(--font-b5-letter-spacing)] text-black">
              {studioName}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start py-[2px] text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)] text-gray-40">
            <p className="shrink-0 whitespace-nowrap">{dateTime}</p>
            <p className="shrink-0 whitespace-nowrap">{packageName}</p>
          </div>
        </div>

        <div className="flex w-full shrink-0 items-center gap-[8px]">
          <button
            className="flex h-[40px] min-w-0 flex-1 cursor-pointer items-center justify-center rounded-[8px] border border-gray-20 bg-white p-px text-center text-[var(--font-b8-size)] font-[var(--font-b8-weight)] leading-[var(--font-b8-line-height)] tracking-[var(--font-b8-letter-spacing)] text-gray-60"
            type="button"
            onClick={onLeftButtonClick}
          >
            <span className="shrink-0 whitespace-nowrap">{leftButtonLabel}</span>
          </button>

          <button
            className="flex h-[40px] min-w-0 flex-1 cursor-pointer items-center justify-center rounded-[8px] border-none bg-brand-100 text-center text-[var(--font-b7-size)] font-[var(--font-b7-weight)] leading-[var(--font-b7-line-height)] tracking-[var(--font-b7-letter-spacing)] text-white"
            type="button"
            onClick={onRightButtonClick}
          >
            <span className="shrink-0 whitespace-nowrap">{rightButtonLabel}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardReservationHistory