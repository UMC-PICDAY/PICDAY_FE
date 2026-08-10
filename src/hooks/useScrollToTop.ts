import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'

/**
 * 라우트 이동 시 문서 스크롤을 최상단으로 되돌린다.
 *
 * SPA는 화면을 새로 로드하지 않아 이전 화면의 스크롤 위치가 그대로 남는다.
 * 새로 진입한 화면이 중간부터 보이지 않도록 이동 시점에 직접 올려준다.
 *
 * 뒤로가기·앞으로가기(POP)는 보던 위치로 돌아가는 편이 자연스러우므로 건너뛴다.
 * 페인트 전에 처리해야 이전 위치가 한 프레임 스쳐 보이지 않는다.
 *
 * 앱 전역에 적용하려면 App에서, 특정 화면에만 적용하려면 해당 페이지에서 호출한다.
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    if (navigationType === 'POP') return
    window.scrollTo(0, 0)
  }, [pathname, navigationType])
}
