import { integrationTypes } from '../../constants/integrationTypes'
import IntegrationCardPlaceholder from './IntegrationCardPlaceholder'

function IntegrationGridPlaceholder() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Integration Detection Placeholder Grid</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {integrationTypes.map((integration) => (
          <IntegrationCardPlaceholder key={integration.id} integration={integration} />
        ))}
      </div>
    </section>
  )
}

export default IntegrationGridPlaceholder
