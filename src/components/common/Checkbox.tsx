/**
 * Checkbox 사용법
 *
 * [기본] 체크 상태를 부모에서 관리
 *   <Checkbox
 *     checked={checked}
 *     onChange={(event) => setChecked(event.target.checked)}
 *   />
 *
 * [disabled] 비활성화
 *   <Checkbox checked={false} disabled />
 */

import type { InputHTMLAttributes } from "react";
import { IcCheckBox, IcCheckBoxFill } from "@/components/icons";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  checked?: boolean;
  className?: string;
}

/** Figma의 on/off 아이콘을 사용하는 접근 가능한 체크박스입니다. */
const Checkbox = ({
  checked = false,
  disabled = false,
  onChange,
  className = "",
  "aria-label": ariaLabel = "선택",
  ...inputProps
}: CheckboxProps) => (
  <label
    className={`relative inline-flex size-6 shrink-0 items-center justify-center ${
      disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
    } ${className}`}
  >
    <input
      type="checkbox"
      className="peer sr-only"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      readOnly={onChange ? inputProps.readOnly : true}
      aria-label={ariaLabel}
      {...inputProps}
    />
    <span className="inline-flex size-6 items-center justify-center rounded-sm text-[var(--color-gray-10)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-brand-100)] peer-checked:text-[var(--color-brand-100)]">
      {checked ? <IcCheckBoxFill /> : <IcCheckBox />}
    </span>
  </label>
);

export default Checkbox;
