import { useCallback, useEffect, useState } from 'react'
import IntegrationGridPlaceholder from '../components/dashboard/IntegrationGridPlaceholder'
import GithubOrgInputPlaceholder from '../components/github/GithubOrgInputPlaceholder'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../lib/apiClient'

function IntegrationsPage() {
  const { token } = useAuth()
  const [integrations, setIntegrations] = useState([])
  const [domainId, setDomainId] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadIntegrations = useCallback(async () => {
    try {
      const response = await apiRequest('/dashboard/integrations', { token })
      setIntegrations(response.integrations || [])
      setDomainId(response.domain?.id || '')
    } catch (err) {
      setError(err.message)
    }
  }, [token])

  const saveGithubOrg = async (orgName) => {
    if (!domainId) return
    try {
      setSaving(true)
      setError('')
      await apiRequest('/dashboard/github-org', {
        method: 'POST',
        token,
        body: { domain_id: domainId, org_name: orgName.trim() },
      })
      setMessage('GitHub org saved. Run a scan to detect proof.')
      await loadIntegrations()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadIntegrations()
  }, [loadIntegrations])

  return (
    /* Main container: Centers everything and handles page height */
    <section className="flex flex-col items-center justify-start min-h-screen py-8 bg-base-50/30">
      
      {/* Adjusted to max-w-3xl to match the new compact GithubOrgInput size.
          This ensures the headers and card borders line up perfectly.
      */}
      <div className="w-full max-w-3xl space-y-8 px-4 lg:px-0">
        
        {/* Page Header - Left aligned to the 3xl column */}
        <div className="text-left w-full">
          <h2 className="text-3xl font-black tracking-tight text-neutral">Integrations</h2>
          <p className="text-xs opacity-50 mt-1 uppercase tracking-wider">
            DNS Proof Management
          </p>
        </div>

        {/* GitHub Config Section */}
        <div className="w-full">
          <GithubOrgInputPlaceholder onSave={saveGithubOrg} loading={saving} />
          {message ? <div className="alert alert-success mt-4"><span>{message}</span></div> : null}
          {error ? <div className="alert alert-error mt-4"><span>{error}</span></div> : null}
        </div>

        {/* Horizontal Divider 
            Reduced opacity and text size to keep the 'compact' feel 
        */}
        <div className="divider text-[10px] font-bold uppercase tracking-widest opacity-30 py-4">
          Detection Results
        </div>

        {/* Integration Grid Section */}
        <div className="w-full">
          <IntegrationGridPlaceholder integrations={integrations} />
        </div>

      </div>
    </section>
  )
}

export default IntegrationsPage