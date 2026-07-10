/**
 * InputField 사용법
 *
 * [기본] 일반 텍스트 입력
 *   <InputField
 *     label="아이디"
 *     placeholder="아이디를 입력해 주세요"
 *     value={value}
 *     onChange={(event) => setValue(event.target.value)}
 *   />
 *
 * [prefix] 전화번호 등의 고정 prefix 표시
 *   <InputField
 *     label="전화번호"
 *     placeholder="휴대폰 번호를 입력해 주세요"
 *     prefix="+82"
 *   />
 *
 * [error] 유효성 오류 메시지 표시
 *   <InputField
 *     label="아이디"
 *     placeholder="영문 소문자, 숫자를 포함하여 4~12자로 작성"
 *     error="이미 사용 중인 아이디에요"
 *   />
 */

import { useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "placeholder"
  > {
  label: string;
  placeholder: string;
  prefix?: string;
  error?: string;
  wrapperClassName?: string;
}

/** label과 선택적 prefix 영역을 포함하는 48px 높이의 입력 필드입니다. */
const InputField = ({
  label,
  prefix,
  placeholder,
  error,
  wrapperClassName = "",
  className = "",
  id,
  disabled,
  ...inputProps
}: InputFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputStyle =
    "min-w-0 bg-[var(--color-white)] px-5 py-3 font-b6 text-[var(--color-black)] outline-none disabled:cursor-not-allowed disabled:bg-[var(--color-gray-10)] disabled:text-[var(--color-gray-40)]";
  const borderStyle = error
    ? "border-[var(--color-error)]"
    : "border-[var(--color-gray-10)] focus:border-[var(--color-gray-60)]";

  return (
    <div className={`flex w-full flex-col gap-1 px-5 pb-3 ${wrapperClassName}`}>
      <label htmlFor={inputId} className="font-b4 text-[var(--color-black)]">
        {label}
      </label>
      {prefix ? (
        <div
          className={`flex h-12 w-full items-stretch overflow-hidden rounded-lg border bg-[var(--color-white)] focus-within:border-[var(--color-gray-60)] ${borderStyle}`}
        >
          <span className="inline-flex h-full shrink-0 items-center border-r border-[var(--color-gray-10)] px-5 font-b6 text-[var(--color-gray-40)]">
            {prefix}
          </span>
          <input
            id={inputId}
            className={`${inputStyle} h-full flex-1 border-0 placeholder:text-[var(--color-gray-40)] ${className}`}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            {...inputProps}
          />
        </div>
      ) : (
        <input
          id={inputId}
          className={`${inputStyle} h-12 w-full rounded-lg border placeholder:text-[var(--color-gray-40)] ${borderStyle} ${className}`}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          {...inputProps}
        />
      )}
      {error && <p className="font-cap3 text-[var(--color-error)]">{error}</p>}
    </div>
  );
};

export default InputField;
