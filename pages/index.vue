<template>
  <section class="flex item-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">
      Summary
    </h1>
    <div>
      <USelectMenu v-model="selectedVeiw" :options="transactionsViewOptions" />
    </div>
  </section>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    <Trend
      color="green"
      title="Income"
      :amount="incomeTotal"
      :last-amount="3000"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="expenseTotal"
      :last-amount="5000"
      :loading="isLoading"
    />
    <Trend
      color="green"
      title="Investments"
      :amount="4000"
      :last-amount="3000"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="4100"
      :loading="isLoading"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">
        Transactions
      </h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this
        period
      </div>
    </div>
    <div>
      <TransactionModal v-model="isOpen" @saved="refreshTransactions()" />
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        @click="isOpen = true"
      />
    </div>
  </section>

  <section v-if="!isLoading">
    <div
      v-for="(transactionsOnDay, date) in transactionsGroupedByDay"
      :key="date"
      class="mb-10"
    >
      <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
      <Transaction
        v-for="transaction in transactionsOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refreshTransactions()"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton v-for="i in 4" :key="i" class="h-8 w-full mb-2" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { transactionsViewOptions } from '~/common/constants'
import type {
  IAsyncTransactionsResult,
  ITransaction
} from '~/types/transaction'
// import type { Database } from '~/types'

const selectedVeiw = ref(transactionsViewOptions[1])

// @ts-ignore
const supabase = useSupabaseClient()
// const supabase = useSupabaseClient<Database>()

// NOTE: error with this:
//
// const transactions = ref<ITransaction[]>([])
const transactions = ref<ITransaction[]>([])
const isLoading = ref(false)
const isOpen = ref(false)

const income = computed(() => {
  if (transactions.value.length) {
    const income = transactions.value.filter(
      // t => t.type.toLowerCase() === 'income'
      t => t.type === 'Income'
    )
    return income
  }
  return []
})
const expense = computed(() => {
  if (transactions.value.length) {
    const expense = transactions.value.filter(
      // t => t.type.toLowerCase() === 'expense'
      t => t.type === 'Expense'
    )
    return expense
  }
  return []
})
const incomeCount = computed(() => income.value.length)
const expenseCount = computed(() => expense.value.length)
const incomeTotal = computed(() =>
  income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)
const expenseTotal = computed(() =>
  expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)

const fetchTransactions = async () => {
  isLoading.value = true
  try {
    const result: IAsyncTransactionsResult =
      // @ts-ignore
      await useAsyncData('transactions', async () => {
        const { data, error } = await supabase
          .from('transactions')
          .select()
          .order('created_at', { ascending: false })

        if (error) {
          return []
        }

        return data
      })

    return result.data.value
  } finally {
    isLoading.value = false
  }
}

const refreshTransactions = async () =>
  (transactions.value = await fetchTransactions())

await refreshTransactions()

type GroupedTransactions = { [date: string]: ITransaction[] };

const transactionsGroupedByDay = computed(() => {
  const grouped: GroupedTransactions = {}

  // @ts-ignore
  for (const transaction of transactions.value) {
    const date = new Date(transaction.created_at).toISOString().split('T')[0]

    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(transaction)
  }

  return grouped
})
// console.log(transactionsGroupedByDay.value)
</script>
