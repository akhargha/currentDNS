import { useState, useEffect } from 'react'
import { api } from '../lib/apiClient'
import IntegrationGridPlaceholder from '../components/dashboard/IntegrationGridPlaceholder'
import GithubOrgInputPlaceholder from '../components/github/GithubOrgInputPlaceholder'

function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(null)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    api.get('/api/dashboard/integrations').then(setIntegrations).catch(() => {})
    api.get('/api/settings').then(setSettings).catch(() => {})
  }, [])

  return (
    <section className="flex flex-col items-center justify-start min-h-screen py-8 bg-base-50/30">
      <div className="w-full max-w-3xl space-y-8 px-4 lg:px-0">
        
        <div className="text-left w-full">
          <h2 className="text-3xl font-black tracking-tight text-neutral">Integrations</h2>
          <p className="text-xs opacity-50 mt-1 uppercase tracking-wider">
            DNS Proof Management
          </p>
        </div>

        <div className="w-full">
          <GithubOrgInputPlaceholder
            initialOrg={settings?.github_org || ''}
            domain={settings?.domain || ''}
          />
        </div>

        <div className="divider text-[10px] font-bold uppercase tracking-widest opacity-30 py-4">
          Detection Results
        </div>

        <div className="w-full">
          <IntegrationGridPlaceholder integrations={integrations} />
        </div>

      </div>
    </section>
  )
}

export default IntegrationsPage
