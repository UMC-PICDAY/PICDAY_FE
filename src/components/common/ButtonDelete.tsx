/**
 * ButtonDelete 사용법
 *
 * 기본 (20x20)
 *   <ButtonDelete onClick={handleClick} />
 *
 * 미니 (14x14)
 *   <ButtonDelete size="mini" onClick={handleClick} />
 */

interface Props {
  size?: 'default' | 'mini'
  onClick?: () => void
}

// 원과 X가 한 shape(subtract)로 되어있어 X 부분이 뚫려 배경(사진 등)이 비쳐 보임 — Figma node 1257:18706
const DEFAULT_PATH =
  'M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM14.3555 5.64453C14.102 5.39109 13.6911 5.39128 13.4375 5.64453L10 9.08203L6.5625 5.64453C6.30891 5.39129 5.89799 5.39107 5.64453 5.64453C5.39107 5.89799 5.39129 6.30891 5.64453 6.5625L9.08203 10L5.64453 13.4375C5.39128 13.6911 5.39109 14.102 5.64453 14.3555C5.898 14.6089 6.30893 14.6087 6.5625 14.3555L10 10.918L13.4375 14.3555C13.6911 14.6087 14.102 14.6089 14.3555 14.3555C14.6089 14.102 14.6087 13.6911 14.3555 13.4375L10.918 10L14.3555 6.5625C14.6087 6.30893 14.6089 5.898 14.3555 5.64453Z'
const MINI_PATH =
  'M7 0C10.8661 0 14.001 3.13387 14.001 7C14.0009 10.866 10.8661 14 7 14C3.13406 13.9999 0.000126013 10.8659 0 7C0 3.13395 3.13398 0.000137879 7 0ZM10.0488 3.95117C9.87135 3.7739 9.5837 3.77386 9.40625 3.95117L7 6.35742L4.59375 3.95117C4.41623 3.77398 4.12857 3.77379 3.95117 3.95117C3.77377 4.12857 3.77398 4.41622 3.95117 4.59375L6.35742 7L3.95117 9.40625C3.77383 9.5837 3.77389 9.87134 3.95117 10.0488C4.12864 10.2262 4.41626 10.2262 4.59375 10.0488L7 7.64258L9.40625 10.0488C9.58376 10.2263 9.87134 10.2263 10.0488 10.0488C10.2263 9.87134 10.2263 9.58375 10.0488 9.40625L7.64258 7L10.0488 4.59375C10.2262 4.41625 10.2262 4.12863 10.0488 3.95117Z'

const ButtonDelete = ({ size = 'default', onClick }: Props) => {
  const isMini = size === 'mini'
  const dimension = isMini ? 14 : 20

  return (
    <button
      type="button"
      className="flex items-center justify-center border-none bg-transparent p-0 cursor-pointer"
      style={{ width: dimension, height: dimension }}
      onClick={onClick}
      aria-label="삭제"
    >
      <svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`} fill="none">
        <path d={isMini ? MINI_PATH : DEFAULT_PATH} fill="#171617" opacity={0.3} />
      </svg>
    </button>
  )
}

export default ButtonDelete
