import { monitoringOptions } from '../../constants/monitoringOptions'

function FrequencySelectorPlaceholder() {
  return (
    <section className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h3 className="card-title">Monitoring Frequency Placeholder</h3>
        <p className="text-sm opacity-80">
          Select how often DNS proofs should be re-checked.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {monitoringOptions.map((option) => (
            <label key={option.value} className="label cursor-pointer rounded-box border p-3">
              <span className="label-text">{option.label}</span>
              <input type="radio" name="monitoring-frequency" className="radio radio-primary" />
            </label>
          ))}
        </div>
        <button className="btn btn-primary w-fit" type="button">
          Save Monitoring Cadence
        </button>
      </div>
    </section>
  )
}

export default FrequencySelectorPlaceholder
