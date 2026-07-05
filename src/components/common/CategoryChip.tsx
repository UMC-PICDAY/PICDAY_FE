/**
 * CategoryChip 사용법
 *
 * [compact] 작은 카테고리 칩 (기본값)
 *   <CategoryChip label="헤어·메이크업" />
 *
 * [large] 큰 카테고리 칩
 *   <CategoryChip label="주차" size="large" />
 */

import type { HTMLAttributes } from "react";

export type CategoryChipProps = HTMLAttributes<HTMLSpanElement> & {
  label: string;
  size?: "compact" | "large";
};

/** 사진관의 부가 카테고리를 표시하는 읽기 전용 칩입니다. */
const CategoryChip = ({
  label,
  size = "compact",
  className = "",
  ...spanProps
}: CategoryChipProps) => (
  <span
    className={`inline-flex w-fit items-center justify-center whitespace-nowrap rounded-full px-2 py-0.5 ring-1 ring-inset ring-[var(--color-gray-10)] ${
      size === "large"
        ? "bg-[var(--color-gray-20)] font-cap1 text-[var(--color-gray-60)]"
        : "bg-transparent font-cap4 text-[var(--color-gray-40)]"
    } ${className}`}
    {...spanProps}
  >
    {label}
  </span>
);

export default CategoryChip;
