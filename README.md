# 📸 PICDAY — Frontend

> 나에게 딱 맞는 사진관을 찾아주는 서비스, PICDAY의 프론트엔드 레포지토리입니다.

<br>

## 📌 프로젝트 소개

PICDAY는 사용자가 촬영 목적, 날짜, 지역 등의 조건으로 사진관을 검색하고 예약할 수 있는 웹 서비스입니다.

<br>

## 👥 팀원 및 역할 분담

| 이름 | 역할 | 담당 페이지 |
|------|------|------------|
| 김이준 (팀장) | FE | A. 로그인/회원가입, B. 검색, G. 위시리스트 |
| 남현준 | FE | C. 사진관 탐색/상세 |
| 전지혜 | FE | D. 비교, E. 예약 |
| 신승연 | FE | F. 마이페이지, 리뷰 |

<br>

## 🛠 기술 스택

| 역할 | 기술 |
|------|------|
| 번들러 | Vite |
| UI | React + TypeScript |
| 라우터 | React Router v8 |
| 전역 상태 | Zustand v5 |
| 서버 상태 | TanStack Query v5 |

<br>

## 📁 폴더 구조

```
src/
├── components/
│   ├── common/       # 공통 UI 컴포넌트 (Button, Card, Chip 등)
│   ├── layout/       # 레이아웃 컴포넌트 (NavigationBar, AppTabBar 등)
│   └── icons/        # 아이콘 컴포넌트
├── pages/
│   ├── auth/         # A - 로그인/회원가입
│   ├── home/         # A-1/B-1 - 홈
│   ├── search/       # B - 검색
│   ├── studio/       # C - 사진관 목록/상세
│   ├── compare/      # D - 사진관 비교
│   ├── reservation/  # E - 예약
│   ├── mypage/       # F - 마이페이지
│   ├── wishlist/     # G-1 위시리스트
│   └── common/       # 약관 상세 등 공용 화면
├── hooks/            # 커스텀 훅
├── stores/           # Zustand 전역 상태
├── services/         # API 호출 함수 (axios 클라이언트 + 도메인별 함수)
├── types/            # TypeScript 타입/인터페이스
├── constants/        # 공용 상수 (약관 목록 등)
├── styles/           # 디자인 토큰, 타이포그래피 CSS
├── assets/           # 이미지, 폰트 등 정적 파일
├── App.tsx           # 라우트 설정
└── main.tsx          # 앱 진입점
```

<br>

## ✍️ 코드 스타일

- **따옴표·세미콜론**: 새로 작성하는 코드는 작은따옴표(`'`) + 세미콜론 없음을 기본으로 합니다. `components/common/` 초반에 만들어진 일부 컴포넌트(예: `InputField.tsx`, `SearchField.tsx`, `Calendar.tsx` 등)는 큰따옴표+세미콜론 스타일로 남아있는데, 팀 합의로 기존 파일은 굳이 통일하지 않고 그대로 둔 것입니다 — 파일마다 스타일이 섞인 게 아니라 "이전에 만든 파일 vs 이후에 만든 파일" 기준으로 나뉩니다.
- 이 저장소엔 별도의 ESLint 설정이 없고 `oxlint`(`npm run lint`)만 사용합니다.

<br>

## 🌿 브랜치 컨벤션

### 브랜치 구성

| 브랜치 | 설명 |
|--------|------|
| `main` | 실제 서비스에 배포되는 브랜치 |
| `develop` | 모든 기능 브랜치가 병합되는 기본 개발 브랜치 |
| `feature/*` | 기능 개발 (develop에서 분기) |
| `bugfix/*` | 버그 수정 (develop에서 분기) |
| `hotfix/*` | 운영 중 긴급 수정 (main에서 분기) |
| `design/*` | 디자인 반영 (develop에서 분기) |
| `fix/*` | 버그 수정 (develop에서 분기, `bugfix/*`와 동일하게 사용) |
| `refactor/*` | 리팩토링 (develop에서 분기) |
| `docs/*` | 문서 작업 (develop에서 분기) |
| `test/*` | 테스트 (develop에서 분기) |
| `chore/*` | 기타 작업 (develop에서 분기) |

### 브랜치 네이밍

```
<type>/<issue-number>-<간단한설명>
```

```
feature/12-login-form
bugfix/45-missing-data-sync
hotfix/73-server-crash-on-boot
design/21-studio-detail-ui
refactor/34-search-hook
docs/5-readme-update
```

### 병합 흐름

| 단계 | 설명 |
|------|------|
| `feature/`, `bugfix/` | develop에서 분기하고 다시 develop으로 병합 |
| `develop → main` | 정기 릴리즈 또는 QA 완료 시점에 병합 |
| `hotfix/` | main에서 직접 분기하여 운영 긴급 수정만 처리 |
| `main → develop` | hotfix 이후 develop과의 상태 동기화 |

<br>

## ✏️ 커밋 컨벤션

### 형식

```
<Gitmoji> <Type>. <요약 설명>

Why: 변경 이유
How: 변경 방법 (각 줄 72자 이내)

Tag: #키워드 #기술 #패턴
See: 링크 또는 이슈 번호
```

### Gitmoji 목록

| Gitmoji | Type | 설명 |
|---------|------|------|
| 🎨 | Style | 코드 포맷, 구조 개선 |
| ⚡ | Perf | 성능 개선 |
| 🔥 | Remove | 불필요한 코드/파일 삭제 |
| 🐛 | Fix | 버그 수정 |
| 🚑 | Hotfix | 긴급 수정 |
| ✨ | Feat | 새로운 기능 추가 |
| 📝 | Docs | 문서 작성 및 수정 |
| 🚀 | Deploy | 배포 관련 작업 |
| 🚨 | UI | UI/스타일 변경 |
| ✅ | Test | 테스트 코드 추가 및 수정 |
| 🔒 | Security | 보안 이슈 해결 |
| ♻️ | Refac | 리팩토링 |
| 🔧 | Config | 설정 파일 수정 |
| 🔨 | Script | 빌드/개발 스크립트 |
| 💡 | Comment | 주석 추가/수정 |
| 🚚 | Move | 리소스 이동/리네이밍 |
| 📱 | Mobile | 반응형/디바이스 대응 |
| 🩹 | Patch | 간단한 수정 |
| ✏️ | Typo | 오타 수정 |
| ⏪ | Revert | 이전 커밋 롤백 |
| 🙈 | Ignore | .gitignore 관련 작업 |

### 예시

```
✨ Feat. 사진관 검색 필터 기능 구현

Why: 사용자가 목적/날짜/지역 조건으로 사진관을 필터링할 수 있어야 함

How: FilterPage에 조건 상태 관리 추가,
     TanStack Query로 필터 파라미터 API 연동

Tag: #feat #filter #react-query
See: #21
```

<br>

## 🔀 PR 컨벤션

```markdown
## 관련 이슈
- Closes #이슈번호

## 주요 변경 내용
-

## 스크린샷 (선택)

## 테스트 체크리스트
- [ ] 정상 동작 확인
- [ ] 브라우저 호환성 확인

## 기타 공유 사항
```

<br>

## 🖥 실행 방법

```bash
# 의존성 설치
npm install

# 환경변수 설정 (.env.example을 복사해 값 채우기)
cp .env.example .env

# 개발 서버 실행 (배포된 백엔드로 붙일 땐 반드시 3000번 포트로 — 아래 참고)
npm run dev -- --port 3000
```

`.env`에 필요한 값:

| 변수 | 설명 |
|------|------|
| `VITE_API_BASE_URL` | 백엔드 API Base URL (오리진만, 예: `http://localhost:8080`) |
| `VITE_KAKAO_MAP_KEY` | 카카오맵 JavaScript 키. [Kakao Developers](https://developers.kakao.com)에서 발급, 플랫폼에 `http://localhost:3000` 등록 필요 |

> ⚠️ **CORS 주의**: 배포된 백엔드는 `localhost:3000`만 CORS 허용 목록에 등록되어 있습니다. Vite 기본 포트(5173)로 실행하면 `VITE_API_BASE_URL`을 배포 백엔드로 설정했을 때 CORS 에러가 납니다. 반드시 `npm run dev -- --port 3000`으로 실행하세요. (로컬 백엔드를 직접 띄워서 붙이는 경우는 해당 없음)

> 모바일 UI 확인은 Chrome DevTools에서 `Cmd + Shift + M` (디바이스 모드) 사용을 권장합니다.

<br>

## 🚀 배포

- **프로덕션**: [picday-fe.vercel.app](https://picday-fe.vercel.app) — `main` 브랜치에 push하면 Vercel(GitHub 연동)이 자동으로 배포합니다.
- **환경변수**는 Vercel 프로젝트 설정(Production/Preview)에서 별도로 관리하며, 로컬 `.env`와는 독립적입니다.

<br>

## 📱 화면 목록 및 플로우

### A. 로그인/회원가입 · 홈

| 화면 | 설명 |
|------|------|
| A-1 비로그인 홈 | 검색창·캐러셀·사진관 리스트 (Guest 탭바) |
| B-1 로그인 후 홈 | A-1과 동일 콘텐츠, User 탭바 |
| A-2 로그인 | 아이디/비밀번호 로그인, 소셜 로그인 |
| A-2 소셜 인증 처리 중 | 카카오/구글 인증 콜백 대기 화면 |
| A-3 자체 회원가입 | 이름/아이디/비밀번호/이메일/전화번호 + 약관동의 |
| A-4 회원가입 완료 | 가입 완료 안내, 로그인 화면으로 이동 |
| A-5 소셜 신규회원 약관동의 | 소셜 최초 로그인 시 약관동의만 받는 화면 |

### B. 검색

| 화면 | 설명 |
|------|------|
| B-2 통합검색 | 키워드 검색 메인 화면 |
| B-2 자동완성 노출 | 검색어 자동완성 |
| B-3 날짜 선택 | 촬영 날짜 선택 |
| B-4 목적 선택 | 촬영 목적 선택 |

### C. 사진관

| 화면 | 설명 |
|------|------|
| C-1 지도+리스트 | 지도와 리스트 통합 뷰 |
| C-2 지도 전체뷰 | 지도 전체 화면 |
| C-3 결과 없음 | 검색 결과 없음 |
| C-3 리스트 전체뷰 | 리스트 전체 화면 |
| C-4 필터 | 필터 설정 (가격, 스타일 등) |
| C-5 사진관 상세 | 사진관 상세 정보 |
| C-6 리뷰 상세 | 리뷰 목록 및 상세 |
| C-7 컨셉 목록 | 촬영 컨셉 목록 |
| C-8 컨셉 사진 상세 | 컨셉 사진 상세 |

### D. 비교

| 화면 | 설명 |
|------|------|
| D-1 비교할 촬영 목적 선택 | 비교 목적 선택 |
| D-2 비교 2개 | 사진관 2개 비교 |
| D-3 비교 3개 | 사진관 3개 비교 |

### E. 예약

| 화면 | 설명 |
|------|------|
| E-1 예약 | 예약 정보 입력 |
| E-1 제휴샵 선택 | 헤어메이크업 제휴샵 선택 |
| E-3 예약 완료 | 예약 완료 확인 |

### F. 마이페이지

| 화면 | 설명 |
|------|------|
| F-1 예약 목록 | 전체/예약완료/촬영완료/취소 탭별 예약 내역 |
| F-1D 예약 상세 | 예약 상세 내역, 상태별(예약완료/촬영완료/취소) 화면 분기 |
| F-1C 예약 취소 | 예약 내역·환불 안내 확인 후 취소 진행 |
| F-1C 취소 완료 | 취소 완료 안내, 마이페이지/홈 이동 |
| F-1R 리뷰 작성 | 촬영 완료 건에 대한 별점·태그·후기·사진 첨부 |
| F-1R 리뷰 등록 완료 | 리뷰 등록 완료 안내, 마이페이지 이동 |
| 내 리뷰 상세/수정 | 작성한 리뷰 조회·수정·삭제 (`/mypage/reviews/:reviewId`) |
| F-3 프로필 설정 | 닉네임·알림 설정 편집, 연결 계정 확인 |
| F-3 회원탈퇴 | 탈퇴 확인 팝업 플로우 |
| F-3 탈퇴 완료 | 탈퇴 완료 안내, 홈으로 이동 |

### G. 기타

| 화면 | 설명 |
|------|------|
| G-1 위시리스트 | 찜한 사진관 목록 |
