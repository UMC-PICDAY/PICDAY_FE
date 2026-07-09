/**
 * FilterChip 사용법
 *
 * [기본] 텍스트 필터
 *   <FilterChip label="전체" />
 *
 * [선택] 선택된 필터
 *   <FilterChip label="예약완료" selected />
 *
 * [count] 건수 표시
 *   <FilterChip label="전체" count={3} size="medium" />
 *
 * [강조] 선택 전 강조 상태
 *   <FilterChip label="추천" highlighted />
 */

import type { ButtonHTMLAttributes } from "react";

export type FilterChipSize = "compact" | "medium" | "large";

export interface FilterChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  count?: number;
  selected?: boolean;
  highlighted?: boolean;
  size?: FilterChipSize;
}

const sizeStyles: Record<FilterChipSize, string> = {
  compact: "h-[27px] py-1",
  medium: "h-8 py-1",
  large: "h-[37px] py-2",
};

const typographyStyles: Record<
  FilterChipSize,
  { default: string; selected: string }
> = {
  compact: { default: "font-b10", selected: "font-b10" },
  medium: { default: "font-b10", selected: "font-b9" },
  large: { default: "font-b8", selected: "font-b7" },
};

/** Figma FilterChip의 크기, 선택, 강조 및 count 상태를 표현합니다. */
const FilterChip = ({
  label,
  count,
  selected = false,
  highlighted = false,
  size = count === undefined ? "compact" : "medium",
  className = "",
  type = "button",
  disabled,
  ...buttonProps
}: FilterChipProps) => {
  const tone = selected
    ? "border-[var(--color-brand-100)] bg-[var(--color-brand-80)] text-[var(--color-white)] shadow-[0_15px_20px_rgba(206,206,206,0.08)]"
    : highlighted
      ? "border-[var(--color-brand-40)] bg-[var(--color-brand-20)] text-[var(--color-brand-100)] shadow-[0_15px_24px_rgba(252,200,215,0.10)]"
      : "border-[var(--color-gray-10)]/60 bg-[var(--color-white)]/75 text-[var(--color-gray-60)] shadow-[0_15px_40px_rgba(206,206,206,0.08)]";

  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center justify-center gap-[5px] whitespace-nowrap rounded-[32px] border px-4 backdrop-blur-[10px] disabled:cursor-not-allowed disabled:opacity-40 ${sizeStyles[size]} ${tone} ${typographyStyles[size][selected ? "selected" : "default"]} ${className}`}
      aria-pressed={selected}
      disabled={disabled}
      {...buttonProps}
    >
      <span>{label}</span>
      {count !== undefined && <span>{count}</span>}
    </button>
  );
};

export default FilterChip;
