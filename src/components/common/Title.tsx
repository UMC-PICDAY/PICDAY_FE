/**
 * Title 사용법
 *
 * 섹션 제목과 설명 텍스트
 *   <Title />
 *
 * variant에 따라 다른 형태 표시
 *   <Title variant="default" />
 *   <Title variant="large" />
 *   <Title variant="onlyTitle" />
 *
 * 제목/설명 변경
 *   <Title
 *     title="최근 본 사진관"
 *     description="로그인하면 기록이 저장돼요"
 *   />
 */

interface Props {
  variant?: 'default' | 'large' | 'onlyTitle'
  title?: string
  description?: string
}

const Title = ({
  variant = 'default',
  title = '최근 본 사진관',
  description = '로그인하면 기록이 저장돼요',
}: Props) => {
  const isLarge = variant === 'large'
  const isOnlyTitle = variant === 'onlyTitle'

  return (
    <div className="flex w-full flex-col items-start gap-1 px-5 py-[10px]">
      <h2 className={`${isLarge ? 'font-h5' : 'font-b5'} text-black`}>
        {title}
      </h2>

      {!isOnlyTitle && (
        <p className="font-cap1 text-[#AAA]">
          {description}
        </p>
      )}
    </div>
  )
}

export default Title