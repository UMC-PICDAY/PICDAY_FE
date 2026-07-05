/**
 * LikesChip 사용법
 *
 * 좋아요 상태와 개수를 부모에서 관리
 *   <LikesChip
 *     count={likeCount}
 *     liked={liked}
 *     onLikedChange={setLiked}
 *   />
 *

 */

import type { ButtonHTMLAttributes } from "react";
import { IcThumbsUp } from "@/components/icons";

export type LikesChipProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onClick"
> & {
  count: number;
  liked: boolean;
  onLikedChange: (liked: boolean) => void;
};

/** 좋아요 수와 선택 상태를 표시하고, 선택 변경을 부모에 전달하는 칩 버튼입니다. */
const LikesChip = ({
  count,
  liked,
  onLikedChange,
  className = "",
  type = "button",
  disabled,
  ...buttonProps
}: LikesChipProps) => {
  const tone = liked
    ? "border-[var(--color-brand-100)] bg-[var(--color-brand-80)] text-[var(--color-white)] shadow-[0_15px_20px_rgba(206,206,206,0.08)] font-b9"
    : "border-[var(--color-gray-10)]/60 bg-[var(--color-white)]/75 text-[var(--color-gray-60)] shadow-[0_15px_40px_rgba(206,206,206,0.08)] font-b10";

  return (
    <button
      type={type}
      className={`inline-flex h-8 min-w-[66px] w-fit shrink-0 items-center justify-center gap-[5px] rounded-[32px] border px-4 py-1 backdrop-blur-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-100)] disabled:cursor-not-allowed disabled:opacity-40 ${tone} ${className}`}
      disabled={disabled}
      onClick={() => onLikedChange(!liked)}
      {...buttonProps}
    >
      <IcThumbsUp className="shrink-0" />
      <span>{count}</span>
    </button>
  );
};

export default LikesChip;
