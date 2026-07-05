/**
 * Calendar 사용법
 *
 * [단일 월] 시작 월부터 한 달 표시
 *   <Calendar startMonth={{ year: 2026, month: 7 }} />
 *
 * [다중 월] 연속된 여러 달과 선택 상태 표시
 *   <Calendar
 *     startMonth={{ year: 2026, month: 7 }}
 *     monthCount={2}
 *     selectedDate={selectedDate}
 *     onDateSelect={setSelectedDate}
 *   />
 *
 * [disabled] 특정 날짜 비활성화
 *   <Calendar startMonth={month} disabledDates={disabledDates} />
 */

import { Fragment } from "react";

import DayCell from "@/components/common/DayCell";
import Weekday from "@/components/common/Weekday";

export type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

export type CalendarMonth = Omit<CalendarDate, "day">;

export type CalendarProps = {
  startMonth: CalendarMonth;
  monthCount?: number;
  selectedDate?: CalendarDate;
  disabledDates?: readonly CalendarDate[];
  weekdays?: readonly string[];
  className?: string;
  onDateSelect?: (date: CalendarDate) => void;
  isDateDisabled?: (date: CalendarDate) => boolean;
};

const defaultWeekdays = ["일", "월", "화", "수", "목", "금", "토"] as const;

const getMonthByOffset = (
  { year, month }: CalendarMonth,
  offset: number,
): CalendarMonth => {
  const date = new Date(year, month - 1 + offset, 1);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
};

const isSameDate = (left: CalendarDate, right: CalendarDate) =>
  left.year === right.year &&
  left.month === right.month &&
  left.day === right.day;

/** Weekday와 DayCell을 조합해 연속된 여러 달을 표시하는 controlled calendar입니다. */
const Calendar = ({
  startMonth,
  monthCount = 1,
  selectedDate,
  disabledDates = [],
  weekdays = defaultWeekdays,
  className = "",
  onDateSelect,
  isDateDisabled,
}: CalendarProps) => {
  const normalizedMonthCount = Number.isFinite(monthCount)
    ? Math.max(1, Math.floor(monthCount))
    : 1;
  const months = Array.from({ length: normalizedMonthCount }, (_, index) =>
    getMonthByOffset(startMonth, index),
  );

  return (
    <div
      className={`flex w-full max-w-[356px] flex-col items-center justify-center gap-5 px-2 ${className}`}
    >
      <div className="grid w-full grid-cols-7 gap-x-6">
        {weekdays.map((weekday, index) => (
          <Weekday key={`${weekday}-${index}`} label={weekday} />
        ))}
      </div>

      {months.map(({ year, month }) => {
        const firstWeekday = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();
        const leadingEmptyCells = Array.from(
          { length: firstWeekday },
          (_, index) => index,
        );
        const days = Array.from(
          { length: daysInMonth },
          (_, index) => index + 1,
        );

        return (
          <Fragment key={`${year}-${month}`}>
            <h2 className="w-full font-b5 text-[var(--color-black)]">
              {year}년 {month}월
            </h2>

            <div className="grid w-full grid-cols-7 gap-x-6 gap-y-3">
              {leadingEmptyCells.map((cell) => (
                <span
                  key={`empty-${year}-${month}-${cell}`}
                  className="size-7"
                  aria-hidden
                />
              ))}
              {days.map((day) => {
                const date = { year, month, day };
                const disabled =
                  disabledDates.some((disabledDate) =>
                    isSameDate(disabledDate, date),
                  ) || isDateDisabled?.(date) === true;

                return (
                  <DayCell
                    key={day}
                    day={day}
                    selected={
                      selectedDate !== undefined &&
                      isSameDate(selectedDate, date)
                    }
                    disabled={disabled}
                    aria-label={`${year}년 ${month}월 ${day}일`}
                    onClick={() => onDateSelect?.(date)}
                  />
                );
              })}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default Calendar;
