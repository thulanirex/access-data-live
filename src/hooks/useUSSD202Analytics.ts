
import { useState, useEffect } from 'react'
import { USSD202Response } from '@/types/api'

interface UseUSSD202AnalyticsProps {
  startDate: string
  endDate: string
}

export function useUSSD202Analytics({ startDate, endDate }: UseUSSD202AnalyticsProps) {
  const [data, setData] = useState<USSD202Response | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `http://10.160.43.209:5000/api/v1/access_data_analytic/?start_timestamp=${startDate}&end_timestamp=${endDate}&channel_name=USSD_202`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch USSD 202 data')
      }

      const jsonData = await response.json()
      setData(jsonData)
      setError(null)
    } catch (err) {
      console.error('Error fetching USSD 202 data:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch USSD 202 data'))
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