
// Type Definition matching the Market Store
export interface MarketCoin {
    id: string
    name: string
    symbol: string
    pair: string // Added to match CoinSelector needs (usually 'USD' or 'USDT')
    price: number
    change24h: number
    marketCap: string
    volume24h: string
    category: 'Layer 1' | 'DeFi' | 'Metaverse' | 'Meme' | 'Smart Contract'
    sparkline: number[]
}

// Single Source of Truth for all Tradable Assets
export const MARKET_DATA: MarketCoin[] = [
    {
        id: 'btc',
        name: 'Bitcoin',
        symbol: 'BTC',
        pair: 'USDT',
        price: 98250.50,
        change24h: -1.24,
        marketCap: '1.9T',
        volume24h: '32B',
        category: 'Layer 1',
        sparkline: [95000, 96000, 97000, 96500, 97800, 98100, 98250]
    },
    {
        id: 'eth',
        name: 'Ethereum',
        symbol: 'ETH',
        pair: 'USDT',
        price: 3450.12,
        change24h: 2.34,
        marketCap: '400B',
        volume24h: '15B',
        category: 'Smart Contract',
        sparkline: [3300, 3350, 3400, 3380, 3420, 3440, 3450]
    },
    {
        id: 'sol',
        name: 'Solana',
        symbol: 'SOL',
        pair: 'USDT',
        price: 145.20,
        change24h: 12.50,
        marketCap: '65B',
        volume24h: '4B',
        category: 'Layer 1',
        sparkline: [130, 135, 132, 138, 142, 144, 145]
    },
    {
        id: 'bnb',
        name: 'Binance Coin',
        symbol: 'BNB',
        pair: 'USDT',
        price: 975.54,
        change24h: 0.27,
        marketCap: '89B',
        volume24h: '1.2B',
        category: 'Layer 1',
        sparkline: [960, 965, 970, 968, 972, 974, 975]
    },
    {
        id: 'ada',
        name: 'Cardano',
        symbol: 'ADA',
        pair: 'USDT',
        price: 0.45,
        change24h: -0.50,
        marketCap: '16B',
        volume24h: '500M',
        category: 'Layer 1',
        sparkline: [0.46, 0.45, 0.45, 0.44, 0.45, 0.45, 0.45]
    },
    {
        id: 'aave',
        name: 'Aave',
        symbol: 'AAVE',
        pair: 'USDT',
        price: 154.50,
        change24h: -1.20,
        marketCap: '2.5B',
        volume24h: '150M',
        category: 'DeFi',
        sparkline: [156, 155, 154, 153, 154, 154, 154]
    },
    {
        id: 'dot',
        name: 'Polkadot',
        symbol: 'DOT',
        pair: 'USDT',
        price: 7.20,
        change24h: 1.10,
        marketCap: '10B',
        volume24h: '300M',
        category: 'Layer 1',
        sparkline: [7.1, 7.15, 7.12, 7.18, 7.22, 7.19, 7.20]
    },
    {
        id: 'doge',
        name: 'Dogecoin',
        symbol: 'DOGE',
        pair: 'USDT',
        price: 0.16,
        change24h: 5.40,
        marketCap: '23B',
        volume24h: '1B',
        category: 'Meme',
        sparkline: [0.15, 0.15, 0.16, 0.16, 0.15, 0.16, 0.16]
    },
    {
        id: 'uni',
        name: 'Uniswap',
        symbol: 'UNI',
        pair: 'USDT',
        price: 9.50,
        change24h: -2.10,
        marketCap: '5.7B',
        volume24h: '120M',
        category: 'DeFi',
        sparkline: [9.8, 9.7, 9.6, 9.5, 9.4, 9.5, 9.5]
    },
    {
        id: 'link',
        name: 'Chainlink',
        symbol: 'LINK',
        pair: 'USDT',
        price: 18.20,
        change24h: 3.45,
        marketCap: '10B',
        volume24h: '400M',
        category: 'Smart Contract',
        sparkline: [17.5, 17.8, 18.0, 18.1, 18.3, 18.1, 18.2]
    },
]

// Portfolio / Treasury Data
export const PORTFOLIO_DATA = {
    totalTreasuryValue: 0.067196836775,
    activeWallets: 1,

    // This could be dynamically calculated by looking up prices from MARKET_DATA,
    // but for now we keep the structure the user is familiar with from ethernet.js
    assets: [
        {
            symbol: 'ETH',
            name: 'Ethereum',
            logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
            valueUsd: 0.067196836775, // value * price
            amount: 40.5, // Added explicit amount field for logic
            percentOfTreasury: 100,
            change24hPercent: 2.35,
        },
        {
            symbol: 'USDC',
            name: 'USD Coin',
            logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
            valueUsd: 0.0,
            amount: 0,
            percentOfTreasury: 0,
            change24hPercent: 0.02,
        },
        {
            symbol: 'SOL',
            name: 'Solana',
            logo: 'https://cryptologos.cc/logos/solana-sol-logo.png',
            valueUsd: 14500,
            amount: 100,
            percentOfTreasury: 0.15,
            change24hPercent: 12.5,
        }
    ],

    recentTransactions: [
        { id: 'tx1', wallet: '0x5e6F7a8B9C2D3E4F5a6B7c8D9E0F1A2B3C4D5E67', type: 'Deposit', amount: 0.1024, symbol: 'SepoliaETH', usdValue: 0.067196836775, avatar: 'https://i.pravatar.cc/150?img=5' },
    ]
}
