/**
 * TimeChip 사용법
 *
 * [property1] 선택된 칩 / 핑크 배경 + 핑크 테두리
 *   <TimeChip label="친절한 응대" property1="selected" />
 *
 * [property2] 기본 칩 / 흰 배경 + 회색 테두리
 *   <TimeChip label="시간 엄수" />
 *
 * [variant3] 비활성 칩 / 회색 배경 + 회색 테두리
 *   <TimeChip label="11:00" property1="disabled" />
 */

interface Props {
  label: string
  property1?: 'default' | 'selected' | 'disabled'
  onClick?: () => void
}

const TimeChip = ({ label, property1 = 'default', onClick }: Props) => {
  const chipClass = {
    selected:
      'border-brand-80 bg-brand-20 text-brand-80 font-b9',
    default:
      'border-[rgba(238,238,238,0.6)] bg-[rgba(252,252,252,0.75)] text-gray-60 font-b10',
    disabled:
      'border-gray-20 bg-gray-10 text-gray-40 font-b10',
  }

  return (
    <button
      type="button"
      className={`flex h-8 items-center justify-center rounded-[32px] border px-4 shadow-[0_15px_40px_0_rgba(206,206,206,0.08)] backdrop-blur-[10px] ${chipClass[property1]}`}
      onClick={onClick}
      disabled={property1 === 'disabled'}
    >
      {label}
    </button>
  )
}

export default TimeChip