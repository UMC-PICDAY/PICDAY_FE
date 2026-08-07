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
 *
 * [월 이동 제한] 이번 달 이전으로는 넘기지 못하게
 *   <Calendar startMonth={thisMonth} minMonth={thisMonth} />
 *
 * 오늘 날짜는 별도 설정 없이 항상 표시된다.
 * startMonth는 처음 보여줄 달이고, 이후 표시 월은 스테퍼(‹ ›)가 관리한다.
 * 스테퍼는 첫 달 제목 옆에만 두고 monthCount만큼씩 넘긴다.
 */

import { Fragment, useState } from "react";

import DayCell from "@/components/common/DayCell";
import Weekday from "@/components/common/Weekday";
import { IcBack, IcRight } from "@/components/icons";

export type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

export type CalendarMonth = Omit<CalendarDate, "day">;

export interface CalendarProps {
  startMonth: CalendarMonth;
  monthCount?: number;
  selectedDate?: CalendarDate;
  disabledDates?: readonly CalendarDate[];
  weekdays?: readonly string[];
  className?: string;
  /** 이 달 이전으로는 넘기지 못한다. 없으면 제한 없음. */
  minMonth?: CalendarMonth;
  /** 이 달 이후로는 넘기지 못한다. 없으면 제한 없음. */
  maxMonth?: CalendarMonth;
  onDateSelect?: (date: CalendarDate) => void;
  isDateDisabled?: (date: CalendarDate) => boolean;
}

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

/** 두 달의 앞뒤를 비교하기 위한 단조 증가 값. */
const toMonthIndex = ({ year, month }: CalendarMonth) => year * 12 + month;

const getToday = (): CalendarDate => {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
};

/** Weekday와 DayCell을 조합해 연속된 여러 달을 표시하는 controlled calendar입니다. */
const Calendar = ({
  startMonth,
  monthCount = 1,
  selectedDate,
  disabledDates = [],
  weekdays = defaultWeekdays,
  className = "",
  minMonth,
  maxMonth,
  onDateSelect,
  isDateDisabled,
}: CalendarProps) => {
  const today = getToday();
  const normalizedMonthCount = Number.isFinite(monthCount)
    ? Math.max(1, Math.floor(monthCount))
    : 1;
  // startMonth는 처음 보여줄 달일 뿐이고, 이후로는 스테퍼가 이 값을 옮긴다.
  const [viewMonth, setViewMonth] = useState<CalendarMonth>(startMonth);
  const months = Array.from({ length: normalizedMonthCount }, (_, index) =>
    getMonthByOffset(viewMonth, index),
  );

  // 두 달을 함께 보여줄 땐 두 달씩 넘겨야 6·7월 → 8·9월로 이어진다.
  const prevMonth = getMonthByOffset(viewMonth, -normalizedMonthCount);
  const nextMonth = getMonthByOffset(viewMonth, normalizedMonthCount);
  const prevDisabled =
    minMonth !== undefined && toMonthIndex(prevMonth) < toMonthIndex(minMonth);
  const maxVisibleMonth = months[months.length - 1];
  const nextDisabled =
    maxMonth !== undefined && toMonthIndex(maxVisibleMonth) >= toMonthIndex(maxMonth);

  return (
    <div
      className={`flex w-full max-w-[356px] flex-col items-center justify-center gap-5 px-2 ${className}`}
    >
      <div className="grid w-full grid-cols-7 gap-x-6">
        {weekdays.map((weekday, index) => (
          <Weekday key={`${weekday}-${index}`} label={weekday} />
        ))}
      </div>

      {months.map(({ year, month }, monthIndex) => {
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
            <div className="flex w-full items-center justify-between">
              <h2 className="font-b5 text-[var(--color-black)]">
                {year}년 {month}월
              </h2>

              {/* 여러 달을 함께 보여줄 때도 스테퍼는 첫 달 옆에만 둔다. */}
              {monthIndex === 0 && (
                <div className="flex shrink-0 items-center gap-[22px]">
                  <button
                    type="button"
                    aria-label="이전 달"
                    disabled={prevDisabled}
                    onClick={() => setViewMonth(prevMonth)}
                    className="disabled:cursor-not-allowed"
                  >
                    <IcBack
                      width={24}
                      height={24}
                      className={
                        prevDisabled
                          ? "text-[var(--color-gray-10)]"
                          : "text-[var(--color-gray-60)]"
                      }
                    />
                  </button>
                  <button
                    type="button"
                    aria-label="다음 달"
                    disabled={nextDisabled}
                    onClick={() => setViewMonth(nextMonth)}
                    className="disabled:cursor-not-allowed"
                  >
                    <IcRight
                      width={24}
                      height={24}
                      className={
                        nextDisabled
                          ? "text-[var(--color-gray-10)]"
                          : "text-[var(--color-gray-60)]"
                      }
                    />
                  </button>
                </div>
              )}
            </div>

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
                    today={isSameDate(today, date)}
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
