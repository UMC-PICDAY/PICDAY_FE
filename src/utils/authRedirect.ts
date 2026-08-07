const SOCIAL_LOGIN_RETURN_TO_KEY = 'picday:social-login-return-to'

export const getSafeReturnTo = (
  value: string | null | undefined,
  fallback = '/home',
) => {
  if (!value?.startsWith('/') || value.startsWith('//')) {
    return fallback
  }

  return value
}

export const saveSocialLoginReturnTo = (returnTo: string) => {
  sessionStorage.setItem(
    SOCIAL_LOGIN_RETURN_TO_KEY,
    getSafeReturnTo(returnTo),
  )
}

export const getSocialLoginReturnTo = () =>
  getSafeReturnTo(
    sessionStorage.getItem(SOCIAL_LOGIN_RETURN_TO_KEY),
  )

export const clearSocialLoginReturnTo = () => {
  sessionStorage.removeItem(SOCIAL_LOGIN_RETURN_TO_KEY)
}