import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { useToast } from '../components/toast/ToastContext'
import { onboardApi } from '../services/onboard'
import AnimalInformationStep from '../components/AnimalInformationStep'
import EnclosureInformationStep from '../components/EnclosureInformationStep'
import DietPlanStep from '../components/DietPlanStep'
import ProgressStepper from '../components/ProgressStepper'
import NavigationButtons from '../components/NavigationButtons'

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

interface DietItemData {
  foodItem: string
  quantityInGrams: string
  feedingTime: string
  preparationInstructions: string
  nutritionNotes: string
}

interface DietFormData {
  dietName: string
  ageCategory: 'adult' | 'senior'
  specialConditions: string
  totalCaloriesPerDay: string
  feedingFrequencyPerDay: string
  dietItems: DietItemData[]
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
    enclosureType: '',
    temperatureMinCelsius: '',
    temperatureMaxCelsius: '',
    safetyLevel: ''
  })

  const [dietData, setDietData] = useState<DietFormData>({
    dietName: '',
    ageCategory: 'adult',
    specialConditions: '',
    totalCaloriesPerDay: '',
    feedingFrequencyPerDay: '',
    dietItems: []
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
      if (!enclosureData.enclosureType.trim()) newErrors.enclosureType = 'Enclosure type is required'
      if (!enclosureData.safetyLevel.trim()) newErrors.safetyLevel = 'Safety level is required'
    } else if (currentStep === 2) {
      // Diet validation
      if (!dietData.dietName.trim()) newErrors.dietName = 'Diet name is required'
      if (!dietData.feedingFrequencyPerDay.trim()) newErrors.feedingFrequencyPerDay = 'Feeding frequency is required'
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
          enclosureName: enclosureData.enclosureName, // Map enclosureNumber to enclosureName
          enclosureType: enclosureData.enclosureType,
          temperatureMinCelsius: parseFloat(enclosureData.temperatureMinCelsius) || undefined, // Temporarily using size as temp
          temperatureMaxCelsius: parseFloat(enclosureData.temperatureMaxCelsius) || undefined, // Temporarily using capacity as temp  
          safetyLevel: enclosureData.safetyLevel
        },
        dietPlan: {
          dietName: dietData.dietName,
          ageCategory: dietData.ageCategory,
          specialConditions: dietData.specialConditions || undefined,
          totalCaloriesPerDay: dietData.totalCaloriesPerDay ? parseFloat(dietData.totalCaloriesPerDay) : undefined,
          feedingFrequencyPerDay: dietData.feedingFrequencyPerDay ? parseInt(dietData.feedingFrequencyPerDay) : undefined,
          dietItems: dietData.dietItems.map(item => ({
            foodItem: item.foodItem,
            quantityInGrams: parseFloat(item.quantityInGrams) || 0,
            feedingTime: item.feedingTime,
            preparationInstructions: item.preparationInstructions || undefined,
            nutritionNotes: item.nutritionNotes || undefined
          }))
        }
      }

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
            <ProgressStepper steps={steps} currentStep={currentStep} />

            {/* Form Content */}
            <form onSubmit={(e) => { e.preventDefault(); }} className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {/* Step 1: Animal Information */}
              {currentStep === 0 && (
                <AnimalInformationStep
                  data={animalData}
                  errors={errors}
                  onChange={(data) => setAnimalData(prev => ({ ...prev, ...data }))}
                  clearError={clearError}
                />
              )}

              {/* Step 2: Enclosure Information */}
              {currentStep === 1 && (
                <EnclosureInformationStep
                  data={enclosureData}
                  errors={errors}
                  onChange={(data) => setEnclosureData(prev => ({ ...prev, ...data }))}
                  clearError={clearError}
                />
              )}

              {/* Step 3: Diet Plan Information */}
              {currentStep === 2 && (
                <DietPlanStep
                  data={dietData}
                  errors={errors}
                  onChange={(data) => setDietData(prev => ({ ...prev, ...data }))}
                  clearError={clearError}
                />
              )}
            </form>

            {/* Navigation Buttons */}
            <NavigationButtons
              currentStep={currentStep}
              steps={steps}
              isSubmitting={isSubmitting}
              onBack={prevStep}
              onNext={nextStep}
              onSubmit={submit}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AddAnimal
