/**
 * ButtonCompareSlot 사용법
 *
 * 선택된 슬롯
 *   <ButtonCompareSlot />
 *
 * 라벨 변경
 *   <ButtonCompareSlot label="스튜디오명" />
 *
 * 추가 버튼 표시
 *   <ButtonCompareSlot state="add" />
 *
 * 클릭 동작 연결
 *   <ButtonCompareSlot
 *     state="add"
 *     onClick={handleAddStudio}
 *   />
 */

import { IcAdd, IcClose } from '@/components/icons'

interface Props {
  className?: string
  state?: 'selected' | 'add'
  label?: string
  onClick?: () => void
}

const ButtonCompareSlot = ({
  className,
  state = 'selected',
  label = '데이지',
  onClick,
}: Props) => {
  const isAdd = state === 'add'

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className={
        className ||
        `relative flex size-[48px] content-stretch items-center justify-center rounded-[8px] border border-brand-40 p-[10px] ${
          isAdd
            ? 'border-dashed bg-white'
            : 'flex-col border-solid bg-brand-20'
        } ${onClick ? 'cursor-pointer' : ''}`
      }
      id={isAdd ? 'node-767_4627' : 'node-767_4615'}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {!isAdd && (
        <>
          <p
            className="shrink-0 whitespace-nowrap text-[var(--font-b9-size)] font-[var(--font-b9-weight)] leading-[var(--font-b9-line-height)] tracking-[var(--font-b9-letter-spacing)] text-brand-100 [word-break:break-word]"
            data-node-id="767:4612"
          >
            {label}
          </p>

          <div
            className="absolute right-[5px] top-[5px] size-[8px]"
            data-node-id="890:5990"
          >
            <IcClose
              className="block size-full text-brand-100"
              width={8}
              height={8}
            />
          </div>
        </>
      )}

      {isAdd && (
        <div
          className="relative size-[24px] shrink-0"
          data-node-id="767:4629"
          data-name="ic_add"
        >
          <IcAdd
            className="block size-full text-brand-100"
            width={24}
            height={24}
          />
        </div>
      )}
    </div>
  )
}

export default ButtonCompareSlot