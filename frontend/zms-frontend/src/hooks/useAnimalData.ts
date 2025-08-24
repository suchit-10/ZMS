import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/http-client'
import type { Observation, MedicalRecord, FeedingRecord } from '../types/animalDetails'

// Query keys for consistent invalidation
export const queryKeys = {
  observations: (animalId: string) => ['observations', animalId],
  medicalRecords: (animalId: string) => ['medical-records', animalId],
  feedingRecords: (animalId: string) => ['feeding-records', animalId],
}

// Fetch observations by animal ID
export const useObservations = (animalId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.observations(animalId || ''),
    queryFn: async (): Promise<Observation[]> => {
      if (!animalId) return []
      
      const response = await api.get(`/v1/observations?animal_id=${animalId}`)
      const data = (response as Record<string, unknown>)?.data || []
      return Array.isArray(data) ? data as Observation[] : []
    },
    enabled: !!animalId, // Only run query when animalId is available
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for real-time feel
  })
}

// Fetch medical records by animal ID
export const useMedicalRecords = (animalId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.medicalRecords(animalId || ''),
    queryFn: async (): Promise<MedicalRecord[]> => {
      if (!animalId) return []
      
      const response = await api.get(`/v1/medical-records?animal_id=${animalId}`)
      const data = (response as Record<string, unknown>)?.data || []
      return Array.isArray(data) ? data as MedicalRecord[] : []
    },
    enabled: !!animalId,
    staleTime: 2 * 60 * 1000,
  })
}

// Fetch feeding records by animal ID
export const useFeedingRecords = (animalId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.feedingRecords(animalId || ''),
    queryFn: async (): Promise<FeedingRecord[]> => {
      if (!animalId) return []
      
      const response = await api.get(`/v1/feeding-records?animal_id=${animalId}`)
      const data = (response as Record<string, unknown>)?.data || []
      return Array.isArray(data) ? data as FeedingRecord[] : []
    },
    enabled: !!animalId,
    staleTime: 2 * 60 * 1000,
  })
}