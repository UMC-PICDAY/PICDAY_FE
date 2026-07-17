import { useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'

interface PolicySection {
  heading: string
  items: string[]
}

const POLICY_SECTIONS: PolicySection[] = [
  {
    heading: '리뷰 작성 자격',
    items: [
      '촬영을 완료한 예약 건에 한해 리뷰를 작성할 수 있습니다.',
      '예약 1건당 리뷰 1개를 작성할 수 있습니다.',
      '리뷰 작성은 마이페이지 예약 상세에서 진행합니다.',
    ],
  },
  {
    heading: '리뷰 작성 기준',
    items: [
      '별점, 촬영 컨셉, 내용(최소 10자), 사진(최대 5장)을 등록할 수 있습니다.',
      '등록한 사진은 해당 사진관의 리뷰 영역에 공개됩니다.',
      '타인의 사진이나 저작권이 있는 이미지는 등록할 수 없습니다.',
    ],
  },
  {
    heading: '금지되는 리뷰',
    items: [
      '욕설·비방·차별·혐오 표현이 포함된 리뷰',
      '광고, 홍보, 외부 링크가 포함된 리뷰',
      '실제 촬영과 무관한 내용이거나 허위 사실이 포함된 리뷰',
      '타인의 개인정보(이름·연락처 등)가 노출된 리뷰',
      '음란하거나 불쾌감을 주는 사진이 포함된 리뷰',
    ],
  },
  {
    heading: '리뷰 삭제·비공개',
    items: [
      '위 기준을 위반한 리뷰는 사전 통지 없이 삭제되거나 비공개 처리될 수 있습니다.',
      '반복 위반 시 리뷰 작성이 제한될 수 있습니다.',
    ],
  },
]

const PolicyBullet = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2 pb-2">
    <span className="mt-[9px] size-1 shrink-0 rounded-full bg-brand-100" />
    <span className="font-b6 text-gray-80">{text}</span>
  </li>
)

const ReviewPolicyPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <NavigationBar variant="default" showRight={false} onBack={() => navigate(-1)} />

      <main className="px-5 pb-10">
        <h1 className="py-5 font-h4 text-gray-80">리뷰 운영정책</h1>

        {POLICY_SECTIONS.map((section) => (
          <section key={section.heading} className="pb-5">
            <h2 className="pb-3 font-b5 text-brand-100">{section.heading}</h2>
            <ul className="flex flex-col">
              {section.items.map((item) => (
                <PolicyBullet key={item} text={item} />
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  )
}

export default ReviewPolicyPage
