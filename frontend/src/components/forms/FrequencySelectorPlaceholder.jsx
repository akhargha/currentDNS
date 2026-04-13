import { useState } from 'react'
import { frequencySteps } from '../../constants/frequencySteps'

function FrequencySelectorPlaceholder({ initialIndex = 1, onSave, loading = false }) {
  const [stepIndex, setStepIndex] = useState(initialIndex)
  const currentOption = frequencySteps[stepIndex]

  function handleSave() {
    if (onSave) onSave(currentOption.key)
  }

  return (
    <section className="card bg-base-100 border border-base-300 w-full max-w-4xl shadow-sm">
      <div className="card-body p-10 gap-10">
        
        <div className="text-left w-full">
          <h3 className="card-title text-2xl font-bold">Monitoring Frequency</h3>
          <p className="text-sm opacity-60 mt-1">
            Select the interval for DNS proof re-verification.
          </p>
        </div>

        <div className="flex flex-col items-center py-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] font-bold opacity-40">Frequency</span>
            <h2 className={`text-5xl font-black mt-2 transition-colors duration-300 ${currentOption.color.replace('range-', 'text-')}`}>
              {currentOption?.human}
            </h2>
          </div>

          <div className="w-full px-2"> 
            <input 
              type="range" 
              min="0" 
              max="3" 
              value={stepIndex} 
              className={`range w-full transition-colors duration-300 ${currentOption.color}`} 
              step="1" 
              onChange={(e) => setStepIndex(parseInt(e.target.value))}
            />
            
            <div className="w-full flex justify-between px-3 mt-2 text-xs opacity-20 font-bold">
              <span>|</span><span>|</span><span>|</span><span>|</span>
            </div>

            <div className="w-full flex justify-between mt-2 text-xs font-bold opacity-60">
              {frequencySteps.map((step) => (
                <span key={step.value} className="flex justify-center w-12">
                  {step.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button className="btn btn-neutral px-16" type="button" onClick={handleSave} disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Save Monitoring Frequency'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default FrequencySelectorPlaceholder
