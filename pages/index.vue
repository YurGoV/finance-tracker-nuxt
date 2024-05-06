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
      :amount="4000"
      :last-amount="3000"
      :loading="false"
    />
    <Trend
      color="red"
      title="Expence"
      :amount="4000"
      :last-amount="5000"
      :loading="false"
    />
    <Trend
      color="green"
      title="Investments"
      :amount="4000"
      :last-amount="3000"
      :loading="false"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="4100"
      :loading="false"
    />
  </section>
  <!-- <section v-if="transactions?.length"> -->
  <section>
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
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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

// @ts-ignore
const { data: transactions, pending }: IAsyncTransactionsResult = useAsyncData(
  'transactions',
  async () => {
    const { data, error } = await supabase.from('transactions').select()

    if (error) {
      return []
    }

    return data
  }
)

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
