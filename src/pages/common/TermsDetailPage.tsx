/**
 * Figma A-3 약관 상세 (라우트: /terms/:termType) — SignUpPage(A-3)에서 항목 클릭 시 진입
 * 레이아웃은 4개 약관이 전부 동일(뒤로가기 바 + 제목 + 섹션/불릿)해서 페이지를 나누지 않고
 * termType에 따라 TERM_CONTENT에서 내용만 골라 렌더링함
 */
import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'

type TermType = 'service' | 'privacy' | 'age' | 'marketing'

interface TermSection {
  heading: string
  bullets: ReactNode[]
}

interface TermContent {
  title: string
  sections: TermSection[]
}

const TERM_CONTENT: Record<TermType, TermContent> = {
  service: {
    title: '서비스 이용약관 동의 (필수)',
    sections: [
      {
        heading: '서비스 개요',
        bullets: [
          'PICDAY는 사진관 탐색·비교·예약을 제공하는 온라인 플랫폼입니다.',
          'PICDAY는 통신판매중개자이며, 촬영 서비스의 당사자가 아닙니다.',
          '촬영 내용·품질·결과물에 대한 책임은 해당 사진관에 있습니다.',
          '사진관 정보(가격·컨셉·운영시간·포트폴리오)는 사진관이 제공한 자료를 기준으로 게시됩니다.',
        ],
      },
      {
        heading: '회원 계정',
        bullets: [
          '만 14세 이상만 가입할 수 있습니다.',
          '자체 계정(아이디·비밀번호) 또는 카카오·네이버 계정으로 가입합니다.',
          '닉네임은 가입 시 자동 부여되며 마이페이지에서 변경할 수 있습니다.',
          '계정을 타인에게 양도하거나 대여할 수 없습니다.',
          '타인 정보 도용, 허위 정보 등록 시 이용이 제한될 수 있습니다.',
        ],
      },
      {
        heading: '예약과 결제',
        bullets: [
          <>
            예약은 결제 완료 시점에 <span className="font-semibold">즉시 확정</span>됩니다. 사진관의 별도 승인 절차는
            없습니다.
          </>,
          '동일 사진관·동일 시간대는 결제가 먼저 완료된 1건만 확정됩니다.',
          '화면에 표기된 금액 외 추가 비용은 없습니다.',
          '촬영 당일 컨셉·인원·옵션을 추가하면 사진관에서 현장 결제로 진행됩니다.',
        ],
      },
      {
        heading: '취소와 환불',
        bullets: [
          '예약 취소는 마이페이지에서 즉시 처리됩니다.',
          '취소 수수료와 환불 금액은 사진관마다 다릅니다.',
          '촬영 당일에는 서비스를 통한 취소가 불가합니다.',
        ],
      },
      {
        heading: '리뷰',
        bullets: [
          '리뷰는 촬영을 완료한 예약 건에 한해 작성할 수 있습니다.',
          '비방·광고·허위 내용의 리뷰는 사전 통지 없이 삭제될 수 있습니다.',
        ],
      },
      {
        heading: '회원 탈퇴',
        bullets: [
          '마이페이지에서 언제든 탈퇴할 수 있습니다.',
          '진행 중인 예약이 있으면 탈퇴할 수 없습니다.',
          '작성한 리뷰는 탈퇴 후에도 서비스에 남을 수 있습니다.',
        ],
      },
      {
        heading: '기타',
        bullets: [
          '약관 개정 시 적용일 7일 전(회원에게 불리한 개정은 30일 전)에 공지합니다.',
          '분쟁은 대한민국 법령에 따르며, 민사소송법상 관할 법원에 제소합니다.',
        ],
      },
    ],
  },
  privacy: {
    title: '개인정보 수집·이용 동의 (필수)',
    sections: [
      {
        heading: '수집 항목',
        bullets: [
          '자체 가입 — 이름, 아이디, 비밀번호, 이메일, 휴대폰번호',
          '소셜 가입 — 카카오·네이버 계정의 이름, 이메일, 휴대폰번호',
          '자동 부여 — 닉네임',
          '자동 수집 — 접속 IP, 접속 일시, 기기 정보, 서비스 이용 기록',
        ],
      },
      {
        heading: '이용 목적',
        bullets: [
          '회원 식별 및 가입 의사 확인',
          '회원제 서비스 제공 및 계정 관리',
          '고객 문의 접수 및 처리',
          '부정 이용 방지',
          '서비스 공지사항 전달',
        ],
      },
      {
        heading: '보유 기간',
        bullets: [
          '회원 탈퇴 시 지체 없이 파기합니다.',
          '계약·청약철회 기록 — 5년 (전자상거래법)',
          '대금결제·재화 공급 기록 — 5년 (전자상거래법)',
          '소비자 불만·분쟁처리 기록 — 3년 (전자상거래법)',
          '서비스 접속 기록 — 3개월 (통신비밀보호법)',
        ],
      },
      {
        heading: '동의를 거부할 권리',
        bullets: ['동의를 거부할 수 있습니다. 다만 필수 항목에 동의하지 않으면 회원가입이 불가합니다.'],
      },
    ],
  },
  age: {
    title: '만 14세 이상 확인 (필수)',
    sections: [
      {
        heading: '확인 사항',
        bullets: [
          'PICDAY는 만 14세 미만 아동의 회원가입을 받지 않습니다.',
          '본인은 만 14세 이상임을 확인합니다.',
          '만 14세 미만으로 확인되면 계정 이용이 제한되고, 수집된 개인정보는 지체 없이 파기됩니다.',
          '만 14세 미만 아동은 법정대리인 동의를 거쳐 별도 문의해 주세요.',
        ],
      },
      {
        heading: '동의를 거부할 권리',
        bullets: ['이 항목에 동의하지 않으면 회원가입이 불가합니다.'],
      },
    ],
  },
  // Figma 프레임 이름/본문은 "마케팅 알림 수신 동의"인데 제목 텍스트만 다른 약관 제목이 잘못 남아있어서,
  // 프레임 이름·본문 내용·SignUpPage의 기존 TermKey 라벨을 기준으로 제목을 바로잡음
  marketing: {
    title: '마케팅 알림 수신 동의 (선택)',
    sections: [
      {
        heading: '이용 목적',
        bullets: ['신규 사진관 입점·프로모션·이벤트 안내', '맞춤 사진관·컨셉 추천 정보 제공', '서비스 개선을 위한 이용 통계 분석'],
      },
      {
        heading: '수집 항목',
        bullets: ['이름, 닉네임, 이메일, 휴대폰번호', '검색·조회·예약 이력'],
      },
      {
        heading: '수신 채널',
        bullets: ['앱 푸시 알림, 이메일, 문자메시지(SMS)'],
      },
      {
        heading: '보유 기간과 철회',
        bullets: [
          '동의 철회 시 또는 회원 탈퇴 시까지 보유합니다.',
          '마이페이지 > 알림 설정에서 언제든 철회할 수 있습니다.',
          '예약 확정·취소 안내 등 필수 안내는 동의 여부와 관계없이 발송됩니다.',
        ],
      },
    ],
  },
}

const TermsDetailPage = () => {
  const navigate = useNavigate()
  const { termType } = useParams<{ termType: string }>()
  const content = termType && termType in TERM_CONTENT ? TERM_CONTENT[termType as TermType] : null

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar showRight={false} onBack={() => navigate(-1)} />

      {content && (
        <div className="flex w-full flex-col px-5">
          <div className="flex items-center justify-center py-5">
            <p className="font-h4 text-gray-80">{content.title}</p>
          </div>

          {content.sections.map((section) => (
            <div key={section.heading} className="flex flex-col pb-5">
              <p className="pb-3 font-b5 text-brand-100">{section.heading}</p>
              <ul className="flex flex-col">
                {section.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start pb-2 last:pb-0">
                    <span className="flex size-5 shrink-0 items-center justify-center pt-[2px]">
                      <span className="size-1 rounded-full bg-brand-100" />
                    </span>
                    <span className="font-b6 text-gray-80">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TermsDetailPage
