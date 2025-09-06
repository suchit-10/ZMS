import type { AnimalDetailsData } from '../types/animalDetails'

interface DietPlanOverviewProps {
  animal: AnimalDetailsData
}

const DietPlanOverview = ({ animal }: DietPlanOverviewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Diet Plan</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Diet Name</div>
              <div className="font-medium">{animal.dietPlan.dietName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Age Category</div>
              <div className="font-medium capitalize">{animal.dietPlan.ageCategory}</div>
            </div>
            {animal.dietPlan.totalCaloriesPerDay && (
              <div>
                <div className="text-sm text-gray-500">Daily Calories</div>
                <div className="font-medium">{animal.dietPlan.totalCaloriesPerDay} kcal</div>
              </div>
            )}
            {animal.dietPlan.feedingFrequencyPerDay && (
              <div>
                <div className="text-sm text-gray-500">Feeding Frequency</div>
                <div className="font-medium">{animal.dietPlan.feedingFrequencyPerDay} times/day</div>
              </div>
            )}
          </div>
          {animal.dietPlan.specialConditions && (
            <div>
              <div className="text-sm text-gray-500">Special Conditions</div>
              <div className="font-medium">{animal.dietPlan.specialConditions}</div>
            </div>
          )}
        </div>
      </div>

      {animal.distinguishingMarks && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Distinguishing Marks</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p>{animal.distinguishingMarks}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DietPlanOverview
