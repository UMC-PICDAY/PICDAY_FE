import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import CardPortfolioGrid from '@/components/cards/CardPortfolioGrid'
import FeatureGrid from '@/components/common/FeatureGrid'
import { IcError, IcPin, IcRight, IcStar } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'
import NavigationBarTransparent from '@/components/layout/NavigationBarTransparent'
import TabBarUser from '@/components/layout/TabBarUser'

import BottomSheet from '@/pages/studio/components/BottomSheet'
import ErrorNotice from '@/pages/studio/components/ErrorNotice'
import HairMakeupSheet from '@/pages/studio/components/HairMakeupSheet'
import ReviewCard from '@/pages/studio/components/ReviewCard'
import StudioInfoSheet from '@/pages/studio/components/StudioInfoSheet'

import heroImage from '@/assets/images/CardImage1.png'

type OpenSheet = 'info' | 'hairmakeup' | null

const USAGE_PREVIEW = [
  {
    title: '운영 정보',
    items: ['운영시간: 매일 12:00 - 20:00', '휴무일: 연중무휴', '예약 마감: 촬영 1일 전'],
  },
  {
    title: '주차 정보',
    items: ['건물 내 주차 가능 (2시간 무료)', '만차 시 인근 공영주차장 이용 안내'],
  },
  {
    title: '촬영 안내',
    items: [
      '의상 무료 대여 (개인화보 컨셉 한정)',
      '헤어메이크업 제휴샵 연계 가능 (추가 비용)',
      '보정본은 촬영 후 7일 이내 전달',
    ],
  },
]

const Bullet = ({ text }: { text: string }) => (
  <li className="flex items-start gap-1.5">
    <span className="mt-[7px] size-1 shrink-0 rounded-full bg-brand-100" />
    <span className="font-b8 text-gray-80">{text}</span>
  </li>
)

const Divider = () => <div className="h-1.5 w-full bg-gray-10" />

const StudioDetailPage = () => {
  const navigate = useNavigate()
  const { studioId } = useParams()
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null)
  const [favorited, setFavorited] = useState(false)
  const [searchParams] = useSearchParams()

  const closeSheet = () => setOpenSheet(null)
  const goToReviews = () => navigate(`/studios/${studioId}/reviews`)
  const goToConcepts = () => navigate(`/studios/${studioId}/concepts`)

  if (searchParams.get('state') === 'error') {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <NavigationBar variant="default" showRight={false} />
        <div className="flex flex-1 items-center justify-center">
          <ErrorNotice
            icon={<IcError width={48} height={48} className="text-brand-80" />}
            title="정보를 불러오지 못했어요"
          />
        </div>
        <TabBarUser activeTab="search" />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-white pb-24">
      {/* 히어로 */}
      <div className="relative h-[302px] w-full shrink-0">
        <img src={heroImage} alt="데이지 스튜디오" className="size-full object-cover" />
        <div className="absolute inset-x-0 top-0">
          <NavigationBarTransparent
            isFavorited={favorited}
            onBack={() => navigate(-1)}
            onFavorite={() => setFavorited((prev) => !prev)}
          />
        </div>
      </div>

      {/* 이름 / 위치 / 별점 */}
      <div className="px-5 py-3">
        <h1 className="py-2 font-h3 text-black">데이지 스튜디오</h1>
        <div className="flex items-center pb-1 font-b6 text-gray-60">
          <IcPin width={20} height={20} className="shrink-0" />
          <span>홍대입구역 도보 5분</span>
          <span className="px-1">|</span>
          <span>서울 마포구</span>
        </div>
        <button type="button" onClick={goToReviews} className="flex items-center pb-2">
          <IcStar width={20} height={20} className="shrink-0 text-brand-80" />
          <span className="pl-0.5 font-b7 text-black">4.9</span>
          <span className="pl-0.5 font-b7 text-gray-40">(721개 평가)</span>
          <IcRight width={20} height={20} className="text-gray-40" />
        </button>
      </div>

      <Divider />

      {/* 촬영 컨셉 */}
      <section className="px-5">
        <h2 className="pb-3 pt-5 font-b3 text-black">촬영 컨셉</h2>
        <CardPortfolioGrid className="flex w-full items-center justify-center gap-2" />
        <button
          type="button"
          onClick={goToConcepts}
          className="mt-5 flex w-full items-center justify-center rounded-lg border border-brand-100 px-5 py-3"
        >
          <span className="flex-1 text-center font-b3 text-brand-100">모든 컨셉 보기</span>
          <IcRight width={24} height={24} className="text-brand-100" />
        </button>
      </section>

      <Divider />

      {/* 편의시설 및 서비스 */}
      <section className="px-5">
        <div className="flex items-center pb-3 pt-5">
          <h2 className="flex-1 font-b3 text-black">편의시설 및 서비스</h2>
          <IcRight width={24} height={24} className="text-gray-40" />
        </div>
        <div className="flex justify-center pb-5">
          <FeatureGrid />
        </div>
      </section>

      <Divider />

      {/* 위치 및 주변 정보 */}
      <section className="px-5">
        <h2 className="pb-3 pt-5 font-b3 text-black">위치 및 주변 정보</h2>
        <div className="relative flex h-[180px] w-full items-center justify-center rounded-xl bg-gray-20">
          <IcPin width={48} height={48} className="text-brand-100" />
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <IcPin width={20} height={20} className="shrink-0" />
            <span className="font-b4 text-black">서울 마포구 동교동 (홍대입구)</span>
          </div>
          <button type="button" className="shrink-0 font-b8 text-brand-100">
            주소 복사
          </button>
        </div>
        <ul className="flex flex-col gap-1 pb-5">
          <Bullet text="홍대 입구역 도보 5분" />
          <Bullet text="2호선 · 공항철도 · 경의중앙선 홍대입구역" />
        </ul>
      </section>

      <Divider />

      {/* 사진관 소개 */}
      <section className="px-5">
        <h2 className="pb-3 pt-5 font-b3 text-black">사진관 소개</h2>
        <p className="font-b6 text-gray-80">
          홍대 감성의 자연광 셀프/개인화보 전문 스튜디오입니다. 넓은 촬영 공간과 다양한 컨셉존을
          갖추고 있어 원하는 분위기의 사진을 남길 수 있습니다....
        </p>
        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center rounded-lg border border-brand-100 px-5 py-3 font-b3 text-brand-100"
        >
          더보기
        </button>
      </section>

      <Divider />

      {/* 공지사항 */}
      <section className="px-5 py-5">
        <h2 className="pb-3 font-b3 text-black">공지사항</h2>
        <div className="rounded-xl bg-brand-20 px-3 py-2">
          <p className="py-2 font-b7 text-black">예약 및 촬영 안내</p>
          <ul className="flex flex-col gap-1 pb-1">
            <Bullet text="예약 변경은 촬영 3일 전까지 가능합니다." />
            <Bullet text="촬영 시간에 늦으실 경우 촬영 시간이 단축될 수 있습니다." />
          </ul>
        </div>
      </section>

      <Divider />

      {/* 사진관 이용 정보 */}
      <section className="px-5 py-5">
        <button
          type="button"
          onClick={() => setOpenSheet('info')}
          className="flex w-full items-center pb-3"
        >
          <h2 className="flex-1 text-left font-b3 text-black">사진관 이용 정보</h2>
          <IcRight width={24} height={24} className="text-gray-40" />
        </button>
        {USAGE_PREVIEW.map((group) => (
          <div key={group.title} className="pb-2">
            <p className="py-2 font-b7 text-gray-80">{group.title}</p>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => (
                <Bullet key={item} text={item} />
              ))}
            </ul>
          </div>
        ))}
      </section>

      <Divider />

      {/* 헤어메이크업 연계 */}
      <section className="px-5 py-5">
        <button
          type="button"
          onClick={() => setOpenSheet('hairmakeup')}
          className="flex w-full items-center pb-3"
        >
          <h2 className="flex-1 text-left font-b3 text-black">헤어메이크업 연계</h2>
          <IcRight width={24} height={24} className="text-gray-40" />
        </button>
        <p className="font-b6 text-gray-80">제휴 헤어메이크업샵 4곳 · 무드바이 외 3곳</p>
      </section>

      <Divider />

      {/* 리뷰 요약 */}
      <section className="px-5 py-5">
        <button
          type="button"
          onClick={goToReviews}
          className="flex w-full items-center pb-4"
        >
          <IcStar width={20} height={20} className="shrink-0 text-brand-80" />
          <span className="flex-1 pl-1 text-left">
            <span className="font-b3 text-black">4.9</span>
            <span className="pl-1 font-b6 text-gray-60">(721개 평가)</span>
          </span>
          <IcRight width={24} height={24} className="text-gray-40" />
        </button>
        <ReviewCard
          reviewerName="조**"
          isBest
          rating={5}
          date="1개월 전"
          body="사진관 분위기도 좋고 사진작가님이 정말 친절하게 잘 찍어주셨어요. 보정본도 만족스럽습니다."
          photos={[null, null]}
        />
      </section>

      <Divider />

      {/* 판매자 정보 */}
      <section className="px-5 py-5">
        <div className="flex items-center pb-3">
          <h2 className="flex-1 font-b3 text-black">판매자 정보</h2>
          <IcRight width={24} height={24} className="text-gray-40" />
        </div>
        <p className="font-b8 text-gray-40">
          통신판매중개자로서 PICDAY는 거래 당사자가 아니며, 예약·이용·환불 관련 책임은 각
          사진관에 있습니다.
        </p>
      </section>

      {/* 하단 고정 CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-[390px] justify-center bg-white p-5">
        <button
          type="button"
          onClick={goToConcepts}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-brand-100 font-b5 text-white"
        >
          모든 컨셉 보기
        </button>
      </div>

      {openSheet === 'info' && (
        <BottomSheet dim onClose={closeSheet}>
          <StudioInfoSheet onClose={closeSheet} />
        </BottomSheet>
      )}
      {openSheet === 'hairmakeup' && (
        <BottomSheet dim onClose={closeSheet}>
          <HairMakeupSheet onClose={closeSheet} />
        </BottomSheet>
      )}
    </div>
  )
}

export default StudioDetailPage
