/**
 * PageIndicator 사용법
 *
 * 현재 페이지와 전체 페이지 수 표시
 *   <PageIndicator />
 *
 * 페이지 값 변경
 *   <PageIndicator current={1} total={8} />
 *   <PageIndicator current={3} total={8} />
 */

interface Props {
  current?: number
  total?: number
}

const PageIndicator = ({ 
  current = 1, 
  total = 8, 
}: Props) => (
  <span className="flex w-[44px] items-center justify-center rounded-[100px] bg-gray-60 px-3 py-0.5 font-cap1 text-white opacity-60">
    {current}/{total}
  </span>
)

export default PageIndicator