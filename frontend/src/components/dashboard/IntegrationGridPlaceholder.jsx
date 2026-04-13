import { Link } from 'react-router-dom'
import { integrationTypes } from '../../constants/integrationTypes'
import IntegrationCardPlaceholder from './IntegrationCardPlaceholder'

function IntegrationGridPlaceholder() {
  return (
    /* Removed max-w-3xl here so it relies on the IntegrationsPage container */
    <section className="w-full space-y-6">
      
      {/* Header aligned to the left edge of the 3xl column */}
      <div className="text-left">
        <h2 className="text-xl font-bold text-neutral">Detected Integrations</h2>
        <p className="text-xs opacity-50 mt-1 uppercase tracking-wider">
          Click a card to view its audit history
        </p>
      </div>

      {/* Grid Layout - 1 col on mobile, 3 cols on desktop */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrationTypes.map((integration) => (
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