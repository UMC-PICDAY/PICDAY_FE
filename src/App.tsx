import { Routes, Route } from 'react-router'

import SearchPage from './pages/search/SearchPage'
import SearchAutoCompletePage from './pages/search/SearchAutoCompletePage'
import DateSelectPage from './pages/search/DateSelectPage'
import PurposeSelectPage from './pages/search/PurposeSelectPage'

import StudioListPage from './pages/studio/StudioListPage'
import StudioMapPage from './pages/studio/StudioMapPage'
import StudioEmptyPage from './pages/studio/StudioEmptyPage'
import StudioListFullPage from './pages/studio/StudioListFullPage'
import FilterPage from './pages/studio/FilterPage'
import StudioDetailPage from './pages/studio/StudioDetailPage'
import ReviewDetailPage from './pages/studio/ReviewDetailPage'
import ConceptListPage from './pages/studio/ConceptListPage'
import ConceptDetailPage from './pages/studio/ConceptDetailPage'

import ComparePurposePage from './pages/compare/ComparePurposePage'
import CompareTwoPage from './pages/compare/CompareTwoPage'
import CompareThreePage from './pages/compare/CompareThreePage'

import ReservationPage from './pages/reservation/ReservationPage'
import PartnerShopSelectPage from './pages/reservation/PartnerShopSelectPage'
import ReservationCompletePage from './pages/reservation/ReservationCompletePage'

import MyReservationPage from './pages/mypage/MyReservationPage'
import ReservationDetailPage from './pages/mypage/ReservationDetailPage'
import ProfileSettingPage from './pages/mypage/ProfileSettingPage'

import WishlistPage from './pages/wishlist/WishlistPage'
import ChatListPage from './pages/chat/ChatListPage'

function App() {
  return (
    <Routes>
      {/* 검색 */}
      <Route path="/search" element={<SearchPage />} />
      <Route path="/search/autocomplete" element={<SearchAutoCompletePage />} />
      <Route path="/search/date" element={<DateSelectPage />} />
      <Route path="/search/purpose" element={<PurposeSelectPage />} />

      {/* 사진관 */}
      <Route path="/studios" element={<StudioListPage />} />
      <Route path="/studios/map" element={<StudioMapPage />} />
      <Route path="/studios/empty" element={<StudioEmptyPage />} />
      <Route path="/studios/list" element={<StudioListFullPage />} />
      <Route path="/studios/filter" element={<FilterPage />} />
      <Route path="/studios/:studioId" element={<StudioDetailPage />} />
      <Route path="/studios/:studioId/reviews" element={<ReviewDetailPage />} />
      <Route path="/studios/:studioId/concepts" element={<ConceptListPage />} />
      <Route path="/studios/:studioId/concepts/:conceptId" element={<ConceptDetailPage />} />

      {/* 비교 */}
      <Route path="/compare" element={<ComparePurposePage />} />
      <Route path="/compare/two" element={<CompareTwoPage />} />
      <Route path="/compare/three" element={<CompareThreePage />} />

      {/* 예약 */}
      <Route path="/reservation" element={<ReservationPage />} />
      <Route path="/reservation/partner-shop" element={<PartnerShopSelectPage />} />
      <Route path="/reservation/complete" element={<ReservationCompletePage />} />

      {/* 마이페이지 */}
      <Route path="/mypage" element={<MyReservationPage />} />
      <Route path="/mypage/reservations/:reservationId" element={<ReservationDetailPage />} />
      <Route path="/mypage/profile" element={<ProfileSettingPage />} />

      {/* 위시리스트 / 채팅 */}
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/chat" element={<ChatListPage />} />
    </Routes>
  )
}

export default App
