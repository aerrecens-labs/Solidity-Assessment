import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { testTokenAbi, treasuryVaultAbi } from '../../../contracts/abis'
import { contractsReady, deployment, localSigner } from '../../../contracts/localChain'

type TxRow = {
  user: string
  amount: bigint
  kind: number
  timestamp: number
}

const KIND_LABEL = ['Deposit', 'Withdrawal', 'Bonus'] as const

function formatTest(value: bigint): string {
  const asNumber = Number(ethers.formatEther(value))
  if (!Number.isFinite(asNumber)) return ethers.formatEther(value)
  return asNumber.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

function parseAmount(value: string): bigint | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  try {
    const parsed = ethers.parseEther(trimmed)
    return parsed > 0n ? parsed : null
  } catch {
    return null
  }
}

function errorText(error: unknown, iface?: ethers.Interface): string {
  const queue: unknown[] = [error]
  const seen = new Set<unknown>()
  let fallback = 'Transaction failed'

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current || typeof current !== 'object' || seen.has(current)) continue
    seen.add(current)

    const details = current as {
      data?: string
      shortMessage?: string
      reason?: string
      message?: string
      error?: unknown
      info?: { error?: unknown }
    }

    if (iface && typeof details.data === 'string') {
      try {
        const parsed = iface.parseError(details.data)
        if (parsed?.name === 'Error') return `Reverted: ${String(parsed.args?.[0] ?? 'Error')}`
        if (parsed?.name) return `Reverted: ${parsed.name}`
      } catch {
        // The data is not one of this contract's errors.
      }
    }

    fallback = details.reason || details.shortMessage || details.message || fallback
    if (details.error) queue.push(details.error)
    if (details.info?.error) queue.push(details.info.error)
  }

  return fallback.replace(/^execution reverted:?\s*/i, 'Reverted: ')
}

function shortAddress(address: string): string {
  if (!address) return '—'
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export default function TreasuryView() {
  const [treasuryBalance, setTreasuryBalance] = useState(0n)
  const [userBalance, setUserBalance] = useState(0n)
  const [walletBalance, setWalletBalance] = useState(0n)
  const [tokenBalance, setTokenBalance] = useState(0n)
  const [claimed, setClaimed] = useState(false)
  const [transactions, setTransactions] = useState<TxRow[]>([])
  const [depositAmount, setDepositAmount] = useState('20')
  const [withdrawAmount, setWithdrawAmount] = useState('10')
  const [connectionStatus, setConnectionStatus] = useState('Connecting to local Hardhat…')
  const [actionStatus, setActionStatus] = useState<string | null>(null)
  const [actionOk, setActionOk] = useState(true)
  const [online, setOnline] = useState(false)
  const [pending, setPending] = useState(false)
  const pendingRef = useRef(false)

  const ready = contractsReady()

  const vault = useMemo(() => {
    if (!ready) return null
    return new ethers.Contract(deployment.vault, treasuryVaultAbi, localSigner)
  }, [ready])

  const token = useMemo(() => {
    if (!ready) return null
    return new ethers.Contract(deployment.token, testTokenAbi, localSigner)
  }, [ready])

  const refresh = useCallback(async () => {
    if (!vault || !token) {
      setOnline(false)
      setConnectionStatus('Contracts are not deployed. In a second terminal run npm run deploy.')
      return
    }

    try {
      const signerAddress = await localSigner.getAddress()
      const [treasury, user, wallet, held, hasClaimed, count] = await Promise.all([
        vault.getTreasuryBalance(),
        vault.getUserBalance(signerAddress),
        token.balanceOf(signerAddress),
        token.balanceOf(deployment.vault),
        vault.hasClaimedBonus(signerAddress),
        vault.getTransactionCount(),
      ])

      const total = Number(count)
      const rows: TxRow[] = []
      for (let index = 0; index < total; index += 1) {
        const record = await vault.getTransaction(index)
        rows.push({
          user: record.user ?? record[0],
          amount: record.amount ?? record[1],
          kind: Number(record.kind ?? record[2]),
          timestamp: Number(record.timestamp ?? record[3]),
        })
      }

      setTreasuryBalance(treasury)
      setUserBalance(user)
      setWalletBalance(wallet)
      setTokenBalance(held)
      setClaimed(Boolean(hasClaimed))
      setTransactions(rows.reverse())
      setOnline(true)
      setConnectionStatus('Connected to local Hardhat')
    } catch {
      setOnline(false)
      setConnectionStatus('Hardhat is not running. Start it with npm run node, then npm run deploy.')
    }
  }, [vault, token])

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => {
      void refresh()
    }, 8000)
    return () => window.clearInterval(timer)
  }, [refresh])

  async function runAction(label: string, action: () => Promise<void>) {
    if (!online || pendingRef.current) return
    pendingRef.current = true
    setPending(true)
    setActionOk(true)
    setActionStatus(label)
    try {
      await action()
      setActionStatus('Transaction successful')
      setActionOk(true)
      await refresh()
    } catch (error) {
      setActionStatus(errorText(error, vault?.interface))
      setActionOk(false)
    } finally {
      pendingRef.current = false
      setPending(false)
    }
  }

  async function handleDeposit() {
    if (!vault || !token) return
    const amount = parseAmount(depositAmount)
    if (amount === null) {
      setActionStatus('Enter a deposit amount greater than 0.')
      setActionOk(false)
      return
    }

    await runAction('Depositing…', async () => {
      const allowance = await token.allowance(localSigner.address, deployment.vault)
      if (allowance < amount) {
        setActionStatus('Approving TEST…')
        const approval = await token.approve(deployment.vault, ethers.MaxUint256)
        await approval.wait()
        setActionStatus('Depositing…')
      }
      const tx = await vault.deposit(amount)
      await tx.wait()
    })
  }

  async function handleWithdraw() {
    if (!vault) return
    const amount = parseAmount(withdrawAmount)
    if (amount === null) {
      setActionStatus('Enter a withdrawal amount greater than 0.')
      setActionOk(false)
      return
    }

    await runAction('Withdrawing…', async () => {
      const tx = await vault.withdraw(amount)
      await tx.wait()
    })
  }

  async function handleClaim() {
    if (!vault) return
    await runAction('Claiming bonus…', async () => {
      const tx = await vault.claimTreasuryBonus()
      await tx.wait()
    })
  }

  const status = actionStatus ?? connectionStatus
  const statusOk = actionStatus ? actionOk : online

  const chartData = transactions
    .slice()
    .reverse()
    .slice(-8)
    .map((tx, index) => ({
      name: `${index + 1}`,
      amount: Number(ethers.formatEther(tx.amount)),
      kind: KIND_LABEL[tx.kind] ?? 'Activity',
    }))

  return (
    <div className="h-full overflow-y-auto bg-[#0b0e14] text-slate-200">
      <div className="max-w-6xl mx-auto p-4 md:p-6 flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold tracking-[0.22em] text-blue-400">DAO TREASURY</div>
            <h1 className="text-2xl font-black text-white mt-1">Treasury Actions</h1>
            <p className="text-sm text-slate-400 mt-1">
              Local Hardhat account {shortAddress(deployment.account)} · chain {deployment.chainId}
            </p>
          </div>
          <div className="text-[10px] font-bold tracking-widest text-amber-200 border border-amber-300/30 bg-amber-300/10 rounded-full px-3 py-1">
            LOCAL DEVELOPMENT ONLY
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Stat label="Treasury Balance" value={`${formatTest(treasuryBalance)} TEST`} />
              <Stat label="Your Balance" value={`${formatTest(userBalance)} TEST`} />
              <Stat label="Wallet" value={`${formatTest(walletBalance)} TEST`} />
            </div>

            <section className="rounded-2xl border border-white/10 bg-[#151926] p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-white">Vault activity</h2>
                <span className="text-[11px] text-slate-500">
                  Tokens held {formatTest(tokenBalance)} TEST
                </span>
              </div>
              <div className="h-40">
                {chartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-slate-500">
                    No vault activity yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="kind" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                        contentStyle={{ background: '#0b0e14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}
                      />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#151926] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 text-sm font-bold text-white">Recent Transactions</div>
              {transactions.length === 0 ? (
                <div className="px-4 py-8 text-sm text-slate-500">Deposits, withdrawals, and bonus claims will show up here.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {transactions.slice(0, 8).map((tx, index) => (
                    <div key={`${tx.timestamp}-${index}`} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{KIND_LABEL[tx.kind] ?? 'Transaction'}</div>
                        <div className="text-[11px] text-slate-500">
                          {new Date(tx.timestamp * 1000).toLocaleString()} · {shortAddress(tx.user)}
                        </div>
                      </div>
                      <div className="font-mono text-sm text-slate-200">{formatTest(tx.amount)} TEST</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-2 order-1 lg:order-2">
            <section className="rounded-2xl border border-white/10 bg-[#151926] p-5 flex flex-col gap-5">
              <div>
                <h2 className="text-lg font-black text-white">Treasury Actions</h2>
                <p className="text-xs text-slate-500 mt-1">Reads and writes the local TreasuryVault contract.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Stat label="Treasury Balance" value={`${formatTest(treasuryBalance)} TEST`} compact />
                <Stat label="Your Balance" value={`${formatTest(userBalance)} TEST`} compact />
              </div>

              <ActionRow
                title="Deposit"
                amount={depositAmount}
                onAmount={setDepositAmount}
                onSubmit={handleDeposit}
                disabled={!online || pending}
              />
              <ActionRow
                title="Withdraw"
                amount={withdrawAmount}
                onAmount={setWithdrawAmount}
                onSubmit={handleWithdraw}
                disabled={!online || pending}
              />

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleClaim}
                  disabled={!online || pending || claimed}
                  className="bg-[#F5BD02] text-black text-xs font-bold px-4 py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Claim Bonus
                </button>
                <span className="text-xs text-slate-400">{claimed ? 'Bonus claimed' : 'Bonus available once'}</span>
              </div>

              <div className="border-t border-white/5 pt-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</div>
                <div className={`mt-1 text-sm font-medium ${statusOk ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {status}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-[#0b0e14] ${compact ? 'p-3' : 'p-4'}`}>
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 font-mono text-white ${compact ? 'text-sm' : 'text-xl'}`}>{value}</div>
    </div>
  )
}

function ActionRow({
  title,
  amount,
  onAmount,
  onSubmit,
  disabled,
}: {
  title: string
  amount: string
  onAmount: (value: string) => void
  onSubmit: () => void
  disabled: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg w-fit disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {title}
      </button>
      <label className="flex items-center gap-3 text-sm text-slate-400">
        Amount
        <input
          value={amount}
          onChange={(event) => onAmount(event.target.value)}
          inputMode="decimal"
          className="flex-1 bg-[#0b0e14] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
        />
      </label>
    </div>
  )
}
