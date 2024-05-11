import { parseISO } from 'date-fns'
import { computed, ref } from 'vue'
import type {
  IAsyncTransactionsResult,
  ITransaction
} from '~/types/transaction'

export const useFetchTransactions = (period) => {
  const transactions = ref<ITransaction[]>([])
  const pending = ref(false)

  // @ts-ignore
  const supabase = useSupabaseClient()

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
    pending.value = true
    try {
      const data: IAsyncTransactionsResult =
        // `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
        // @ts-ignore
        await useAsyncData(
          `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
          // 'transactions',
          async () => {
            const { data, error } = await supabase
              .from('transactions')
              .select()
              .gte('created_at', period.value.from.toISOString())
              .lte('created_at', period.value.to.toISOString())
              .order('created_at', { ascending: false })

            if (error || !data) {
              return []
            }

            return data
          }
        )

      return data.data.value || []
    } finally {
      pending.value = false
    }
  }

  const refresh = async () => {
    transactions.value = await fetchTransactions()
  }

  // @ts-ignore
  watch(period, async () => await refresh())

  type GroupedTransactions = { [date: string]: ITransaction[] };

  const transactionsGroupedByDate = computed(() => {
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

  return {
    refresh,
    pending,
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate
      },
      income,
      expense,
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount
    }
  }
}
