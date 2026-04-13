import IntegrationGridPlaceholder from '../components/dashboard/IntegrationGridPlaceholder'
import GithubOrgInputPlaceholder from '../components/github/GithubOrgInputPlaceholder'

function IntegrationsPage() {
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
          <GithubOrgInputPlaceholder />
        </div>

        {/* Horizontal Divider 
            Reduced opacity and text size to keep the 'compact' feel 
        */}
        <div className="divider text-[10px] font-bold uppercase tracking-widest opacity-30 py-4">
          Detection Results
        </div>

        {/* Integration Grid Section */}
        <div className="w-full">
          <IntegrationGridPlaceholder />
        </div>

      </div>
    </section>
  )
}

export default IntegrationsPage