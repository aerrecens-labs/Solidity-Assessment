import _ from 'lodash'
import { DASHBOARD_TEMPLATES, SlotRole, TradingMode } from './layoutTemplates'

export interface GridItem {
    i: string
    x: number
    y: number
    w: number
    h: number
    [key: string]: any
}

export const useGridOptimizer = () => {

    const getComponentRole = (id: string): SlotRole => {
        const lowerId = id.toLowerCase()
        if (lowerId.includes('order') && lowerId.includes('form')) return 'orderform'
        if (lowerId.includes('buy') || lowerId.includes('sell')) return 'orderform'
        if (lowerId.includes('spot') || lowerId.includes('future')) return 'orderform'
        if (lowerId.includes('chart') || lowerId.includes('graph')) return 'main'
        if (lowerId.includes('book') || lowerId.includes('depth')) return 'secondary'
        return 'bottom'
    }

    const generateLayout = (
        currentLayout: GridItem[],
        breakpoint: 'lg' | 'md' | 'sm',
        templateIndex: number,
        tradingMode: TradingMode
    ) => {
        const count = currentLayout.length

        // 1. FILTER: Only get templates for the current mode (Spot vs Futures)
        let availableTemplates = DASHBOARD_TEMPLATES.filter(t => t.mode === tradingMode && t.count === count)

        // Safety: If no templates match (shouldn't happen), fallback to any
        if (availableTemplates.length === 0) {
            availableTemplates = DASHBOARD_TEMPLATES.filter(t => t.count === count)
        }

        const selectedTemplate = availableTemplates[templateIndex % availableTemplates.length]
        const rawSlots = selectedTemplate.layouts[breakpoint]

        const classifiedItems = currentLayout.map(item => ({
            ...item,
            role: getComponentRole(item.i),
            placed: false
        }))

        const finalLayout: GridItem[] = []
        const usedSlots = new Set<number>()

        // 2. PLACEMENT: Strict mapping
        const priorityRoles: SlotRole[] = ['orderform', 'main', 'secondary', 'bottom']

        priorityRoles.forEach(role => {
            classifiedItems.forEach(item => {
                if (item.placed) return
                if (item.role === role) {
                    const slotIndex = rawSlots.findIndex((s, i) => s.role === role && !usedSlots.has(i))
                    if (slotIndex !== -1) {
                        usedSlots.add(slotIndex)
                        finalLayout.push({
                            ...item,
                            x: rawSlots[slotIndex].x,
                            y: rawSlots[slotIndex].y,
                            w: rawSlots[slotIndex].w,
                            h: rawSlots[slotIndex].h
                        })
                        item.placed = true
                    }
                }
            })
        })

        // 3. LEFTOVERS: Just in case
        classifiedItems.forEach(item => {
            if (item.placed) return
            finalLayout.push({ ...item, x: 0, y: 50, w: 4, h: 4 })
        })

        return { layout: finalLayout, name: selectedTemplate.name }
    }

    const optimizeResponsiveLayout = (currentLayout: GridItem[], templateIndex: number, tradingMode: TradingMode) => {
        const lg = generateLayout(currentLayout, 'lg', templateIndex, tradingMode).layout
        const md = generateLayout(currentLayout, 'md', templateIndex, tradingMode).layout
        const sm = generateLayout(currentLayout, 'sm', templateIndex, tradingMode).layout

        // Find the name of the template we actually used
        const count = currentLayout.length
        let templates = DASHBOARD_TEMPLATES.filter(t => t.mode === tradingMode && t.count === count)
        if (templates.length === 0) templates = DASHBOARD_TEMPLATES.filter(t => t.count === count)
        const name = templates[templateIndex % templates.length].name

        return { layouts: { lg, md, sm }, name }
    }

    return { optimizeResponsiveLayout }
}