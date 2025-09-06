interface VitalSignsData {
  weight_kg: string
  temperature_celsius: string
  heart_rate_bpm: string
  respiratory_rate_per_min: string
}

interface VitalSignsSectionProps {
  data: VitalSignsData
  errors: Record<string, string>
  onChange: (data: Partial<VitalSignsData>) => void
}

const VitalSignsSection = ({ data, errors, onChange }: VitalSignsSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-3">Vital Signs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="9999.99"
            placeholder="0.00"
            value={data.weight_kg}
            onChange={(e) => onChange({ weight_kg: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.weight_kg ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.weight_kg && (
            <p className="text-red-500 text-xs mt-1">{errors.weight_kg}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1"
            min="25"
            max="50"
            placeholder="37.0"
            value={data.temperature_celsius}
            onChange={(e) => onChange({ temperature_celsius: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.temperature_celsius ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.temperature_celsius && (
            <p className="text-red-500 text-xs mt-1">{errors.temperature_celsius}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Heart Rate (BPM)
          </label>
          <input
            type="number"
            min="10"
            max="1000"
            placeholder="60"
            value={data.heart_rate_bpm}
            onChange={(e) => onChange({ heart_rate_bpm: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.heart_rate_bpm ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.heart_rate_bpm && (
            <p className="text-red-500 text-xs mt-1">{errors.heart_rate_bpm}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Respiratory Rate (per min)
          </label>
          <input
            type="number"
            min="1"
            max="200"
            placeholder="16"
            value={data.respiratory_rate_per_min}
            onChange={(e) => onChange({ respiratory_rate_per_min: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.respiratory_rate_per_min ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.respiratory_rate_per_min && (
            <p className="text-red-500 text-xs mt-1">{errors.respiratory_rate_per_min}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default VitalSignsSection
