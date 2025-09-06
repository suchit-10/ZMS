interface AnimalFormData {
  name: string
  species: string
  sex: string
  age: string
  microchipId: string
  weight: string
  acquisitionDate: string
  acquisitionType: string
}

interface AnimalInformationStepProps {
  data: AnimalFormData
  errors: Record<string, string>
  onChange: (data: Partial<AnimalFormData>) => void
  clearError: (field: string) => void
}

const AnimalInformationStep = ({ data, errors, onChange, clearError }: AnimalInformationStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Animal Information</h3>
          <p className="text-sm text-gray-600">Enter the basic details about the animal</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            value={data.name} 
            onChange={(e) => {
              onChange({ name: e.target.value })
              clearError('name')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter animal name"
            required
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Species <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            value={data.species} 
            onChange={(e) => {
              onChange({ species: e.target.value })
              clearError('species')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.species ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="e.g., African Elephant, Bengal Tiger"
            required
          />
          {errors.species && <p className="mt-1 text-sm text-red-600">{errors.species}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sex <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                checked={data.sex === 'Male'} 
                onChange={() => onChange({ sex: 'Male' })}
                className="mr-2 text-emerald-600"
              />
              <span className="text-gray-700">Male</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                checked={data.sex === 'Female'} 
                onChange={() => onChange({ sex: 'Female' })}
                className="mr-2 text-emerald-600"
              />
              <span className="text-gray-700">Female</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age (years) <span className="text-red-500">*</span>
          </label>
          <input 
            type="number"
            value={data.age} 
            onChange={(e) => {
              onChange({ age: e.target.value })
              clearError('age')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.age ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter age in years"
            min="0"
            required
          />
          {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Microchip ID <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            value={data.microchipId} 
            onChange={(e) => {
              onChange({ microchipId: e.target.value })
              clearError('microchipId')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.microchipId ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter microchip ID"
            required
          />
          {errors.microchipId && <p className="mt-1 text-sm text-red-600">{errors.microchipId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg) <span className="text-red-500">*</span>
          </label>
          <input 
            type="number"
            value={data.weight} 
            onChange={(e) => {
              onChange({ weight: e.target.value })
              clearError('weight')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.weight ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter weight in kg"
            min="0"
            step="0.1"
            required
          />
          {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Acquisition Date <span className="text-red-500">*</span>
          </label>
          <input 
            type="date"
            value={data.acquisitionDate} 
            onChange={(e) => {
              onChange({ acquisitionDate: e.target.value })
              clearError('acquisitionDate')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.acquisitionDate ? 'border-red-300' : 'border-gray-300'}`}
            required
          />
          {errors.acquisitionDate && <p className="mt-1 text-sm text-red-600">{errors.acquisitionDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Acquisition Type <span className="text-red-500">*</span>
          </label>
          <select 
            value={data.acquisitionType} 
            onChange={(e) => {
              onChange({ acquisitionType: e.target.value })
              clearError('acquisitionType')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.acquisitionType ? 'border-red-300' : 'border-gray-300'}`}
            required
          >
            <option value="">Select acquisition type</option>
            <option value="birth">Birth</option>
            <option value="purchase">Purchase</option>
            <option value="donation">Donation</option>
            <option value="transfer">Transfer</option>
            <option value="rescue">Rescue</option>
          </select>
          {errors.acquisitionType && <p className="mt-1 text-sm text-red-600">{errors.acquisitionType}</p>}
        </div>
      </div>
    </div>
  )
}

export default AnimalInformationStep
