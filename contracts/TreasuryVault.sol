// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Simplified DAO treasury used by the Cryptic dashboard.
///         Balances below are the contract's own accounting.
contract TreasuryVault {
    IERC20 public immutable token;
    address public immutable owner;

    /// @notice One-time bonus paid to a claimant. 10 TEST, 18 decimals.
    uint256 public constant BONUS_AMOUNT = 10 ether;

    /// @notice Tokens accounted to the treasury.
    uint256 public treasuryBalance;

    /// @notice Vault deposit balance credited to each user.
    mapping(address => uint256) public userBalances;

    /// @notice Whether an address has already claimed the treasury bonus.
    mapping(address => bool) public bonusClaimed;

    enum TxKind {
        Deposit,
        Withdrawal,
        Bonus
    }

    struct TxRecord {
        address user;
        uint256 amount;
        TxKind kind;
        uint256 timestamp;
    }

    TxRecord[] private _transactions;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event BonusClaimed(address indexed user, uint256 amount);
    event ReserveFunded(address indexed from, uint256 amount);

    error ZeroAmount();
    error InsufficientBalance();
    error InsufficientTreasury();
    error TransferFailed();
    error NotOwner();
    error NotImplemented();
    error AlreadyClaimed();

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
        owner = msg.sender;
    }

    /// @notice Pull TEST from the caller and credit their vault balance.
    function deposit(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();

        if (!token.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();

        userBalances[msg.sender] += amount;
        treasuryBalance += amount;

        _transactions.push(
            TxRecord({
                user: msg.sender,
                amount: amount,
                kind: TxKind.Deposit,
                timestamp: block.timestamp
            })
        );

        emit Deposited(msg.sender, amount);
    }

    /// @notice Return TEST from the caller's vault balance to their wallet.
    function withdraw(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();

        uint256 balance = userBalances[msg.sender];
        if (balance < amount) revert InsufficientBalance();

        uint256 updatedBalance = balance - amount;
        userBalances[msg.sender] = updatedBalance;

        if (treasuryBalance < updatedBalance) revert InsufficientTreasury();
        treasuryBalance -= updatedBalance;

        _transactions.push(
            TxRecord({
                user: msg.sender,
                amount: amount,
                kind: TxKind.Withdrawal,
                timestamp: block.timestamp
            })
        );

        if (!token.transfer(msg.sender, amount)) revert TransferFailed();

        emit Withdrawn(msg.sender, amount);
    }

    /// @notice Load reserve TEST into the treasury. Used by the deploy script.
    function fundReserve(uint256 amount) external {
        if (msg.sender != owner) revert NotOwner();
        if (amount == 0) revert ZeroAmount();

        if (!token.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();

        treasuryBalance += amount;
        emit ReserveFunded(msg.sender, amount);
    }

    /// @notice Claim the caller's one-time treasury bonus.
    function claimTreasuryBonus() external {
        revert NotImplemented();
    }

    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }

    function getTreasuryBalance() external view returns (uint256) {
        return treasuryBalance;
    }

    function hasClaimedBonus(address user) external view returns (bool) {
        return bonusClaimed[user];
    }

    function getTransactionCount() external view returns (uint256) {
        return _transactions.length;
    }

    function getTransaction(uint256 index)
        external
        view
        returns (address user, uint256 amount, uint8 kind, uint256 timestamp)
    {
        TxRecord storage record = _transactions[index];
        return (record.user, record.amount, uint8(record.kind), record.timestamp);
    }
}
