import { IcClose } from '@/components/icons'

interface InfoSection {
  title: string
  items: string[]
}

const SECTIONS: InfoSection[] = [
  {
    title: '운영 정보',
    items: ['운영시간: 매일 12:00 - 20:00', '휴무일: 연중무휴', '예약 마감: 촬영 1일 전'],
  },
  {
    title: '주차 정보',
    items: ['건물 내 주차 가능 (2시간 무료)', '만차 시 인근 공영주차장 이용 안내'],
  },
  {
    title: '촬영 안내',
    items: [
      '의상 무료 대여 (개인화보 컨셉 한정)',
      '헤어메이크업 제휴샵 연계 가능 (추가 비용)',
      '보정본은 촬영 후 7일 이내 전달',
    ],
  },
  {
    title: '환불 안내',
    items: ['환불 정책은 사진관 정책에 따름', '당일 취소 불가'],
  },
]

interface StudioInfoSheetProps {
  onClose?: () => void
}

const StudioInfoSheet = ({ onClose }: StudioInfoSheetProps) => (
  <div className="w-full">
    <div className="-mx-5 flex items-center border-b border-gray-10 px-5 py-3">
      <p className="flex-1 font-b3 text-black">사진관 이용 정보</p>
      <button type="button" onClick={onClose} aria-label="닫기">
        <IcClose width={24} height={24} />
      </button>
    </div>

    <div className="py-2.5">
      {SECTIONS.map((section) => (
        <div key={section.title} className="py-2">
          <p className="py-2 font-b7 text-gray-80">{section.title}</p>
          <ul className="flex flex-col gap-1">
            {section.items.map((item) => (
              <li key={item} className="flex items-start gap-1.5">
                <span className="mt-[7px] size-1 shrink-0 rounded-full bg-brand-100" />
                <span className="font-b8 text-gray-80">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
)

export default StudioInfoSheet
