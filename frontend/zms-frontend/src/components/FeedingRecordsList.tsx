import { Plus, Utensils } from 'lucide-react'
import type { FeedingRecord, AnimalDetailsData } from '../types/animalDetails'

interface FeedingRecordsListProps {
  animal: AnimalDetailsData
  feedingRecords: FeedingRecord[]
  loadingRecords: boolean
  onAddFeedingRecord: () => void
  formatDateTime: (date: string) => string
}

const getAppetiteRatingClasses = (rating: string) => {
  switch (rating) {
    case 'excellent': return 'bg-green-100 text-green-800'
    case 'good': return 'bg-blue-100 text-blue-800'
    case 'fair': return 'bg-yellow-100 text-yellow-800'
    case 'poor': return 'bg-orange-100 text-orange-800'
    case 'refused': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getAppetiteRatingLabel = (rating: string) => {
  switch (rating) {
    case 'excellent': return 'Excellent'
    case 'good': return 'Good'
    case 'fair': return 'Fair'
    case 'poor': return 'Poor'
    case 'refused': return 'Refused'
    default: return rating
  }
}

const FeedingRecordsList = ({ 
  animal, 
  feedingRecords, 
  loadingRecords, 
  onAddFeedingRecord, 
  formatDateTime 
}: FeedingRecordsListProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold">Feeding Records</h3>
        <button 
          onClick={onAddFeedingRecord}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Feeding Record</span>
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {loadingRecords ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading feeding records...</p>
          </div>
        ) : feedingRecords.length > 0 ? (
          <div className="h-full overflow-y-auto pr-2 space-y-3">
          {feedingRecords.map((record) => (
            <div key={record._id} className="bg-gray-50 rounded-lg p-4 border">
              {/* Header with Date and Appetite */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">
                    {formatDateTime(record.feeding_at)}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getAppetiteRatingClasses(record.appetite_rating)}`}>
                    Appetite: {getAppetiteRatingLabel(record.appetite_rating)}
                  </span>
                </div>
              </div>

              {/* Compact Grid Layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {record.quantity_given_grams && (
                  <div>
                    <span className="text-gray-500">Given:</span>
                    <span className="ml-1 font-medium">{record.quantity_given_grams}g</span>
                  </div>
                )}
                {record.quantity_consumed_grams && (
                  <div>
                    <span className="text-gray-500">Consumed:</span>
                    <span className="ml-1 font-medium">{record.quantity_consumed_grams}g</span>
                  </div>
                )}
                {record.staff_id && (
                  <div>
                    <span className="text-gray-500">Staff:</span>
                    <span className="ml-1 font-medium">
                      {typeof record.staff_id === 'string' 
                        ? record.staff_id 
                        : (record.staff_id as { _id: string; username: string }).username || 'Unknown'
                      }
                    </span>
                  </div>
                )}
                {record.diet_item_id && (
                  <div>
                    <span className="text-gray-500">Diet Item:</span>
                    <span className="ml-1 font-medium">{record.diet_item_id}</span>
                  </div>
                )}
              </div>

              {/* Behavioral Notes */}
              {record.behavioral_notes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Notes:</span>
                  <p className="text-sm text-gray-800 mt-1">{record.behavioral_notes}</p>
                </div>
              )}
            </div>
          ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Feeding Records Yet</h3>
              <p className="text-gray-600 mb-6">Start tracking feeding schedules for {animal.name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedingRecordsList
