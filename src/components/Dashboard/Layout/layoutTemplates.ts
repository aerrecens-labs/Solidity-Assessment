// src/components/Dashboard/Layout/layoutTemplates.ts

export type SlotRole = 'main' | 'orderform' | 'secondary' | 'bottom'
export type TradingMode = 'spot' | 'futures'

export type ResponsiveGridTemplate = {
    name: string
    id: string
    mode: TradingMode
    count: number
    layouts: {
        // Desktop: 24 cols x 24 rows (Fixed Screen)
        lg: { x: number; y: number; w: number; h: number; role: SlotRole }[],
        // Tablet: 12 cols x 24 rows (Fixed Screen)
        md: { x: number; y: number; w: number; h: number; role: SlotRole }[],
        // Mobile: 6 cols x Variable Rows (Scrolling)
        sm: { x: number; y: number; w: number; h: number; role: SlotRole }[]
    }
}

export const DASHBOARD_TEMPLATES: ResponsiveGridTemplate[] = [
    // =========================================================================
    // SPOT LAYOUTS (Compact Buy Box = More Chart Space)
    // =========================================================================
    {
        name: "Classic Spot",
        id: "spot_classic",
        mode: 'spot',
        count: 4,
        layouts: {
            lg: [ // 1920x1080: Chart Left, Data Right
                { x: 0, y: 0, w: 18, h: 16, role: 'main' },
                { x: 18, y: 0, w: 6, h: 10, role: 'orderform' }, // Short form
                { x: 18, y: 10, w: 6, h: 14, role: 'secondary' },// Tall Book
                { x: 0, y: 16, w: 18, h: 8, role: 'bottom' }
            ],
            md: [ // Tablet
                { x: 0, y: 0, w: 12, h: 14, role: 'main' },
                { x: 0, y: 14, w: 6, h: 10, role: 'orderform' },
                { x: 6, y: 14, w: 6, h: 10, role: 'secondary' },
                { x: 0, y: 24, w: 12, h: 8, role: 'bottom' }
            ],
            sm: [ // Mobile (Scrolling)
                { x: 0, y: 0, w: 6, h: 14, role: 'main' },
                { x: 0, y: 14, w: 6, h: 14, role: 'orderform' },
                { x: 0, y: 28, w: 6, h: 12, role: 'secondary' },
                { x: 0, y: 40, w: 6, h: 10, role: 'bottom' }
            ]
        }
    },
    {
        name: "Spot Terminal",
        id: "spot_terminal",
        mode: 'spot',
        count: 4,
        layouts: {
            lg: [
                { x: 0, y: 0, w: 14, h: 24, role: 'main' },
                { x: 14, y: 0, w: 5, h: 12, role: 'secondary' },
                { x: 19, y: 0, w: 5, h: 12, role: 'orderform' }, // Top Right
                { x: 14, y: 12, w: 10, h: 12, role: 'bottom' }
            ],
            md: [
                { x: 0, y: 0, w: 12, h: 12, role: 'main' },
                { x: 0, y: 12, w: 6, h: 12, role: 'orderform' },
                { x: 6, y: 12, w: 6, h: 12, role: 'secondary' },
                { x: 0, y: 24, w: 12, h: 8, role: 'bottom' }
            ],
            sm: [
                { x: 0, y: 0, w: 6, h: 12, role: 'orderform' }, // Buy First
                { x: 0, y: 12, w: 6, h: 14, role: 'main' },
                { x: 0, y: 26, w: 6, h: 12, role: 'secondary' },
                { x: 0, y: 38, w: 6, h: 10, role: 'bottom' }
            ]
        }
    },
    {
        name: "Spot Grid",
        id: "spot_grid",
        mode: 'spot',
        count: 4,
        layouts: {
            lg: [
                { x: 0, y: 0, w: 12, h: 14, role: 'main' },
                { x: 12, y: 0, w: 12, h: 14, role: 'orderform' }, // Wide Form
                { x: 0, y: 14, w: 12, h: 10, role: 'bottom' },
                { x: 12, y: 14, w: 12, h: 10, role: 'secondary' }
            ],
            md: [
                { x: 0, y: 0, w: 12, h: 12, role: 'main' },
                { x: 0, y: 12, w: 6, h: 12, role: 'orderform' },
                { x: 6, y: 12, w: 6, h: 12, role: 'secondary' },
                { x: 0, y: 24, w: 12, h: 8, role: 'bottom' }
            ],
            sm: [
                { x: 0, y: 0, w: 6, h: 14, role: 'main' },
                { x: 0, y: 14, w: 6, h: 14, role: 'orderform' },
                { x: 0, y: 28, w: 6, h: 10, role: 'secondary' },
                { x: 0, y: 38, w: 6, h: 10, role: 'bottom' }
            ]
        }
    },

    // =========================================================================
    // FUTURES LAYOUTS (Tall Buy Box REQUIRED for Leverage)
    // =========================================================================
    {
        name: "Pro Futures",
        id: "futures_pro",
        mode: 'futures',
        count: 4,
        layouts: {
            lg: [ // Desktop: Full Right Sidebar
                { x: 0, y: 0, w: 19, h: 16, role: 'main' },
                { x: 19, y: 0, w: 5, h: 24, role: 'orderform' }, // Full Height (24 rows)
                { x: 0, y: 16, w: 11, h: 8, role: 'bottom' },
                { x: 11, y: 16, w: 8, h: 8, role: 'secondary' }
            ],
            md: [
                { x: 0, y: 0, w: 8, h: 16, role: 'main' },
                { x: 8, y: 0, w: 4, h: 24, role: 'orderform' },
                { x: 0, y: 16, w: 8, h: 8, role: 'secondary' },
                { x: 0, y: 24, w: 12, h: 8, role: 'bottom' }
            ],
            sm: [ // Mobile: TALL Buy Button
                { x: 0, y: 0, w: 6, h: 16, role: 'main' },
                { x: 0, y: 16, w: 6, h: 20, role: 'orderform' }, // 500px Height for Slider
                { x: 0, y: 36, w: 6, h: 12, role: 'secondary' },
                { x: 0, y: 48, w: 6, h: 10, role: 'bottom' }
            ]
        }
    },
    {
        name: "Futures Left",
        id: "futures_left",
        mode: 'futures',
        count: 4,
        layouts: {
            lg: [
                { x: 0, y: 0, w: 5, h: 24, role: 'orderform' }, // Left Sidebar
                { x: 5, y: 0, w: 19, h: 16, role: 'main' },
                { x: 5, y: 16, w: 10, h: 8, role: 'secondary' },
                { x: 15, y: 16, w: 9, h: 8, role: 'bottom' }
            ],
            md: [
                { x: 0, y: 0, w: 12, h: 14, role: 'main' },
                { x: 0, y: 14, w: 5, h: 18, role: 'orderform' },
                { x: 5, y: 14, w: 7, h: 10, role: 'secondary' },
                { x: 5, y: 24, w: 7, h: 8, role: 'bottom' }
            ],
            sm: [
                { x: 0, y: 0, w: 6, h: 20, role: 'orderform' }, // Buy First
                { x: 0, y: 20, w: 6, h: 16, role: 'main' },
                { x: 0, y: 36, w: 6, h: 12, role: 'secondary' },
                { x: 0, y: 48, w: 6, h: 10, role: 'bottom' }
            ]
        }
    },
    {
        name: "Futures Stack",
        id: "futures_stack",
        mode: 'futures',
        count: 4,
        layouts: {
            lg: [
                { x: 0, y: 0, w: 18, h: 24, role: 'main' },
                { x: 18, y: 0, w: 6, h: 12, role: 'orderform' }, // Half Height (Still Tall)
                { x: 18, y: 12, w: 6, h: 12, role: 'secondary' },
                { x: 0, y: 24, w: 18, h: 6, role: 'bottom' }
            ],
            md: [
                { x: 0, y: 0, w: 8, h: 24, role: 'main' },
                { x: 8, y: 0, w: 4, h: 12, role: 'orderform' },
                { x: 8, y: 12, w: 4, h: 12, role: 'secondary' },
                { x: 0, y: 24, w: 12, h: 6, role: 'bottom' }
            ],
            sm: [
                { x: 0, y: 0, w: 6, h: 16, role: 'main' },
                { x: 0, y: 16, w: 6, h: 18, role: 'orderform' },
                { x: 0, y: 34, w: 6, h: 12, role: 'secondary' },
                { x: 0, y: 46, w: 6, h: 10, role: 'bottom' }
            ]
        }
    }
]