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
 */

import { IcAdd, IcClose } from '@/components/icons'

interface Props {
  className?: string
  state?: 'selected' | 'add'
  label?: string
}

const ButtonCompareSlot = ({ className, state = 'selected', label = '데이지' }: Props) => {
  const isAdd = state === 'add'

  return (
    <div
      className={
        className ||
        `relative border border-brand-40 content-stretch flex size-[48px] items-center justify-center rounded-[8px] p-[10px] ${
          isAdd ? 'border-dashed bg-white' : 'flex-col border-solid bg-brand-20'
        }`
      }
      id={isAdd ? 'node-767_4627' : 'node-767_4615'}
    >
      {!isAdd && (
        <>
          <p
            className="shrink-0 whitespace-nowrap [word-break:break-word] text-[var(--font-b9-size)] font-[var(--font-b9-weight)] leading-[var(--font-b9-line-height)] tracking-[var(--font-b9-letter-spacing)] text-brand-100"
            data-node-id="767:4612"
          >
            {label}
          </p>
          <div className="absolute right-[5px] top-[5px] size-[8px]" data-node-id="890:5990">
            <IcClose className="block size-full text-brand-100" width={8} height={8} />
          </div>
        </>
      )}
      {isAdd && (
        <div className="relative shrink-0 size-[24px]" data-node-id="767:4629" data-name="ic_add">
          <IcAdd className="block size-full text-brand-100" width={24} height={24} />
        </div>
      )}
    </div>
  )
}

export default ButtonCompareSlot
