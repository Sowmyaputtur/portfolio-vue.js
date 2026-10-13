<script setup lang="ts">
import { computed, ref } from "vue";
import { useAccountStore } from "@/stores/account";

const account = useAccountStore();
const recipient = ref("");
const amount = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const searchQuery = ref("");
const today = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());

const filteredTransactions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return account.transactions;
  return account.transactions.filter((transaction) =>
    `${transaction.name} ${transaction.category}`.toLowerCase().includes(query),
  );
});

function submitTransfer() {
  errorMessage.value = "";
  successMessage.value = "";
  const transferAmount = Number(amount.value);

  try {
    account.transferFunds(recipient.value, transferAmount);
    successMessage.value = `Transfer of ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(transferAmount)} sent to ${recipient.value.trim()}.`;
    recipient.value = "";
    amount.value = "";
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Your transfer could not be completed.";
  }
}

function fillRecipient(name: string) {
  recipient.value = name;
  successMessage.value = "";
  errorMessage.value = "";
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <RouterLink class="brand" to="/" aria-label="Northstar home">
        <span class="brand-mark">✳</span>
        <span>northstar<span class="brand-period">.</span></span>
      </RouterLink>

      <div class="workspace-label">WORKSPACE</div>
      <nav class="main-nav" aria-label="Main navigation">
        <RouterLink to="/" class="nav-link active">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
          </svg>
          Overview
        </RouterLink>
        <a class="nav-link" href="#transactions">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h15m0 0-3-3m3 3-3 3M20 17H5m0 0 3 3m-3-3 3-3" />
          </svg>
          Transactions
        </a>
        <a class="nav-link" href="#accounts">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 10h18m-14 5h3" />
          </svg>
          Cards
        </a>
        <a class="nav-link" href="#transfer">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7h13m0 0-4-4m4 4-4 4M17 17H4m0 0 4 4m-4-4 4-4" />
          </svg>
          Transfers
        </a>
      </nav>

      <div class="sidebar-bottom">
        <div class="help-card">
          <div class="help-icon">?</div>
          <div>
            <strong>Need a hand?</strong><span>We're here for you.</span>
          </div>
          <span class="help-arrow">↗</span>
        </div>
        <button
          class="profile-button"
          type="button"
          aria-label="Profile: Sowmya Puttur"
        >
          <span class="avatar avatar-profile">SP</span>
          <span class="profile-copy"
            ><strong>Sowmya Puttur</strong><span>Personal account</span></span
          >
          <span class="profile-menu">···</span>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div class="breadcrumb">
          Your account <span>/</span> <strong>Overview</strong>
        </div>
        <div class="topbar-actions">
          <button
            class="icon-button notification-button"
            type="button"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4"
              />
            </svg>
            <i></i>
          </button>
          <span class="topbar-divider"></span>
          <span class="topbar-date">{{ today }}</span>
          <span class="avatar avatar-profile topbar-avatar">SP</span>
        </div>
      </header>

      <div class="dashboard">
        <section class="welcome-row">
          <div>
            <div class="eyebrow">
              <span class="status-dot"></span> YOUR MONEY, IN GOOD HANDS
            </div>
            <h1>Good morning, Sowmya <span class="wave">✳</span></h1>
            <p class="welcome-subtitle">
              Here's what's happening with your money today.
            </p>
          </div>
          <button class="date-filter" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M16 3v4M8 3v4M3 10h18" />
            </svg>
            Last 30 days
            <span class="chevron">⌄</span>
          </button>
        </section>

        <section
          id="accounts"
          class="overview-grid"
          aria-label="Account overview"
        >
          <article class="balance-card">
            <div class="balance-card-top">
              <span>Total balance</span><span class="balance-menu">···</span>
            </div>
            <div class="balance-amount">{{ account.formattedBalance }}</div>
            <div class="balance-foot">
              <span class="balance-account"
                ><span class="mini-bank-icon">▤</span> Everyday checking
                <span class="account-number">···· 4829</span></span
              >
              <span class="balance-change"
                ><span>↗</span> 4.8%
                <span class="muted-on-dark">this month</span></span
              >
            </div>
            <div class="balance-decoration"></div>
          </article>
          <article class="stat-card income-card">
            <div class="stat-heading">
              <span class="stat-icon income-icon">↙</span><span>Income</span
              ><button
                class="more-button"
                type="button"
                aria-label="Income options"
              >
                ···
              </button>
            </div>
            <div class="stat-amount">
              ${{
                account.monthlyIncome.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })
              }}
            </div>
            <div class="stat-foot">
              <span class="change-pill">↗ 12.6%</span
              ><span>vs. last month</span>
            </div>
            <div class="sparkline income-sparkline">
              <svg
                viewBox="0 0 150 42"
                preserveAspectRatio="none"
                aria-label="Income trending up"
              >
                <path
                  d="M1 34 C 15 30, 19 35, 29 26 S 42 30, 53 21 S 69 27, 80 17 S 96 23, 109 12 S 126 17, 149 3"
                />
              </svg>
            </div>
          </article>
          <article class="stat-card spending-card">
            <div class="stat-heading">
              <span class="stat-icon spending-icon">↗</span><span>Spending</span
              ><button
                class="more-button"
                type="button"
                aria-label="Spending options"
              >
                ···
              </button>
            </div>
            <div class="stat-amount">
              ${{
                account.monthlySpending.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })
              }}
            </div>
            <div class="stat-foot">
              <span class="change-pill neutral-pill">↓ 8.2%</span
              ><span>vs. last month</span>
            </div>
            <div class="sparkline spending-sparkline">
              <svg
                viewBox="0 0 150 42"
                preserveAspectRatio="none"
                aria-label="Spending trending down"
              >
                <path
                  d="M1 8 C 14 14, 20 9, 31 18 S 47 12, 57 22 S 73 16, 85 27 S 103 19, 114 31 S 135 24, 149 38"
                />
              </svg>
            </div>
          </article>
        </section>

        <section class="content-grid">
          <article class="panel transactions-panel" id="transactions">
            <div class="panel-heading">
              <div>
                <h2>Recent transactions</h2>
                <p>A little snapshot of your spending.</p>
              </div>
              <div class="transaction-actions">
                <label class="search-box">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="10.8" cy="10.8" r="6.8" />
                    <path d="m16 16 4 4" />
                  </svg>
                  <input
                    v-model="searchQuery"
                    aria-label="Search transactions"
                    placeholder="Search"
                  />
                  <kbd>⌘ K</kbd>
                </label>
                <button
                  class="filter-button"
                  type="button"
                  aria-label="Filter transactions"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 7h16M7 12h10m-7 5h4" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="transaction-table">
              <div class="table-header">
                <span>NAME</span><span>DATE</span><span>AMOUNT</span
                ><span></span>
              </div>
              <div v-if="filteredTransactions.length" class="transaction-rows">
                <div
                  v-for="transaction in filteredTransactions"
                  :key="transaction.id"
                  class="transaction-row"
                >
                  <div class="transaction-name">
                    <span
                      class="merchant-avatar"
                      :class="{
                        'merchant-transfer':
                          transaction.category === 'Transfer',
                        'merchant-salary': transaction.kind === 'income',
                      }"
                      >{{ transaction.initials }}</span
                    >
                    <span class="merchant-copy"
                      ><strong>{{ transaction.name }}</strong
                      ><span>{{ transaction.category }}</span></span
                    >
                  </div>
                  <span class="transaction-date">{{ transaction.date }}</span>
                  <span
                    class="transaction-amount"
                    :class="{ 'amount-income': transaction.kind === 'income' }"
                  >
                    {{ transaction.kind === "income" ? "+" : "−" }}${{
                      transaction.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })
                    }}
                  </span>
                  <button
                    class="row-menu"
                    type="button"
                    :aria-label="`More options for ${transaction.name}`"
                  >
                    ···
                  </button>
                </div>
              </div>
              <p v-else class="empty-state">
                No transactions match your search.
              </p>
            </div>
            <button class="view-all-button" type="button">
              View all transactions <span>→</span>
            </button>
          </article>

          <article class="panel transfer-panel" id="transfer">
            <div class="transfer-heading">
              <div class="transfer-title-icon">↗</div>
              <div>
                <h2>Quick transfer</h2>
                <p>Send money in a few taps.</p>
              </div>
              <button
                class="more-button"
                type="button"
                aria-label="Transfer options"
              >
                ···
              </button>
            </div>
            <div class="recipient-section">
              <div class="field-label">SEND TO</div>
              <div class="recipient-chips">
                <button
                  class="recipient-chip"
                  type="button"
                  @click="fillRecipient('Olivia Chen')"
                >
                  <span class="recipient-avatar olivia">OC</span
                  ><span>Olivia</span>
                </button>
                <button
                  class="recipient-chip"
                  type="button"
                  @click="fillRecipient('Marcus Lee')"
                >
                  <span class="recipient-avatar marcus">ML</span
                  ><span>Marcus</span>
                </button>
                <button
                  class="recipient-chip"
                  type="button"
                  @click="fillRecipient('Jamie Park')"
                >
                  <span class="recipient-avatar jamie">JP</span
                  ><span>Jamie</span>
                </button>
                <button
                  class="add-recipient"
                  type="button"
                  aria-label="Add recipient"
                  @click="fillRecipient('')"
                >
                  +
                </button>
              </div>
            </div>
            <form
              class="transfer-form"
              novalidate
              @submit.prevent="submitTransfer"
            >
              <label class="input-label" for="recipient">Recipient</label>
              <input
                id="recipient"
                v-model="recipient"
                class="form-input"
                autocomplete="name"
                placeholder="Name or email address"
              />
              <label class="input-label amount-label" for="amount"
                >Amount</label
              >
              <div class="amount-input-wrap">
                <span>$</span
                ><input
                  id="amount"
                  v-model="amount"
                  class="form-input amount-input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputmode="decimal"
                  placeholder="0.00"
                /><span class="currency-code">USD</span>
              </div>
              <p class="available-balance">
                Available balance
                <strong>{{ account.formattedBalance }}</strong>
              </p>
              <p
                v-if="errorMessage"
                class="form-feedback error-feedback"
                role="alert"
              >
                {{ errorMessage }}
              </p>
              <p
                v-if="successMessage"
                class="form-feedback success-feedback"
                role="status"
              >
                {{ successMessage }}
              </p>
              <button class="send-button" type="submit">
                Send money <span>→</span>
              </button>
            </form>
            <div class="secure-note">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2" />
              </svg>
              Your transfers are protected and secure.
            </div>
          </article>
        </section>

        <footer class="dashboard-footer">
          <span>© 2025 Northstar Financial</span
          ><span
            >Member FDIC <span class="footer-dot">·</span> Equal Housing
            Lender</span
          ><a href="mailto:support@northstar.example"
            >Need help? <span>↗</span></a
          >
        </footer>
      </div>
    </main>
  </div>
</template>
