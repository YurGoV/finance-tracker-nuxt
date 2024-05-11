<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        Add Transaction
      </template>

      <UForm ref="form" :state="state" :schema="schema" @submit="save">
        <UFormGroup
          label="Transaction type"
          :required="true"
          name="type"
          class="mb-4"
        >
          <USelect
            v-model="state.type"
            placeholder="Select the transaction type"
            :options="types"
          />
        </UFormGroup>
        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput
            v-model.number="state.amount"
            type="number"
            placeholder="Amount"
          />
        </UFormGroup>
        <UFormGroup
          label="Transaction date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            v-model="state.created_at"
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
          />
        </UFormGroup>
        <UFormGroup
          label="Description"
          hint="Optional"
          name="description"
          class="mb-4"
        >
          <UInput v-model="state.description" placeholder="description" />
        </UFormGroup>
        <UFormGroup
          v-if="state.type === 'Expense'"
          label="Category"
          :required="true"
          name="category"
          class="mb-4"
        >
          <USelect
            v-model="state.category"
            placeholder="category"
            :options="categories"
          />
        </UFormGroup>
        <UButton
          type="submit"
          color="black"
          variant="solid"
          label="Save"
          :loading="isLoading"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { z } from 'zod'
import { categories, types } from '~/common/constants'

const toast = useToast()

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive('Amount needs to be more than 0')
})
const incomeSchema = z.object({
  type: z.literal('Income')
})
const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(categories)
})
const investmentSchema = z.object({
  type: z.literal('Investment')
})
const savingSchema = z.object({
  type: z.literal('Saving')
})
const schema = z.intersection(
  z.discriminatedUnion('type', [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema
  ]),
  defaultSchema
)
const form = ref()
const isLoading = ref(false)
const supabase = useSupabaseClient()
const save = async () => {
  // eslint-disable-next-line
  if (form.value.errors.length) return;

  isLoading.value = true
  try {
    const { error } = await supabase
      .from('transactions')
      .upsert({ ...state.value })
    if (!error) {
      toast.add({
        title: 'Transaction saved',
        icon: 'i-heroicons-check-circle',
        color: 'green'
      })
      isOpen.value = false
      emit('saved')
    }

    throw error
  } catch (err) {
    toast.add({
      title: 'Transaction not saved',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

const initialState = {
  type: undefined,
  amount: undefined,
  created_at: undefined,
  description: undefined,
  category: undefined
}
const state = ref({ ...initialState })
const resetForm = () => {
  Object.assign(state.value, initialState)
  form.value.clear()
}

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) {
      resetForm()
    }
    emit('update:modelValue', value)
  }
})
</script>
