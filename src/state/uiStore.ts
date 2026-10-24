import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
    showGradients: boolean
    toggleGradients: () => void
    enableAnimations: boolean
    toggleAnimations: () => void
    showCinematicIntro: boolean
    toggleCinematicIntro: () => void

    // --- New Hover State ---
    hoveredAsset: string | null
    setHoveredAsset: (symbol: string | null) => void

    // Global Modals
    isProfileOpen: boolean
    toggleProfile: () => void
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            showGradients: true,
            toggleGradients: () => set((state) => ({ showGradients: !state.showGradients })),
            enableAnimations: true,
            toggleAnimations: () => set((state) => ({ enableAnimations: !state.enableAnimations })),
            showCinematicIntro: true,
            toggleCinematicIntro: () => set((state) => ({ showCinematicIntro: !state.showCinematicIntro })),

            // Initial value
            hoveredAsset: null,
            setHoveredAsset: (symbol) => set({ hoveredAsset: symbol }),

            isProfileOpen: false,
            toggleProfile: () => set((state) => ({ isProfileOpen: !state.isProfileOpen })),
        }),
        {
            name: 'ui-storage',
            // IMPORTANT: Do not persist 'hoveredAsset' to localStorage
            partialize: (state) => ({
                showGradients: state.showGradients,
                enableAnimations: state.enableAnimations,
                showCinematicIntro: state.showCinematicIntro
            }),
        }
    )
)