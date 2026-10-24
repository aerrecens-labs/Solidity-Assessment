# Treasury assessment

You are joining an existing DAO treasury dashboard.

Change one file only: `contracts/TreasuryVault.sol`.

Do two things:

1. Finish `claimTreasuryBonus()`.
2. Fix the bug in `withdraw()`.

The React app is already built. Use it to check your work. Do not edit the frontend.

About 10 minutes.

## 1. Open the dashboard first

```bash
npm install
npm run frontend
```

Open [http://localhost:5173](http://localhost:5173).

You should see the Cryptic dashboard with a **Treasury** tab: balances, Deposit, Withdraw, and **Claim Bonus**.

No MetaMask. The app uses a local test account. That key is for **LOCAL DEVELOPMENT ONLY**. Never use it on a public network.

The buttons need a local chain. Start it in two more terminals, and leave them running.

**Terminal 2**

```bash
npm run node
```

**Terminal 3**

```bash
npm run deploy
```

Refresh the page. You should see:

- Treasury balance: 1,000 TEST
- Your balance: 100 TEST
- Wallet: 9,000 TEST

If you restart `npm run node`, run `npm run deploy` again. Restarting the chain clears the contracts.

## 2. The two tasks

### Task 1 — Claim bonus

`claimTreasuryBonus()` is not finished yet. **Claim Bonus** will fail until you write it.

When it works:

- Each address can claim once.
- The bonus is 10 TEST (`BONUS_AMOUNT`).
- Those 10 TEST move from the contract to the caller’s wallet.
- Save the claim on `bonusClaimed`.
- Add a `TxKind.Bonus` record, the same way deposit and withdraw record a transaction.
- Lower `treasuryBalance` by 10 TEST.
- Do not change the caller’s vault balance (`getUserBalance`). This is a wallet payment, not a new deposit.
- Emit `BonusClaimed(address indexed user, uint256 amount)`.
- A second claim from the same address must fail.
- Another address can still claim once.

The storage, constant, event, and errors are already in the contract. Fill in the function.

### Task 2 — Fix withdraw

`withdraw()` already sends the tokens, but the numbers it stores are wrong.

After a correct withdraw:

- The user’s vault balance goes down by the amount they withdrew.
- The treasury balance goes down by that same amount.
- The treasury balance matches the TEST still sitting in the contract.

These cases must still fail:

- Withdrawing 0.
- Withdrawing more than that user has.
- One user withdrawing another user’s funds.

Read `withdraw` next to `deposit` and fix the accounting. Do not change how many tokens are sent.

## 3. Check your work

In the dashboard:

- Deposit and withdraw update the balances.
- After a withdraw, **Treasury balance** matches **Tokens held**.
- **Claim Bonus** succeeds once, adds 10 TEST to the wallet, and fails the second time.

Then run:

```bash
npm test
```

Some tests already pass. The withdraw tests and the `claimTreasuryBonus` tests fail until both tasks are done. You do not need to write new tests.

## Hand in

`contracts/TreasuryVault.sol` with the bonus function done and the withdraw bug fixed.
