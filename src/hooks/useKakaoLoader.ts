import { useKakaoLoader as useKakaoLoaderOrigin } from 'react-kakao-maps-sdk'

/**
 * 카카오 지도 SDK 로더.
 *
 * `.env`의 `VITE_KAKAO_MAP_KEY`(JavaScript 키)를 주입해 SDK 스크립트를 한 번만 로드한다.
 * 여러 위치에서 호출해도 실제 로드는 최초 1회만 일어난다.
 *
 * @returns `[loading, error]` — 로드 진행 여부와 실패 시 에러
 */
export const useKakaoLoader = () =>
  useKakaoLoaderOrigin({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
  })
