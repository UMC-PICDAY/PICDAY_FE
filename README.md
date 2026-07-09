# 📸 PICKDAY — Frontend

> 나에게 딱 맞는 사진관을 찾아주는 서비스, PICKDAY의 프론트엔드 레포지토리입니다.

<br>

## 📌 프로젝트 소개

PICKDAY는 사용자가 촬영 목적, 날짜, 지역 등의 조건으로 사진관을 검색하고 예약할 수 있는 웹 서비스입니다.

<br>

## 👥 팀원 및 역할 분담

| 이름 | 역할 | 담당 페이지 |
|------|------|------------|
| 김이준 (팀장) | FE | TBD |
| 남현준 | FE | TBD |
| 전지혜 | FE | TBD |
| 신승연 | FE | TBD |

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
│   ├── layout/       # 레이아웃 컴포넌트 (HomeBar, StatusBar)
│   └── icons/        # 아이콘 컴포넌트
├── pages/
│   ├── search/       # B - 검색
│   ├── studio/       # C - 사진관 목록/상세
│   ├── compare/      # D - 사진관 비교
│   ├── reservation/  # E - 예약
│   ├── mypage/       # F - 마이페이지
│   ├── wishlist/     # G-1 위시리스트
│   └── chat/         # G-2 채팅
├── hooks/            # 커스텀 훅
├── stores/           # Zustand 전역 상태
├── services/         # API 호출 함수
├── types/            # TypeScript 타입/인터페이스
├── utils/            # 공통 유틸 함수
├── assets/           # 이미지, 폰트 등 정적 파일
├── App.tsx           # 라우트 설정
└── main.tsx          # 앱 진입점
```

<br>

## 🧩 공통 컴포넌트 범위 및 사용 기준

### Figma 기준

공통 컴포넌트 구현 범위는 PICDAY Figma의 공통 컴포넌트 섹션 전체를 기준으로 합니다.

- Figma 파일: `PICDAY`
- 기준 노드: `1996:16986`
- 링크: https://www.figma.com/design/KGcQqwHfsRwy4IG3Spxk4M/PICDAY?node-id=1996-16986&t=oPJNCxbjyRe7BrSi-0

위 노드까지 포함된 디자인 요소 중 여러 화면에서 반복 사용되는 UI를 공통 컴포넌트 대상으로 봅니다.

### 공통 컴포넌트로 분리하는 기준

다음 조건 중 하나 이상에 해당하면 `src/components/common` 또는 `src/components/layout`으로 분리합니다.

| 기준 | 설명 |
|------|------|
| 반복 사용성 | 2개 이상 화면에서 동일하거나 유사한 UI가 반복되는 경우 |
| 독립성 | 특정 페이지의 API 응답, 라우팅, 도메인 상태에 직접 의존하지 않는 경우 |
| 변형 가능성 | `variant`, `size`, `state`, `disabled`, `selected` 등 props로 상태나 형태를 제어할 수 있는 경우 |
| 디자인 일관성 | 색상, 폰트, 간격, radius 등이 디자인 토큰 또는 CSS variable 기준으로 관리되어야 하는 경우 |

### 공통 컴포넌트 사용 범위

| 경로 | 사용 범위 |
|------|----------|
| `src/components/common` | Button, Chip, Input, Card, BottomSheet, Modal, Tab 등 페이지와 무관하게 재사용 가능한 기본 UI |
| `src/components/layout` | TopBar, BottomNav, StatusBar, PageLayout 등 여러 화면에서 공통으로 쓰는 레이아웃 UI |
| `src/components/icons` | SVG 아이콘 컴포넌트 또는 아이콘 래퍼 |
| `src/pages/**/components` | 특정 페이지에서만 사용하는 섹션, 리스트 아이템, 도메인 결합 UI |

### 페이지 전용 컴포넌트로 유지하는 기준

다음에 해당하면 공통 컴포넌트로 올리지 않고 해당 페이지 폴더 내부에 둡니다.

- 특정 화면에서만 사용되고 재사용 가능성이 낮은 경우
- 예약, 검색, 사진관 상세 등 특정 도메인 데이터에 강하게 결합된 경우
- API 호출 결과, 페이지 라우팅, 전역 상태에 직접 의존하는 경우
- 공통 컴포넌트를 조합한 화면 단위 섹션인 경우

예를 들어 `Button`, `Chip`, `BottomSheet`는 공통 컴포넌트가 될 수 있지만, `StudioFilterBottomSheet`, `ReservationSummaryCard`, `SearchResultItem`처럼 특정 도메인 의미가 강한 컴포넌트는 페이지 전용 컴포넌트로 관리합니다.

### 구현 원칙

- 공통 컴포넌트는 기본적으로 controlled/uncontrolled 사용 가능성을 고려합니다.
- 스타일은 Figma 기준을 우선하며, 가능한 경우 CSS variable 또는 디자인 토큰을 사용합니다.
- 컴포넌트 외부에서 간격을 제어할 수 있도록 `className` 또는 wrapper props는 필요한 경우에만 제공합니다.
- 공통 컴포넌트 내부에 페이지 전용 문구, API 호출, 라우팅 로직을 넣지 않습니다.
- 접근성이 필요한 요소는 `aria-label`, `aria-expanded`, `role`, keyboard interaction을 함께 고려합니다.

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

# 개발 서버 실행
npm run dev
```

> 모바일 UI 확인은 Chrome DevTools에서 `Cmd + Shift + M` (디바이스 모드) 사용을 권장합니다.

<br>

## 📱 화면 목록 및 플로우

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
| C-3 리스트 전체뷰 | 리스트 전체뷰 |
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
| F-1 예약 목록 | 전체/촬영완료/취소 탭 |
| F-1D 예약 상세 | 예약 상세 내역 |
| F-3 프로필 설정 | 프로필 편집 |

### G. 기타

| 화면 | 설명 |
|------|------|
| G-1 위시리스트 | 찜한 사진관 목록 |
| G-2 채팅 목록 | 사진관과의 채팅 |
