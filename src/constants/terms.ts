export type TermKey = 'service' | 'privacy' | 'age' | 'marketing'

export const REQUIRED_TERMS: TermKey[] = ['service', 'privacy', 'age']

// 약관 목록 조회 API가 아직 없어서, 명세서 예시(agreedTermsIds: [1,2,3,4], 필수 3종 + 선택 1종)
// 순서를 그대로 따라 임시로 고정 매핑 — 실제 약관 ID 나오면 교체
export const TERM_ITEMS: { key: TermKey; label: string; id: number }[] = [
  { key: 'service', label: '서비스 이용 약관 동의 (필수)', id: 1 },
  { key: 'privacy', label: '개인정보 수집 및 이용 동의 (필수)', id: 2 },
  { key: 'age', label: '만 14세 이상 확인 (필수)', id: 3 },
  { key: 'marketing', label: '마케팅 알림 수신 동의 (선택)', id: 4 },
]
