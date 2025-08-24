import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import AnimalOverview from "../components/AnimalOverview"
import DietPlanOverview from "../components/DietPlanOverview"
import ObservationsList from "../components/ObservationsList"
import MedicalRecordsList from "../components/MedicalRecordsList"
import FeedingRecordsList from "../components/FeedingRecordsList"
import AddFeedingRecordModal from "../components/AddFeedingRecordModal"
import AddMedicalRecordModal from "../components/AddMedicalRecordModal"
import AddObservationModal from "../components/AddObservationModal"
import { api } from "../lib/http-client"
import { ArrowLeft, Eye, Stethoscope, Utensils, Home } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useObservations, useMedicalRecords, useFeedingRecords, queryKeys } from '../hooks/useAnimalData'
import type { 
  AnimalDetailsData, 
  ModalType 
} from '../types/animalDetails'

type TabType = 'overview' | 'observations' | 'medical' | 'feeding'

export const AnimalDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [animal, setAnimal] = useState<AnimalDetailsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('observations')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  
  // React Query hooks for data fetching
  const { data: observations = [], isLoading: isLoadingObservations } = useObservations(id)
  const { data: medicalRecords = [], isLoading: isLoadingMedical } = useMedicalRecords(id)
  const { data: feedingRecords = [], isLoading: isLoadingFeeding } = useFeedingRecords(id)

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/v1/animals/${id}`)
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tabs = [
    { id: 'observations', label: 'Observations', icon: Eye },
    { id: 'medical', label: 'Medical Records', icon: Stethoscope },
    { id: 'feeding', label: 'Feeding Records', icon: Utensils },
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
      <div className="flex h-screen">
        <Sidebar />
        
        <main className="flex-1 p-6 pt-8 md:pt-6 md:ml-52 flex flex-col overflow-hidden">
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

          <AnimalOverview animal={animal} formatDate={formatDate} />

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border flex-1 flex flex-col min-h-0">
            <div className="border-b border-gray-200 flex-shrink-0">
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

            <div className="flex-1 flex flex-col min-h-0 p-6">
              {activeTab === 'observations' && (
                <ObservationsList 
                  animal={animal}
                  observations={observations}
                  loadingRecords={isLoadingObservations}
                  onAddObservation={() => setActiveModal('observation')}
                  formatDateTime={formatDateTime}
                />
              )}

              {activeTab === 'medical' && (
                <MedicalRecordsList 
                  animal={animal}
                  medicalRecords={medicalRecords}
                  loadingRecords={isLoadingMedical}
                  onAddMedicalRecord={() => setActiveModal('medical')}
                  formatDate={formatDate}
                />
              )}

              {activeTab === 'feeding' && (
                <FeedingRecordsList 
                  animal={animal}
                  feedingRecords={feedingRecords}
                  loadingRecords={isLoadingFeeding}
                  onAddFeedingRecord={() => setActiveModal('feeding')}
                  formatDateTime={formatDateTime}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals - Only render when we have animal data */}
      {animal && (
        <>
          <AddFeedingRecordModal
            isOpen={activeModal === 'feeding'}
            onClose={() => setActiveModal(null)}
            onSuccess={() => {
              // Invalidate feeding records query to trigger automatic refresh
              if (id) {
                queryClient.invalidateQueries({ queryKey: queryKeys.feedingRecords(id) })
              }
            }}
            preSelectedAnimal={{ _id: animal._id, name: animal.name, species: animal.species }}
          />

          <AddMedicalRecordModal
            isOpen={activeModal === 'medical'}
            onClose={() => setActiveModal(null)}
            onSuccess={() => {
              // Invalidate medical records query to trigger automatic refresh
              if (id) {
                queryClient.invalidateQueries({ queryKey: queryKeys.medicalRecords(id) })
              }
            }}
            preSelectedAnimal={{ _id: animal._id, name: animal.name, species: animal.species }}
          />

          <AddObservationModal
            isOpen={activeModal === 'observation'}
            onClose={() => setActiveModal(null)}
            onSuccess={() => {
              // Invalidate observations query to trigger automatic refresh
              if (id) {
                queryClient.invalidateQueries({ queryKey: queryKeys.observations(id) })
              }
            }}
            preSelectedAnimal={{ _id: animal._id, name: animal.name, species: animal.species }}
          />
        </>
      )}
    </div>
  )
}

export default AnimalDetails
