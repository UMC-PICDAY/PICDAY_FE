/**
 * InputImage 사용법
 *
 * [default] 이미지 첨부 전 상태
 *   <InputImage count={0} />
 *
 * [uploaded] 이미지 첨부 후 상태
 *   <InputImage imageSrc={image} count={1} onRemove={handleRemove} />
 */

import { IcClose, IcPicture } from '@/components/icons'

interface Props {
  imageSrc?: string
  count?: number
  maxCount?: number
  onClick?: () => void
  onRemove?: () => void
}

const InputImage = ({ imageSrc, count = 0, maxCount = 5, onClick, onRemove }: Props) => {
  if (imageSrc) {
    return (
      <div className="relative h-16 w-16">
        <img src={imageSrc} alt="" className="h-16 w-16 rounded-[8px] object-cover" />

        <button
          type="button"
          aria-label="이미지 삭제"
          className="absolute right-[-6px] top-[-6px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black/30"
          onClick={onRemove}
        >
          <IcClose width={18} height={18} className="text-white" />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-[8px] border border-brand-20 bg-white"
      onClick={onClick}
    >
      <IcPicture width={24} height={24} className="text-brand-100" />
      <span className="font-b6 text-gray-40">
        {count}/{maxCount}
      </span>
    </button>
  )
}

export default InputImage