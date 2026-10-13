import { defineStore } from 'pinia'

export interface Transaction {
  id: number
  name: string
  initials: string
  category: string
  date: string
  amount: number
  kind: 'income' | 'expense'
}

export const useAccountStore = defineStore('account', {
  state: () => ({
    balance: 24_680.5,
    monthlyIncome: 8_250,
    monthlySpending: 3_428.76,
    transactions: [
      { id: 1, name: 'Whole Foods Market', initials: 'W', category: 'Groceries', date: 'Today, 10:42 AM', amount: 86.42, kind: 'expense' as const },
      { id: 2, name: 'Olivia Chen', initials: 'OC', category: 'Transfer', date: 'Today, 9:18 AM', amount: 125, kind: 'expense' as const },
      { id: 3, name: 'Acme Studio', initials: 'AS', category: 'Salary', date: 'Yesterday', amount: 4_250, kind: 'income' as const },
      { id: 4, name: 'Blue Bottle Coffee', initials: 'B', category: 'Dining', date: 'Yesterday', amount: 12.8, kind: 'expense' as const },
      { id: 5, name: 'Notion Labs', initials: 'N', category: 'Software', date: 'Oct 10, 2025', amount: 10, kind: 'expense' as const },
    ] satisfies Transaction[],
    nextTransactionId: 6,
  }),
  getters: {
    formattedBalance: (state) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(state.balance),
  },
  actions: {
    transferFunds(recipient: string, amount: number) {
      if (!recipient.trim()) throw new Error('Enter a recipient name.')
      if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter an amount greater than $0.')
      if (amount > this.balance) throw new Error('This transfer exceeds your available balance.')

      this.balance = Number((this.balance - amount).toFixed(2))
      this.transactions.unshift({
        id: this.nextTransactionId++,
        name: recipient.trim(),
        initials: recipient.trim().slice(0, 2).toUpperCase(),
        category: 'Transfer',
        date: 'Just now',
        amount,
        kind: 'expense',
      })
    },
  },
})
