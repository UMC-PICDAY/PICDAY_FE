/**
 * RangeSlider 사용법
 *
 *  범위 안내만 표시
 *   <RangeSlider min={30000} max={150000} />
 *
 * [active] 선택 범위를 부모에서 관리
 *   <RangeSlider
 *     variant="active"
 *     min={30000}
 *     max={150000}
 *     value={range}
 *     onValueChange={setRange}
 *   />
 */

import type { ChangeEvent, CSSProperties } from "react";

type RangeSliderBaseProps = {
  min: number;
  max: number;
  className?: string;
  formatValue?: (value: number) => string;
};

export type RangeSliderDefaultProps = RangeSliderBaseProps & {
  variant?: "default";
};

export type RangeSliderActiveProps = RangeSliderBaseProps & {
  variant: "active";
  step?: number;
  value: readonly [number, number];
  disabled?: boolean;
  onValueChange: (value: [number, number]) => void;
};

export type RangeSliderProps = RangeSliderDefaultProps | RangeSliderActiveProps;

const THUMB_SIZE = 16;
const THUMB_RADIUS = THUMB_SIZE / 2;

const rangeInputStyle =
  "pointer-events-none absolute left-0 top-[-4px] h-4 w-full appearance-none bg-transparent outline-none focus:z-30 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--color-brand-80)] [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-brand-80)] focus-visible:[&::-moz-range-thumb]:outline-2 focus-visible:[&::-moz-range-thumb]:outline-offset-2 focus-visible:[&::-moz-range-thumb]:outline-[var(--color-brand-100)] focus-visible:[&::-webkit-slider-thumb]:outline-2 focus-visible:[&::-webkit-slider-thumb]:outline-offset-2 focus-visible:[&::-webkit-slider-thumb]:outline-[var(--color-brand-100)] disabled:[&::-moz-range-thumb]:cursor-not-allowed disabled:[&::-webkit-slider-thumb]:cursor-not-allowed";

const defaultFormatValue = (value: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);

/** 두 개의 native range input으로 구성된 가격 범위 슬라이더입니다. */
const RangeSlider = (props: RangeSliderProps) => {
  const { min, max, className = "", formatValue = defaultFormatValue } = props;
  const activeProps = props.variant === "active" ? props : undefined;
  const value = activeProps?.value ?? [min, min];
  const lowerValue = Math.max(min, Math.min(Math.min(value[0], value[1]), max));
  const upperValue = Math.max(min, Math.min(Math.max(value[0], value[1]), max));
  const span = Math.max(max - min, 1);
  const lowerPercent = ((lowerValue - min) / span) * 100;
  const upperPercent = ((upperValue - min) / span) * 100;
  const lowerOffset = THUMB_RADIUS - (lowerPercent / 100) * THUMB_SIZE;
  const upperOffset = THUMB_RADIUS - (upperPercent / 100) * THUMB_SIZE;
  const fillStyle = {
    left: `calc(${lowerPercent}% + ${lowerOffset}px)`,
    width: `calc(${upperPercent - lowerPercent}% + ${upperOffset - lowerOffset}px)`,
  } satisfies CSSProperties;

  const handleLowerChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!activeProps) return;

    const next = Math.min(Number(event.target.value), upperValue);
    activeProps.onValueChange([next, upperValue]);
  };

  const handleUpperChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!activeProps) return;

    const next = Math.max(Number(event.target.value), lowerValue);
    activeProps.onValueChange([lowerValue, next]);
  };

  return (
    <div
      className={`relative flex h-[30px] w-full max-w-[390px] flex-col gap-1 ${className}`}
    >
      <div className="relative h-2 w-full shrink-0 rounded-full bg-[var(--color-gray-10)]">
        {activeProps && (
          <>
            <span
              aria-hidden
              className="absolute top-0 h-2 rounded-full bg-[var(--color-brand-20)]"
              style={fillStyle}
            />
            <input
              type="range"
              min={min}
              max={max}
              step={activeProps.step ?? 10000}
              value={lowerValue}
              disabled={activeProps.disabled}
              onChange={handleLowerChange}
              aria-label="최소 가격"
              className={`${rangeInputStyle} ${lowerValue >= upperValue ? "z-20" : "z-10"}`}
            />
            <input
              type="range"
              min={min}
              max={max}
              step={activeProps.step ?? 10000}
              value={upperValue}
              disabled={activeProps.disabled}
              onChange={handleUpperChange}
              aria-label="최대 가격"
              className={`${rangeInputStyle} z-10`}
            />
          </>
        )}
      </div>
      <div className="flex w-full items-center justify-between font-cap1 text-[var(--color-gray-60)]">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}+</span>
      </div>
    </div>
  );
};

export default RangeSlider;
