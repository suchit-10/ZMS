export interface AnimalPayload {
  name?: string
  species?: string
  sex?: string
  age?: number | string
  acquisitionDate?: string
  acquisitionType?: string
  image?: string
  // internal frontend-only file object for uploads
  _file?: File
}

export interface EnclosurePayload {
  enclosureName?: string
  enclosureType?: string
  temperatureMinCelsius?: number | string
  temperatureMaxCelsius?: number | string
  safetyLevel?: string
}

export interface DietPayload {
  dietName?: string
  ageCategory?: 'adult' | 'senior'
  specialConditions?: string
  totalCaloriesPerDay?: number | string
  feedingFrequencyPerDay?: number | string
}

export interface OnboardForm {
  animal?: AnimalPayload
  enclosure?: EnclosurePayload
  dietPlan?: DietPayload
}
