import { computed, isRef, type Ref } from 'vue'

export const useCurrency = (amount: number | Ref<number>) => {
  const currency = computed(() => {
    // TODO: customer change currency
    const currencyOptions = {
      style: 'currency',
      currency: 'EUR'
    }

    const value = isRef(amount) ? amount.value : amount

    const formattedCurrency = new Intl.NumberFormat(
      'en-IN',
      currencyOptions
    ).format(value)

    return formattedCurrency
  })

  return currency
}
