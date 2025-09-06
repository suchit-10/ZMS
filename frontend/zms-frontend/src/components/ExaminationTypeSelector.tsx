import { Calendar, User, Heart, AlertTriangle, Shield } from 'lucide-react'

const examinationTypes = [
  { 
    value: 'routine', 
    label: 'Routine', 
    icon: Calendar, 
    color: 'emerald',
    description: 'Regular health check-up'
  },
  { 
    value: 'emergency', 
    label: 'Emergency', 
    icon: AlertTriangle, 
    color: 'red',
    description: 'Urgent medical attention needed'
  },
  { 
    value: 'follow_up', 
    label: 'Follow-up', 
    icon: User, 
    color: 'blue',
    description: 'Post-treatment check'
  },
  { 
    value: 'pre_breeding', 
    label: 'Pre-breeding', 
    icon: Heart, 
    color: 'pink',
    description: 'Health assessment before breeding'
  },
  { 
    value: 'quarantine', 
    label: 'Quarantine', 
    icon: Shield, 
    color: 'yellow',
    description: 'Isolation health screening'
  }
]

const getExaminationTypeClasses = (color: string, isSelected: boolean) => {
  if (!isSelected) return 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
  
  const colorMap: Record<string, string> = {
    emerald: 'border-emerald-500 bg-emerald-50 text-emerald-700',
    red: 'border-red-500 bg-red-50 text-red-700',
    blue: 'border-blue-500 bg-blue-50 text-blue-700',
    pink: 'border-pink-500 bg-pink-50 text-pink-700',
    yellow: 'border-yellow-500 bg-yellow-50 text-yellow-700',
  }
  return colorMap[color] || colorMap.emerald
}

const getExaminationTypeIconClasses = (color: string, isSelected: boolean) => {
  if (!isSelected) return 'text-gray-400'
  
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
    pink: 'text-pink-600',
    yellow: 'text-yellow-600',
  }
  return colorMap[color] || colorMap.emerald
}

interface ExaminationTypeSelectorProps {
  selectedType: string
  onTypeSelect: (type: string) => void
}

const ExaminationTypeSelector = ({ selectedType, onTypeSelect }: ExaminationTypeSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Examination Type <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {examinationTypes.map((type) => {
          const Icon = type.icon
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onTypeSelect(type.value)}
              className={`p-3 border-2 rounded-lg text-sm font-medium transition-all hover:shadow-md ${
                selectedType === type.value
                  ? getExaminationTypeClasses(type.color, true)
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
              title={type.description}
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon className={`w-5 h-5 ${getExaminationTypeIconClasses(type.color, selectedType === type.value)}`} />
                <span className="text-center leading-tight">{type.label}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ExaminationTypeSelector
