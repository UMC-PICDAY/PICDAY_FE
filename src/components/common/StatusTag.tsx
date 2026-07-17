/**
 * StatusTag 사용법
 *
 * 예약 상태를 나타내는 태그
 *   <StatusTag />
 *
 * 상태별 표시
 *   <StatusTag variant="reservation" />
 *   <StatusTag variant="shooting" />
 *   <StatusTag variant="canceled" />
 *
 * 표시 텍스트 변경
 *   <StatusTag variant="reservation" label="결제 완료" />
 */

interface Props {
  variant?: 'reservation' | 'shooting' | 'canceled'
  label?: string
}

const statusStyle = {
  reservation: {
    label: '예약 완료',
    className: 'border-brand-40 bg-brand-20 text-gray-80',
  },
  shooting: {
    label: '촬영 완료',
    className: 'border-brand-100 bg-brand-80 text-white',
  },
  canceled: {
    label: '취소',
    className: 'border-gray-20 bg-gray-10 text-gray-80',
  },
}

const StatusTag = ({ variant = 'reservation', label }: Props) => {
  const status = statusStyle[variant]

  return (
    <span
      className={`flex w-fit items-center justify-center rounded-[100px] border px-2 py-1 font-cap2 ${status.className}`}
    >
      {label ?? status.label}
    </span>
  )
}

export default StatusTag