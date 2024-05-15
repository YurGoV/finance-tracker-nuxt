import { ref, watch } from "vue"

export const useAvatarUrl = () => {
  // Get the current user metadata - which contain name of avatar image
  // Public URL of that image
  // Watch user for any changes - so we always display image of the user

  // @ts-ignore
  const supabase = useSupabaseClient()
  // @ts-ignore
  const user = useSupabaseUser()

  const getPublicUrl = () => {
    if (!user.value?.user_metadata?.avatar_url) return null

    const { data } = supabase
      .storage
      .from('avatar')
      .getPublicUrl(user.value?.user_metadata?.avatar_url)

    return data.publicUrl
  }

  const url = ref(getPublicUrl())

  watch(user, () => url.value = getPublicUrl(), { immediate: true })

  return { url }
}
