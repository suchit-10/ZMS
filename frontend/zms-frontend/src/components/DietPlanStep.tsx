interface DietPlanData {
  dietName: string
  ageCategory: 'adult' | 'senior'
  specialConditions: string
  totalCaloriesPerDay: string
  feedingFrequencyPerDay: string
}

interface DietPlanStepProps {
  data: DietPlanData
  errors: Record<string, string>
  onChange: (data: Partial<DietPlanData>) => void
  clearError: (field: string) => void
}

const DietPlanStep = ({ data, errors, onChange, clearError }: DietPlanStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Diet Plan</h3>
          <p className="text-sm text-gray-600">Configure the animal's feeding schedule and dietary requirements</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diet Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            value={data.dietName} 
            onChange={(e) => {
              onChange({ dietName: e.target.value })
              clearError('dietName')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.dietName ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="e.g., Herbivore Mix, Carnivore Special"
            required
          />
          {errors.dietName && <p className="mt-1 text-sm text-red-600">{errors.dietName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age Category <span className="text-red-500">*</span>
          </label>
          <select 
            value={data.ageCategory} 
            onChange={(e) => {
              onChange({ ageCategory: e.target.value as 'adult' | 'senior' })
              clearError('ageCategory')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.ageCategory ? 'border-red-300' : 'border-gray-300'}`}
            required
          >
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>
          {errors.ageCategory && <p className="mt-1 text-sm text-red-600">{errors.ageCategory}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Calories Per Day
          </label>
          <input 
            type="number"
            value={data.totalCaloriesPerDay} 
            onChange={(e) => {
              onChange({ totalCaloriesPerDay: e.target.value })
              clearError('totalCaloriesPerDay')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.totalCaloriesPerDay ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="e.g., 2500"
            min="0"
          />
          {errors.totalCaloriesPerDay && <p className="mt-1 text-sm text-red-600">{errors.totalCaloriesPerDay}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feeding Frequency Per Day
          </label>
          <input 
            type="number"
            value={data.feedingFrequencyPerDay} 
            onChange={(e) => {
              onChange({ feedingFrequencyPerDay: e.target.value })
              clearError('feedingFrequencyPerDay')
            }} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.feedingFrequencyPerDay ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="e.g., 3"
            min="1"
          />
          {errors.feedingFrequencyPerDay && <p className="mt-1 text-sm text-red-600">{errors.feedingFrequencyPerDay}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Conditions
          </label>
          <textarea 
            value={data.specialConditions} 
            onChange={(e) => onChange({ specialConditions: e.target.value })} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Any special dietary requirements, allergies, or medical conditions affecting diet..."
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}

export default DietPlanStep
