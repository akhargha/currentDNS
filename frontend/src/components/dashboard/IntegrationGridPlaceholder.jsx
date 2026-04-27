import { Link } from 'react-router-dom'
import IntegrationCardPlaceholder from './IntegrationCardPlaceholder'

function IntegrationGridPlaceholder({ integrations }) {
  if (!integrations) {
    return (
      <section className="w-full flex justify-center py-8">
        <span className="loading loading-spinner loading-md"></span>
      </section>
    )
  }

  const sortedIntegrations = [...integrations].sort((a, b) => {
    const aPriority = a.status === 'active' ? 0 : 1
    const bPriority = b.status === 'active' ? 0 : 1
    return aPriority - bPriority
  })

  return (
    <section className="w-full space-y-6">
      
      <div className="text-left">
        <h2 className="text-xl font-bold text-neutral">Detected Integrations</h2>
        <p className="text-xs opacity-50 mt-1 uppercase tracking-wider">
          Click a card to view its audit history
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedIntegrations.map((integration) => (
          <Link 
            key={integration.id} 
            to="/dashboard/timeline" 
            className="transition-transform active:scale-95 outline-none block"
          >
            <IntegrationCardPlaceholder integration={integration} />
          </Link>
        ))}
      </div>
    </section>
  )
}

export default IntegrationGridPlaceholder
