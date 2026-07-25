import { create } from 'zustand'

import type { TermKey } from '@/constants/terms'

const INITIAL_TERMS: Record<TermKey, boolean> = {
  service: false,
  privacy: false,
  age: false,
  marketing: false,
}

interface SignUpDraftState {
  name: string
  loginId: string
  password: string
  email: string
  phone: string
  terms: Record<TermKey, boolean>
  reset: () => void
}

/**
 * 회원가입 폼 입력값 임시 저장.
 * 약관 상세(/terms/:termType)로 갔다가 돌아와도 SignUpPage가 리마운트되면서
 * 입력값이 날아가지 않도록, 컴포넌트 바깥(zustand)에 값을 들고 있는다.
 */
export const useSignUpDraftStore = create<SignUpDraftState>((set) => ({
  name: '',
  loginId: '',
  password: '',
  email: '',
  phone: '',
  terms: INITIAL_TERMS,
  reset: () =>
    set({ name: '', loginId: '', password: '', email: '', phone: '', terms: INITIAL_TERMS }),
}))
