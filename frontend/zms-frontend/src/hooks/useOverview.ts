import { useQuery } from "@tanstack/react-query"
import api from "../lib/http-client"


// ==========================
// Types that match the API
// ==========================
interface ActivityOnboardedItem {
  name: string
  species: string
  microchipId: string
  onboardedAt: string // ISO
}

interface FeedingRecordItem {
  animalName: string
  animalSpecies: string
  dietItem: string
  quantityGiven: number // grams
  appetiteRating: string
  staffName: string
  createdAt: string // ISO
}

interface TodayActivities {
  animalsOnboarded: { count: number; details: ActivityOnboardedItem[] }
  medicalRecords: { count: number; details: any[] }
  observations: { count: number; details: any[] }
  feedingRecords: { count: number; details: FeedingRecordItem[] }
  newUsers: { count: number; details: any[] }
}

export interface RealtimeAnalyticsResponse {
  message: string
  data: {
    animals: number
    users: number
    medicalRecords: number
    observations: number
    feedingRecords: number
  }
  todayActivities: TodayActivities
  generatedAt: string // ISO
}

export const useOverview = () => {
  return useQuery({
    queryKey: ['overview'],
    queryFn: async (): Promise<RealtimeAnalyticsResponse> => {
      
      const response = await api.get<RealtimeAnalyticsResponse>(`/v1/analytics/overview`)
      return response
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for real-time feel
  })
}