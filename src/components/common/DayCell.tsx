/**
 * DayCell 사용법
 *
 *  날짜 표시
 *   <DayCell day={1} />
 *
 * [selected] 선택된 날짜
 *   <DayCell day={1} selected onClick={handleDateSelect} />
 *
 * [disabled] 선택할 수 없는 날짜
 *   <DayCell day={1} disabled />
 *
 * [today] 오늘 날짜
 *   <DayCell day={1} today />
 */

import type { ButtonHTMLAttributes } from "react";

export interface DayCellProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  day: number | string;
  selected?: boolean;
  today?: boolean;
}

/** Calendar에서 사용하는 28×28px 날짜 셀입니다. */
const DayCell = ({
  day,
  selected = false,
  today = false,
  disabled = false,
  className = "",
  type = "button",
  ...buttonProps
}: DayCellProps) => (
  <button
    type={type}
    // 오늘이면서 선택된 날짜는 선택 상태를 우선한다.
    className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full font-b8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-100)] disabled:cursor-not-allowed disabled:text-[var(--color-gray-20)] ${
      selected
        ? "bg-[var(--color-brand-100)] text-[var(--color-white)]"
        : today
          ? "bg-[var(--color-gray-10)] text-[var(--color-black)]"
          : "bg-transparent text-[var(--color-black)]"
    } ${className}`}
    aria-pressed={selected}
    aria-current={today ? "date" : undefined}
    disabled={disabled}
    {...buttonProps}
  >
    {day}
  </button>
);

export default DayCell;
