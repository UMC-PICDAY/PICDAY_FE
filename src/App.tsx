import { Routes, Route } from 'react-router'

import NonLoggedHomePage from '@/pages/home/NonLoggedHomePage'
import HomePage from '@/pages/home/HomePage'
import LoginPage from '@/pages/auth/LoginPage'
import SignUpPage from '@/pages/auth/SignUpPage'
import SignUpCompletePage from '@/pages/auth/SignUpCompletePage'
import SocialSignUpPage from '@/pages/auth/SocialSignUpPage'
import OAuthCallbackPage from '@/pages/auth/OAuthCallbackPage'

import SearchPage from '@/pages/search/SearchPage'
import SearchAutoCompletePage from '@/pages/search/SearchAutoCompletePage'
import DateSelectPage from '@/pages/search/DateSelectPage'
import PurposeSelectPage from '@/pages/search/PurposeSelectPage'

import StudioSearchPage from '@/pages/studio/StudioSearchPage'
import FilterPage from '@/pages/studio/FilterPage'
import StudioDetailPage from '@/pages/studio/StudioDetailPage'
import ReviewDetailPage from '@/pages/studio/ReviewDetailPage'
import ReviewPolicyPage from '@/pages/studio/ReviewPolicyPage'
import ConceptListPage from '@/pages/studio/ConceptListPage'
import ConceptDetailPage from '@/pages/studio/ConceptDetailPage'

import ComparePurposePage from '@/pages/compare/ComparePurposePage'
import CompareTwoPage from '@/pages/compare/CompareTwoPage'
import CompareThreePage from '@/pages/compare/CompareThreePage'

import ReservationPage from '@/pages/reservation/ReservationPage'
import ReservationCompletePage from '@/pages/reservation/ReservationCompletePage'
import AgreementDetailPage from '@/pages/reservation/AgreementDetailPage'

import RequireAuth from '@/components/auth/RequireAuth'
import MyReservationPage from '@/pages/mypage/MyReservationPage'
import ReservationDetailPage from '@/pages/mypage/ReservationDetailPage'
import ReservationCancelPage from '@/pages/mypage/ReservationCancelPage'
import CancelCompletePage from '@/pages/mypage/CancelCompletePage'
import ProfileSettingPage from '@/pages/mypage/ProfileSettingPage'
import WithdrawCompletePage from '@/pages/mypage/WithdrawCompletePage'
import ReviewWritePage from '@/pages/mypage/ReviewWritePage'
import ReviewCompletePage from '@/pages/mypage/ReviewCompletePage'
import MyReviewPage from '@/pages/mypage/MyReviewPage'

import WishlistPage from '@/pages/wishlist/WishlistPage'
import ChatListPage from '@/pages/chat/ChatListPage'
import ChatRoomPage from '@/pages/chat/ChatRoomPage'

import TermsDetailPage from '@/pages/common/TermsDetailPage'

import { useScrollToTop } from '@/hooks/useScrollToTop'

function App() {
  useScrollToTop()

  return (
    <Routes>
      {/* 홈 */}
      <Route path="/" element={<NonLoggedHomePage />} />
      <Route path="/home" element={<HomePage />} />

      {/* 로그인 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signup/complete" element={<SignUpCompletePage />} />
      <Route path="/signup/social" element={<SocialSignUpPage />} />
      <Route path="/oauth/callback/:provider" element={<OAuthCallbackPage />} />

      {/* 검색 */}
      <Route path="/search" element={<SearchPage />} />
      <Route path="/search/autocomplete" element={<SearchAutoCompletePage />} />
      <Route path="/search/date" element={<DateSelectPage />} />
      <Route path="/search/purpose" element={<PurposeSelectPage />} />

      {/* 사진관 */}
      <Route path="/studios" element={<StudioSearchPage />} />
      <Route path="/studios/filter" element={<FilterPage />} />
      <Route path="/studios/:studioId" element={<StudioDetailPage />} />
      <Route path="/studios/:studioId/reviews" element={<ReviewDetailPage />} />
      <Route path="/studios/:studioId/reviews/policy" element={<ReviewPolicyPage />} />
      <Route path="/studios/:studioId/concepts" element={<ConceptListPage />} />
      <Route path="/studios/:studioId/concepts/:conceptId" element={<ConceptDetailPage />} />

      {/* 비교 */}
      <Route path="/compare" element={<ComparePurposePage />} />
      <Route path="/compare/two" element={<CompareTwoPage />} />
      <Route path="/compare/three" element={<CompareThreePage />} />

      {/* 예약 */}
      <Route path="/reservation" element={<ReservationPage />} />
      <Route path="/reservation/complete/:reservationId" element={<ReservationCompletePage />} />
      <Route path="/reservation/terms/:key" element={<AgreementDetailPage />}
/>

      {/* 마이페이지 (로그인 가드) */}
      <Route element={<RequireAuth />}>
        <Route path="/mypage" element={<MyReservationPage />} />
        <Route path="/mypage/reservations/:reservationId" element={<ReservationDetailPage />} />
        <Route path="/mypage/reservations/:reservationId/cancel" element={<ReservationCancelPage />} />
        <Route path="/mypage/reservations/:reservationId/cancel/complete" element={<CancelCompletePage />} />
        <Route path="/mypage/profile" element={<ProfileSettingPage />} />
        <Route path="/mypage/withdraw/complete" element={<WithdrawCompletePage />} />
        <Route path="/mypage/reservations/:reservationId/review" element={<ReviewWritePage />} />
        <Route path="/mypage/reservations/:reservationId/review/complete" element={<ReviewCompletePage />} />
        <Route path="/mypage/reviews/:reviewId" element={<MyReviewPage />} />
      </Route>

      {/* 위시리스트 */}
      <Route path="/wishlist" element={<WishlistPage />} />

      {/* 채팅 */}
      <Route path="/chat" element={<ChatListPage />} />
      <Route path="/chat/:chatId" element={<ChatRoomPage />} />

      {/* 공용 */}
      <Route path="/terms/:termType" element={<TermsDetailPage />} />


    </Routes>
  )
}

export default App
