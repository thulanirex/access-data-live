import { useState, useEffect } from 'react'
import { RIBResponse } from '@/types/api'

interface UseRIBAnalyticsProps {
  startDate: string
  endDate: string
}

export function useRIBAnalytics({ startDate, endDate }: UseRIBAnalyticsProps) {
  const [data, setData] = useState<RIBResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `http://10.160.43.209:5000/api/v1/access_data_analytic/?start_timestamp=${startDate}&end_timestamp=${endDate}&channel_name=rib`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch RIB data')
      }

      const jsonData = await response.json()
      setData(jsonData)
      setError(null)
    } catch (err) {
      console.error('Error fetching RIB data:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch RIB data'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [startDate, endDate])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  }
}