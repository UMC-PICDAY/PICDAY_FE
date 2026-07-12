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

import ButtonPair from '@/components/common/ButtonPair'
import StatusTag from '@/components/common/StatusTag'

import defaultImage from '@/assets/images/CardImage1.png'
import defaultSecondImage from '@/assets/images/CardImage2.png'

const DEFAULT_IMAGE = defaultImage
const DEFAULT_SECOND_IMAGE = defaultSecondImage

type ReservationStatusTag = '예약 완료' | '촬영 완료' | '취소'
type StatusTagVariant = 'reservation' | 'shooting' | 'canceled'

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

const getStatusTagVariant = (
  statusTag: ReservationStatusTag,
): StatusTagVariant => {
  if (statusTag === '촬영 완료') {
    return 'shooting'
  }

  if (statusTag === '취소') {
    return 'canceled'
  }

  return 'reservation'
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
  const statusTagVariant = getStatusTagVariant(statusTag)
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
            <img
              alt={studioName}
              className="h-full w-full object-cover"
              src={imageSrc}
            />
          ) : (
            <div className="h-full w-full bg-gray-10" />
          )}
        </div>

        <div className="relative h-[181px] w-[149px] shrink-0 overflow-hidden rounded-[16px] bg-brand-60">
          {secondImageSrc ? (
            <img
              alt={studioName}
              className="h-full w-full object-cover"
              src={secondImageSrc}
            />
          ) : (
            <div className="h-full w-full bg-gray-10" />
          )}
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col items-start gap-[10px] rounded-[12px] px-[12px] py-[8px]">
        <div className="flex shrink-0 flex-col items-start gap-[5px]">
          <div className="flex w-[338px] shrink-0 items-center gap-[5px]">
            <StatusTag variant={statusTagVariant} />

            <p className="min-w-0 flex-1 truncate text-[var(--font-b5-size)] font-[var(--font-b5-weight)] leading-[var(--font-b5-line-height)] tracking-[var(--font-b5-letter-spacing)] text-black">
              {studioName}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start py-[2px]">
            <p className="shrink-0 whitespace-nowrap font-cap3 text-gray-40">{dateTime}</p>
            <p className="shrink-0 whitespace-nowrap font-cap3 text-gray-40">{packageName}</p>
          </div>
        </div>

        <ButtonPair
          leftLabel={leftButtonLabel}
          rightLabel={rightButtonLabel}
          onLeftClick={onLeftButtonClick}
          onRightClick={onRightButtonClick}
        />
      </div>
    </div>
  )
}

export default CardReservationHistory