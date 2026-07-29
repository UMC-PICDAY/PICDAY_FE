// 촬영 컨셉 enum → 표시 라벨. 화면에는 라벨을, API에는 코드를 쓴다.
export const SHOOTING_CATEGORY_LABEL: Record<string, string> = {
  ID_PHOTO: '증명',
  PROFILE: '프로필',
  PERSONAL_PORTRAIT: '개인화보',
  JOB_PHOTO: '취업',
  FAMILY: '가족',
  FRIENDSHIP: '우정',
}

// 매핑에 없는 코드는 원문을 그대로 노출한다(백엔드가 enum을 추가한 경우 대비).
export const getShootingCategoryLabel = (shootingCategory: string) =>
  SHOOTING_CATEGORY_LABEL[shootingCategory] ?? shootingCategory
