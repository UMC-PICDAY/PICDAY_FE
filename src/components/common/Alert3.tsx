/**
 * Alert3 사용법
 *
 * [default] 이미 예약된 시간 안내
 *   <Alert3 />
 *   <Alert3 onClick={handleClick} />
 *
 * [variant2] 진행 중인 예약이 있어 탈퇴할 수 없는 경우
 *   <Alert3 variant="variant2" />
 *   <Alert3 variant="variant2" onClick={handleClick} />
 *
 * [variant3] 로그인이 필요한 경우
 *   <Alert3 variant="variant3" />
 *   <Alert3 variant="variant3" onClick={handleLogin} />
 *
 * 텍스트 변경
 *   <Alert3 title="제목" description="설명" buttonText="확인" helperText="닫기" />
 *
 * helperText(닫기 등) 클릭
 *   <Alert3 variant="variant3" onClick={handleLogin} onHelperClick={handleClose} />
 */

    import type { ReactNode } from 'react'

    import Button from '@/components/common/Button'
    import { IcError, IcEvent2, IcLock } from '@/components/icons'

    interface Props {
    variant?: 'default' | 'variant2' | 'variant3'
    title?: ReactNode
    description?: ReactNode
    buttonText?: string
    helperText?: string
    onClick?: () => void
    onHelperClick?: () => void
    }

    const alertContent = {
    default: {
        icon: <IcEvent2 width={36} height={36} className="text-brand-100" />,
        title: '이미 예약된 시간대에요',
        description: (
        <>
            선택하신 시간대는 방금 마감됐어요
            <br />
            다른 시간을 확인해 주세요
        </>
        ),
        buttonText: '다른 시간 선택하기',
        helperText: '선택하신 컨셉 목록으로 돌아갑니다',
    },
    variant2: {
        icon: <IcError width={36} height={36} className="text-brand-100" />,
        title: (
        <>
            진행 중인 예약이 있어
            <br />
            탈퇴할 수 없어요
        </>
        ),
        description: '예약을 취소하신 후 탈퇴를 진행해 주세요',
        buttonText: '확인',
        helperText: '',
    },
    variant3: {
        icon: <IcLock width={36} height={36} className="text-brand-100" />,
        title: '로그인이 필요해요',
        description: '로그인하고 이용해 보세요',
        buttonText: '로그인',
        helperText: '닫기',
    }
    }

    const Alert3 = ({
    variant = 'default',
    title,
    description,
    buttonText,
    helperText,
    onClick,
    onHelperClick,
    }: Props) => {
    const content = alertContent[variant]

    return (
        <div className="flex w-full flex-col items-center rounded-[12px] bg-white">
        <div className="flex w-full flex-col items-center">
            <div className="w-full flex justify-center pt-5">
                <div className="p-2 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-brand-20 text-brand-100">
                    {content.icon}
                </div>
            </div>

            <div className="w-full pt-6 pb-1 flex flex-col items-center gap-2 text-center">
            <h2 className="font-h6 text-black">{title ?? content.title}</h2>
            <p className="font-b6 text-gray-60">{description ?? content.description}</p>
            </div>

            <div className="w-full px-5 py-5">
            <Button variant="primary" onClick={onClick}>
                {buttonText ?? content.buttonText}
            </Button>
            </div>

            {(variant === 'default' || variant === 'variant3') &&
            (helperText ?? content.helperText) ? (
            <button
                type="button"
                className="mb-5 font-b8 text-gray-40"
                onClick={onHelperClick}
            >
                {helperText ?? content.helperText}
            </button>
            ) : null}
        </div>
        </div>
    )
    }

    export default Alert3