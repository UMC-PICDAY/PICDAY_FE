import { queryClient } from '@/services/queryClient'
import { useCompareStore } from '@/stores/useCompareStore'
import { useSearchDraftStore } from '@/stores/useSearchDraftStore'

/**
 * 로그아웃/새 로그인처럼 인증 주체가 바뀌는 시점에 호출해서, 이전
 * 사용자와 이어져 있던 상태(쿼리 캐시·비교 트레이·검색 draft)가 다음
 * 사용자에게 그대로 남아있지 않게 한다.
 *
 * client.ts의 토큰 갱신(같은 사용자의 세션 연장)이 부르는 login()에서는
 * 쓰지 않는다 — 거기서까지 비우면 접속 중인 화면이 매 갱신(약 1시간)
 * 마다 불필요하게 다시 로딩되는 회귀가 생긴다.
 */
export const clearUserSessionState = () => {
  queryClient.clear()
  useCompareStore.getState().clear()
  useSearchDraftStore.getState().reset()
}
