import { IcClose } from '@/components/icons'

interface StudioInfoSheetProps {
  sections: string[]
  onClose?: () => void
}

const StudioInfoSheet = ({ sections, onClose }: StudioInfoSheetProps) => (
  <div className="w-full">
    <div className="-mx-5 flex items-center border-b border-gray-10 px-5 py-3">
      <p className="flex-1 font-b3 text-black">사진관 이용 정보</p>
      <button type="button" onClick={onClose} aria-label="닫기">
        <IcClose width={24} height={24} />
      </button>
    </div>

    <div className="py-2.5">
      <ul className="flex flex-col gap-1">
        {sections.map((line, index) => (
          <li key={index} className="flex items-start gap-1.5">
            <span className="mt-[7px] size-1 shrink-0 rounded-full bg-brand-100" />
            <span className="font-b8 text-gray-80">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

export default StudioInfoSheet
