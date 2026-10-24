
import { Layout } from 'react-grid-layout'

import cloneDeep from 'lodash/cloneDeep'
import sortBy from 'lodash/sortBy'
import maxBy from 'lodash/maxBy'

// --- Types ---
// --- Types ---
export interface DashboardLayout {
    i: string
    x: number
    y: number
    w: number
    h: number
    minW?: number
    minH?: number
    static?: boolean
    isDraggable?: boolean
    isResizable?: boolean
}

// --- Algorithm: Anti-Ragged Edges ---
/**
 * Scans each row of the layout and stretches the right-most item to fill the remaining space.
 * This ensures a solid block feel without gaps on the right side.
 */
export const expandToFillRow = (layout: DashboardLayout[], totalCols: number = 12): DashboardLayout[] => {
    // 1. Group items by their Y coordinate (Rows)
    // We clone deep to avoid mutating the original RGL state directly
    const newLayout = cloneDeep(layout)
    const sorted = sortBy(newLayout, ['y', 'x'])

    // Group by Y (using string key to handle potential float issues, though RGL uses ints)
    const rows: Record<string, DashboardLayout[]> = {}

    sorted.forEach(item => {
        const yKey = String(item.y)
        if (!rows[yKey]) rows[yKey] = []
        rows[yKey].push(item)
    })

    // 2. Iterate each row
    Object.values(rows).forEach(rowItems => {
        if (rowItems.length === 0) return

        // Find the right-most item (highest x + w)
        // Since we sorted by X, the last item in the array is usually the right-most, 
        // but let's be mathematically safe.
        const rightMostItem = maxBy(rowItems, (item) => item.x + item.w)

        if (rightMostItem) {
            const currentRightEdge = rightMostItem.x + rightMostItem.w
            const gap = totalCols - currentRightEdge

            // 3. If there is a gap, expand the item
            // Only expand if the item isn't static (optional constraint, but good for UX)
            // And ensure we don't violate any maxW if it were set (not used here yet)
            if (gap > 0 && !rightMostItem.static) {
                rightMostItem.w = rightMostItem.w + gap
            }
        }
    })

    return newLayout
}

// --- Premade Layouts (12 Cols) ---

export const LAYOUT_CRYPTO: DashboardLayout[] = [
    // Top Row: Ticker Tape / Stats (implied or separate)
    // Row 1: Main Chart (Left, huge) + Order Book (Right strip)
    { i: 'chart', x: 0, y: 0, w: 9, h: 6, minW: 6, minH: 4 },
    { i: 'orderbook', x: 9, y: 0, w: 3, h: 8, minW: 2, minH: 4 }, // Tall sidebar

    // Row 2: Recent Trades + Depth (Below Chart)
    { i: 'tradeform', x: 9, y: 8, w: 3, h: 4, minW: 2, minH: 3 }, // Below orderbook
    { i: 'orders', x: 0, y: 6, w: 9, h: 3, minW: 4, minH: 2 }, // Wide bottom table

    // Extra Widgets (Hidden by default or placed below)
    { i: 'leverage', x: 0, y: 9, w: 3, h: 3, minW: 2, minH: 2 },
]

export const LAYOUT_FUTURES: DashboardLayout[] = [
    { i: 'chart', x: 0, y: 0, w: 18, h: 16, minW: 6, minH: 4 },
    { i: 'orderbook', x: 18, y: 0, w: 6, h: 12, minW: 3, minH: 6 },
    { i: 'tradeform', x: 18, y: 12, w: 6, h: 12, minW: 3, minH: 6 },
    { i: 'positions', x: 0, y: 16, w: 18, h: 8, minW: 10, minH: 4 } // Bottom Table
]

export const LAYOUT_ANALYTICS: DashboardLayout[] = [
    // Row 1: KPI Cards (3 Top Items)
    { i: 'kpi1', x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
    { i: 'kpi2', x: 4, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
    { i: 'kpi3', x: 8, y: 0, w: 4, h: 2, minW: 2, minH: 2 },

    // Row 2: Medium Comparisons
    { i: 'chart', x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'comparison', x: 6, y: 2, w: 6, h: 4, minW: 4, minH: 3 },

    // Row 3: Wide Data Table
    { i: 'table', x: 0, y: 6, w: 12, h: 5, minW: 6, minH: 3 },
]

export const LAYOUT_CRM: DashboardLayout[] = [
    // Left Sidebar: Form / List
    { i: 'sidebar', x: 0, y: 0, w: 3, h: 10, minW: 2, minH: 6 },

    // Right Content: Context Headers + Activity
    { i: 'header', x: 3, y: 0, w: 9, h: 2, minW: 4, minH: 2 },
    { i: 'main', x: 3, y: 2, w: 9, h: 5, minW: 4, minH: 4 },
    { i: 'footer', x: 3, y: 7, w: 9, h: 3, minW: 4, minH: 2 },
]

// Map for easier access
export const PRESET_LAYOUTS: Record<string, DashboardLayout[]> = {
    'CRYPTO': LAYOUT_CRYPTO,
    'ANALYTICS': LAYOUT_ANALYTICS,
    'CRM': LAYOUT_CRM
}
