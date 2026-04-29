const BASE_URL = 'http://localhost:8000'

export const submitScore = async (player_id: number, score: number) => {
  const res = await fetch(`${BASE_URL}/score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      player_id,
      score
    })
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit score')
  }

  return data
}

export const fetcher = async () => {
  const res = await fetch(`${BASE_URL}/leaderboard`)

  if (!res.ok) {
    throw new Error('Failed to fetch')
  }

  return res.json()
}

export const registerPlayer = async (name: string) => {


  const res = await fetch(`${BASE_URL}/player`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Failed to register player')
  }

  return data
}

