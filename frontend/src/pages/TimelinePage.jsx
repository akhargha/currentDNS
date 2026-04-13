/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react'
import TimelinePlaceholder from '../components/dashboard/TimelinePlaceholder'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../lib/apiClient'

function TimelinePage() {
  const { token } = useAuth()
  const [events, setEvents] = useState([])
  const [error, setError] = useState('')

  const loadTimeline = useCallback(async () => {
    try {
      const response = await apiRequest('/dashboard/timeline', { token })
      setEvents(response.events || [])
    } catch (err) {
      setError(err.message)
    }
  }, [token])

  useEffect(() => {
    loadTimeline()
  }, [loadTimeline])

  return (
    <section className="space-y-4">
      <TimelinePlaceholder events={events} />
      {error ? <div className="alert alert-error"><span>{error}</span></div> : null}
    </section>
  )
}

export default TimelinePage
