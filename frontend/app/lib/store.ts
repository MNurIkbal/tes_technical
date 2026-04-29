import { create } from 'zustand'

interface GameState {
  name: string
  score: number
  isPlaying: boolean
  setName: (name: string) => void
  setScore: (score: number) => void
  start: () => void
  end: () => void
}

export const useGameStore = create<GameState>((set) => ({
  name: '',
  score: 0,
  isPlaying: false,
  setName: (name) => set({ name }),
  setScore: (score) => set({ score }),
  start: () => set({ isPlaying: true, score: 0 }),
  end: () => set({ isPlaying: false }),
}))

export const useGameStores = create((set) => ({
  name: '',
  playerId: null,

  setName: (name: string) => set({ name }),
  setPlayerId: (id: number) => set({ playerId: id })
}))