'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useGameStores } from '../lib/store'
import { registerPlayer } from '../lib/api'

export default function NameInput() {
  const [name, setName] = useState('')
  const router = useRouter()

  const setGlobalName = useGameStores((s: any) => s.setName)
  const setPlayerId = useGameStores((s: any) => s.setPlayerId)

  const handleStart = async () => {
    if (!name.trim()) return

    try {
      setGlobalName(name)

      const data = await registerPlayer(name)

      setPlayerId(data.player_id)

      router.push('/game')

    } catch (err: any) {
      alert(err.message || 'Something went wrong')
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">🚀 Asteroid Game</h1>
        <p className="subtitle">Enter your name to start</p>

        <input
          type="text"
          className="input"
          placeholder="Your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className={`button ${!name.trim() ? 'disabled' : ''}`}
          onClick={handleStart}
          disabled={!name.trim()}
        >
          Play Game
        </button>
      </div>
    </div>
  )
}