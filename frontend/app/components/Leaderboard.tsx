import { useEffect, useState } from "react"
import { useLeaderboard } from "../lib/leaderboard"

export default function Leaderboard({
  lastScore,
  gameKey
}: {
  lastScore: number | null,
  gameKey: number
}) {
  const { data, error, isLoading } = useLeaderboard()
  const [liveScore, setLiveScore] = useState(0)

  // 🔥 RESET SCORE SETIAP GAME ULANG
  useEffect(() => {
    setLiveScore(0)
  }, [gameKey])

  useEffect(() => {
    const handler = (e: any) => {
      setLiveScore(e.detail)
    }

    window.addEventListener("score-update", handler)

    return () => window.removeEventListener("score-update", handler)
  }, [])

  if (isLoading) return <div className="leaderboard-box">Loading leaderboard...</div>
  if (error) return <div className="leaderboard-box">Failed to load leaderboard</div>

  return (
    <div className="leaderboard-box">
      <h3 className="leaderboard-title">🏆 Leaderboard</h3>

      {/* 🔥 RESET TO 0 SAAT GAME ULANG */}
      <div className="current-score">
        🎮 Your Score: <b>{liveScore}</b>
      </div>

      <ul className="leaderboard-list">
        {data?.map((item: any, i: number) => (
          <li key={i} className="leaderboard-item">
            <span className="rank">#{i + 1}</span>
            <span className="name">{item.name}</span>
            <span className="score">{item.score}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}