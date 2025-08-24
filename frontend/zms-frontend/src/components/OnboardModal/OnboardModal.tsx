import React, { useState } from 'react'
import { useToast } from '../toast/ToastContext'
import AnimalStep from './steps/AnimalStep'
import EnclosureStep from './steps/EnclosureStep'
import DietStep from './steps/DietStep'
import { onboardApi } from '../../services/onboard'
import OnboardContext from './OnboardContext'

import type { OnboardForm } from './OnboardTypes'

export const OnboardModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<number>(0)
  const [data, setDataState] = useState<Partial<OnboardForm>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { push } = useToast()

  const setData = (patch: Partial<OnboardForm>) => setDataState((s) => ({ ...s, ...patch }))
  const next = () => setStep((s: number) => Math.min(2, s + 1))
  const back = () => setStep((s: number) => Math.max(0, s - 1))

  const submit = async () => {
    setIsSubmitting(true)
    try {
      const file = (data as Partial<OnboardForm> & { animal?: { _file?: File } })?.animal?._file as File | undefined
      if (file) {
        const form = new FormData()
        if (data.animal) form.append('animal', JSON.stringify({ ...data.animal, _file: undefined }))
        if (data.enclosure) form.append('enclosure', JSON.stringify(data.enclosure))
        if (data.dietPlan) form.append('dietPlan', JSON.stringify(data.dietPlan))
        form.append('file', file)
        await onboardApi.create(form)
      } else {
        await onboardApi.create(data)
      }

  // show success toast then close
  push('Animal onboarded successfully', 'success')
  // notify other parts of the app to refresh (Animals list)
  window.dispatchEvent(new CustomEvent('animals:refresh'))
  setTimeout(() => onClose(), 900)
    } catch (err: unknown) {
      console.error('Failed to onboard:', err)
  const msg = err instanceof Error ? err.message : 'Failed to onboard animal'
      push(msg, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { id: 0, title: 'Animal Details' },
    { id: 1, title: 'Enclosure Details' },
    { id: 2, title: 'Diet Plans' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-auto">
        <OnboardContext.Provider value={{ data, setData }}>
          <div className="mb-4 relative">
            <h3 className="text-xl font-semibold">Add New Animal</h3>
            <p className="text-sm text-gray-500">Complete the steps to onboard an animal</p>
            {/* close button top-right */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 p-2 text-2xl leading-none text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100"
              style={{ lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          {/* Stepper: centered track with circles on top and titles underneath */}
          <div className="mb-6">
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-3xl">
                {/* background track */}
                <div className="absolute left-4 right-4 top-6 h-1 bg-gray-200 rounded" />

                {/* progress fill */}
                <div
                  className="absolute left-4 top-6 h-1 bg-emerald-600 rounded"
                  style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                />

                <div className="relative flex justify-between items-start px-4">
                  {steps.map((s, i) => (
                    <div key={s.id} className="flex flex-col items-center text-center cursor-pointer w-1/3" onClick={() => setStep(i)}>
                      <div className={`z-10 -mt-6 w-10 h-10 rounded-full flex items-center justify-center ${step === i ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-700'}`}>
                        {i + 1}
                      </div>
                      <div className="mt-4 text-xs text-gray-600">{s.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {step === 0 && <AnimalStep />}
            {step === 1 && <EnclosureStep />}
            {step === 2 && <DietStep />}
          </div>

          {/* Footer navigation */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
              <button onClick={back} disabled={step === 0} className="px-3 py-2 rounded border disabled:opacity-50">Back</button>
            </div>
            <div>
              {step < steps.length - 1 ? (
                <button onClick={next} className="px-4 py-2 rounded bg-emerald-600 text-white">Next</button>
              ) : (
                <button onClick={submit} className={`px-4 py-2 rounded bg-emerald-600 text-white ${isSubmitting ? 'opacity-60' : ''}`} disabled={isSubmitting}>Finish</button>
              )}
            </div>
          </div>
        </OnboardContext.Provider>
    {/* Toaster rendered by ToastProvider */}
        </div>
      </div>
  )
}

export default OnboardModal
