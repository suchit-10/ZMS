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
import type { 
  AnimalDetailsData, 
  Observation, 
  MedicalRecord, 
  FeedingRecord, 
  ModalType 
} from '../types/animalDetails'

type TabType = 'overview' | 'observations' | 'medical' | 'feeding'

export const AnimalDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [animal, setAnimal] = useState<AnimalDetailsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  
  // Data states
  const [observations, setObservations] = useState<Observation[]>([])
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([])
  const [loadingRecords, setLoadingRecords] = useState(false)

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

  useEffect(() => {
    const fetchRecords = async (type: 'observations' | 'medical' | 'feeding') => {
      if (!id) return
      
      try {
        setLoadingRecords(true)
        let endpoint = ''
        
        switch (type) {
          case 'observations':
            endpoint = `/v1/observations?animal_id=${id}`
            break
          case 'medical':
            endpoint = `/v1/medical-records?animal_id=${id}`
            break
          case 'feeding':
            endpoint = `/v1/feeding-records?animal_id=${id}`
            break
        }

        const response = await api.get(endpoint)
        const data = (response as Record<string, unknown>)?.data || []
        
        switch (type) {
          case 'observations':
            setObservations(Array.isArray(data) ? data as Observation[] : [])
            break
          case 'medical':
            setMedicalRecords(Array.isArray(data) ? data as MedicalRecord[] : [])
            break
          case 'feeding':
            setFeedingRecords(Array.isArray(data) ? data as FeedingRecord[] : [])
            break
        }
      } catch (error) {
        console.error(`Error fetching ${type}:`, error)
      } finally {
        setLoadingRecords(false)
      }
    }

    const loadRecords = async () => {
      if (activeTab !== 'overview' && id) {
        switch (activeTab) {
          case 'observations':
            await fetchRecords('observations')
            break
          case 'medical':
            await fetchRecords('medical')
            break
          case 'feeding':
            await fetchRecords('feeding')
            break
        }
      }
    }
    
    loadRecords()
  }, [activeTab, id])

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
    { id: 'overview', label: 'Overview', icon: Home },
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

          <AnimalOverview animal={animal} formatDate={formatDate} />

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
                <DietPlanOverview animal={animal} />
              )}

              {activeTab === 'observations' && (
                <ObservationsList 
                  animal={animal}
                  observations={observations}
                  loadingRecords={loadingRecords}
                  onAddObservation={() => setActiveModal('observation')}
                  formatDateTime={formatDateTime}
                />
              )}

              {activeTab === 'medical' && (
                <MedicalRecordsList 
                  animal={animal}
                  medicalRecords={medicalRecords}
                  loadingRecords={loadingRecords}
                  onAddMedicalRecord={() => setActiveModal('medical')}
                  formatDate={formatDate}
                />
              )}

              {activeTab === 'feeding' && (
                <FeedingRecordsList 
                  animal={animal}
                  feedingRecords={feedingRecords}
                  loadingRecords={loadingRecords}
                  onAddFeedingRecord={() => setActiveModal('feeding')}
                  formatDateTime={formatDateTime}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddFeedingRecordModal
        isOpen={activeModal === 'feeding'}
        onClose={() => setActiveModal(null)}
        onSuccess={() => {
          // Refresh feeding records
          if (activeTab === 'feeding') {
            setActiveTab('overview')
            setTimeout(() => setActiveTab('feeding'), 100)
          }
        }}
        preSelectedAnimal={animal ? { _id: animal._id, name: animal.name, species: animal.species } : undefined}
      />

      <AddMedicalRecordModal
        isOpen={activeModal === 'medical'}
        onClose={() => setActiveModal(null)}
        onSuccess={() => {
          // Refresh medical records
          if (activeTab === 'medical') {
            setActiveTab('overview')
            setTimeout(() => setActiveTab('medical'), 100)
          }
        }}
        preSelectedAnimal={animal ? { _id: animal._id, name: animal.name, species: animal.species } : undefined}
      />

      <AddObservationModal
        isOpen={activeModal === 'observation'}
        onClose={() => setActiveModal(null)}
        onSuccess={() => {
          // Refresh observations
          if (activeTab === 'observations') {
            setActiveTab('overview')
            setTimeout(() => setActiveTab('observations'), 100)
          }
        }}
        preSelectedAnimal={animal ? { _id: animal._id, name: animal.name, species: animal.species } : undefined}
      />
    </div>
  )
}

export default AnimalDetails
