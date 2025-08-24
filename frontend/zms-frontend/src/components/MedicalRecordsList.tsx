import { Plus, Stethoscope } from 'lucide-react'
import type { MedicalRecord, AnimalDetailsData } from '../types/animalDetails'

interface MedicalRecordsListProps {
  animal: AnimalDetailsData
  medicalRecords: MedicalRecord[]
  loadingRecords: boolean
  onAddMedicalRecord: () => void
  formatDate: (date: string) => string
}

const MedicalRecordsList = ({ 
  animal, 
  medicalRecords, 
  loadingRecords, 
  onAddMedicalRecord, 
  formatDate 
}: MedicalRecordsListProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold">Medical Records</h3>
        <button 
          onClick={onAddMedicalRecord}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medical Record</span>
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {loadingRecords ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading medical records...</p>
          </div>
        ) : medicalRecords.length > 0 ? (
          <div className="h-full overflow-y-auto pr-2 space-y-3">
          {medicalRecords.map((record) => (
            <div key={record._id} className="bg-gray-50 rounded-lg p-4 border">
              {/* Header with Date, Type and Follow-up */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(record.examination_date)}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    record.examination_type === 'routine' ? 'bg-green-100 text-green-800' :
                    record.examination_type === 'emergency' ? 'bg-red-100 text-red-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {record.examination_type}
                  </span>
                  {record.follow_up_required && (
                    <span className="px-2 py-1 text-xs rounded-full font-medium bg-orange-100 text-orange-800">
                      📋 Follow-up Required
                      {record.follow_up_date && ` - ${formatDate(record.follow_up_date)}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Veterinarian */}
              <div className="mb-2">
                <span className="text-xs text-gray-500">Veterinarian:</span>
                <span className="ml-1 text-sm font-medium text-gray-900">{record.veterinarian_name}</span>
              </div>

              {/* Vital Signs Grid */}
              {(record.weight_kg || record.temperature_celsius || record.heart_rate_bpm || record.respiratory_rate_per_min) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-2">
                  {record.weight_kg && (
                    <div>
                      <span className="text-gray-500">Weight:</span>
                      <span className="ml-1 font-medium">{record.weight_kg} kg</span>
                    </div>
                  )}
                  {record.temperature_celsius && (
                    <div>
                      <span className="text-gray-500">Temperature:</span>
                      <span className="ml-1 font-medium">{record.temperature_celsius}°C</span>
                    </div>
                  )}
                  {record.heart_rate_bpm && (
                    <div>
                      <span className="text-gray-500">Heart Rate:</span>
                      <span className="ml-1 font-medium">{record.heart_rate_bpm} BPM</span>
                    </div>
                  )}
                  {record.respiratory_rate_per_min && (
                    <div>
                      <span className="text-gray-500">Respiratory:</span>
                      <span className="ml-1 font-medium">{record.respiratory_rate_per_min}/min</span>
                    </div>
                  )}
                </div>
              )}

              {/* Medical Details in Horizontal Layout */}
              {(record.symptoms || record.diagnosis || record.treatment || record.medications) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mb-2">
                  {record.symptoms && (
                    <div>
                      <span className="text-gray-500 font-medium">Symptoms:</span>
                      <span className="ml-1 text-gray-800">{record.symptoms}</span>
                    </div>
                  )}
                  {record.diagnosis && (
                    <div>
                      <span className="text-gray-500 font-medium">Diagnosis:</span>
                      <span className="ml-1 text-gray-800">{record.diagnosis}</span>
                    </div>
                  )}
                  {record.treatment && (
                    <div>
                      <span className="text-gray-500 font-medium">Treatment:</span>
                      <span className="ml-1 text-gray-800">{record.treatment}</span>
                    </div>
                  )}
                  {record.medications && (
                    <div>
                      <span className="text-gray-500 font-medium">Medications:</span>
                      <span className="ml-1 text-gray-800">{record.medications}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Notes */}
              {record.notes && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500 font-medium">Notes:</span>
                  <span className="ml-2 text-sm text-gray-800">{record.notes}</span>
                </div>
              )}
            </div>
          ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical Records Yet</h3>
              <p className="text-gray-600 mb-6">Start tracking medical history for {animal.name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MedicalRecordsList
