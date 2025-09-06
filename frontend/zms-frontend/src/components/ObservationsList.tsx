import { Plus, Eye } from 'lucide-react'
import type { Observation, AnimalDetailsData } from '../types/animalDetails'

interface ObservationsListProps {
  animal: AnimalDetailsData
  observations: Observation[]
  loadingRecords: boolean
  onAddObservation: () => void
  formatDateTime: (date: string) => string
}

const ObservationsList = ({ 
  animal, 
  observations, 
  loadingRecords, 
  onAddObservation, 
  formatDateTime 
}: ObservationsListProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold">Behavioral Observations</h3>
        <button 
          onClick={onAddObservation}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Observation</span>
        </button>
      </div>
      
      <div className="flex-1 min-h-0">
        {loadingRecords ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading observations...</p>
          </div>
        ) : observations.length > 0 ? (
          <div className="h-full overflow-y-auto pr-2 space-y-3">
          {observations.map((observation) => (
            <div key={observation._id} className="bg-gray-50 rounded-lg p-4 border">
              {/* Header with Date, Category and Severity */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">
                    {formatDateTime(observation.observation_at)}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    observation.behavior_category === 'feeding' ? 'bg-green-100 text-green-800' :
                    observation.behavior_category === 'social' ? 'bg-blue-100 text-blue-800' :
                    observation.behavior_category === 'aggressive' ? 'bg-red-100 text-red-800' :
                    observation.behavior_category === 'reproductive' ? 'bg-purple-100 text-purple-800' :
                    observation.behavior_category === 'play' ? 'bg-yellow-100 text-yellow-800' :
                    observation.behavior_category === 'rest' ? 'bg-indigo-100 text-indigo-800' :
                    observation.behavior_category === 'exploration' ? 'bg-teal-100 text-teal-800' :
                    observation.behavior_category === 'abnormal' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {observation.behavior_category}
                  </span>
                  {observation.severity !== 'normal' && (
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      observation.severity === 'concerning' ? 'bg-yellow-100 text-yellow-800' :
                      observation.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      ⚠️ {observation.severity}
                    </span>
                  )}
                  {observation.follow_up_required && (
                    <span className="px-2 py-1 text-xs rounded-full font-medium bg-orange-100 text-orange-800">
                      📋 Follow-up Required
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-800 mb-3">{observation.behavior_description}</p>

              {/* Compact Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {observation.duration_minutes && (
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="ml-1 font-medium">{observation.duration_minutes} min</span>
                  </div>
                )}
                {observation.observer_staff_id && (
                  <div>
                    <span className="text-gray-500">Observer:</span>
                    <span className="ml-1 font-medium">
                      {typeof observation.observer_staff_id === 'string' 
                        ? observation.observer_staff_id 
                        : (observation.observer_staff_id as { _id: string; username: string }).username || 'Unknown Observer'
                      }
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Severity:</span>
                  <span className={`ml-1 font-medium ${
                    observation.severity === 'normal' ? 'text-emerald-600' :
                    observation.severity === 'concerning' ? 'text-yellow-600' :
                    observation.severity === 'critical' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {observation.severity}
                  </span>
                </div>
              </div>

              {/* Environmental Factors */}
              {observation.environmental_factors && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Environment:</span>
                  <p className="text-sm text-gray-800 mt-1">{observation.environmental_factors}</p>
                </div>
              )}
            </div>
          ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Observations Yet</h3>
              <p className="text-gray-600 mb-6">Start tracking behavioral observations for {animal.name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ObservationsList
