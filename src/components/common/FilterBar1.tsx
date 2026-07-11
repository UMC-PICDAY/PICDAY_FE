/**
 * FilterBar1 사용법
 *
 * [기본] 예약 상태와 건수 필터
 *   <FilterBar1
 *     items={[
 *       { value: 'all', label: '전체', count: 3 },
 *       { value: 'reserved', label: '예약완료', count: 1 },
 *     ]}
 *     value={filter}
 *     onChange={setFilter}
 *   />
 */

import FilterChip from "@/components/common/FilterChip";

export type CountFilterItem = {
  value: string;
  label: string;
  count: number;
  disabled?: boolean;
};

export interface FilterBar1Props {
  items: readonly CountFilterItem[];
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
}

/** 예약 상태와 건수를 FilterChip으로 선택하는 필터 바입니다. */
const FilterBar1 = ({
  items,
  value,
  className = "",
  onChange,
}: FilterBar1Props) => (
  <div
    className={`flex h-[52px] w-full items-center justify-between px-5 py-2.5 ${className}`}
  >
    {items.map((item) => (
      <FilterChip
        key={item.value}
        label={item.label}
        count={item.count}
        size="medium"
        selected={item.value === value}
        disabled={item.disabled}
        onClick={() => onChange?.(item.value)}
      />
    ))}
  </div>
);

export default FilterBar1;
