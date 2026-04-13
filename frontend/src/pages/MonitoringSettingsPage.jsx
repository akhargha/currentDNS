import { useState, useEffect } from 'react'
import { api } from '../lib/apiClient'
import FrequencySelectorPlaceholder from '../components/forms/FrequencySelectorPlaceholder'
import { frequencySteps } from '../constants/frequencySteps'
import GithubOrgInputPlaceholder from '../components/github/GithubOrgInputPlaceholder'

function MonitoringSettingsPage() {
  const [settings, setSettings] = useState(null)
  const [alertEnabled, setAlertEnabled] = useState(true)
  const [saving, setSaving] = useState(false)
  const [freqLoading, setFreqLoading] = useState(false)

  useEffect(() => {
    api.get('/api/settings').then((s) => {
      setSettings(s)
      setAlertEnabled(s.alert_enabled)
    }).catch(() => {})
  }, [])

  async function handleSaveGeneral() {
    setSaving(true)
    try {
      await api.put('/api/settings', { alert_enabled: alertEnabled })
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  async function handleFreqSave(frequency) {
    setFreqLoading(true)
    try {
      await api.put('/api/settings', { monitoring_frequency: frequency })
    } catch { /* ignore */ }
    finally { setFreqLoading(false) }
  }

  const freqIndex = settings ? frequencySteps.findIndex(s => s.key === settings.monitoring_frequency) : 1

  return (
    <section className="flex flex-col items-center justify-start min-h-screen py-8">
      <div className="w-full max-w-3xl space-y-8 px-4 lg:px-0">
        
        <div className="text-left w-full">
          <h2 className="text-3xl font-black tracking-tight text-neutral">Monitoring Settings</h2>
          <p className="text-xs opacity-50 mt-1 uppercase tracking-wider">
            Account & Detection Preferences
          </p>
        </div>

        <section className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-8 gap-6">
            <div className="text-left">
              <h3 className="card-title text-xl font-bold">General Settings</h3>
              <p className="text-xs opacity-60">Manage where you receive alerts and which domain is monitored.</p>
            </div>

            <div className="grid gap-5">
              <div className="form-control w-full text-left">
                <label className="label py-1">
                  <span className="label-text font-bold uppercase text-[10px] opacity-50 tracking-widest">Monitored Domain</span>
                </label>
                <input type="text" className="input input-bordered input-md w-full font-mono text-sm" value={settings?.domain || ''} readOnly />
              </div>

              <div className="form-control w-full text-left">
                <label className="label py-1">
                  <span className="label-text font-bold uppercase text-[10px] opacity-50 tracking-widest">Notification Email</span>
                </label>
                <input type="email" className="input input-bordered input-md w-full font-mono text-sm" value={settings?.email || ''} readOnly />
              </div>

              <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg border border-base-300/50 mt-2">
                <div className="text-left">
                  <p className="text-sm font-bold">Email Alerts</p>
                  <p className="text-[10px] opacity-50">Notify me immediately if a proof is broken.</p>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-neutral"
                  checked={alertEnabled}
                  onChange={(e) => setAlertEnabled(e.target.checked)}
                />
              </div>
            </div>

            <div className="flex justify-center mt-2">
              <button className="btn btn-neutral btn-sm px-10 h-10" onClick={handleSaveGeneral} disabled={saving}>
                {saving ? <span className="loading loading-spinner loading-sm"></span> : 'Save Settings'}
              </button>
            </div>
          </div>
        </section>

        <div className="w-full">
          <FrequencySelectorPlaceholder
            initialIndex={freqIndex >= 0 ? freqIndex : 1}
            onSave={handleFreqSave}
            loading={freqLoading}
          />
        </div>

        <div className="divider text-[10px] font-bold uppercase tracking-widest opacity-30 py-4">
          Github Integration
        </div>

        <div className="w-full">
          <GithubOrgInputPlaceholder
            initialOrg={settings?.github_org || ''}
            domain={settings?.domain || ''}
          />
        </div>

      </div>
    </section>
  )
}

export default MonitoringSettingsPage
