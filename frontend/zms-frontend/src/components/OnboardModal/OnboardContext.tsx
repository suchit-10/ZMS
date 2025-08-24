import { createContext, useContext } from 'react'
import type { OnboardForm } from './OnboardTypes'

const OnboardContext = createContext<{
  data: Partial<OnboardForm>
  setData: (patch: Partial<OnboardForm>) => void
} | null>(null)

export const useOnboard = () => {
  const ctx = useContext(OnboardContext)
  if (!ctx) throw new Error('useOnboard must be used inside OnboardProvider')
  return ctx
}

export default OnboardContext
