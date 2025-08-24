import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { useToast } from '../components/toast/ToastContext'
import { onboardApi } from '../services/onboard'

interface AnimalFormData {
  name: string
  species: string
  sex: string
  age: string
  microchipId: string
  weight: string
  acquisitionDate: string
  acquisitionType: string
}

interface EnclosureFormData {
  enclosureName: string
  enclosureType: string
  temperatureMinCelsius: string
  temperatureMaxCelsius: string
  safetyLevel: string
}

interface DietFormData {
  dietName: string
  ageCategory: 'adult' | 'senior'
  specialConditions: string
  totalCaloriesPerDay: string
  feedingFrequencyPerDay: string
}

export const AddAnimal = () => {
  const navigate = useNavigate()
  const { push } = useToast()
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [animalData, setAnimalData] = useState<AnimalFormData>({
    name: '',
    species: '',
    sex: 'Male',
    age: '',
    microchipId: '',
    weight: '',
    acquisitionDate: '',
    acquisitionType: ''
  })

  const [enclosureData, setEnclosureData] = useState<EnclosureFormData>({
    enclosureName: '',
    enclosureType: 'indoor',
    temperatureMinCelsius: '',
    temperatureMaxCelsius: '',
    safetyLevel: 'restrictedAccess'
  })

  const [dietData, setDietData] = useState<DietFormData>({
    dietName: '',
    ageCategory: 'adult',
    specialConditions: '',
    totalCaloriesPerDay: '',
    feedingFrequencyPerDay: ''
  })

  const steps = [
    { id: 0, title: 'Animal Details', description: 'Basic information about the animal' },
    { id: 1, title: 'Enclosure Setup', description: 'Housing and environment details' },
    { id: 2, title: 'Diet Planning', description: 'Nutrition and feeding requirements' },
  ]

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {}
    
    if (currentStep === 0) {
      // Animal validation
      if (!animalData.name.trim()) newErrors.name = 'Name is required'
      if (!animalData.species.trim()) newErrors.species = 'Species is required'
      if (!animalData.age.trim()) newErrors.age = 'Age is required'
      if (!animalData.microchipId.trim()) newErrors.microchipId = 'Microchip ID is required'
      if (!animalData.weight.trim()) newErrors.weight = 'Weight is required'
      if (!animalData.acquisitionDate.trim()) newErrors.acquisitionDate = 'Acquisition date is required'
    } else if (currentStep === 1) {
      // Enclosure validation
      if (!enclosureData.enclosureName.trim()) newErrors.enclosureName = 'Enclosure name is required'
    } else if (currentStep === 2) {
      // Diet validation
      if (!dietData.dietName.trim()) newErrors.dietName = 'Diet name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))
    } else {
      push('Please fill in all required fields', 'error')
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const submit = async () => {
    if (!validateCurrentStep()) {
      push('Please fill in all required fields', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        animal: {
          ...animalData,
          age: parseInt(animalData.age) || 0,
          weight: parseFloat(animalData.weight) || 0
        },
        enclosure: {
          ...enclosureData,
          temperatureMinCelsius: parseFloat(enclosureData.temperatureMinCelsius) || undefined,
          temperatureMaxCelsius: parseFloat(enclosureData.temperatureMaxCelsius) || undefined
        },
        dietPlan: {
          ...dietData,
          totalCaloriesPerDay: parseFloat(dietData.totalCaloriesPerDay) || undefined,
          feedingFrequencyPerDay: parseInt(dietData.feedingFrequencyPerDay) || undefined
        }
      }

      console.log('Submitting payload:', payload) // Debug log
      await onboardApi.create(payload)
      push(`🎉 ${animalData.name} has been successfully registered!`, 'success')
      
      // Dispatch refresh event for animals page
      window.dispatchEvent(new CustomEvent('animals:refresh'))
      
      // Navigate back to animals page after success
      setTimeout(() => navigate('/animals'), 1500)
    } catch (err: unknown) {
      console.error('Failed to onboard:', err)
      let msg = 'Failed to onboard animal'
      
      if (err instanceof Error) {
        if (err.message.includes('microchip')) {
          msg = 'This microchip ID is already in use. Please use a unique ID.'
        } else if (err.message.includes('validation')) {
          msg = 'Please check all required fields and try again.'
        } else {
          msg = err.message
        }
      }
      
      push(msg, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(135deg, #e6f4e6 0%, #f2fff4 50%, #dff0df 100%)" }}>
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 pt-8 md:pt-6 md:ml-52">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Header title="Register New Animal" subtitle="Follow the steps to add a new animal to the zoo management system" />
            </div>

            {/* Progress Steps */}
            <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Registration Progress</h3>
                <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
              </div>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-emerald-600 transition-all duration-300"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>
                
                {/* Step Indicators */}
                <div className="relative flex justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                          index === currentStep 
                            ? 'bg-emerald-600 text-white shadow-lg scale-110' 
                            : index < currentStep 
                              ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-600' 
                              : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {index < currentStep ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="mt-3 text-center">
                        <div className={`text-sm font-medium ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 max-w-24">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={(e) => { e.preventDefault(); }} className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {/* Step 1: Animal Information */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Animal Information</h3>
                      <p className="text-sm text-gray-600">Enter the basic details about the animal</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        value={animalData.name} 
                        onChange={(e) => {
                          setAnimalData(prev => ({ ...prev, name: e.target.value }))
                          clearError('name')
                        }} 
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Enter animal name"
                        required
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Species <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        value={animalData.species} 
                        onChange={(e) => {
                          setAnimalData(prev => ({ ...prev, species: e.target.value }))
                          clearError('species')
                        }} 
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.species ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="e.g., African Elephant, Bengal Tiger"
                        required
                      />
                      {errors.species && <p className="mt-1 text-sm text-red-600">{errors.species}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sex <span className="text-red-500">*</span>
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="radio" 
                            checked={animalData.sex === 'Male'} 
                            onChange={() => setAnimalData(prev => ({ ...prev, sex: 'Male' }))}
                            className="mr-2 text-emerald-600"
                          />
                          <span className="text-gray-700">Male</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="radio" 
                            checked={animalData.sex === 'Female'} 
                            onChange={() => setAnimalData(prev => ({ ...prev, sex: 'Female' }))}
                            className="mr-2 text-emerald-600"
                          />
                          <span className="text-gray-700">Female</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age (years) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number"
                        value={animalData.age} 
                        onChange={(e) => {
                          setAnimalData(prev => ({ ...prev, age: e.target.value }))
                          clearError('age')
                        }} 
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.age ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="0"
                        min="0"
                        required
                      />
                      {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Microchip ID <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        value={animalData.microchipId} 
                        onChange={(e) => {
                          setAnimalData(prev => ({ ...prev, microchipId: e.target.value }))
                          clearError('microchipId')
                        }} 
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.microchipId ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="e.g., MC123456789"
                        required
                      />
                      {errors.microchipId && <p className="mt-1 text-sm text-red-600">{errors.microchipId}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number"
                        step="0.1"
                        value={animalData.weight} 
                        onChange={(e) => {
                          setAnimalData(prev => ({ ...prev, weight: e.target.value }))
                          clearError('weight')
                        }} 
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.weight ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="0.0"
                        min="0"
                        required
                      />
                      {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Acquisition Date <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="date"
                        value={animalData.acquisitionDate} 
                        onChange={(e) => {
                          setAnimalData(prev => ({ ...prev, acquisitionDate: e.target.value }))
                          clearError('acquisitionDate')
                        }} 
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.acquisitionDate ? 'border-red-300' : 'border-gray-300'}`}
                        required
                      />
                      {errors.acquisitionDate && <p className="mt-1 text-sm text-red-600">{errors.acquisitionDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Acquisition Type</label>
                      <input 
                        type="text"
                        value={animalData.acquisitionType} 
                        onChange={(e) => setAnimalData(prev => ({ ...prev, acquisitionType: e.target.value }))} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g., Birth, Transfer, Rescue, Purchase"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Enclosure Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Enclosure Setup</h3>
                      <p className="text-sm text-gray-600">Configure the animal's living environment</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enclosure Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        value={enclosureData.enclosureName} 
                        onChange={(e) => {
                          setEnclosureData(prev => ({ ...prev, enclosureName: e.target.value }))
                          clearError('enclosureName')
                        }} 
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.enclosureName ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="e.g., African Savanna, Tropical Rainforest"
                        required
                      />
                      {errors.enclosureName && <p className="mt-1 text-sm text-red-600">{errors.enclosureName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enclosure Type <span className="text-red-500">*</span>
                      </label>
                      <select 
                        value={enclosureData.enclosureType} 
                        onChange={(e) => setEnclosureData(prev => ({ ...prev, enclosureType: e.target.value }))} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        <option value="indoor">Indoor</option>
                        <option value="outdoor">Outdoor</option>
                        <option value="mixed">Mixed (Indoor/Outdoor)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Temperature (°C)</label>
                      <input 
                        type="number"
                        value={enclosureData.temperatureMinCelsius} 
                        onChange={(e) => setEnclosureData(prev => ({ ...prev, temperatureMinCelsius: e.target.value }))} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g., 18"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Temperature (°C)</label>
                      <input 
                        type="number"
                        value={enclosureData.temperatureMaxCelsius} 
                        onChange={(e) => setEnclosureData(prev => ({ ...prev, temperatureMaxCelsius: e.target.value }))} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g., 28"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Safety Level <span className="text-red-500">*</span>
                      </label>
                      <select 
                        value={enclosureData.safetyLevel} 
                        onChange={(e) => setEnclosureData(prev => ({ ...prev, safetyLevel: e.target.value }))} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        <option value="restrictedAccess">Restricted Access</option>
                        <option value="quarantine">Quarantine</option>
                        <option value="hospital">Hospital</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Diet Plan Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Diet Planning</h3>
                      <p className="text-sm text-gray-600">Set up nutrition and feeding requirements</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diet Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        value={dietData.dietName} 
                        onChange={(e) => {
                          setDietData(prev => ({ ...prev, dietName: e.target.value }))
                          clearError('dietName')
                        }} 
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.dietName ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="e.g., Herbivore Mix, Carnivore Special"
                        required
                      />
                      {errors.dietName && <p className="mt-1 text-sm text-red-600">{errors.dietName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age Category <span className="text-red-500">*</span>
                      </label>
                      <select 
                        value={dietData.ageCategory} 
                        onChange={(e) => setDietData(prev => ({ ...prev, ageCategory: e.target.value as 'adult' | 'senior' }))} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        <option value="adult">Adult</option>
                        <option value="senior">Senior</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Calories Per Day</label>
                      <input 
                        type="number"
                        value={dietData.totalCaloriesPerDay} 
                        onChange={(e) => setDietData(prev => ({ ...prev, totalCaloriesPerDay: e.target.value }))} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g., 2500"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Feeding Frequency Per Day</label>
                      <input 
                        type="number"
                        value={dietData.feedingFrequencyPerDay} 
                        onChange={(e) => setDietData(prev => ({ ...prev, feedingFrequencyPerDay: e.target.value }))} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g., 3"
                        min="1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Special Conditions</label>
                      <textarea 
                        value={dietData.specialConditions} 
                        onChange={(e) => setDietData(prev => ({ ...prev, specialConditions: e.target.value }))} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        rows={3}
                        placeholder="Any special dietary requirements, allergies, or medical conditions affecting diet..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* Navigation Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    type="button"
                    onClick={() => navigate('/animals')} 
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  {currentStep > 0 && (
                    <button 
                      type="button"
                      onClick={prevStep} 
                      className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  )}
                </div>
                
                <div>
                  {currentStep < steps.length - 1 ? (
                    <button 
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={submit}
                      className={`px-6 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center space-x-2 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`} 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AddAnimal
