<template>
  <section class="flex item-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">
      Summary
    </h1>
    <div>
      <USelectMenu v-model="selectedView" :options="transactionsViewOptions" />
    </div>
  </section>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    <Trend
      color="green"
      title="Income"
      :amount="incomeTotal"
      :last-amount="prevIncomeTotal"
      :loading="pending"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="expenseTotal"
      :last-amount="prevExpenseTotal"
      :loading="pending"
    />
    <Trend
      color="green"
      title="Investments"
      :amount="4000"
      :last-amount="3000"
      :loading="pending"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="4100"
      :loading="pending"
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
      <TransactionModal v-model="isOpen" @saved="refresh()" />
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        @click="isOpen = true"
      />
    </div>
  </section>

  <section v-if="!pending">
    <div v-for="(transactionsOnDay, date) in byDate" :key="date" class="mb-10">
      <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
      <Transaction
        v-for="transaction in transactionsOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refresh()"
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
// import type {
//   IAsyncTransactionsResult,
//   ITransaction
// } from '~/types/transaction'

const selectedView = ref(transactionsViewOptions[1])
const isOpen = ref(false)

// @ts-ignore
const { current, previous } = useSelectedTimePeriod(selectedView)

const {
  pending,
  refresh,
  transactions: {
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    grouped: { byDate }
  }
  // @ts-ignore
} = useFetchTransactions(current)

const {
  transactions: {
    incomeTotal: prevIncomeTotal,
    expenseTotal: prevExpenseTotal
  }
  // @ts-ignore
} = useFetchTransactions(previous)

</script>
