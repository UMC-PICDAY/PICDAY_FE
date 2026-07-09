/**
 * SearchField 사용법
 *
 * [input] 검색어 입력
 *   <SearchField
 *     value={keyword}
 *     placeholder="사진관을 검색해 보세요"
 *     onChange={(event) => setKeyword(event.target.value)}
 *     onClear={() => setKeyword('')}
 *   />
 *
 * [result] 검색 결과 아이템
 *   <SearchField
 *     variant="result"
 *     resultLabel="픽데이 스튜디오"
 *     resultMeta="홍대"
 *     position="top"
 *     selected
 *   />
 */

import type {
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  MouseEventHandler,
} from "react";
import { IcClose, IcSearch } from "@/components/icons";

export type SearchFieldPosition = "standalone" | "top" | "middle" | "bottom";

interface SearchFieldBaseProps {
  disabled?: boolean;
  className?: string;
}

export interface SearchFieldInputProps extends SearchFieldBaseProps {
  variant?: "input";
  value: string;
  placeholder: string;
  inputName?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onSearch?: FormEventHandler<HTMLFormElement>;
  onClear?: MouseEventHandler<HTMLButtonElement>;
}

export interface SearchFieldResultProps extends SearchFieldBaseProps {
  variant: "result";
  selected?: boolean;
  position?: SearchFieldPosition;
  resultLabel: string;
  resultMeta: string;
  onResultClick?: MouseEventHandler<HTMLButtonElement>;
}

export type SearchFieldProps = SearchFieldInputProps | SearchFieldResultProps;

const positionStyles: Record<SearchFieldPosition, string> = {
  standalone: "rounded-lg border",
  top: "rounded-t-lg border",
  middle: "border-x border-b",
  bottom: "rounded-b-lg border-x border-b",
};

/** 검색 input과 자동완성 result row의 모든 Figma 상태를 제공합니다. */
const SearchField = (props: SearchFieldProps) => {
  const { disabled = false, className = "" } = props;

  if (props.variant === "result") {
    const {
      selected = false,
      position = "standalone",
      resultLabel,
      resultMeta,
      onResultClick,
    } = props;

    return (
      <button
        type="button"
        className={`flex h-12 w-full items-center justify-between overflow-hidden border-[var(--color-gray-10)]/60 px-4 font-b6 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-[var(--color-brand-100)] disabled:cursor-not-allowed disabled:opacity-40 ${
          selected
            ? "bg-[var(--color-brand-20)]/30 text-[var(--color-brand-100)]"
            : "bg-[var(--color-white)]/75 text-[var(--color-gray-80)]"
        } ${positionStyles[position]} ${className}`}
        aria-pressed={selected}
        disabled={disabled}
        onClick={onResultClick}
      >
        <span>{resultLabel}</span>
        <span
          className={
            selected
              ? "text-[var(--color-brand-100)]"
              : "text-[var(--color-gray-40)]"
          }
        >
          {resultMeta}
        </span>
      </button>
    );
  }

  const { value, placeholder, inputName, onChange, onSearch, onClear } = props;
  const isActive = value.length > 0;
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(event);
  };

  return (
    <form
      className={`group flex h-12 w-full items-center gap-2.5 rounded-lg border bg-[var(--color-white)]/75 px-4 shadow-[0_15px_40px_rgba(206,206,206,0.08)] backdrop-blur-[10px] focus-within:border-[var(--color-gray-60)] ${
        isActive
          ? "border-[var(--color-gray-60)]"
          : "border-[var(--color-gray-10)]/60"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""} ${className}`}
      role="search"
      onSubmit={handleSubmit}
    >
      <IcSearch
        width={24}
        height={24}
        className={`shrink-0 ${
          isActive
            ? "text-[var(--color-gray-80)]"
            : "text-[var(--color-gray-20)] group-focus-within:text-[var(--color-gray-80)]"
        }`}
        aria-hidden
      />
      <input
        name={inputName}
        type="search"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={!onChange}
        onChange={onChange}
        className="min-w-0 flex-1 appearance-none bg-transparent font-b6 text-[var(--color-gray-80)] outline-none placeholder:text-[var(--color-gray-40)] [&::-webkit-search-cancel-button]:hidden"
      />
      <button
        type="button"
        className={`${
          isActive ? "inline-flex" : "hidden group-focus-within:inline-flex"
        } size-6 shrink-0 items-center justify-center text-[var(--color-gray-40)] focus-visible:outline-2 focus-visible:outline-[var(--color-brand-100)]`}
        aria-label="검색어 지우기"
        disabled={disabled}
        onClick={onClear}
      >
        <IcClose />
      </button>
    </form>
  );
};

export default SearchField;
