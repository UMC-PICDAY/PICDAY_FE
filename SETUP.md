# Pickday FE 프로젝트 세팅 정리

## 기술 스택

| 역할 | 라이브러리 | 버전 |
|------|-----------|------|
| 번들러 | Vite | 최신 |
| UI | React + TypeScript | 최신 |
| 라우터 | React Router | v8 |
| 전역 상태 | Zustand | v5 |
| 서버 상태 | TanStack Query | v5 |

## 시작하는 법

```bash
npm install
npm run dev
```

## 폴더 구조

```
src/
├── components/
│   ├── common/       # 공통 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Chip.tsx
│   │   ├── SearchField.tsx
│   │   └── TitleText.tsx
│   ├── layout/       # 레이아웃
│   │   ├── HomeBar.tsx
│   │   └── StatusBar.tsx
│   └── icons/        # 아이콘
│       ├── IcAdd.tsx
│       ├── IcBack.tsx
│       ├── IcCheck.tsx
│       ├── IcFavorite.tsx
│       ├── IcFilter.tsx
│       ├── IcPin.tsx
│       ├── IcRight.tsx
│       ├── IcShare.tsx
│       └── IcStar.tsx
├── pages/
│   ├── search/           # B - 검색
│   │   ├── SearchPage.tsx
│   │   ├── SearchAutoCompletePage.tsx
│   │   ├── DateSelectPage.tsx
│   │   └── PurposeSelectPage.tsx
│   ├── studio/           # C - 사진관
│   │   ├── StudioListPage.tsx
│   │   ├── StudioMapPage.tsx
│   │   ├── StudioEmptyPage.tsx
│   │   ├── StudioListFullPage.tsx
│   │   ├── FilterPage.tsx
│   │   ├── StudioDetailPage.tsx
│   │   ├── ReviewDetailPage.tsx
│   │   ├── ConceptListPage.tsx
│   │   └── ConceptDetailPage.tsx
│   ├── compare/          # D - 비교
│   │   ├── ComparePurposePage.tsx
│   │   ├── CompareTwoPage.tsx
│   │   └── CompareThreePage.tsx
│   ├── reservation/      # E - 예약
│   │   ├── ReservationPage.tsx
│   │   ├── PartnerShopSelectPage.tsx
│   │   └── ReservationCompletePage.tsx
│   ├── mypage/           # F - 마이페이지
│   │   ├── MyReservationPage.tsx
│   │   ├── ReservationDetailPage.tsx
│   │   └── ProfileSettingPage.tsx
│   ├── wishlist/         # G-1
│   │   └── WishlistPage.tsx
│   └── chat/             # G-2
│       └── ChatListPage.tsx
├── hooks/        # 커스텀 훅
├── stores/       # Zustand 전역 상태
├── services/     # API 호출 함수
├── types/        # TypeScript 타입/인터페이스
├── utils/        # 공통 유틸 함수
├── assets/       # 이미지, 폰트 등 정적 파일
├── App.tsx       # 라우트 설정
└── main.tsx      # 앱 진입점
```

## 라우트 구조

```
/search                           → SearchPage
/search/autocomplete              → SearchAutoCompletePage
/search/date                      → DateSelectPage
/search/purpose                   → PurposeSelectPage

/studios                          → StudioListPage
/studios/map                      → StudioMapPage
/studios/filter                   → FilterPage
/studios/:studioId                → StudioDetailPage
/studios/:studioId/reviews        → ReviewDetailPage
/studios/:studioId/concepts       → ConceptListPage
/studios/:studioId/concepts/:id   → ConceptDetailPage

/compare                          → ComparePurposePage
/compare/two                      → CompareTwoPage
/compare/three                    → CompareThreePage

/reservation                      → ReservationPage
/reservation/partner-shop         → PartnerShopSelectPage
/reservation/complete             → ReservationCompletePage

/mypage                           → MyReservationPage
/mypage/reservations/:id          → ReservationDetailPage
/mypage/profile                   → ProfileSettingPage

/wishlist                         → WishlistPage
/chat                             → ChatListPage
```

## 상태관리 원칙

- **Zustand** → 로그인 여부, 모달 열림/닫힘 같은 UI 전역 상태
- **TanStack Query** → API 응답 데이터 (캐싱/로딩/에러 자동 처리)

## 미결 사항

- [ ] 모바일 뷰 CSS 세팅 (max-width: 390px 고정)
- [ ] 라우터 index(홈) 페이지 설정
- [ ] API base URL 환경변수 설정 (.env)
- [ ] ESLint / Prettier 설정
