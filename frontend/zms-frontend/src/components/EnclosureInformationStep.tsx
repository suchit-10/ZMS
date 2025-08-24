interface EnclosureFormData {
  enclosureName: string
  enclosureType: string
  temperatureMinCelsius: string
  temperatureMaxCelsius: string
  safetyLevel: string
}

interface EnclosureInformationStepProps {
  data: EnclosureFormData
  errors: Record<string, string>
  onChange: (data: Partial<EnclosureFormData>) => void
  clearError: (field: string) => void
}

const EnclosureInformationStep = ({ data, errors, onChange, clearError }: EnclosureInformationStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Enclosure Information</h3>
          <p className="text-sm text-gray-600">Set up the animal's living space</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enclosure Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            value={data.enclosureName} 
            onChange={(e) => {
              onChange({ enclosureName: e.target.value })
              clearError('enclosureName')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.enclosureName ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="e.g., African Savanna Habitat, Tropical Rainforest"
            required
          />
          {errors.enclosureName && <p className="mt-1 text-sm text-red-600">{errors.enclosureName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enclosure Type <span className="text-red-500">*</span>
          </label>
          <select 
            value={data.enclosureType} 
            onChange={(e) => {
              onChange({ enclosureType: e.target.value })
              clearError('enclosureType')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.enclosureType ? 'border-red-300' : 'border-gray-300'}`}
            required
          >
            <option value="">Select enclosure type</option>
            <option value="outdoor">Outdoor</option>
            <option value="indoor">Indoor</option>
            <option value="mixed">Mixed (Indoor/Outdoor)</option>
            <option value="aquatic">Aquatic</option>
            <option value="aviary">Aviary</option>
            <option value="terrarium">Terrarium</option>
          </select>
          {errors.enclosureType && <p className="mt-1 text-sm text-red-600">{errors.enclosureType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Temperature (°C)
          </label>
          <input 
            type="number"
            step="0.1"
            value={data.temperatureMinCelsius} 
            onChange={(e) => {
              onChange({ temperatureMinCelsius: e.target.value })
              clearError('temperatureMinCelsius')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.temperatureMinCelsius ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="e.g., 18.0"
          />
          {errors.temperatureMinCelsius && <p className="mt-1 text-sm text-red-600">{errors.temperatureMinCelsius}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Temperature (°C)
          </label>
          <input 
            type="number"
            step="0.1"
            value={data.temperatureMaxCelsius} 
            onChange={(e) => {
              onChange({ temperatureMaxCelsius: e.target.value })
              clearError('temperatureMaxCelsius')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.temperatureMaxCelsius ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="e.g., 28.0"
          />
          {errors.temperatureMaxCelsius && <p className="mt-1 text-sm text-red-600">{errors.temperatureMaxCelsius}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Safety Level <span className="text-red-500">*</span>
          </label>
          <select 
            value={data.safetyLevel} 
            onChange={(e) => {
              onChange({ safetyLevel: e.target.value })
              clearError('safetyLevel')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.safetyLevel ? 'border-red-300' : 'border-gray-300'}`}
            required
          >
            <option value="">Select safety level</option>
            <option value="restrictedAccess">Restricted Access</option>
            <option value="quarantine">Quarantine</option>
            <option value="hospital">Hospital</option>
            <option value="public">Public Access</option>
          </select>
          {errors.safetyLevel && <p className="mt-1 text-sm text-red-600">{errors.safetyLevel}</p>}
        </div>
      </div>
    </div>
  )
}

export default EnclosureInformationStep
