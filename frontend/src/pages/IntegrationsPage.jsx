import IntegrationGridPlaceholder from '../components/dashboard/IntegrationGridPlaceholder'
import GithubOrgInputPlaceholder from '../components/github/GithubOrgInputPlaceholder'

function IntegrationsPage() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Integrations</h2>
      <p className="opacity-80">
        Placeholder page for Bluesky, Keybase, and GitHub organization DNS checks.
      </p>
      <GithubOrgInputPlaceholder />
      <IntegrationGridPlaceholder />
    </section>
  )
}

export default IntegrationsPage
