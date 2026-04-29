'use client'

import useSWR from 'swr'
import { fetcher } from './api'


export const useLeaderboard = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/leaderboard',
    fetcher,
    {
      refreshInterval: 3000, // realtime update tiap 3 detik
    }
  )

  console.log(fetcher);
  

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}