import { useState } from 'react'
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import Modal from './Modal'
import { api } from '../lib/http-client'
import { useToast } from './toast/ToastContext'

interface Animal {
  _id: string
  name: string
  species: string
}

interface AddObservationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  preSelectedAnimal: Animal
}

interface ObservationFormData {
  animal_id: string
  observation_at: string
  observer_staff_id: string
  behavior_category: 'feeding' | 'social' | 'reproductive' | 'aggressive' | 'play' | 'rest' | 'exploration' | 'abnormal'
  behavior_description: string
  duration_minutes: string
  environmental_factors: string
  severity: 'normal' | 'concerning' | 'critical'
  follow_up_required: boolean
}

const behaviorCategories = [
  { 
    value: 'feeding', 
    label: 'Feeding', 
    description: 'Eating, drinking, foraging behaviors'
  },
  { 
    value: 'social', 
    label: 'Social', 
    description: 'Interactions with other animals'
  },
  { 
    value: 'reproductive', 
    label: 'Reproductive', 
    description: 'Mating, nesting, parental behaviors'
  },
  { 
    value: 'aggressive', 
    label: 'Aggressive', 
    description: 'Fighting, territorial, dominance behaviors'
  },
  { 
    value: 'play', 
    label: 'Play', 
    description: 'Playful, recreational activities'
  },
  { 
    value: 'rest', 
    label: 'Rest', 
    description: 'Sleeping, resting, inactive behaviors'
  },
  { 
    value: 'exploration', 
    label: 'Exploration', 
    description: 'Investigating environment, curious behaviors'
  },
  { 
    value: 'abnormal', 
    label: 'Abnormal', 
    description: 'Stereotypic or concerning behaviors'
  }
]

const severityLevels = [
  {
    value: 'normal',
    label: 'Normal',
    icon: CheckCircle,
    color: 'emerald',
    description: 'Typical, expected behavior'
  },
  {
    value: 'concerning',
    label: 'Concerning',
    icon: AlertTriangle,
    color: 'yellow',
    description: 'Requires monitoring'
  },
  {
    value: 'critical',
    label: 'Critical',
    icon: AlertTriangle,
    color: 'red',
    description: 'Requires immediate attention'
  }
]

const AddObservationModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  preSelectedAnimal 
}: AddObservationModalProps) => {
  const [formData, setFormData] = useState<ObservationFormData>({
    animal_id: preSelectedAnimal._id,
    observation_at: new Date().toISOString().slice(0, 16),
    observer_staff_id: '',
    behavior_category: 'feeding',
    behavior_description: '',
    duration_minutes: '',
    environmental_factors: '',
    severity: 'normal',
    follow_up_required: false
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { push } = useToast()

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.observation_at) {
      newErrors.observation_at = 'Observation date and time is required'
    }
    if (!formData.behavior_description.trim()) {
      newErrors.behavior_description = 'Behavior description is required'
    } else if (formData.behavior_description.trim().length < 5) {
      newErrors.behavior_description = 'Behavior description must be at least 5 characters'
    }
    if (formData.duration_minutes && Number(formData.duration_minutes) < 0) {
      newErrors.duration_minutes = 'Duration cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      const payload: Record<string, unknown> = {
        animal_id: formData.animal_id,
        observation_at: new Date(formData.observation_at).toISOString(),
        behavior_category: formData.behavior_category,
        behavior_description: formData.behavior_description,
        severity: formData.severity,
        follow_up_required: formData.follow_up_required
      }

      // Only include optional fields if they have values
      if (formData.observer_staff_id) {
        payload.observer_staff_id = formData.observer_staff_id
      }
      if (formData.duration_minutes) {
        payload.duration_minutes = Number(formData.duration_minutes)
      }
      if (formData.environmental_factors) {
        payload.environmental_factors = formData.environmental_factors
      }

      await api.post('/v1/observations', payload)
      push('Observation created successfully!', 'success')
      onSuccess()
      onClose()
      setFormData({
        animal_id: preSelectedAnimal._id,
        observation_at: new Date().toISOString().slice(0, 16),
        observer_staff_id: '',
        behavior_category: 'feeding',
        behavior_description: '',
        duration_minutes: '',
        environmental_factors: '',
        severity: 'normal',
        follow_up_required: false
      })
    } catch (error: unknown) {
      console.error('Error creating observation:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create observation. Please try again.'
      push(errorMessage, 'error')
      setErrors({ 
        submit: errorMessage
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getSeverityIconClasses = (color: string, selected: boolean) => {
    const baseClasses = 'transition-colors'
    if (selected) {
      switch (color) {
        case 'emerald': return `${baseClasses} text-emerald-600`
        case 'yellow': return `${baseClasses} text-yellow-600`
        case 'red': return `${baseClasses} text-red-600`
        default: return `${baseClasses} text-gray-600`
      }
    }
    return `${baseClasses} text-gray-400`
  }

  const getSeverityBorderClasses = (color: string, selected: boolean) => {
    if (selected) {
      switch (color) {
        case 'emerald': return 'border-emerald-200 bg-emerald-50'
        case 'yellow': return 'border-yellow-200 bg-yellow-50'
        case 'red': return 'border-red-200 bg-red-50'
        default: return 'border-gray-200 bg-gray-50'
      }
    }
    return 'border-gray-200 bg-white'
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Add Behavioral Observation"
      maxWidth="max-w-4xl"
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Animal Info Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Animal
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
            <span className="font-medium">{preSelectedAnimal.name}</span>
            <span className="text-gray-500 ml-2">({preSelectedAnimal.species})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Observation Date and Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observation Date & Time <span className="text-red-500">*</span>
            </label>
            <input 
              type="datetime-local"
              value={formData.observation_at}
              onChange={(e) => setFormData(prev => ({ ...prev, observation_at: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.observation_at ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.observation_at && <p className="mt-1 text-sm text-red-600">{errors.observation_at}</p>}
          </div>
        </div>

        {/* Behavior Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Behavior Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {behaviorCategories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, behavior_category: category.value as ObservationFormData['behavior_category'] }))}
                className={`p-2 sm:p-3 border-2 rounded-lg text-left transition-all ${
                  formData.behavior_category === category.value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-xs sm:text-sm">{category.label}</div>
                <div className="text-xs text-gray-500 mt-1 hidden sm:block">{category.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Behavior Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Behavior Description <span className="text-red-500">*</span>
          </label>
          <textarea 
            value={formData.behavior_description}
            onChange={(e) => setFormData(prev => ({ ...prev, behavior_description: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              errors.behavior_description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Detailed description of the observed behavior..."
            rows={4}
            required
          />
          {errors.behavior_description && <p className="mt-1 text-sm text-red-600">{errors.behavior_description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.duration_minutes ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 15"
                min="0"
              />
            </div>
            {errors.duration_minutes && <p className="mt-1 text-sm text-red-600">{errors.duration_minutes}</p>}
          </div>

          {/* Environmental Factors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Environmental Factors
            </label>
            <input 
              type="text"
              value={formData.environmental_factors}
              onChange={(e) => setFormData(prev => ({ ...prev, environmental_factors: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Weather, temperature, visitors, etc."
            />
          </div>
        </div>

        {/* Severity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Severity Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {severityLevels.map((level) => {
              const Icon = level.icon
              return (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, severity: level.value as ObservationFormData['severity'] }))}
                  className={`p-2 sm:p-3 border-2 rounded-lg text-left transition-all ${
                    getSeverityBorderClasses(level.color, formData.severity === level.value)
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${getSeverityIconClasses(level.color, formData.severity === level.value)}`} />
                    <span className="font-medium text-xs sm:text-sm">{level.label}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 hidden sm:block">{level.description}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Follow-up Required */}
        <div>
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox"
              checked={formData.follow_up_required}
              onChange={(e) => setFormData(prev => ({ ...prev, follow_up_required: e.target.checked }))}
              className="mr-2 text-emerald-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Follow-up observation required</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Adding...' : 'Add Observation'}
          </button>
        </div>
      </form>
      </div>
    </Modal>
  )
}

export default AddObservationModal
