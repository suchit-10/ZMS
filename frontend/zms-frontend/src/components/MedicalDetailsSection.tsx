interface MedicalDetailsData {
  symptoms: string
  diagnosis: string
  treatment: string
  medications: string
  follow_up_required: boolean
  follow_up_date: string
  notes: string
}

interface MedicalDetailsSectionProps {
  data: MedicalDetailsData
  errors: Record<string, string>
  onChange: (data: Partial<MedicalDetailsData>) => void
}

const MedicalDetailsSection = ({ data, errors, onChange }: MedicalDetailsSectionProps) => {
  return (
    <>
      {/* Medical Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Symptoms
          </label>
          <textarea
            placeholder="Observed symptoms..."
            value={data.symptoms}
            onChange={(e) => onChange({ symptoms: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diagnosis
          </label>
          <textarea
            placeholder="Medical diagnosis..."
            value={data.diagnosis}
            onChange={(e) => onChange({ diagnosis: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Treatment
          </label>
          <textarea
            placeholder="Treatment provided..."
            value={data.treatment}
            onChange={(e) => onChange({ treatment: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medications
          </label>
          <textarea
            placeholder="Medications prescribed..."
            value={data.medications}
            onChange={(e) => onChange({ medications: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Follow-up */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="follow_up_required"
            checked={data.follow_up_required}
            onChange={(e) => onChange({ follow_up_required: e.target.checked })}
            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="follow_up_required" className="text-sm font-medium text-gray-700">
            Follow-up required
          </label>
        </div>

        {data.follow_up_required && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={data.follow_up_date}
              onChange={(e) => onChange({ follow_up_date: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                errors.follow_up_date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.follow_up_date && (
              <p className="text-red-500 text-sm mt-1">{errors.follow_up_date}</p>
            )}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          placeholder="Any additional notes about the examination..."
          value={data.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
        />
      </div>
    </>
  )
}

export default MedicalDetailsSection
