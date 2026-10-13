import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import DashboardView from '@/views/DashboardView.vue'
import { useAccountStore } from '@/stores/account'

const mountDashboard = () => mount(DashboardView, { global: { stubs: { RouterLink: true } } })

describe('account transfers', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('deducts a valid transfer and records it in the transaction list', () => {
    const account = useAccountStore()
    const startingBalance = account.balance

    account.transferFunds('Taylor Reed', 32.5)

    expect(account.balance).toBe(startingBalance - 32.5)
    expect(account.transactions[0]).toMatchObject({
      name: 'Taylor Reed',
      amount: 32.5,
      category: 'Transfer',
      kind: 'expense',
      date: 'Just now',
    })
  })

  it.each([
    ['', 5, 'Enter a recipient name.'],
    ['Taylor Reed', 0, 'Enter an amount greater than $0.'],
    ['Taylor Reed', -1, 'Enter an amount greater than $0.'],
    ['Taylor Reed', Number.NaN, 'Enter an amount greater than $0.'],
    ['Taylor Reed', 30_000, 'This transfer exceeds your available balance.'],
  ])('rejects invalid transfers to %s for $%s', (recipient, amount, message) => {
    const account = useAccountStore()
    const startingBalance = account.balance
    const startingTransactionCount = account.transactions.length

    expect(() => account.transferFunds(recipient, amount)).toThrow(message)
    expect(account.balance).toBe(startingBalance)
    expect(account.transactions).toHaveLength(startingTransactionCount)
  })

  it('shows validation feedback when the transfer form is submitted empty', async () => {
    const wrapper = mountDashboard()

    await wrapper.get('form').trigger('submit')

    expect(wrapper.get('[role="alert"]').text()).toBe('Enter a recipient name.')
  })

  it('submits a transfer and updates the balance and transaction list', async () => {
    const wrapper = mountDashboard()

    await wrapper.get('#recipient').setValue('Taylor Reed')
    await wrapper.get('#amount').setValue('32.50')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.get('[role="status"]').text()).toContain('Transfer of $32.50 sent to Taylor Reed.')
    expect(wrapper.text()).toContain('Taylor Reed')
    expect(wrapper.text()).toContain('$24,648.00')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('filters transactions by merchant or category', async () => {
    const wrapper = mountDashboard()

    await wrapper.get('input[aria-label="Search transactions"]').setValue('salary')

    expect(wrapper.text()).toContain('Acme Studio')
    expect(wrapper.text()).not.toContain('Whole Foods Market')
  })
})
