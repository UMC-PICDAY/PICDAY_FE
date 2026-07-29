// locationCategory는 한글("홍대")이 아니라 영문 코드("HONGDAE")로 내려온다.
// 아래 10개는 검색 API(2-3)에 실제로 넣어보고 전부 통과하는 것을 확인한 확정값이다.
// (건대는 GEONDAE가 아니라 KONDAE. GEONDAE로 보내면 STUDIO_4008 오류)
export const LOCATION_CATEGORY_LABEL: Record<string, string> = {
  HONGDAE: '홍대',
  GANGNAM: '강남',
  SEONGSU: '성수',
  YEONNAM: '연남',
  KONDAE: '건대',
  SINCHON: '신촌',
  JAMSIL: '잠실',
  APGUJEONG: '압구정',
  HYEHWA: '혜화',
  JONGNO: '종로',
}

// 매핑에 없는 코드는(추정 목록에 없는 지역, 또는 백엔드가 아직 한글로 내려주는 다른 API 응답) 그대로 노출한다.
export const getLocationLabel = (locationCategory: string) =>
  LOCATION_CATEGORY_LABEL[locationCategory] ?? locationCategory
