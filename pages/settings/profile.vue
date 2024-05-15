<template>
  <UForm :state="state" :schema="schema" @submit="saveProfile">
    <UFormGroup class="mb-4" label="Full name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>
    <UFormGroup
      class="mb-4"
      label="Email"
      name="email"
      help="If modify - you will receive confirmation messages to both email"
    >
      <UInput v-model="state.email" />
    </UFormGroup>
    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </UForm>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";

// @ts-ignore
const supabase = useSupabaseClient();
// @ts-ignore
const user = useSupabaseUser();
// @ts-ignore
const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);

const state = ref({
  name: user.value.user_metadata?.full_name,
  email: user.value.email,
});

const schema = z.object({
  // TODO: optional is not work with min
  //
  // name: z.string().min(2).optional(),
  name: z.string().optional(),
  email: z.string().email(),
});

// TODO: move out
interface userUpdatePayload {
  full_name?: string
  email?: string
}

const saveProfile = async () => {
  pending.value = true;
  try {
    const data: userUpdatePayload = {
      full_name: state.value.name,
    };
    if (state.value.email !== user.value.email) {
      data.email = state.value.email;
    }

    const { error } = await supabase.auth.updateUser({
      data,
    });
    if (error) throw error;

    toastSuccess({
      title: "Profile updated",
      description: "Your prifile has updated",
    });
  } catch (error) {
    toastError({
      title: "Error on profile updating",
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>
