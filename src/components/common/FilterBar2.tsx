/**
 * FilterBar2 사용법
 *
 * 사진관 정렬·편의 조건 필터
 *   <FilterBar2
 *     items={[
 *       { value: 'recommended', label: '추천순' },
 *       { value: 'lowest-price', label: '가격낮은순' },
 *     ]}
 *     value={filter}
 *     onChange={setFilter}
 *   />
 */

import FilterChip from "./FilterChip";

export type FilterItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type FilterBar2Props = {
  items: readonly FilterItem[];
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
};

/** 사진관 정렬·편의 조건을 가로로 선택하는 필터 바입니다. */
const FilterBar2 = ({
  items,
  value,
  className = "",
  onChange,
}: FilterBar2Props) => (
  <div
    className={`flex h-[52px] w-full items-center gap-2.5 overflow-x-auto bg-[var(--color-white)] px-5 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
  >
    {items.map((item) => (
      <FilterChip
        key={item.value}
        label={item.label}
        size="medium"
        selected={item.value === value}
        disabled={item.disabled}
        onClick={() => onChange?.(item.value)}
      />
    ))}
  </div>
);

export default FilterBar2;
