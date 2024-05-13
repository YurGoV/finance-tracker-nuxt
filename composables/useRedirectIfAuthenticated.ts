import { navigateTo } from 'nuxt/app'

export const useRedirectIfAuthenticated = (url = '/') => {
  // @ts-ignore
  const user = useSupabaseUser()

  // @ts-ignore
  watch(
    user,
    (user) => {
      if (user) {
        return navigateTo(url)
      }
    },
    { immediate: true }
  )

  return { user }
}
