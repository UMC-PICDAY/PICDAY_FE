// 홈(2-1)·자동완성(2-2) 응답의 locationCategory가 한글("홍대") → 영문 코드("HONGDAE")로 변경됨(백엔드 확정).
// "HONGDAE"만 백엔드가 확정해준 값이고, 나머지는 REGION_CHIPS(검색 지역칩) 목록 기준 추정치라
// 실제 응답과 다르면 백엔드에 코드 목록을 확인해서 갱신해야 함.
export const LOCATION_CATEGORY_LABEL: Record<string, string> = {
  HONGDAE: '홍대',
  GANGNAM: '강남',
  SEONGSU: '성수',
  YEONNAM: '연남',
  GEONDAE: '건대',
  SINCHON: '신촌',
  JAMSIL: '잠실',
  APGUJEONG: '압구정',
  HYEHWA: '혜화',
  JONGNO: '종로',
}

// 매핑에 없는 코드는(추정 목록에 없는 지역, 또는 백엔드가 아직 한글로 내려주는 다른 API 응답) 그대로 노출한다.
export const getLocationLabel = (locationCategory: string) =>
  LOCATION_CATEGORY_LABEL[locationCategory] ?? locationCategory
