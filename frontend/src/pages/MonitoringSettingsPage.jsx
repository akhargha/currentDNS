/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react'
import FrequencySelectorPlaceholder from '../components/forms/FrequencySelectorPlaceholder'
import GithubOrgInputPlaceholder from '../components/github/GithubOrgInputPlaceholder'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../lib/apiClient'

function MonitoringSettingsPage() {
  const { token } = useAuth()
  const [domainId, setDomainId] = useState('')
  const [domainName, setDomainName] = useState('domain.com')
  const [monitorEmail, setMonitorEmail] = useState('you@domain.com')
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadSettings = useCallback(async () => {
    try {
      const response = await apiRequest('/settings/monitoring', { token })
      setDomainId(response.domain.id)
      setDomainName(response.domain.domain_name)
      setMonitorEmail(response.domain.monitor_email)
      setAlertsEnabled(response.monitoring_preference?.alerts_enabled ?? true)
    } catch (err) {
      setError(err.message)
    }
  }, [token])

  useEffect(() => {
    void loadSettings()
  }, [loadSettings])

  const saveSettings = async (intervalMinutes = 1440) => {
    try {
      setError('')
      const response = await apiRequest('/settings/monitoring', {
        method: 'PATCH',
        token,
        body: {
          domain_id: domainId,
          monitor_email: monitorEmail,
          domain_name: domainName,
          alerts_enabled: alertsEnabled,
          interval_minutes: intervalMinutes,
        },
      })
      setMessage(`Settings saved. Interval: ${response.monitoring_preference.interval_minutes} minutes`)
    } catch (err) {
      setError(err.message)
    }
  }

  const saveGithubOrg = async (orgName) => {
    try {
      setError('')
      await apiRequest('/dashboard/github-org', {
        method: 'POST',
        token,
        body: { domain_id: domainId, org_name: orgName },
      })
      setMessage('GitHub organization saved.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    /* Centers the layout and matches the vertical flow of the Dashboard/Integrations */
    <section className="flex flex-col items-center justify-start min-h-screen py-8">
      <div className="w-full max-w-3xl space-y-8 px-4 lg:px-0">
        
        {/* Page Header */}
        <div className="text-left w-full">
          <h2 className="text-3xl font-black tracking-tight text-neutral">Monitoring Settings</h2>
          <p className="text-xs opacity-50 mt-1 uppercase tracking-wider">
            Account & Detection Preferences
          </p>
        </div>

        {/* General Account & Alert Settings */}
        <section className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-8 gap-6">
            <div className="text-left">
              <h3 className="card-title text-xl font-bold">General Settings</h3>
              <p className="text-xs opacity-60">Manage where you receive alerts and which domain is monitored.</p>
            </div>

            <div className="grid gap-5">
              {/* Monitored Domain */}
              <div className="form-control w-full text-left">
                <label className="label py-1">
                  <span className="label-text font-bold uppercase text-[10px] opacity-50 tracking-widest">Monitored Domain</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered input-md w-full font-mono text-sm"
                  value={domainName}
                  onChange={(event) => setDomainName(event.target.value)}
                />
              </div>

              {/* Monitor Email */}
              <div className="form-control w-full text-left">
                <label className="label py-1">
                  <span className="label-text font-bold uppercase text-[10px] opacity-50 tracking-widest">Notification Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered input-md w-full font-mono text-sm"
                  value={monitorEmail}
                  onChange={(event) => setMonitorEmail(event.target.value)}
                />
              </div>

              {/* Alert Toggle */}
              <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg border border-base-300/50 mt-2">
                <div className="text-left">
                  <p className="text-sm font-bold">Email Alerts</p>
                  <p className="text-[10px] opacity-50">Notify me immediately if a proof is broken.</p>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-neutral"
                  checked={alertsEnabled}
                  onChange={(event) => setAlertsEnabled(event.target.checked)}
                />
              </div>
            </div>

            <div className="flex justify-center mt-2">
              <button type="button" className="btn btn-neutral btn-sm px-10 h-10" onClick={() => saveSettings()}>
                Save Settings
              </button>
            </div>
          </div>
        </section>

        {/* Frequency Section */}
        <div className="w-full">
          <FrequencySelectorPlaceholder onSave={saveSettings} />
        </div>

        {/* Divider for visual separation */}
        <div className="divider text-[10px] font-bold uppercase tracking-widest opacity-30 py-4">
          Github Integration
        </div>

        {/* GitHub Org Section */}
        <div className="w-full">
          <GithubOrgInputPlaceholder onSave={saveGithubOrg} />
        </div>
        {message ? <div className="alert alert-success"><span>{message}</span></div> : null}
        {error ? <div className="alert alert-error"><span>{error}</span></div> : null}

      </div>
    </section>
  )
}

export default MonitoringSettingsPage