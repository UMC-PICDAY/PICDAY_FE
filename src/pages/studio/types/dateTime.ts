import type { CalendarDate } from '@/components/common/Calendar'

export interface StudioTimeSlot {
  slotId: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface StudioDateTimeSelection {
  date: CalendarDate
  slotId: string
  startTime: string
  endTime: string
}
