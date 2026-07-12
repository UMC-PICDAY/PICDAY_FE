/**
 * SegmentedTab 사용법
 *
 *  items와 선택값을 부모에서 전달
 *   <SegmentedTab
 *     items={[
 *       { value: 'booking', label: '예약관리' },
 *       { value: 'profile', label: '프로필 설정' },
 *     ]}
 *     value={tab}
 *     onChange={setTab}
 *   />
 */

import type { ButtonHTMLAttributes } from "react";

export type SegmentedTabItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface SegmentedTabProps {
  items: readonly SegmentedTabItem[];
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
  buttonProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "value" | "onChange"
  >;
}

/** 동일한 너비의 항목으로 구성된 controlled segmented tab입니다. */
const SegmentedTab = ({
  items,
  value,
  className = "",
  onChange,
  buttonProps,
}: SegmentedTabProps) => (
  <div
    role="tablist"
    className={`flex h-[41px] w-full items-center border-b border-[var(--color-gray-10)] ${className}`}
  >
    {items.map((item) => {
      const selected = item.value === value;

      return (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={selected}
          disabled={item.disabled}
          onClick={() => onChange?.(item.value)}
          className={`flex h-[41px] flex-1 items-center justify-center border-b-2 p-2.5 text-center disabled:cursor-not-allowed disabled:opacity-40 ${
            selected
              ? "border-[var(--color-brand-80)] font-b7 text-[var(--color-brand-80)]"
              : "border-transparent font-b8 text-[var(--color-gray-40)]"
          }`}
          {...buttonProps}
        >
          {item.label}
        </button>
      );
    })}
  </div>
);

export default SegmentedTab;
