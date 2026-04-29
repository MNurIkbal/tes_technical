"use client"

import { useState } from "react"
import GameCanvas from "../components/GameCanvas"
import Leaderboard from "../components/Leaderboard"
import { useRouter } from "next/navigation"
import { useGameStores } from "../lib/store"

export default function Page() {
  const router = useRouter()

  const playerId = useGameStores((s: any) => s.playerId)

  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [gameKey, setGameKey] = useState(0)

  function handleGameOver(finalScore: number) {
    setScore(finalScore)
    setGameOver(true)
  }

  function restart() {
    setGameOver(false)
    setScore(0)
    setGameKey(prev => prev + 1)
  }

  const handleExit = () => {
    router.push('/')
  }

  return (
    <div style={{ overflow: "hidden" }}>

      {!gameOver && (
        <GameCanvas
          key={gameKey}
          onGameOver={handleGameOver}
          playerId={playerId}
        />
      )}

      {!gameOver && (
        <Leaderboard
          lastScore={gameOver ? score : null}
          gameKey={gameKey}
        />
      )}

      {gameOver && (
        <div className="gameover-overlay">
          <div className="gameover-box">
            <h1 className="gameover-title">GAME OVER</h1>

            <p className="gameover-score">
              Score: <span>{score}</span>
            </p>

            <button className="gameover-btn" onClick={restart}>
              Main Ulang
            </button>

            <button className="gameover-btn danger" onClick={handleExit}>
              Keluar
            </button>
          </div>
        </div>
      )}

    </div>
  )
}