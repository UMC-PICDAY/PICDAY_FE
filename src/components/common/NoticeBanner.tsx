/**
 * NoticeBanner 사용법
 *
 * 안내 문구를 보여주는 공지 배너
 *   <NoticeBanner />
 *
 */

interface Props {
  label?: string
}

const NoticeBanner = ({
  label = '리뷰 작성 기능은 준비중이에요',
}: Props) => (
  <div className="flex w-full items-center justify-center rounded-[8px] bg-brand-20 px-5 py-3">
    <p className="font-b8 text-brand-100">
      {label}</p>
  </div>
)

export default NoticeBanner