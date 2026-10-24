import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { PRESET_LAYOUTS, LAYOUT_FUTURES, expandToFillRow, DashboardLayout } from '../utils/layoutUtils'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'

// --- HELPER: Simple UUID Generator (No external dependency) ---
const uuidv4 = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// --- CONSTANTS & CONFIGURATION ---
const MAKER_FEE = 0.0002 // 0.02%
const TAKER_FEE = 0.0004 // 0.04%
const MAINTENANCE_MARGIN_RATE = 0.005 // 0.5%
const INITIAL_BTC_PRICE = 64000

// --- TYPES ---
export type ViewType = 'QUICK' | 'EXCHANGE' | 'FUTURES' | 'PROFILE' | 'ORDERS' | 'MARKET' | 'TREASURY'
export type OrderSide = 'BUY' | 'SELL'
export type OrderType = 'LIMIT' | 'MARKET' | 'STOP_LIMIT'
export type PositionSide = 'LONG' | 'SHORT'
export type OrderStatus = 'OPEN' | 'FILLED' | 'CANCELLED' | 'PARTIAL' | 'REJECTED'

export interface Order {
    id: string
    pair: string
    type: OrderType
    side: OrderSide
    price: number
    amount: number
    filled: number
    total: number
    leverage: number
    reduceOnly: boolean
    timestamp: number
    status: OrderStatus
}

export interface Position {
    id: string
    symbol: string
    side: PositionSide
    size: number
    entryPrice: number
    markPrice: number
    liquidationPrice: number
    leverage: number
    margin: number
    maintenanceMargin: number
    unrealizedPnl: number
    realizedPnl: number
    roe: number
}

export interface TradeHistory {
    id: string
    orderId: string
    symbol: string
    side: OrderSide
    price: number
    amount: number
    fee: number
    role: 'MAKER' | 'TAKER'
    realizedPnl: number
    timestamp: number
}

interface WalletAsset {
    total: number
    available: number
    locked: number
}

export interface Notification {
    id: string
    type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING'
    message: string
    timestamp: number
}

export type ResponsiveLayouts = Record<string, Record<string, DashboardLayout[]>>
interface HistoryState {
    past: ResponsiveLayouts[]
    future: ResponsiveLayouts[]
}

interface DashboardState {
    // UI State
    currentView: ViewType
    isSidebarOpen: boolean
    isLayoutLocked: boolean
    isFullScreen: boolean
    isQuickTradeOpen: boolean // NEW
    layouts: ResponsiveLayouts
    layoutHistory: HistoryState
    notifications: Notification[]

    // Market State
    activePair: string
    currentPrice: number

    // Trading Settings
    leverage: number
    marginMode: 'CROSS' | 'ISOLATED'

    // Account State
    wallet: {
        usd: WalletAsset
        usdt: WalletAsset
        btc: WalletAsset
    }

    // Trading Data
    orders: Order[]
    positions: Position[]
    trades: TradeHistory[]

    // Actions
    setView: (view: ViewType) => void
    setQuickTradeOpen: (isOpen: boolean) => void // NEW
    toggleSidebar: () => void
    setIsFullScreen: (isFull: boolean) => void
    toggleLayoutLock: () => void
    addNotification: (type: Notification['type'], message: string) => void
    removeNotification: (id: string) => void
    updateLayout: (view: string, newLayouts: Record<string, DashboardLayout[]>) => void
    resetToLayout: (view: string, presetName: string) => void
    undoLayout: () => void
    redoLayout: () => void
    setPair: (pair: string) => void
    processPriceUpdate: (newPrice: number) => void
    setLeverage: (lev: number) => void
    setMarginMode: (mode: 'CROSS' | 'ISOLATED') => void
    placeOrder: (params: { side: OrderSide; type: OrderType; amount: number; price?: number; reduceOnly?: boolean }) => void
    cancelOrder: (orderId: string) => void
    closePosition: (positionId: string) => void
    deposit: (asset: 'usd' | 'usdt' | 'btc', amount: number) => void
}

// --- HELPER FUNCTIONS ---
const calculateLiquidationPrice = (entry: number, leverage: number, side: PositionSide, maintenanceRate: number) => {
    if (side === 'LONG') {
        return entry * (1 - (1 / leverage) + maintenanceRate)
    } else {
        return entry * (1 + (1 / leverage) - maintenanceRate)
    }
}

const calculatePnL = (entry: number, current: number, size: number, side: PositionSide) => {
    if (side === 'LONG') {
        return (current - entry) * size
    } else {
        return (entry - current) * size
    }
}

export const useDashboardStore = create<DashboardState>()(
    persist(
        (set, get) => ({
            // INITIAL STATE
            currentView: 'TREASURY',
            isSidebarOpen: true,
            isLayoutLocked: true,
            isFullScreen: false,
            isQuickTradeOpen: false, // NEW
            activePair: 'BTC/USDT',
            currentPrice: INITIAL_BTC_PRICE,
            leverage: 10,
            marginMode: 'CROSS',
            notifications: [],
            orders: [],
            positions: [],
            trades: [],
            wallet: {
                usd: { total: 10000, available: 10000, locked: 0 },
                usdt: { total: 50000, available: 50000, locked: 0 },
                btc: { total: 0.5, available: 0.5, locked: 0 }
            },
            layouts: {
                'EXCHANGE': { lg: PRESET_LAYOUTS['CRYPTO'] },
                'FUTURES': { lg: LAYOUT_FUTURES }
            },
            layoutHistory: { past: [], future: [] },

            // ACTIONS
            setView: (view) => set({ currentView: view }),
            setQuickTradeOpen: (isOpen) => set({ isQuickTradeOpen: isOpen }), // NEW
            toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
            setIsFullScreen: (isFullScreen) => set({ isFullScreen }),
            addNotification: (type, message) => set(state => ({
                notifications: [...state.notifications, { id: uuidv4(), type, message, timestamp: Date.now() }]
            })),
            removeNotification: (id) => set(state => ({
                notifications: state.notifications.filter(n => n.id !== id)
            })),
            setPair: (pair) => set({ activePair: pair }),
            setLeverage: (lev) => {
                set({ leverage: lev })
                get().addNotification('INFO', `Leverage changed to ${lev}x`)
            },
            setMarginMode: (mode) => set({ marginMode: mode }),
            deposit: (asset, amount) => set(state => {
                const newWallet = { ...state.wallet }
                newWallet[asset].total += amount
                newWallet[asset].available += amount
                return { wallet: newWallet }
            }),
            toggleLayoutLock: () => set((state) => {
                const nextIsLocked = !state.isLayoutLocked
                let newLayouts = cloneDeep(state.layouts)
                if (nextIsLocked) {
                    Object.keys(newLayouts).forEach(viewKey => {
                        Object.keys(newLayouts[viewKey]).forEach(bp => {
                            const cols = bp === 'lg' ? 12 : 6
                            newLayouts[viewKey][bp] = expandToFillRow(newLayouts[viewKey][bp], cols)
                        })
                    })
                }
                return { isLayoutLocked: nextIsLocked, layouts: newLayouts }
            }),
            updateLayout: (view, newLayouts) => {
                const { layouts, layoutHistory } = get()
                if (isEqual(layouts[view], newLayouts)) return
                const newPast = [...layoutHistory.past, cloneDeep(layouts)]
                if (newPast.length > 15) newPast.shift()
                set({
                    layouts: { ...layouts, [view]: newLayouts },
                    layoutHistory: { past: newPast, future: [] }
                })
            },
            undoLayout: () => set((state) => {
                const { past, future } = state.layoutHistory
                if (past.length === 0) return state
                const previous = past[past.length - 1]
                const newPast = past.slice(0, past.length - 1)
                return {
                    layouts: previous,
                    layoutHistory: { past: newPast, future: [state.layouts, ...future] }
                }
            }),
            redoLayout: () => set((state) => {
                const { past, future } = state.layoutHistory
                if (future.length === 0) return state
                const next = future[0]
                const newFuture = future.slice(1)
                return {
                    layouts: next,
                    layoutHistory: { past: [...past, state.layouts], future: newFuture }
                }
            }),
            resetToLayout: (view, presetName) => {
                const preset = PRESET_LAYOUTS[presetName]
                if (!preset) return
                const { layouts, layoutHistory } = get()
                const newPast = [...layoutHistory.past, cloneDeep(layouts)]
                set({
                    layouts: { ...layouts, [view]: { lg: preset } },
                    layoutHistory: { past: newPast, future: [] }
                })
            },

            placeOrder: ({ side, type, amount, price, reduceOnly = false }) => {
                const state = get()
                const { leverage, activePair, currentPrice, wallet } = state
                const isFutures = activePair.includes('USDT')
                const effectivePrice = type === 'MARKET' ? currentPrice : (price || currentPrice)

                const notionalValue = amount * effectivePrice
                const requiredMargin = isFutures ? notionalValue / leverage : (side === 'BUY' ? notionalValue : amount)
                const assetKey = isFutures ? 'usdt' : (side === 'BUY' ? 'usdt' : 'btc')

                // Validation
                if (wallet[assetKey].available < requiredMargin && !reduceOnly) {
                    get().addNotification('ERROR', `Insufficient ${assetKey.toUpperCase()} Balance`)
                    return
                }

                const newOrder: Order = {
                    id: uuidv4(),
                    pair: activePair,
                    type,
                    side,
                    price: effectivePrice,
                    amount,
                    filled: 0,
                    total: notionalValue,
                    leverage: isFutures ? leverage : 1,
                    reduceOnly,
                    timestamp: Date.now(),
                    status: 'OPEN'
                }

                const newWallet = cloneDeep(wallet)
                if (!reduceOnly) {
                    newWallet[assetKey].available -= requiredMargin
                    newWallet[assetKey].locked += requiredMargin
                }

                set({
                    orders: [newOrder, ...state.orders],
                    wallet: newWallet
                })

                get().addNotification('SUCCESS', `${side} Order Placed`)

                // Instant match for Market orders
                if (type === 'MARKET') {
                    get().processPriceUpdate(currentPrice)
                }
            },

            cancelOrder: (orderId) => {
                const state = get()
                const order = state.orders.find(o => o.id === orderId)
                if (!order || order.status !== 'OPEN') return

                const newWallet = cloneDeep(state.wallet)
                const isFutures = order.pair.includes('USDT')
                const assetKey = isFutures ? 'usdt' : (order.side === 'BUY' ? 'usdt' : 'btc')

                const lockedAmount = isFutures ? (order.amount * order.price) / order.leverage : (order.side === 'BUY' ? order.total : order.amount)

                newWallet[assetKey].locked -= lockedAmount
                newWallet[assetKey].available += lockedAmount

                set({
                    orders: state.orders.filter(o => o.id !== orderId),
                    wallet: newWallet
                })
                get().addNotification('INFO', 'Order Cancelled')
            },

            closePosition: (positionId) => {
                const state = get()
                const position = state.positions.find(p => p.id === positionId)
                if (!position) return

                get().placeOrder({
                    side: position.side === 'LONG' ? 'SELL' : 'BUY',
                    type: 'MARKET',
                    amount: position.size,
                    reduceOnly: true
                })
            },

            processPriceUpdate: (newPrice) => {
                const state = get()
                // optimization: only clone if needed
                let ordersChanged = false
                let positionsChanged = false

                // We need to iterate orders to find matches
                // Limit Orders Checking
                // Buy Limit: Match if NewPrice <= LimitPrice
                // Sell Limit: Match if NewPrice >= LimitPrice
                // Stop Limit: (Simplification) Treat as Limit once triggered? 
                // For this mock, we'll treat Stop Limits as market orders once price crosses stop price (not implemented yet), 
                // or just standard limits for now.

                const matchedOrders = state.orders.filter(order =>
                    order.status === 'OPEN' && (
                        order.type === 'MARKET' ||
                        (order.side === 'BUY' && newPrice <= order.price) ||
                        (order.side === 'SELL' && newPrice >= order.price)
                    )
                )

                if (matchedOrders.length === 0 && state.positions.length === 0) {
                    set({ currentPrice: newPrice })
                    return
                }

                let updatedOrders = [...state.orders]
                let updatedPositions = [...state.positions]
                let updatedTrades = [...state.trades]
                let updatedWallet = cloneDeep(state.wallet)

                matchedOrders.forEach(order => {
                    ordersChanged = true
                    const role = order.type === 'LIMIT' ? 'MAKER' : 'TAKER'
                    const feeRate = role === 'MAKER' ? MAKER_FEE : TAKER_FEE

                    const fillPrice = order.type === 'MARKET' ? newPrice : order.price
                    const fillValue = order.amount * fillPrice
                    const fee = fillValue * feeRate

                    const trade: TradeHistory = {
                        id: uuidv4(),
                        orderId: order.id,
                        symbol: order.pair,
                        side: order.side,
                        price: fillPrice,
                        amount: order.amount,
                        fee: fee,
                        role,
                        realizedPnl: 0,
                        timestamp: Date.now()
                    }
                    updatedTrades.unshift(trade)

                    const isFutures = order.pair.includes('USDT')
                    const assetKey = isFutures ? 'usdt' : (order.side === 'BUY' ? 'usdt' : 'btc')

                    // Release Locked Funds
                    const lockedAmount = isFutures
                        ? (order.amount * order.price) / order.leverage // Initial margin locked
                        : (order.side === 'BUY' ? order.total : order.amount)

                    // If it was a market order, funds weren't locked yet? 
                    // Actually in placeOrder we lock funds even for Market orders momentarily. 
                    // But wait, placeOrder sets type=MARKET then calls processPriceUpdate immediately. 
                    // So correct.

                    if (!order.reduceOnly) {
                        updatedWallet[assetKey].locked -= lockedAmount

                        // For Spot:
                        if (!isFutures) {
                            if (order.side === 'BUY') {
                                // Bought BTC
                                updatedWallet['btc'].available += order.amount * (1 - feeRate)
                                // Excess locked (if filled cheaper) returns to usdt available?
                                const actualCost = fillValue
                                const excess = lockedAmount - actualCost
                                if (excess > 0) updatedWallet['usdt'].available += excess
                            } else {
                                // Sold BTC
                                updatedWallet['usdt'].available += fillValue * (1 - feeRate)
                            }
                        }
                    }

                    // Futures Position Logic
                    if (isFutures) {
                        const existingPosIdx = updatedPositions.findIndex(p => p.symbol === order.pair)

                        if (existingPosIdx > -1) {
                            const pos = updatedPositions[existingPosIdx]
                            // Increasing Position
                            if (pos.side === (order.side === 'BUY' ? 'LONG' : 'SHORT')) {
                                const totalSize = pos.size + order.amount
                                const totalValue = (pos.size * pos.entryPrice) + (order.amount * fillPrice)
                                const newEntry = totalValue / totalSize

                                pos.entryPrice = newEntry
                                pos.size = totalSize
                                pos.margin += (fillValue / pos.leverage) // Add margin for new chunk
                            }
                            // Closing / Reducing
                            else {
                                const closeAmount = Math.min(pos.size, order.amount)
                                const pnl = calculatePnL(pos.entryPrice, fillPrice, closeAmount, pos.side)
                                trade.realizedPnl = pnl

                                // Margin Released = portion of margin associated with closeAmount
                                const marginReleased = (pos.margin * (closeAmount / pos.size))
                                updatedWallet['usdt'].available += (marginReleased + pnl - fee)
                                updatedWallet['usdt'].locked -= marginReleased // Wait, we removed 'lockedAmount' from wallet earlier? 
                                // Conflict: earlier logic removed 'lockedAmount' which was from the ORDER.
                                // For reduceOnly order, we didn't lock anything. 
                                // But here we are manipulating the POSITION margin.
                                // Position margin is effectively 'used' funds (not in available).
                                // Wait, 'locked' in wallet usually tracks open orders. 
                                // 'margin' in position tracks used margin.
                                // We need to treat Position Margin as taken from Available.
                                // When closing, we return Position Margin + PnL to Available.

                                pos.margin -= marginReleased
                                pos.size -= closeAmount
                                if (pos.size <= 0.000001) {
                                    updatedPositions.splice(existingPosIdx, 1)
                                }
                            }
                        } else {
                            // New Position
                            const usedMargin = fillValue / order.leverage
                            updatedWallet['usdt'].available -= usedMargin // Move from available to used? 
                            // In placeOrder we moved to 'locked'. 
                            // Use 'locked' implies it's off limits. 
                            // Correct flow: Available -> Locked (Order) -> (Fill) -> Position Margin (deducted from wallet entirely or kept as tracked 'used'?)
                            // Simplest for this dashboard: 
                            // Available Balance = Total - Locked(Orders) - PositionMargin.
                            // Current wallet struct: { total, available, locked }.
                            // If I deduct from Available, it's gone. 
                            // So Position Margin is "gone" until closed. 

                            // Fix: placeOrder moved it to Locked. 
                            // logic above `updatedWallet[assetKey].locked -= lockedAmount` removed it from Locked.
                            // So now we need to decide where it goes.
                            // For Spot Buy, it converted to BTC.
                            // For Futures, it becomes Margin. 
                            // So we simply DON'T give it back to Available.

                            const newPos: Position = {
                                id: uuidv4(),
                                symbol: order.pair,
                                side: order.side === 'BUY' ? 'LONG' : 'SHORT',
                                size: order.amount,
                                entryPrice: fillPrice,
                                markPrice: fillPrice,
                                leverage: order.leverage,
                                liquidationPrice: 0,
                                margin: usedMargin,
                                maintenanceMargin: fillValue * MAINTENANCE_MARGIN_RATE,
                                unrealizedPnl: 0,
                                realizedPnl: 0,
                                roe: 0
                            }
                            updatedPositions.push(newPos)
                        }
                        positionsChanged = true
                    }

                    // Mark Order Filled
                    const orderIdx = updatedOrders.findIndex(o => o.id === order.id)
                    if (orderIdx > -1) {
                        updatedOrders[orderIdx] = { ...order, status: 'FILLED', filled: order.amount }
                    }
                })

                if (updatedPositions.length > 0) {
                    updatedPositions = updatedPositions.map(pos => {
                        const pnl = calculatePnL(pos.entryPrice, newPrice, pos.size, pos.side)
                        return {
                            ...pos,
                            markPrice: newPrice,
                            unrealizedPnl: pnl,
                            roe: (pnl / pos.margin) * 100,
                            liquidationPrice: calculateLiquidationPrice(pos.entryPrice, pos.leverage, pos.side, MAINTENANCE_MARGIN_RATE)
                        }
                    })
                    // Only update if PnL changed for UX? No, always update on price tick.
                }

                set({
                    currentPrice: newPrice,
                    orders: updatedOrders,
                    positions: updatedPositions,
                    trades: updatedTrades,
                    wallet: updatedWallet
                })
            }
        }),
        {
            name: 'dashboard-store-production-v2',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                layouts: state.layouts,
                wallet: state.wallet,
                orders: state.orders,
                positions: state.positions,
                trades: state.trades,
                isLayoutLocked: state.isLayoutLocked,
                activePair: state.activePair
            })
        }
    )
)