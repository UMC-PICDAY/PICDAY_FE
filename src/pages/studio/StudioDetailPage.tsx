import { useEffect, useRef, useState } from 'react'
import type { ComponentType, SVGProps } from 'react'
import { useNavigate, useParams } from 'react-router'

import CardPortfolioGrid from '@/components/cards/CardPortfolioGrid'
import Toast from '@/components/common/Toast'
import {
  IcBeauty,
  IcClothing,
  IcError,
  IcParking,
  IcPin,
  IcRight,
  IcStar,
  IcWifi,
} from '@/components/icons'
import AppTabBar from '@/components/layout/AppTabBar'
import NavigationBar from '@/components/layout/NavigationBar'
import NavigationBarTransparent from '@/components/layout/NavigationBarTransparent'

import BottomSheet from '@/pages/studio/components/BottomSheet'
import ErrorNotice from '@/pages/studio/components/ErrorNotice'
import HairMakeupSheet from '@/pages/studio/components/HairMakeupSheet'
import ReviewCard from '@/pages/studio/components/ReviewCard'
import StudioInfoSheet from '@/pages/studio/components/StudioInfoSheet'
import StudioLocationMap from '@/pages/studio/components/StudioLocationMap'
import { useStudioDetail } from '@/hooks/useStudio'
import { addWishlist, removeWishlist } from '@/services/wishlist'

type OpenSheet = 'info' | 'hairmakeup' | null

const SERVICE_ICON: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  WIFI: IcWifi,
  PARKING: IcParking,
  COSTUME: IcClothing,
  HAIR_MAKEUP: IcBeauty,
}

const stationLabel = (code: number) => {
  if (code >= 1 && code <= 9) return `${code}호선`
  if (code === 11) return '공항철도'
  if (code === 12) return '경의중앙선'
  if (code === 13) return '신분당선'
  return ''
}

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
  const { data: detail, isError, refetch } = useStudioDetail(studioId)
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null)
  const [favorited, setFavorited] = useState(false)
  const [addressCopied, setAddressCopied] = useState(false)
  const [introExpanded, setIntroExpanded] = useState(false)
  const [introOverflow, setIntroOverflow] = useState(false)
  const introRef = useRef<HTMLParagraphElement>(null)

  // 상세 로드 시 서버의 찜 상태로 초기화 (토글은 handleToggleFavorite에서 위시리스트 API 호출)
  useEffect(() => {
    if (detail) setFavorited(detail.isWishlisted)
  }, [detail])

  // 소개 글이 3줄을 넘길 때만 더보기/접기 버튼 노출
  // (펼친 상태에서는 clamp가 풀려 측정이 불가하므로 접힌 상태에서만 측정)
  useEffect(() => {
    const el = introRef.current
    if (!el || introExpanded) return

    let alive = true
    const measure = () => {
      if (alive) setIntroOverflow(el.scrollHeight > el.clientHeight + 1)
    }

    measure()
    document.fonts?.ready.then(measure)

    const observer = new ResizeObserver(measure)
    observer.observe(el)

    return () => {
      alive = false
      observer.disconnect()
    }
  }, [detail?.introduction, introExpanded])

  const closeSheet = () => setOpenSheet(null)
  const goToReviews = () => navigate(`/studios/${studioId}/reviews`)
  const goToConcepts = () => navigate(`/studios/${studioId}/concepts`)

  const fullAddress = detail
    ? `${detail.mainAddress} ${detail.subAddress}`
    : ''

  const handleToggleFavorite = async () => {
    if (!studioId) return

    const next = !favorited
    setFavorited(next)
    try {
      if (next) {
        await addWishlist(Number(studioId))
      } else {
        await removeWishlist(Number(studioId))
      }
    } catch {
      setFavorited(!next)
    }
  }

  const handleCopyAddress = () => {
    if (!fullAddress) return
    navigator.clipboard
      ?.writeText(fullAddress)
      .then(() => {
        setAddressCopied(true)
        setTimeout(() => setAddressCopied(false), 2000)
      })
      .catch(() => {})
  }

  if (isError) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <NavigationBar variant="default" showRight={false} onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center">
          <ErrorNotice
            icon={<IcError width={48} height={48} className="text-brand-80" />}
            title="정보를 불러오지 못했어요"
            onRetry={() => refetch()}
          />
        </div>
        <AppTabBar activeTab="search" />
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <NavigationBar variant="default" showRight={false} onBack={() => navigate(-1)} />
      </div>
    )
  }

  const stationLine = [
    ...detail.stationDetail.map(stationLabel).filter(Boolean),
    detail.nearestStation,
  ].join(' · ')
  const services = detail.studioService.filter(
    (service) => SERVICE_ICON[service.serviceCode],
  )
  const bestReview = detail.review.items[0]

  return (
    <div className="relative flex min-h-dvh flex-col bg-white pb-24">
      {/* 히어로 */}
      <div className="relative h-[302px] w-full shrink-0">
        <img
          src={detail.thumbnailUrl}
          alt={detail.studioName}
          className="size-full object-cover"
        />
        <div className="absolute inset-x-0 top-0">
          <NavigationBarTransparent
            isFavorited={favorited}
            onBack={() => navigate(-1)}
            onFavorite={handleToggleFavorite}
          />
        </div>
      </div>

      {/* 이름 / 위치 / 별점 */}
      <div className="px-5 py-3">
        <h1 className="py-2 font-h3 text-black">{detail.studioName}</h1>
        <div className="flex items-center pb-1 font-b6 text-gray-60">
          <IcPin width={20} height={20} className="shrink-0 text-brand-100" />
          <span>
            {detail.nearestStation} 도보 {detail.walkingMinute}분
          </span>
          <span className="px-1">|</span>
          <span>{detail.mainAddress}</span>
        </div>
        <button type="button" onClick={goToReviews} className="flex items-center pb-2">
          <IcStar width={20} height={20} className="shrink-0 text-brand-80" />
          <span className="pl-0.5 font-b7 text-black">
            {detail.review.summary.avgRating.toFixed(1)}
          </span>
          <span className="pl-0.5 font-b7 text-gray-40">
            ({detail.review.summary.totalCount}개 평가)
          </span>
          <IcRight width={20} height={20} className="text-gray-40" />
        </button>
      </div>

      <Divider />

      {/* 촬영 컨셉 */}
      <section className="px-5 pb-5">
        <h2 className="pb-3 pt-5 font-b3 text-black">촬영 컨셉</h2>
        <CardPortfolioGrid
          className="flex w-full items-center justify-center gap-2"
          items={detail.conceptPreview.map((concept) => ({
            imageSrc: concept.thumbnailUrl,
            title: concept.productName,
            price: `₩${concept.price.toLocaleString()}~`,
          }))}
        />
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
        </div>
        <div className="flex items-center justify-around pb-5">
          {services.map((service) => {
            const Icon = SERVICE_ICON[service.serviceCode]
            return (
              <div
                key={service.serviceCode}
                className="flex h-[48px] w-[68px] flex-col items-center justify-center gap-1"
              >
                <Icon width={24} height={24} className="text-brand-100" />
                <span className="whitespace-nowrap font-b10 text-gray-60">
                  {service.serviceName}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <Divider />

      {/* 위치 및 주변 정보 */}
      <section className="px-5">
        <h2 className="pb-3 pt-5 font-b3 text-black">위치 및 주변 정보</h2>
        <StudioLocationMap
          latitude={detail.latitude}
          longitude={detail.longitude}
          studioName={detail.studioName}
        />
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <IcPin width={20} height={20} className="shrink-0 text-brand-100" />
            <span className="font-b4 text-black">{fullAddress}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyAddress}
            className="shrink-0 font-b8 text-brand-100"
          >
            주소 복사
          </button>
        </div>
        <ul className="flex flex-col gap-1 pb-5">
          <Bullet text={`${detail.nearestStation} 도보 ${detail.walkingMinute}분`} />
          {stationLine && <Bullet text={stationLine} />}
        </ul>
      </section>

      <Divider />

      {/* 사진관 소개 */}
      <section className="px-5 pb-5">
        <h2 className="pb-3 pt-5 font-b3 text-black">사진관 소개</h2>
        <p ref={introRef} className={`font-b6 text-gray-80${introExpanded ? '' : ' line-clamp-3'}`}>
          {detail.introduction}
        </p>
        {introOverflow && (
          <button
            type="button"
            onClick={() => setIntroExpanded((prev) => !prev)}
            aria-expanded={introExpanded}
            className="mt-5 flex w-full items-center justify-center rounded-lg border border-brand-100 px-5 py-3 font-b3 text-brand-100"
          >
            {introExpanded ? '접기' : '더보기'}
          </button>
        )}
      </section>

      <Divider />

      {/* 공지사항 */}
      <section className="px-5 py-5">
        <h2 className="pb-3 font-b3 text-black">공지사항</h2>
        <div className="rounded-xl bg-brand-20 px-3 py-2">
          <p className="py-2 font-b7 text-black">예약 및 촬영 안내</p>
          <ul className="flex flex-col gap-1 pb-1">
            {detail.notice.split('\n').map((line, index) => (
              <Bullet key={index} text={line} />
            ))}
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
        {detail.studioInfo.map((section) => (
          <div key={section.infoSectionId} className="pb-2">
            <ul className="flex flex-col gap-1">
              {section.content.split('\n').map((line, index) => (
                <Bullet key={index} text={line} />
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
        <p className="font-b6 text-gray-80">
          제휴 헤어메이크업샵 {detail.hairMakeupPartnersCount}곳
        </p>
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
            <span className="font-b3 text-black">
              {detail.review.summary.avgRating.toFixed(1)}
            </span>
            <span className="pl-1 font-b6 text-gray-60">
              ({detail.review.summary.totalCount}개 평가)
            </span>
          </span>
          <IcRight width={24} height={24} className="text-gray-40" />
        </button>
        {bestReview && (
          <ReviewCard
            reviewerName={bestReview.writerNickname}
            isBest={bestReview.isBest}
            rating={bestReview.rating}
            date={bestReview.createdAt.slice(0, 10).replaceAll('-', '.')}
            conceptTitle={bestReview.conceptName}
            body={bestReview.content}
            photos={bestReview.images}
          />
        )}
      </section>

      <Divider />

      {/* 판매자 고지 */}
      <section className="px-5 py-5">
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

      {addressCopied && (
        <div className="fixed inset-x-0 bottom-24 z-40 mx-auto flex max-w-[390px] justify-center px-5">
          <Toast message="주소가 복사되었어요" />
        </div>
      )}

      {openSheet === 'info' && (
        <BottomSheet dim onClose={closeSheet}>
          <StudioInfoSheet sections={detail.studioInfo} onClose={closeSheet} />
        </BottomSheet>
      )}
      {openSheet === 'hairmakeup' && (
        <BottomSheet dim onClose={closeSheet}>
          <HairMakeupSheet studioId={studioId ?? ''} onClose={closeSheet} />
        </BottomSheet>
      )}
    </div>
  )
}

export default StudioDetailPage
