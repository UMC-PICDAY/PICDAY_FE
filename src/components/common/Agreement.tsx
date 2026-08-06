/**
 * Agreement 사용법
 *
 * 약관 동의 체크리스트 (전체 동의 + 개별 약관, 상세보기 화살표)
 *   const [terms, setTerms] = useState({ service: false, privacy: false })
 *
 *   <Agreement
 *     items={[
 *       { key: 'service', label: '서비스 이용 약관 동의 (필수)' },
 *       { key: 'privacy', label: '개인정보 수집 및 이용 동의 (필수)' },
 *     ]}
 *     checked={terms}
 *     onToggleAll={() => setTerms((prev) => ...)}
 *     onToggleItem={(key) => setTerms((prev) => ({ ...prev, [key]: !prev[key] }))}
 *     onItemDetailClick={(key) => navigate(`/terms/${key}`)}
 *   />
 *
 * [split] 전체동의를 별도 카드로 분리 (예: A-5 소셜 회원가입 약관동의)
 *   <Agreement variant="split" allAgreeDescription="선택 항목 포함 전체 약관에 동의합니다" ... />
 *
 * 회원가입뿐 아니라 결제 등 약관 동의가 필요한 다른 화면에서도 재사용
 */
import Checkbox from '@/components/common/Checkbox'
import { IcRight } from '@/components/icons'

interface AgreementItem {
  key: string
  label: string
}

interface Props {
  items: AgreementItem[]
  checked: Record<string, boolean>
  onToggleAll: () => void
  onToggleItem: (key: string) => void
  onItemDetailClick?: (key: string) => void
  variant?: 'boxed' | 'split'
  allAgreeDescription?: string
  required?: boolean
  className?: string
}

const Agreement = ({
  items,
  checked,
  onToggleAll,
  onToggleItem,
  onItemDetailClick,
  variant = 'boxed',
  allAgreeDescription,
  required = false,
  className,
}: Props) => {
  const isAllAgreed = items.every(({ key }) => checked[key])

  const allAgreeContent = (
    <>
      <Checkbox checked={isAllAgreed} onChange={onToggleAll} strong aria-label="약관 전체 동의" />
      <div className="flex flex-col items-start">
        <p className="font-b7 text-black">
          약관 전체 동의
          {required && (
            <span className="ml-0.5 text-[#FF3B5B]">*</span>
          )}
        </p>
        {allAgreeDescription && <p className="font-b10 text-gray-40">{allAgreeDescription}</p>}
      </div>
    </>
  )

  const itemRows = items.map(({ key, label }) => (
    <div key={key} className="flex w-full items-center justify-between px-[10px] py-2">
      <div className="flex flex-1 items-center gap-1">
        <Checkbox checked={checked[key] ?? false} onChange={() => onToggleItem(key)} aria-label={label} />
        <p className="font-b8 text-gray-80">{label}</p>
      </div>
      {onItemDetailClick && (
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent p-0"
          onClick={() => onItemDetailClick(key)}
          aria-label={`${label} 상세보기`}
        >
          <IcRight width={24} height={24} className="text-gray-40" />
        </button>
      )}
    </div>
  ))

  if (variant === 'split') {
    return (
      <div className={className || 'flex w-full flex-col items-center gap-[10px] px-5 py-[10px]'}>
        <div className="flex w-full items-center gap-2 rounded-lg border border-gray-10 bg-[rgba(252,252,252,0.75)] p-3 shadow-[0px_15px_40px_0px_rgba(206,206,206,0.08)] backdrop-blur-[10px]">
          {allAgreeContent}
        </div>
        <div className="flex w-full flex-col items-start">{itemRows}</div>
      </div>
    )
  }

  return (
    <div className={className || 'flex w-full flex-col items-center px-5 py-[10px]'}>
      <div className="flex w-full flex-col items-start rounded-lg border border-gray-10 bg-[rgba(252,252,252,0.75)] shadow-[0px_15px_40px_0px_rgba(206,206,206,0.08)] backdrop-blur-[10px]">
        <div className="flex w-full items-center gap-1 px-3 py-2">{allAgreeContent}</div>
        {itemRows}
      </div>
    </div>
  )
}

export default Agreement
