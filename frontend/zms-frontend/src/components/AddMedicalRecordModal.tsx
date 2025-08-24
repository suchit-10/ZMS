import { useState } from 'react'
import Modal from './Modal'
import ExaminationTypeSelector from './ExaminationTypeSelector'
import VitalSignsSection from './VitalSignsSection'
import MedicalDetailsSection from './MedicalDetailsSection'
import { api } from '../lib/http-client'
import { useToast } from './toast/ToastContext'

interface Animal {
  _id: string
  name: string
  species: string
}

interface AddMedicalRecordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  preSelectedAnimal: Animal
}

interface MedicalFormData {
  animal_id: string
  examination_date: string
  examination_type: 'routine' | 'emergency' | 'follow_up' | 'pre_breeding' | 'quarantine'
  veterinarian_name: string
  weight_kg: string
  temperature_celsius: string
  heart_rate_bpm: string
  respiratory_rate_per_min: string
  symptoms: string
  diagnosis: string
  treatment: string
  medications: string
  follow_up_required: boolean
  follow_up_date: string
  notes: string
}

export const AddMedicalRecordModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  preSelectedAnimal 
}: AddMedicalRecordModalProps) => {
  const [formData, setFormData] = useState<MedicalFormData>({
    animal_id: preSelectedAnimal._id,
    examination_date: '',
    examination_type: 'routine',
    veterinarian_name: '',
    weight_kg: '',
    temperature_celsius: '',
    heart_rate_bpm: '',
    respiratory_rate_per_min: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    follow_up_required: false,
    follow_up_date: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { push } = useToast()

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.examination_date) {
      newErrors.examination_date = 'Examination date is required'
    }
    if (!formData.veterinarian_name.trim()) {
      newErrors.veterinarian_name = 'Veterinarian name is required'
    }

    // Validate numeric fields if provided
    if (formData.weight_kg && (Number(formData.weight_kg) <= 0 || Number(formData.weight_kg) > 9999.99)) {
      newErrors.weight_kg = 'Weight must be between 0.01 and 9999.99 kg'
    }
    if (formData.temperature_celsius && (Number(formData.temperature_celsius) < 25 || Number(formData.temperature_celsius) > 50)) {
      newErrors.temperature_celsius = 'Temperature must be between 25°C and 50°C'
    }
    if (formData.heart_rate_bpm && (Number(formData.heart_rate_bpm) < 10 || Number(formData.heart_rate_bpm) > 1000)) {
      newErrors.heart_rate_bpm = 'Heart rate must be between 10 and 1000 BPM'
    }
    if (formData.respiratory_rate_per_min && (Number(formData.respiratory_rate_per_min) < 1 || Number(formData.respiratory_rate_per_min) > 200)) {
      newErrors.respiratory_rate_per_min = 'Respiratory rate must be between 1 and 200 per minute'
    }

    // Follow-up date validation
    if (formData.follow_up_required && !formData.follow_up_date) {
      newErrors.follow_up_date = 'Follow-up date is required when follow-up is needed'
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
        examination_date: new Date(formData.examination_date).toISOString(),
        examination_type: formData.examination_type,
        veterinarian_name: formData.veterinarian_name,
        weight_kg: formData.weight_kg ? Number(formData.weight_kg) : undefined,
        temperature_celsius: formData.temperature_celsius ? Number(formData.temperature_celsius) : undefined,
        heart_rate_bpm: formData.heart_rate_bpm ? Number(formData.heart_rate_bpm) : undefined,
        respiratory_rate_per_min: formData.respiratory_rate_per_min ? Number(formData.respiratory_rate_per_min) : undefined,
        symptoms: formData.symptoms || undefined,
        diagnosis: formData.diagnosis || undefined,
        treatment: formData.treatment || undefined,
        medications: formData.medications || undefined,
        follow_up_required: formData.follow_up_required,
        follow_up_date: formData.follow_up_date ? new Date(formData.follow_up_date).toISOString() : undefined,
        notes: formData.notes || undefined,
      }

      await api.post('/v1/medical-records', submitData)
      
      push('Medical record created successfully!', 'success')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating medical record:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save medical record. Please try again.'
      push(errorMessage, 'error')
      setErrors({ submit: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      animal_id: preSelectedAnimal._id,
      examination_date: '',
      examination_type: 'routine',
      veterinarian_name: '',
      weight_kg: '',
      temperature_celsius: '',
      heart_rate_bpm: '',
      respiratory_rate_per_min: '',
      symptoms: '',
      diagnosis: '',
      treatment: '',
      medications: '',
      follow_up_required: false,
      follow_up_date: '',
      notes: ''
    })
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Medical Record" maxWidth="max-w-4xl">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Examination Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Examination Date <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.examination_date}
              onChange={(e) => setFormData(prev => ({ ...prev, examination_date: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                errors.examination_date ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.examination_date && (
              <p className="text-red-500 text-sm mt-1">{errors.examination_date}</p>
            )}
          </div>

          {/* Veterinarian Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Veterinarian Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Dr. Jane Smith"
              value={formData.veterinarian_name}
              onChange={(e) => setFormData(prev => ({ ...prev, veterinarian_name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                errors.veterinarian_name ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.veterinarian_name && (
              <p className="text-red-500 text-sm mt-1">{errors.veterinarian_name}</p>
            )}
          </div>
        </div>

        {/* Examination Type */}
        <ExaminationTypeSelector
          selectedType={formData.examination_type}
          onTypeSelect={(type) => setFormData(prev => ({ ...prev, examination_type: type as MedicalFormData['examination_type'] }))}
        />

        {/* Vital Signs */}
        <VitalSignsSection
          data={{
            weight_kg: formData.weight_kg,
            temperature_celsius: formData.temperature_celsius,
            heart_rate_bpm: formData.heart_rate_bpm,
            respiratory_rate_per_min: formData.respiratory_rate_per_min
          }}
          errors={errors}
          onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
        />

        {/* Medical Details */}
        <MedicalDetailsSection
          data={{
            symptoms: formData.symptoms,
            diagnosis: formData.diagnosis,
            treatment: formData.treatment,
            medications: formData.medications,
            follow_up_required: formData.follow_up_required,
            follow_up_date: formData.follow_up_date,
            notes: formData.notes
          }}
          errors={errors}
          onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !formData.animal_id}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddMedicalRecordModal
