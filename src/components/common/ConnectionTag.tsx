/**
 * ConnectionTag 사용법
 *
 * 계정/서비스 연결 상태 태그
 *   <ConnectionTag />
 *
 * 문구 변경
 *   <ConnectionTag label="연결된 외부 계정 없음" />
 */

interface Props {
  label?: string
}

const ConnectionTag = ({ label = '연결됨' }: Props) => {
  return (
    <span className="inline-flex items-center justify-center rounded-[8px] bg-brand-40 px-[10px] py-[5px] font-cap2 text-gray-60">
      {label}
    </span>
  )
}

export default ConnectionTag