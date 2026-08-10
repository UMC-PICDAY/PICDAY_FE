/**
 * MiniTitle 사용법
 *
 * 검색 관련 화면 상단의 안내 문구
 *   <MiniTitle title="어떤 사진관을 찾고 있나요?" />
 */
import type { ReactNode } from 'react'

interface Props {
  title: ReactNode
  className?: string
}

const MiniTitle = ({ title, className }: Props) => (
  <div className={className || 'flex w-full items-start p-5'}>
    <p className="font-b3 text-black">{title}</p>
  </div>
)

export default MiniTitle
