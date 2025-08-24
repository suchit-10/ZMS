import React, { useState } from 'react'
import { useOnboard } from '../OnboardContext'

const DietStep: React.FC = () => {
  const { data, setData } = useOnboard()
  const [local, setLocal] = useState<{ dietName: string; ageCategory: string; specialConditions: string; totalCaloriesPerDay: string | number; feedingFrequencyPerDay: string | number }>(() => ({
    dietName: data.dietPlan?.dietName || '',
    ageCategory: String(data.dietPlan?.ageCategory || 'adult'),
    specialConditions: data.dietPlan?.specialConditions || '',
    totalCaloriesPerDay: data.dietPlan?.totalCaloriesPerDay || '',
    feedingFrequencyPerDay: data.dietPlan?.feedingFrequencyPerDay || '',
  }))

  React.useEffect(() => {
  // coerce ageCategory to known values for the shared DTO
  const lc = String(local.ageCategory).toLowerCase()
  const ageCat = lc === 'senior' ? 'senior' : 'adult'
  setData({ dietPlan: { ...local, ageCategory: ageCat } })
  }, [local, setData])

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Diet Name</label>
          <div className="flex-1">
          <input value={local.dietName} onChange={(e) => setLocal((s) => ({ ...s, dietName: e.target.value }))} className="w-full max-w-lg mt-1 px-3 py-2 border rounded" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Age Category</label>
        <div className="flex-1">
          <select value={local.ageCategory} onChange={(e) => setLocal((s) => ({ ...s, ageCategory: String(e.target.value) }))} className="w-full max-w-xs mt-1 px-3 py-2 border rounded">
            <option value="infant">Infant</option>
            <option value="juvenile">Juvenile</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Special Conditions</label>
            <div className="flex-1">
            <input value={local.specialConditions} onChange={(e) => setLocal((s) => ({ ...s, specialConditions: e.target.value }))} className="w-full max-w-lg mt-1 px-3 py-2 border rounded" />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Total Calories / Day</label>
              <div className="flex-1">
              <input value={local.totalCaloriesPerDay} onChange={(e) => setLocal((s) => ({ ...s, totalCaloriesPerDay: e.target.value }))} className="w-full max-w-sm mt-1 px-3 py-2 border rounded" />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Feeding Frequency / Day</label>
              <div className="flex-1">
              <input value={local.feedingFrequencyPerDay} onChange={(e) => setLocal((s) => ({ ...s, feedingFrequencyPerDay: e.target.value }))} className="w-full max-w-sm mt-1 px-3 py-2 border rounded" />
            </div>
          </div>
        </div>
      </div>

    {/* auto-synced to context */}
    </div>
  )
}

export default DietStep
