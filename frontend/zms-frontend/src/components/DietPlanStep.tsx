interface DietItemData {
  foodItem: string
  quantityInGrams: string
  feedingTime: string
  preparationInstructions: string
  nutritionNotes: string
}

export interface DietPlanData {
  dietName: string
  ageCategory: 'adult' | 'senior'
  specialConditions: string
  totalCaloriesPerDay: string
  feedingFrequencyPerDay: string
  dietItems: DietItemData[]
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

      {/* Diet Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-gray-900">Diet Items</h4>
          <button
            type="button"
            onClick={() => {
              const newItem: DietItemData = {
                foodItem: '',
                quantityInGrams: '',
                feedingTime: '',
                preparationInstructions: '',
                nutritionNotes: ''
              }
              onChange({ dietItems: [...data.dietItems, newItem] })
            }}
            className="inline-flex items-center px-3 py-1 border border-emerald-300 text-sm font-medium rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Diet Item
          </button>
        </div>

        {data.dietItems.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-gray-700">Diet Item {index + 1}</h5>
              <button
                type="button"
                onClick={() => {
                  const newItems = data.dietItems.filter((_, i) => i !== index)
                  onChange({ dietItems: newItems })
                }}
                className="text-red-600 hover:text-red-800 focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Food Item <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.foodItem}
                  onChange={(e) => {
                    const newItems = [...data.dietItems]
                    newItems[index] = { ...item, foodItem: e.target.value }
                    onChange({ dietItems: newItems })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Apples, Hay, Fish"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (grams) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={item.quantityInGrams}
                  onChange={(e) => {
                    const newItems = [...data.dietItems]
                    newItems[index] = { ...item, quantityInGrams: e.target.value }
                    onChange({ dietItems: newItems })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., 150"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feeding Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={item.feedingTime}
                  onChange={(e) => {
                    const newItems = [...data.dietItems]
                    newItems[index] = { ...item, feedingTime: e.target.value }
                    onChange({ dietItems: newItems })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preparation Instructions
                </label>
                <input
                  type="text"
                  value={item.preparationInstructions}
                  onChange={(e) => {
                    const newItems = [...data.dietItems]
                    newItems[index] = { ...item, preparationInstructions: e.target.value }
                    onChange({ dietItems: newItems })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Cut into small pieces, Serve at room temperature"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nutrition Notes
                </label>
                <textarea
                  value={item.nutritionNotes}
                  onChange={(e) => {
                    const newItems = [...data.dietItems]
                    newItems[index] = { ...item, nutritionNotes: e.target.value }
                    onChange({ dietItems: newItems })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Any nutritional information, calories, supplements..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}

        {data.dietItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <p>No diet items added yet</p>
            <p className="text-sm">Click "Add Diet Item" to specify what the animal eats</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DietPlanStep
