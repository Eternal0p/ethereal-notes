import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ZenModeState = {
    isZenMode: boolean;
    toggleZenMode: () => void;
    enableZenMode: () => void;
    disableZenMode: () => void;
};

export const useZenModeStore = create<ZenModeState>()(
    persist(
        (set) => ({
            isZenMode: false,
            toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
            enableZenMode: () => set({ isZenMode: true }),
            disableZenMode: () => set({ isZenMode: false }),
        }),
        {
            name: 'zen-mode-storage',
        }
    )
);
