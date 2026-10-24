import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react'
// @ts-ignore
import { Responsive } from 'react-grid-layout'
import { useDashboardStore } from '../../../store/dashboardStore'
// @ts-ignore
import _ from 'lodash'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useGridOptimizer, GridItem } from './useGridOptimizer'
import { TradingMode } from './layoutTemplates'
import { Monitor, Smartphone, Tablet, LayoutTemplate } from 'lucide-react'

interface GridWrapperProps {
    viewId: string
    mode?: TradingMode
    children: React.ReactNode
}

// --- HOOK: ROBUST DIMENSIONS ---
const useContainerDimensions = (ref: React.RefObject<HTMLElement>) => {
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

    useEffect(() => {
        if (!ref.current) return

        const observer = new ResizeObserver((entries) => {
            if (!entries[0]?.contentRect) return
            const { width, height } = entries[0].contentRect

            // Debounce/Frame-limit to prevent resize thrashing
            requestAnimationFrame(() => {
                if (width > 50 && height > 50) {
                    setDimensions({ width, height })
                }
            })
        })

        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [ref])

    return dimensions
}

export default function GridWrapper({ viewId, mode = 'spot', children }: GridWrapperProps) {
    const { layouts, updateLayout, isLayoutLocked } = useDashboardStore()
    const { optimizeResponsiveLayout } = useGridOptimizer()

    const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')
    const [layoutName, setLayoutName] = useState("Custom")
    const containerRef = useRef<HTMLDivElement>(null)
    const dimensions = useContainerDimensions(containerRef)
    const [isMounted, setIsMounted] = useState(false)

    // --- PERSISTENT VARIANT INDEX ---
    // Tracks which template variation we are currently cycling through
    // v2: Bumped version to flush old/corrupt storage states
    const STORAGE_KEY_IDX = `dashboard_layout_v2_${viewId}_${mode}`
    const [layoutVariant, setLayoutVariant] = useState(0)

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY_IDX)
        if (saved) setLayoutVariant(parseInt(saved, 10))
        setIsMounted(true)
    }, [STORAGE_KEY_IDX])

    const validLayouts = useMemo(() => layouts[viewId] || { lg: [], md: [], sm: [] }, [layouts, viewId])

    // Safety: Ensure we always have an array for the current breakpoint
    const activeLayoutItems = useMemo(() =>
        (validLayouts[currentBreakpoint] || validLayouts['lg'] || []) as unknown as GridItem[],
        [validLayouts, currentBreakpoint])

    // --- ROW HEIGHT ENGINE (Titanium-Grade) ---
    // Desktop (LG): Fixed App-Like Viewport. Zero Scroll.
    // Mobile (SM): Standard Scrollable Page.
    const SAFETY_BUFFER = 60 // Header (40px) + Margins/Padding (20px)

    const rowHeight = useMemo(() => {
        if (currentBreakpoint === 'sm') return 25 // Mobile: Fixed 25px row

        // Desktop/Tablet: Calculate dynamic height to fit exactly 100vh
        // Formula: (ContainerHeight - SafetyBuffer) / 24 Rows
        const totalRows = 24
        const availableHeight = dimensions.height - SAFETY_BUFFER
        return Math.max(10, Math.floor(availableHeight / totalRows))
    }, [currentBreakpoint, dimensions.height])

    // --- OPTIMIZER / CYCLE HANDLER ---
    const cycleLayout = useCallback((forceDefault = false) => {
        if (!activeLayoutItems.length) return

        const nextVariant = forceDefault ? 0 : layoutVariant
        const { layouts: newLayouts, name } = optimizeResponsiveLayout(activeLayoutItems, nextVariant, mode)

        setLayoutName(name)
        updateLayout(viewId, { lg: newLayouts.lg, md: newLayouts.md, sm: newLayouts.sm })

        if (!forceDefault) {
            const nextIdx = (nextVariant + 1) % 4 // Cycle 4 templates (reduced from 5 to match typical count)
            setLayoutVariant(nextIdx)
            localStorage.setItem(STORAGE_KEY_IDX, nextIdx.toString())
        }
    }, [activeLayoutItems, layoutVariant, mode, optimizeResponsiveLayout, updateLayout, viewId, STORAGE_KEY_IDX])

    // Auto-Fix: If layout is totally empty/broken, load default
    useEffect(() => {
        if (isMounted && activeLayoutItems.length > 0 && !activeLayoutItems[0].w) {
            cycleLayout(true)
        }
    }, [isMounted, activeLayoutItems.length, cycleLayout])

    // Mode Switch: Reset layout when mode changes
    useEffect(() => {
        if (isMounted) cycleLayout(true)
    }, [mode, isMounted])

    // --- LAYOUT SYNC ---
    const handleLayoutChange = useCallback((layout: any[], allLayouts: any) => {
        // High-performance deep comparison
        if (!_.isEqual(allLayouts, validLayouts)) {
            updateLayout(viewId, allLayouts)
            setLayoutName("Custom") // User manually moved something
        }
    }, [validLayouts, updateLayout, viewId])

    const processedLayouts = useMemo(() => {
        // 1. Get Set of Valid Keys from Children
        // This effectively "Sanitizes" the layout against Ghost Items
        const validKeys = new Set(React.Children.map(children, (child: any) => child?.key))

        return _.mapValues(validLayouts, (items: any[]) => items
            // Filter: Only Allow Items that actually exist in the DOM
            ?.filter(item => validKeys.has(item.i))
            .map(item => ({
                ...item,
                static: isLayoutLocked,
                isDraggable: !isLayoutLocked,
                isResizable: !isLayoutLocked
            })) || [])
    }, [validLayouts, isLayoutLocked, children])

    const ResponsiveAny = Responsive as any

    return (
        <div className="flex-1 w-full h-full min-h-0 relative flex flex-col bg-[#0B0E11]">
            <style>{`
                /* Modern Resize Handle */
                .react-grid-item > .react-resizable-handle { 
                    z-index: 50; 
                    width: 20px; 
                    height: 20px; 
                    bottom: 2px; 
                    right: 2px; 
                    cursor: se-resize; 
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .react-grid-item:hover > .react-resizable-handle { opacity: 1; }
                .react-grid-item > .react-resizable-handle::after { 
                    content: ''; 
                    position: absolute; 
                    right: 4px; 
                    bottom: 4px; 
                    width: 6px; 
                    height: 6px; 
                    border-right: 2px solid #60A5FA; 
                    border-bottom: 2px solid #60A5FA; 
                    border-radius: 1px; 
                }
                
                /* Layout Container */
                .layout-container { 
                    overflow-y: ${currentBreakpoint === 'sm' ? 'auto' : 'hidden'}; 
                    overflow-x: hidden; 
                    height: 100%;
                    scrollbar-width: thin;
                    scrollbar-color: #334155 transparent;
                }
                
                /* Animations */
                .react-grid-item.cssTransforms { 
                    transition-property: transform, width, height; 
                    transition-duration: 300ms; 
                    transition-timing-function: cubic-bezier(0.2, 0, 0, 1); 
                }
                
                /* Placement Placeholder */
                .react-grid-placeholder {
                    background: rgba(59, 130, 246, 0.15) !important;
                    border: 1px dashed rgba(59, 130, 246, 0.6) !important;
                    border-radius: 8px !important;
                    opacity: 1 !important;
                    z-index: 10 !important;
                }
            `}</style>

            {/* EDIT HUD */}
            {!isLayoutLocked && (
                <div className="absolute top-4 right-4 z-50 flex items-center gap-0 bg-[#0F172A]/90 backdrop-blur-md rounded-lg border border-slate-700/50 shadow-2xl overflow-hidden ring-1 ring-white/10">

                    {/* Status Section */}
                    <div className="flex items-center gap-3 px-4 py-2 border-r border-slate-700/50">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Device</span>
                            <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                                {currentBreakpoint === 'lg' && <Monitor size={12} />}
                                {currentBreakpoint === 'md' && <Tablet size={12} />}
                                {currentBreakpoint === 'sm' && <Smartphone size={12} />}
                                <span>{currentBreakpoint.toUpperCase()}</span>
                            </div>
                        </div>
                        <div className="w-px h-6 bg-slate-700/50" />
                        <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Layout</span>
                            <span className="text-slate-200 font-medium text-xs truncate max-w-[100px]">{layoutName}</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => cycleLayout(false)}
                        className="flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wide transition-colors active:bg-indigo-700"
                    >
                        <LayoutTemplate size={14} /> Next Preset
                    </button>
                </div>
            )}

            <div ref={containerRef} className="flex-1 layout-container">
                {isMounted && dimensions.width > 0 && (
                    <ResponsiveAny
                        // CRITICAL FIX: Removed currentBreakpoint from key to prevent 'removeChild' crash loops.
                        // RGL handles breakpoint changes internally. We only remount on View/Mode changes.
                        key={`${viewId}-${mode}`}

                        className="layout"
                        layouts={processedLayouts}

                        // Breakpoints (Matched to Device Spec)
                        // lg: 1000px+ (Desktop/Laptop)
                        // md: 600px - 999px (Tablet)
                        // sm: 0px - 599px (Mobile)
                        breakpoints={{ lg: 1000, md: 600, sm: 0 }}
                        cols={{ lg: 24, md: 12, sm: 6 }}

                        rowHeight={rowHeight}
                        width={dimensions.width}

                        margin={[4, 4]}
                        containerPadding={[4, 4]}

                        isDraggable={!isLayoutLocked}
                        isResizable={!isLayoutLocked}

                        onLayoutChange={handleLayoutChange}
                        onBreakpointChange={setCurrentBreakpoint}

                        compactType="vertical"
                        draggableHandle=".drag-handle"
                        useCSSTransforms={true}
                    >
                        {children}
                    </ResponsiveAny>
                )}
            </div>
        </div>
    )
}