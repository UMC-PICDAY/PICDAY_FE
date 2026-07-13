/**
 * AgreementDetailPage 사용법
 *
 * 예약 결제 약관의 상세 내용을 보여주는 페이지
 *
 * URL 형식
 *   /reservation/terms/:key
 *
 * 지원하는 key
 *   - reservationRule
 *   - privacy
 *   - privacyThirdParty
 *   - paymentTerms
 *
 * AGREEMENT_CONTENTS에서 key에 맞는
 * 약관 제목과 섹션 내용을 조회해 표시
 *
 * 주요 기능
 *   - 약관 제목과 세부 항목 렌더링
 *   - 뒤로가기 시 이전 페이지 이동
 *   - 잘못된 key 접근 시 오류 안내 표시
 *
 */

import { useNavigate, useParams } from 'react-router'
import NavigationBar from '@/components/layout/NavigationBar'

interface AgreementSection {
  title: string
  items: string[]
}

interface AgreementContent {
  title: string
  sections: AgreementSection[]
}

interface AgreementSectionProps {
  title: string
  items: string[]
  isLast?: boolean
}

const AGREEMENT_CONTENTS: Record<string, AgreementContent> = {
  reservationRule: {
    title: '촬영 이용규칙 및 취소/환불 규정 동의 (필수)',
    sections: [
      {
        title: '이용규칙',
        items: [
          '예약은 결제 완료 시점에 즉시 확정됩니다.',
          '동일 사진관·동일 시간대는 결제가 먼저 완료된 1건만 확정됩니다.',
          '촬영 당일 컨셉·인원을 추가하면 사진관에서 현장 결제로 진행됩니다.',
          '촬영 지각 시 촬영 시간이 단축될 수 있으며, 별도 보상이나 환불은 없습니다.',
          '보정본 매수와 전달 시점은 예약한 컨셉 기준을 따릅니다.',
          '제공된 포트폴리오 이미지는 실제 촬영물과 다를 수 있습니다.',
          '현장에서 발생한 분쟁에 대해 PICDAY는 통신판매중개자로서 책임지지 않습니다.',
        ],
      },
      {
        title: '취소/환불 규정',
        items: [
          '예약 취소는 마이페이지에서 즉시 처리됩니다.',
          '환불 정책은 사진관마다 다를 수 있습니다.',
          '촬영 당일에는 서비스를 통한 취소가 불가합니다.',
          '사전 통지 없이 방문하지 않으면(노쇼) 환불이 제한될 수 있습니다.',
          '사진관 사정으로 취소된 경우 100% 환불됩니다.',
          '환불은 원 결제 수단으로 영업일 기준 3~5일 내 처리됩니다.',
        ],
      },
    ],
  },

  privacy: {
    title: '개인정보 수집·이용 동의 (필수)',
    sections: [
      {
        title: '수집 항목',
        items: [
          '예약자 정보 — 이름, 휴대폰번호',
          '예약 정보 — 사진관, 촬영 컨셉, 촬영 날짜·시간, 인원',
          '결제 정보 — 결제 수단, 결제 금액, 승인 정보, 거래 일시',
          '카드번호 등 결제 인증 정보는 결제대행사가 처리하며, PICDAY는 보관하지 않습니다.',
        ],
      },
      {
        title: '이용 목적',
        items: [
          '촬영 예약 접수 및 예약 확정 처리',
          '예약자 확인 및 예약 관련 연락',
          '결제·취소·환불 처리',
          '예약 관련 문의 대응 및 분쟁 처리',
        ],
      },
      {
        title: '보유 기간',
        items: [
          '촬영 완료 또는 예약 취소 시 파기합니다.',
          '계약·청약철회 기록 — 5년 (전자상거래법)',
          '대금결제·재화 공급 기록 — 5년 (전자상거래법)',
          '소비자 불만·분쟁처리 기록 — 3년 (전자상거래법)',
        ],
      },
      {
        title: '동의를 거부할 권리',
        items: [
          '동의를 거부할 수 있습니다. 다만 동의하지 않으면 예약이 불가합니다.',
        ],
      },
    ],
  },

  privacyThirdParty: {
    title: '개인정보 제3자 제공 동의 (필수)',
    sections: [
      {
        title: '제공받는 자',
        items: ['회원이 예약한 해당 사진관'],
      },
      {
        title: '제공 항목',
        items: [
          '예약자 이름, 휴대폰번호',
          '촬영 컨셉, 촬영 날짜·시간, 인원, 예약 번호',
        ],
      },
      {
        title: '제공 목적',
        items: [
          '촬영 예약 확인 및 일정 관리',
          '촬영 서비스 제공',
          '예약 관련 연락',
        ],
      },
      {
        title: '보유·이용 기간',
        items: [
          '촬영 완료 또는 예약 취소 시까지',
          '관계 법령에 따른 보존 기간이 있는 경우 해당 기간까지',
        ],
      },
      {
        title: '동의를 거부할 권리',
        items: [
          '동의를 거부할 수 있습니다. 다만 사진관에 예약 정보를 전달할 수 없어 예약이 불가합니다.',
        ],
      },
    ],
  },

  paymentTerms: {
    title: '결제대행 서비스 약관 동의 (필수)',
    sections: [
      {
        title: '결제대행 서비스',
        items: [
          '결제는 전자금융거래법에 따라 등록된 결제대행사를 통해 처리됩니다.',
          '결제 수단 — 신용/체크카드, 토스페이, 카카오페이, 간편 계좌이체, 네이버페이',
        ],
      },
      {
        title: '결제 정보 처리',
        items: [
          '카드번호·계좌번호 등 결제 인증 정보는 결제대행사가 직접 수집·처리합니다.',
          'PICDAY는 결제 승인 번호, 결제 수단, 결제 금액, 거래 일시만 전달받아 보관합니다.',
          '결제대행사는 결제 처리와 부정거래 방지 목적으로만 결제 정보를 이용합니다.',
        ],
      },
      {
        title: '취소와 환불',
        items: [
          '환불은 결제대행사를 통해 원 결제 수단으로 처리됩니다.',
          '카드사·금융기관 정책에 따라 영업일 기준 3~5일이 소요될 수 있습니다.',
        ],
      },
      {
        title: '결제 오류',
        items: [
          '네트워크 장애로 결제가 정상 처리되지 않으면 결제는 자동 취소되고 예약은 생성되지 않습니다.',
          '결제 후 예약 확정에 실패하면 결제는 자동 취소되고 안내됩니다.',
          '중복 결제 등 오류가 확인되면 결제대행사와 협의해 신속히 환불합니다.',
        ],
      },
    ],
  },
}

const AgreementDetailPage = () => {
  const navigate = useNavigate()
  const { key } = useParams()

  const agreementContent = key ? AGREEMENT_CONTENTS[key] : undefined

  if (!agreementContent) {
    return (
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white text-black">
        <div className="sticky top-0 z-20 bg-white">
          <NavigationBar
            title=""
            showRight={false}
            onBack={() => navigate(-1)}
          />
        </div>

        <main className="flex flex-1 items-center justify-center px-5">
          <p className="font-b6 text-gray-80">
            약관 정보를 찾을 수 없습니다.
          </p>
        </main>

      </div>
    )
  }

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white text-black">
      <div className="sticky top-0 z-20 bg-white">

        <NavigationBar
          title=""
          showRight={false}
          onBack={() => navigate(-1)}
        />
      </div>

      <main className="flex flex-1 flex-col px-5 pb-10">
        <div className="py-5">
          <h1 className="font-h4 text-gray-80">
            {agreementContent.title}
          </h1>
        </div>

        {agreementContent.sections.map((section, index) => (
          <AgreementSection
            key={`${section.title}-${index}`}
            title={section.title}
            items={section.items}
            isLast={index === agreementContent.sections.length - 1}
          />
        ))}
      </main>
    </div>
  )
}

const AgreementSection = ({
  title,
  items,
  isLast = false,
}: AgreementSectionProps) => (
  <section className={isLast ? '' : 'pb-5'}>
    <div className="pb-3">
      <h2 className="font-b5 text-brand-100">{title}</h2>
    </div>

    <ul className="flex flex-col">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-start pb-2">
          <span className="mt-[9px] size-1 shrink-0 rounded-full bg-brand-100" />

          <p className="font-b6 ml-3 flex-1 text-gray-80">
            {item}
          </p>
        </li>
      ))}
    </ul>
  </section>
)

export default AgreementDetailPage