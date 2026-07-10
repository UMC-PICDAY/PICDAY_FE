import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import MiniTitle from '@/components/common/MiniTitle'
import FilterChip from '@/components/common/FilterChip'
import Calendar, { type CalendarDate } from '@/components/common/Calendar'
import Button from '@/components/common/Button'
import { useSearchDraftStore } from '@/stores/useSearchDraftStore'

const DateSelectPage = () => {
  const navigate = useNavigate()
  const setDateDraft = useSearchDraftStore((state) => state.setDate)
  const setDateUndecidedDraft = useSearchDraftStore((state) => state.setDateUndecided)
  const [selectedDate, setSelectedDate] = useState<CalendarDate | undefined>(
    () => useSearchDraftStore.getState().date ?? undefined,
  )
  const [isUndecided, setIsUndecided] = useState(() => useSearchDraftStore.getState().isDateUndecided)

  const startMonth = useMemo(() => {
    const today = new Date()
    return { year: today.getFullYear(), month: today.getMonth() + 1 }
  }, [])

  const canProceed = isUndecided || selectedDate !== undefined

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar title="검색" showRight={false} onBack={() => navigate(-1)} />

      <MiniTitle title="촬영 날짜는 언제인가요?" />

      <div className="w-full px-5">
        <FilterChip
          label="날짜 미정"
          selected={isUndecided}
          onClick={() => {
            setIsUndecided((prev) => !prev)
            setSelectedDate(undefined)
          }}
        />
      </div>

      <div className="flex w-full flex-col items-center px-5 py-5">
        <Calendar
          startMonth={startMonth}
          monthCount={2}
          selectedDate={selectedDate}
          onDateSelect={(date) => {
            setSelectedDate(date)
            setIsUndecided(false)
          }}
        />
      </div>

      <div className="mt-auto w-full p-5">
        <Button
          variant={canProceed ? 'primary' : 'disabled'}
          onClick={() => {
            if (isUndecided) setDateUndecidedDraft()
            else if (selectedDate) setDateDraft(selectedDate)
            navigate('/search')
          }}
        >
          다음
        </Button>
      </div>
    </div>
  )
}

export default DateSelectPage
