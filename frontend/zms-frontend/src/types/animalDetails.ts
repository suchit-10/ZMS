export interface AnimalDetailsData {
  _id: string
  name: string
  species: string
  sex: string
  age: number
  weight: number
  acquisitionDate: string
  acquisitionType: string
  microchipId: string
  distinguishingMarks?: string
  images?: string
  enclosure: {
    enclosureName: string
    enclosureType: string
    temperatureMinCelsius?: number
    temperatureMaxCelsius?: number
    safetyLevel: string
  }
  dietPlan: {
    dietName: string
    ageCategory: string
    specialConditions?: string
    totalCaloriesPerDay?: number
    feedingFrequencyPerDay?: number
  }
  createdAt: string
  updatedAt: string
}

export interface Observation {
  _id: string
  animal_id: string
  observation_at: string
  observer_staff_id?: string | { _id: string; username: string }
  behavior_category: 'feeding' | 'social' | 'reproductive' | 'aggressive' | 'play' | 'rest' | 'exploration' | 'abnormal'
  behavior_description: string
  duration_minutes?: number
  environmental_factors?: string
  severity: 'normal' | 'concerning' | 'critical'
  follow_up_required: boolean
  createdAt: string
  updatedAt: string
}

export interface MedicalRecord {
  _id: string
  animal_id: string
  examination_date: string
  examination_type: string
  veterinarian_name: string
  weight_kg?: number
  temperature_celsius?: number
  heart_rate_bpm?: number
  respiratory_rate_per_min?: number
  symptoms?: string
  diagnosis?: string
  treatment?: string
  medications?: string
  follow_up_required: boolean
  follow_up_date?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface FeedingRecord {
  _id: string
  animal_id: string
  feeding_at: string
  diet_item_id?: string
  quantity_given_grams?: number
  quantity_consumed_grams?: number
  staff_id?: string | { _id: string; username: string }
  appetite_rating: 'excellent' | 'good' | 'fair' | 'poor' | 'refused'
  behavioral_notes?: string
  createdAt: string
  updatedAt: string
}

export type ModalType = 'observation' | 'medical' | 'feeding' | null

export interface TabOption {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}
