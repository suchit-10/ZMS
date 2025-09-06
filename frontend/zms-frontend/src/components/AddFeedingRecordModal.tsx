import { useState } from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Modal from './Modal'
import { api } from '../lib/http-client'
import { useToast } from './toast/ToastContext'

interface Animal {
  _id: string
  name: string
  species: string
}

interface AddFeedingRecordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  preSelectedAnimal: Animal
}

interface FeedingFormData {
  animal_id: string
  feeding_at: string
  diet_item_id: string
  quantity_given_grams: string
  quantity_consumed_grams: string
  staff_id: string
  appetite_rating: 'excellent' | 'good' | 'fair' | 'poor' | 'refused'
  behavioral_notes: string
}

const appetiteOptions = [
  { 
    value: 'excellent', 
    label: 'Excellent', 
    icon: CheckCircle, 
    color: 'emerald',
    description: 'Ate eagerly and completely'
  },
  { 
    value: 'good', 
    label: 'Good', 
    icon: CheckCircle, 
    color: 'blue',
    description: 'Ate well with normal behavior'
  },
  { 
    value: 'fair', 
    label: 'Fair', 
    icon: AlertCircle, 
    color: 'yellow',
    description: 'Ate hesitantly or partially'
  },
  { 
    value: 'poor', 
    label: 'Poor', 
    icon: XCircle, 
    color: 'orange',
    description: 'Minimal eating, showed reluctance'
  },
  { 
    value: 'refused', 
    label: 'Refused', 
    icon: XCircle, 
    color: 'red',
    description: 'Did not eat at all'
  }
] as const

export const AddFeedingRecordModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  preSelectedAnimal 
}: AddFeedingRecordModalProps) => {
  const [formData, setFormData] = useState<FeedingFormData>({
    animal_id: preSelectedAnimal._id,
    feeding_at: '',
    diet_item_id: '',
    quantity_given_grams: '',
    quantity_consumed_grams: '',
    staff_id: '',
    appetite_rating: 'good',
    behavioral_notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { push } = useToast()

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.feeding_at) {
      newErrors.feeding_at = 'Feeding time is required'
    }

    // Validate quantities if provided
    if (formData.quantity_given_grams && Number(formData.quantity_given_grams) < 0) {
      newErrors.quantity_given_grams = 'Quantity given cannot be negative'
    }
    if (formData.quantity_consumed_grams && Number(formData.quantity_consumed_grams) < 0) {
      newErrors.quantity_consumed_grams = 'Quantity consumed cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setSubmitting(true)
      
      const submitData = {
        animal_id: formData.animal_id,
        feeding_at: new Date(formData.feeding_at).toISOString(),
        diet_item_id: formData.diet_item_id || undefined,
        quantity_given_grams: formData.quantity_given_grams ? Number(formData.quantity_given_grams) : undefined,
        quantity_consumed_grams: formData.quantity_consumed_grams ? Number(formData.quantity_consumed_grams) : undefined,
        staff_id: formData.staff_id || undefined,
        appetite_rating: formData.appetite_rating,
        behavioral_notes: formData.behavioral_notes || undefined,
      }

      await api.post('/v1/feeding-records', submitData)
      
      push('Feeding record created successfully!', 'success')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating feeding record:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save feeding record. Please try again.'
      push(errorMessage, 'error')
      setErrors({ submit: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      animal_id: preSelectedAnimal._id,
      feeding_at: '',
      diet_item_id: '',
      quantity_given_grams: '',
      quantity_consumed_grams: '',
      staff_id: '',
      appetite_rating: 'good',
      behavioral_notes: ''
    })
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Feeding Record" maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Animal Info Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Animal
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
            <span className="font-medium">{preSelectedAnimal.name}</span>
            <span className="text-gray-500 ml-2">({preSelectedAnimal.species})</span>
          </div>
        </div>

        {/* Feeding Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feeding Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.feeding_at}
            onChange={(e) => setFormData(prev => ({ ...prev, feeding_at: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.feeding_at ? 'border-red-300' : 'border-gray-300'
            }`}
            required
          />
          {errors.feeding_at && (
            <p className="text-red-500 text-sm mt-1">{errors.feeding_at}</p>
          )}
        </div>

        {/* Food Quantity */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Food Quantity (grams)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Quantity Given
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.quantity_given_grams}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  quantity_given_grams: e.target.value 
                }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.quantity_given_grams ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.quantity_given_grams && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity_given_grams}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Quantity Consumed
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.quantity_consumed_grams}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  quantity_consumed_grams: e.target.value 
                }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.quantity_consumed_grams ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.quantity_consumed_grams && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity_consumed_grams}</p>
              )}
            </div>
          </div>
        </div>

        {/* Appetite Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Appetite Rating <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {appetiteOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, appetite_rating: option.value }))}
                  className={`p-2 sm:p-3 border-2 rounded-lg text-xs sm:text-sm font-medium transition-all hover:shadow-md ${
                    formData.appetite_rating === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700 shadow-md`
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title={option.description}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon className={`w-5 h-5 ${
                      formData.appetite_rating === option.value 
                        ? `text-${option.color}-600` 
                        : 'text-gray-400'
                    }`} />
                    <span className="text-center leading-tight">{option.label}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Behavioral Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Behavioral Notes
          </label>
          <textarea
            placeholder="Add any observations about behavior during feeding..."
            value={formData.behavioral_notes}
            onChange={(e) => setFormData(prev => ({ ...prev, behavioral_notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddFeedingRecordModal
