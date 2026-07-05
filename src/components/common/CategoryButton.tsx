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
  imageSrc?: string
  active?: boolean
  onClick?: () => void
}

const CategoryButton = ({
  label = '증명',
  imageSrc,
  active = false,
  onClick,
}: Props) => (
  <button
    type="button"
    aria-pressed={active}
    className={`flex w-[173px] flex-col items-center justify-center gap-[10px] rounded-[16px] border px-[10px] py-[15px] ${
      active
        ? 'border-brand-40 bg-brand-20 shadow-[0_0_4px_0_#FEE4EB]'
        : 'border-brand-40 bg-[rgba(252,252,252,0.75)]'
    }`}
    onClick={onClick}
  >
    {imageSrc ? (
      <img
        src={imageSrc}
        alt=""
        className="h-10 w-10 object-cover"
      />
    ) : (
      <div className="h-10 w-10 bg-[#D9D9D9]" />
    )}

    <span className={`${active ? 'font-b5' : 'font-b6'} text-black`}>
      {label}
    </span>
  </button>
)

export default CategoryButton