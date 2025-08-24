import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { api } from "../lib/http-client"
import { ArrowLeft, Calendar, MapPin, Scale, Heart, User, Thermometer, Home } from 'lucide-react'

interface AnimalDetailsData {
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

type TabType = 'overview' | 'observations' | 'medical' | 'feeding'

export const AnimalDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [animal, setAnimal] = useState<AnimalDetailsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/v1/animals/${id}`)
        // Handle the response based on the actual API structure
        const data = (response as Record<string, unknown>)?.data || response
        setAnimal(data as AnimalDetailsData)
      } catch (error) {
        console.error('Error fetching animal details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAnimal()
    }
  }, [id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Heart },
    { id: 'observations', label: 'Observations', icon: User },
    { id: 'medical', label: 'Medical Records', icon: Heart },
    { id: 'feeding', label: 'Feeding Records', icon: Scale },
  ]

  if (loading) {
    return (
      <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(135deg, #e6f4e6 0%, #f2fff4 50%, #dff0df 100%)" }}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 pt-8 md:pt-6 md:ml-52">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600">Loading animal details...</div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!animal) {
    return (
      <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(135deg, #e6f4e6 0%, #f2fff4 50%, #dff0df 100%)" }}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 pt-8 md:pt-6 md:ml-52">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600">Animal not found</div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(135deg, #e6f4e6 0%, #f2fff4 50%, #dff0df 100%)" }}>
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 pt-8 md:pt-6 md:ml-52">
          <div className="mb-6">
            <button 
              onClick={() => navigate('/animals')}
              className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Animals</span>
            </button>
            <Header title={animal.name} subtitle={`${animal.species} • ${animal.sex}`} />
          </div>

          {/* Animal Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Animal Image */}
                <div className="lg:w-64 lg:flex-shrink-0">
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img 
                      src="/images/logo-128.svg" 
                      alt={animal.name} 
                      className="h-32 w-32 object-contain" 
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="text-sm text-gray-500">Microchip ID</div>
                          <div className="font-medium">{animal.microchipId}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="text-sm text-gray-500">Acquisition Date</div>
                          <div className="font-medium">{formatDate(animal.acquisitionDate)}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Thermometer className="w-5 h-5 text-emerald-600" />
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

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-emerald-500 text-emerald-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Diet Plan</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Diet Name</div>
                          <div className="font-medium">{animal.dietPlan.dietName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Age Category</div>
                          <div className="font-medium capitalize">{animal.dietPlan.ageCategory}</div>
                        </div>
                        {animal.dietPlan.totalCaloriesPerDay && (
                          <div>
                            <div className="text-sm text-gray-500">Daily Calories</div>
                            <div className="font-medium">{animal.dietPlan.totalCaloriesPerDay} kcal</div>
                          </div>
                        )}
                        {animal.dietPlan.feedingFrequencyPerDay && (
                          <div>
                            <div className="text-sm text-gray-500">Feeding Frequency</div>
                            <div className="font-medium">{animal.dietPlan.feedingFrequencyPerDay} times/day</div>
                          </div>
                        )}
                      </div>
                      {animal.dietPlan.specialConditions && (
                        <div>
                          <div className="text-sm text-gray-500">Special Conditions</div>
                          <div className="font-medium">{animal.dietPlan.specialConditions}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {animal.distinguishingMarks && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Distinguishing Marks</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p>{animal.distinguishingMarks}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'observations' && (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <User className="w-12 h-12 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Observations</h3>
                  <p className="text-gray-600 mb-6">Track behavioral and health observations for {animal.name}</p>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Add Observation
                  </button>
                </div>
              )}

              {activeTab === 'medical' && (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Medical Records</h3>
                  <p className="text-gray-600 mb-6">Manage medical history and health records for {animal.name}</p>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Add Medical Record
                  </button>
                </div>
              )}

              {activeTab === 'feeding' && (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <Scale className="w-12 h-12 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Feeding Records</h3>
                  <p className="text-gray-600 mb-6">Track feeding schedules and nutrition for {animal.name}</p>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Add Feeding Record
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AnimalDetails
