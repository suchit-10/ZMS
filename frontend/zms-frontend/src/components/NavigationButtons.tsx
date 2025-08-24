interface Step {
  id: number
  title: string
  description: string
}

interface NavigationButtonsProps {
  currentStep: number
  steps: Step[]
  isSubmitting: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
}

const NavigationButtons = ({ 
  currentStep, 
  steps, 
  isSubmitting, 
  onBack, 
  onNext, 
  onSubmit 
}: NavigationButtonsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {currentStep > 0 && (
            <button 
              type="button"
              onClick={onBack} 
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
              onClick={onNext}
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
              onClick={onSubmit}
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
                  <span>Complete Registration</span>
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
  )
}

export default NavigationButtons
