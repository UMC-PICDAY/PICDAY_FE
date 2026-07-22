import { useMemo, useState } from 'react'
import type { MouseEvent } from 'react'

import Calendar from '@/components/common/Calendar'
import NoticeBanner from '@/components/common/NoticeBanner'
import TimeChip from '@/components/common/TimeChip'
import { IcClose } from '@/components/icons'

import type { CalendarDate } from '@/components/common/Calendar'
import type {
  StudioDateTimeSelection,
  StudioTimeSlot,
} from '@/pages/studio/types/dateTime'

interface DateChangeSheetProps {
  initialSelection: StudioDateTimeSelection | null
  slots: readonly StudioTimeSlot[]
  onDateChange: (date: CalendarDate) => void
  onApply: (selection: StudioDateTimeSelection) => void
  onClose: () => void
  isSlotsLoading?: boolean
}

const isSameDate = (left: CalendarDate, right: CalendarDate) =>
  left.year === right.year &&
  left.month === right.month &&
  left.day === right.day

const toLocalDate = ({ year, month, day }: CalendarDate) =>
  new Date(year, month - 1, day)

const DateChangeSheet = ({
  initialSelection,
  slots,
  onDateChange,
  onClose,
  onApply,
  isSlotsLoading = false,
}: DateChangeSheetProps) => {
  const today = useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])
  const startMonth = useMemo(
    () => ({ year: today.getFullYear(), month: today.getMonth() + 1 }),
    [today],
  )
  const [selectedDate, setSelectedDate] = useState<CalendarDate | undefined>(
    initialSelection?.date,
  )
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>(
    initialSelection?.slotId,
  )

  const selectedSlot = slots.find(
    (slot) => slot.slotId === selectedSlotId && slot.isAvailable,
  )
  const hasAvailableSlot = slots.some((slot) => slot.isAvailable)
  const canApply = selectedDate !== undefined && selectedSlot !== undefined

  const handleDateSelect = (date: CalendarDate) => {
    if (selectedDate === undefined || !isSameDate(selectedDate, date)) {
      setSelectedSlotId(undefined)
    }

    setSelectedDate(date)
    onDateChange(date)
  }

  const handleApply = () => {
    if (!selectedDate || !selectedSlot) return

    onApply({
      date: selectedDate,
      slotId: selectedSlot.slotId,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
    })
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-[60px] z-40 mx-auto flex max-w-[390px] items-start justify-center bg-black/40 px-3 pt-3"
      onClick={onClose}
    >
      <div
        className="max-h-[calc(100dvh-84px)] w-full overflow-y-auto rounded-[20px] bg-white px-2 pb-4"
        onClick={(event: MouseEvent) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="date-change-title"
      >
        <div className="flex items-center justify-between border-b border-gray-10 px-2 py-[15px]">
          <p id="date-change-title" className="font-b3 text-black">
            날짜 변경
          </p>
          <button type="button" onClick={onClose} aria-label="닫기">
            <IcClose width={24} height={24} />
          </button>
        </div>

        <div className="flex justify-center py-5">
          <Calendar
            startMonth={startMonth}
            monthCount={2}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            isDateDisabled={(date) => toLocalDate(date) < today}
          />
        </div>

        <div className="flex flex-col gap-2.5 px-2 pb-4">
          <p className="font-b5 text-black">시간대</p>
          <div className="grid grid-cols-5 gap-x-[9px] gap-y-2.5">
            {slots.map((slot) => (
              <TimeChip
                key={slot.slotId}
                label={slot.startTime}
                property1={
                  !slot.isAvailable
                    ? 'disabled'
                    : selectedSlotId === slot.slotId
                      ? 'selected'
                      : 'default'
                }
                onClick={() => setSelectedSlotId(slot.slotId)}
                className="w-full"
              />
            ))}
          </div>
        </div>

        {isSlotsLoading && selectedDate && (
          <div className="px-2 pb-2.5">
            <NoticeBanner label="예약 가능한 시간을 불러오고 있어요." />
          </div>
        )}

        {!isSlotsLoading && selectedDate && !hasAvailableSlot && (
          <div className="px-2 pb-2.5">
            <NoticeBanner label="예약 가능한 시간이 없어요. 다른 날짜를 선택해 주세요." />
          </div>
        )}

        <div className="px-2">
          <button
            type="button"
            disabled={!canApply || isSlotsLoading}
            onClick={handleApply}
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
