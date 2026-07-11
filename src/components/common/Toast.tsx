/**
 * Toast 사용법
 *
 * 화면 하단에 떠 있는 안내 메시지
 *   <Toast message="연결 상태를 확인해 주세요" />
 */
interface Props {
  message: string
  className?: string
}

const Toast = ({ message, className }: Props) => (
  <div
    role="status"
    className={
      className ||
      'flex items-center justify-center whitespace-nowrap rounded-[100px] bg-[rgba(254,228,235,0.4)] px-5 py-2 font-b6 text-brand-100'
    }
  >
    {message}
  </div>
)

export default Toast
