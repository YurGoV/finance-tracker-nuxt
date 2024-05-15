<template>
  <UCard v-if="!success">
    <template #header>
      Sign-in to finance tracker
    </template>
    <form @submit.prevent="handleLogin">
      <UFormGroup
        label="Email"
        name="email"
        class="mb-4"
        required
        help="You will receive an email with the confirmation link"
      >
        <UInput v-model="email" type="email" placeholder="Email" required />
      </UFormGroup>
      <!-- <UFormGroup -->
      <!--   label="Email" -->
      <!--   name="email" -->
      <!--   class="mb-4" -->
      <!--   required -->
      <!--   help="You will receive an email with the comfirmation link" -->
      <!-- > -->
      <!--   <UInput v-model="email" type="email" placeholder="Email" required /> -->
      <!-- </UFormGroup> -->

      <UButton
        type="submit"
        variant="solid"
        color="black"
        :loading="pending"
        :disabled="pending"
      >
        Sign-in
      </UButton>
    </form>
  </UCard>
  <UCard v-else>
    <template #header>
      Email has been send
    </template>
    <div class="text-center">
      <p>
        We have send an email to <strong>{{ email }}</strong> whti a link to
        sign in
      </p>
      <p><strong>Important:</strong> The link will expire in 5 minutes</p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
const { toastError } = useAppToast()

const success = ref(false)
const email = ref('')
const pending = ref(false)
// @ts-ignore
const toast = useToast()
// @ts-ignore
const supabase = useSupabaseClient()

// @ts-ignore
useRedirectIfAuthenticated()

const handleLogin = async () => {
  pending.value = true

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm'
      }
    })

    if (error) {
      toastError({
        title: 'Error Authenticating',
        description: error.message
      })
    } else {
      success.value = true
    }
  } finally {
    pending.value = false
  }
}
</script>
