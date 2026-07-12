import { useState } from 'react'
import type { MouseEvent } from 'react'

import Calendar from '@/components/common/Calendar'
import NoticeBanner from '@/components/common/NoticeBanner'
import TimeChip from '@/components/common/TimeChip'
import { IcClose } from '@/components/icons'

import type { CalendarDate } from '@/components/common/Calendar'

const TIMES = [
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
]

interface DateChangeSheetProps {
  onClose?: () => void
  onApply?: () => void
  noAvailableTime?: boolean
}

const DateChangeSheet = ({
  onClose,
  onApply,
  noAvailableTime = false,
}: DateChangeSheetProps) => {
  const [selectedDate, setSelectedDate] = useState<CalendarDate>({
    year: 2026,
    month: 6,
    day: 15,
  })
  const [selectedTime, setSelectedTime] = useState('14:00')

  const hasAvailableTime = !noAvailableTime

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-[60px] z-40 mx-auto flex max-w-[390px] items-start justify-center bg-black/40 px-3 pt-3"
      onClick={onClose}
    >
      <div
        className="max-h-[calc(100dvh-84px)] w-full overflow-y-auto rounded-[20px] bg-white px-2 pb-4"
        onClick={(event: MouseEvent) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-10 px-2 py-[15px]">
          <p className="font-b3 text-black">날짜 변경</p>
          <button type="button" onClick={onClose} aria-label="닫기">
            <IcClose width={24} height={24} />
          </button>
        </div>

        <div className="flex justify-center py-5">
          <Calendar
            startMonth={{ year: 2026, month: 6 }}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        <div className="flex flex-col gap-2.5 px-2 pb-4">
          <p className="font-b5 text-black">시간대</p>
          <div className="grid grid-cols-5 gap-x-[9px] gap-y-2.5">
            {TIMES.map((time) => (
              <TimeChip
                key={time}
                label={time}
                selected={!noAvailableTime && selectedTime === time}
                disabled={noAvailableTime}
                onClick={() => setSelectedTime(time)}
                className="w-full"
              />
            ))}
          </div>
        </div>

        {!hasAvailableTime && (
          <div className="px-2 pb-2.5">
            <NoticeBanner label="예약 가능한 시간이 없어요. 다른 날짜를 선택해 주세요." />
          </div>
        )}

        <div className="px-2">
          <button
            type="button"
            disabled={!hasAvailableTime}
            onClick={onApply}
            className="flex w-full items-center justify-center rounded-xl bg-brand-100 px-5 py-3 font-b5 text-white disabled:bg-gray-20"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default DateChangeSheet
