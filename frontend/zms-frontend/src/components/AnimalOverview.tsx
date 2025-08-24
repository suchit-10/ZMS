import { 
  Calendar, MapPin, Scale, User, Thermometer, Home, Shield 
} from 'lucide-react'
import type { AnimalDetailsData } from '../types/animalDetails'

interface AnimalOverviewProps {
  animal: AnimalDetailsData
  formatDate: (date: string) => string
}

const AnimalOverview = ({ animal, formatDate }: AnimalOverviewProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden h-[35%] ">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Animal Image */}
          <div className="lg:w-64 lg:flex-shrink-0">
            <div className="h-[100%] bg-gray-100 rounded-lg flex items-center justify-center">
              <img 
                src="/images/logo-128.svg" 
                alt={animal.name} 
                className="h-20 w-20 object-contain" 
              />
            </div>
            <div className="mt-4 text-center">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                animal.sex === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
              }`}>
                {animal.sex}
              </span>
            </div>
          </div>

          {/* Animal Details */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-sm text-gray-500">Age</div>
                    <div className="font-medium">{animal.age} years</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-sm text-gray-500">Weight</div>
                    <div className="font-medium">{animal.weight} kg</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-sm text-gray-500">Microchip ID</div>
                    <div className="font-medium">{animal.microchipId}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-sm text-gray-500">Habitat</div>
                    <div className="font-medium">{animal.enclosure.enclosureName}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Home className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-sm text-gray-500">Enclosure Type</div>
                    <div className="font-medium capitalize">{animal.enclosure.enclosureType}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-sm text-gray-500">Acquisition Date</div>
                    <div className="font-medium">{formatDate(animal.acquisitionDate)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-sm text-gray-500">Safety Level</div>
                    <div className="font-medium capitalize">{animal.enclosure.safetyLevel}</div>
                  </div>
                </div>

                {animal.enclosure.temperatureMinCelsius && animal.enclosure.temperatureMaxCelsius && (
                  <div className="flex items-center space-x-3">
                    <Thermometer className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-sm text-gray-500">Temperature Range</div>
                      <div className="font-medium">
                        {animal.enclosure.temperatureMinCelsius}°C - {animal.enclosure.temperatureMaxCelsius}°C
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimalOverview
