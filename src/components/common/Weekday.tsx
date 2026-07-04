/**
 * Weekday 사용법
 *
 *  캘린더 요일 표시
 *   <Weekday label="월" />
 */

import type { HTMLAttributes } from "react";

export type WeekdayProps = HTMLAttributes<HTMLSpanElement> & {
  label: string;
};

/** Calendar 헤더에서 사용하는 28×28px 요일 표시입니다. */
const Weekday = ({ label, className = "", ...spanProps }: WeekdayProps) => (
  <span
    className={`inline-flex size-7 shrink-0 items-center justify-center font-b8 text-[var(--color-gray-60)] ${className}`}
    {...spanProps}
  >
    {label}
  </span>
);

export default Weekday;
