/**
 * CategoryButton 사용법
 *
 * 사진 촬영 카테고리 선택 버튼
 *   <CategoryButton />
 *
 * 촬영 목적 변경
 *   <CategoryButton type="프로필" />
 *
 * 선택 상태 표시
 *   <CategoryButton type="증명" active />
 *
 * 클릭 동작 연결
 *   <CategoryButton
 *     type="프로필"
 *     active={selectedCategory === '프로필'}
 *     onClick={() => setSelectedCategory('프로필')}
 *   />
 */

import PurposeIcon from '@/components/common/PurposeIcon'

type PurposeType = '증명' | '프로필' | '개인화보' | '취업' | '가족' | '우정'

interface Props {
  type?: PurposeType
  active?: boolean
  onClick?: () => void
  className?: string
}

const CategoryButton = ({
  type = '증명',
  active = false,
  onClick,
  className,
}: Props) => (
  <button
    type="button"
    aria-pressed={active}
    className={`flex w-[173px] flex-col items-center justify-center rounded-[16px] border border-brand-40 px-[10px] py-[15px] ${
      active
        ? 'bg-brand-20 shadow-[0_0_4px_0_#FEE4EB]'
        : 'bg-[rgba(252,252,252,0.75)]'
    } ${className ?? ''}`}
    onClick={onClick}
  >
    <div className={`flex flex-col items-center ${active ? 'gap-[5px]' : 'gap-[2px]'}`}>
      <PurposeIcon type={type} selected={active} />

      <span className={`${active ? 'font-b5' : 'font-b6'} text-black`}>
        {type}
      </span>
    </div>
  </button>
)

export default CategoryButton