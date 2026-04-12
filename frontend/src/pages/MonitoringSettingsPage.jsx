import FrequencySelectorPlaceholder from '../components/forms/FrequencySelectorPlaceholder'
import GithubOrgInputPlaceholder from '../components/github/GithubOrgInputPlaceholder'

function MonitoringSettingsPage() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Monitoring Settings</h2>
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h3 className="card-title">Alert + Account Placeholders</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Monitor email display and editable placeholder.</li>
            <li>Broken-proof email alert toggle placeholder.</li>
            <li>Monitored domain display/edit placeholder.</li>
          </ul>
        </div>
      </div>
      <FrequencySelectorPlaceholder />
      <GithubOrgInputPlaceholder />
    </section>
  )
}

export default MonitoringSettingsPage
