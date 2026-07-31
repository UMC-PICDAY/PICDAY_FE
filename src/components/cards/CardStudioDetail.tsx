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
 * 이미지 여러 장
 *   <CardStudioDetail
 *     imageSrcs={product.imageUrls}
 *     totalImages={8}
 *   />
 *   좌우로 넘길 수 있고, 뱃지의 현재 번호가 따라 움직입니다.
 *   totalImages를 넘기지 않으면 imageSrcs 개수를 쓰고, 1장 이하면 뱃지를 숨깁니다
 *
 * 버튼 이벤트 연결
 *   <CardStudioDetail
 *     onDetailClick={handleDetailClick}
 *     onReserveClick={handleReserveClick}
 *   />
 *   onDetailClick은 '상세보기' 버튼과 카드 이미지 탭에 함께 연결됩니다
 */

import { useRef, useState } from 'react'

import { IcCheck, IcRight } from '@/components/icons'
import ButtonLarge from '@/components/common/ButtonLarge'

interface Props {
  className?: string
  imageSrcs?: string[]
  name?: string
  description?: string
  optionText?: string
  totalImages?: number
  price?: string
  buttonLabel?: string
  detailLabel?: string
  onDetailClick?: () => void
  onReserveClick?: () => void
}

// 눌린 동안 트랙이 이만큼 넘게 움직였으면 탭이 아니라 스와이프로 본다.
const SWIPE_TOLERANCE = 4

// 데이터성 prop에는 기본값을 두지 않는다. 값이 없으면 지어내지 않고 해당 영역을 비운다.
// 버튼 문구(buttonLabel·detailLabel)는 데이터가 아니라 UI 라벨이라 기본값을 유지한다.
const CardStudioDetail = ({
  className,
  imageSrcs = [],
  name,
  description,
  optionText,
  totalImages,
  price,
  buttonLabel = '예약하기',
  detailLabel = '상세보기',
  onDetailClick,
  onReserveClick,
}: Props) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const pressStartLeft = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const imageCount = totalImages ?? imageSrcs.length

  // 슬라이드 폭이 카드 폭과 같으므로 스크롤 위치를 폭으로 나누면 현재 장이 나온다.
  const handleTrackScroll = () => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return
    setCurrentIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  const handleImagePointerDown = () => {
    pressStartLeft.current = trackRef.current?.scrollLeft ?? 0
  }

  // 이미지 탭은 상세보기로 이어지지만, 넘기려고 스와이프한 것까지 이동으로
  // 처리되면 안 된다. 누른 동안 트랙이 움직였으면 탭으로 보지 않는다.
  const handleImageClick = () => {
    const moved = Math.abs(
      (trackRef.current?.scrollLeft ?? 0) - pressStartLeft.current,
    )
    if (moved > SWIPE_TOLERANCE) return
    onDetailClick?.()
  }

  return (
    <div
      className={
        className ||
        'relative flex w-[345px] flex-col items-center justify-center overflow-hidden rounded-[12px] border border-[rgba(238,238,238,0.6)] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]'
      }
    >
      <div className="relative h-[230px] w-[345px] shrink-0 overflow-hidden bg-white">
        {imageSrcs.length > 0 ? (
          <div
            ref={trackRef}
            onScroll={handleTrackScroll}
            className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {imageSrcs.map((src, index) => (
              <button
                key={src}
                type="button"
                onPointerDown={handleImagePointerDown}
                onClick={handleImageClick}
                aria-label={name ? `${name} 상세보기` : '상세보기'}
                className="h-full w-full shrink-0 cursor-pointer snap-start border-none bg-transparent p-0"
              >
                <img
                  alt={name ? `${name} 사진 ${index + 1}` : ''}
                  className="h-full w-full object-cover"
                  src={src}
                />
              </button>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={onDetailClick}
            aria-label={name ? `${name} 상세보기` : '상세보기'}
            className="h-full w-full cursor-pointer border-none bg-gray-10 p-0"
          />
        )}

        {imageCount > 1 && (
          <div className="pointer-events-none absolute right-[10px] bottom-[10px] flex items-center justify-center rounded-full border border-gray-60 bg-gray-60 px-[12px] py-[2px] opacity-60">
            <p className="whitespace-nowrap text-[var(--font-cap1-size)] font-[var(--font-cap1-weight)] leading-[var(--font-cap1-line-height)] tracking-[var(--font-cap1-letter-spacing)] text-gray-10">
              {currentIndex + 1}/{imageCount}
            </p>
          </div>
        )}
      </div>

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