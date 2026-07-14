/**
 * CardStudioCompare 사용법
 *
 * 기본 비교 카드
 *   <CardStudioCompare />
 *
 * 큰 사이즈 카드
 *   <CardStudioCompare
 *     size="default"
 *   />
 *
 * 스튜디오 정보 전달
 *   <CardStudioCompare
 *     name="데이지 스튜디오"
 *     rating={4.9}
 *     reviewCount={128}
 *   />
 *
 * 카드 클릭 동작 연결
 *   <CardStudioCompare
 *     onClick={handleStudioClick}
 *   />
 *
 * 삭제 버튼 이벤트
 *   <CardStudioCompare
 *     onDelete={handleDelete}
 *   />
 */

import type { KeyboardEvent, MouseEvent } from 'react'

import defaultImage from '@/assets/images/CardImage3.png'
import ButtonDelete from '@/components/common/ButtonDelete'
import { IcStar } from '@/components/icons'

const DEFAULT_IMAGE = defaultImage

type CardStudioCompareSize = 'default' | 'compact'

interface Props {
  className?: string
  size?: CardStudioCompareSize
  imageSrc?: string | null
  name?: string
  rating?: number
  reviewCount?: number
  onClick?: () => void
  onDelete?: () => void
}

const CardStudioCompare = ({
  className = '',
  size = 'compact',
  imageSrc = DEFAULT_IMAGE,
  name = '데이지 스튜디오',
  rating = 4.9,
  reviewCount = 128,
  onClick,
  onDelete,
}: Props) => {
  const isCompact = size === 'compact'

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !onClick) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  const handleDelete = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    onDelete?.()
  }

  return (
    <div
      className={`relative flex flex-col items-start overflow-hidden rounded-[12px] border-[0.659px] border-[rgba(238,238,238,0.6)] ${
        isCompact
          ? 'w-[114px] shadow-[0px_9.884px_31.63px_0px_rgba(252,200,215,0.1)] backdrop-blur-[6.59px]'
          : 'w-[173px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className={
          isCompact
            ? 'relative h-[114px] w-full shrink-0 overflow-hidden bg-white'
            : 'relative h-[173px] w-full shrink-0 overflow-hidden bg-white'
        }
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-10" />
        )}

        <div
          className={`absolute ${
            isCompact
              ? 'left-[93px] top-[7px]'
              : 'left-[143px] top-[10px]'
          }`}
          onClick={handleDelete}
        >
          <ButtonDelete size={isCompact ? 'mini' : 'default'} />
        </div>
      </div>

      <div
        className={
          isCompact
            ? 'relative flex w-full shrink-0 flex-col items-start bg-[rgba(252,252,252,0.75)] px-[8px] py-[6px]'
            : 'relative flex w-full shrink-0 flex-col items-start bg-[rgba(252,252,252,0.75)] px-[12px] py-[10px]'
        }
      >
        <p
          className={
            isCompact
              ? 'w-[98.185px] shrink-0 truncate text-[var(--font-b9-size)] font-[var(--font-b9-weight)] leading-[var(--font-b9-line-height)] tracking-[var(--font-b9-letter-spacing)] text-black'
              : 'w-[149px] shrink-0 truncate text-[var(--font-b7-size)] font-[var(--font-b7-weight)] leading-[var(--font-b7-line-height)] tracking-[var(--font-b7-letter-spacing)] text-black'
          }
        >
          {name}
        </p>

        <div
          className={`flex shrink-0 items-center ${
            isCompact ? 'gap-[1.318px]' : 'gap-[2px]'
          }`}
        >
          <IcStar
            className="shrink-0 text-gray-40"
            width={isCompact ? 12 : 14}
            height={isCompact ? 12 : 14}
          />

          <p
            className={
              isCompact
                ? 'shrink-0 whitespace-nowrap text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)] text-gray-40'
                : 'shrink-0 whitespace-nowrap text-[var(--font-cap1-size)] font-[var(--font-cap1-weight)] leading-[var(--font-cap1-line-height)] tracking-[var(--font-cap1-letter-spacing)] text-gray-40'
            }
          >
            {rating}
          </p>

          <p
            className={
              isCompact
                ? 'shrink-0 whitespace-nowrap text-[var(--font-cap3-size)] font-[400] leading-[var(--font-cap3-line-height)] tracking-[var(--font-cap3-letter-spacing)] text-gray-40'
                : 'shrink-0 whitespace-nowrap text-[var(--font-cap1-size)] font-[var(--font-cap1-weight)] leading-[var(--font-cap1-line-height)] tracking-[var(--font-cap1-letter-spacing)] text-gray-40'
            }
          >
            ({reviewCount}개)
          </p>
        </div>
      </div>
    </div>
  )
}

export default CardStudioCompare