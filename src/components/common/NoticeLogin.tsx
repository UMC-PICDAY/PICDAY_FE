/**
 * NoticeLogin 사용법
 *
 * 로그인이 필요한 화면에서 보여주는 안내 + 로그인 버튼
 *   <NoticeLogin onLoginClick={() => navigate('/login')} />
 *
 * 문구 변경
 *   <NoticeLogin
 *     title="예약 내역을 확인하려면 로그인하세요"
 *     description="로그인한 후 예약 내역을 확인할 수 있어요."
 *     onLoginClick={handleLoginClick}
 *   />
 */
interface Props {
  title?: string
  description?: string
  onLoginClick?: () => void
  className?: string
}

const NoticeLogin = ({
  title = '위시리스트를 확인하려면 로그인하세요',
  description = '로그인한 후 위시리스트를 저장하고 확인할 수 있어요.',
  onLoginClick,
  className,
}: Props) => (
  <div className={className || 'flex flex-col items-center justify-center gap-5'}>
    <div className="flex flex-col items-center gap-1 whitespace-nowrap">
      <p className="font-b3 text-black">{title}</p>
      <p className="font-b6 text-gray-60">{description}</p>
    </div>
    <button
      type="button"
      className="cursor-pointer rounded-lg border-none bg-brand-100 px-[30px] py-3 font-b3 text-white"
      onClick={onLoginClick}
    >
      로그인
    </button>
  </div>
)

export default NoticeLogin
