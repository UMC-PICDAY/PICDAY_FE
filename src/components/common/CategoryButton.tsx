/**
 * CategoryButton 사용법
 *
 * 사진 촬영 카테고리 선택 버튼
 *   <CategoryButton />
 *
 * 선택 상태 표시
 *   <CategoryButton label="증명" active />
 *
 * 클릭 동작 연결
 *   <CategoryButton
 *     label="프로필"
 *     active={selectedCategory === 'profile'}
 *     onClick={() => setSelectedCategory('profile')}
 *   />
 */

interface Props {
  label?: string
  active?: boolean
  onClick?: () => void
}

const TabProfile = ({
  label = '프로필',
  active = false,
  onClick,
}: Props) => (
  <button
    type="button"
    aria-pressed={active}
    className={`flex h-[32px] items-center justify-center gap-[10px] rounded-full px-5 py-1 whitespace-nowrap ${
      active
        ? 'bg-brand-100 font-b6 text-white'
        : 'bg-transparent font-b7 text-gray-80'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
)

export default TabProfile