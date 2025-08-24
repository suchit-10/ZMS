import React, { useState } from 'react'
import { useOnboard } from '../OnboardContext'

const EnclosureStep: React.FC = () => {
  const { data, setData } = useOnboard()
  const [local, setLocal] = useState(() => ({
    enclosureName: data.enclosure?.enclosureName || '',
    enclosureType: data.enclosure?.enclosureType || '',
    temperatureMinCelsius: data.enclosure?.temperatureMinCelsius || '',
    temperatureMaxCelsius: data.enclosure?.temperatureMaxCelsius || '',
    safetyLevel: data.enclosure?.safetyLevel || '',
  }))

  // auto-sync to context whenever local changes
  React.useEffect(() => {
    setData({ enclosure: local })
  }, [local, setData])

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Enclosure Name</label>
          <div className="flex-1">
          <input value={local.enclosureName} onChange={(e) => setLocal((s) => ({ ...s, enclosureName: e.target.value }))} className="w-full max-w-lg mt-1 px-3 py-2 border rounded" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Enclosure Type</label>
        <div className="flex-1">
          <select value={local.enclosureType} onChange={(e) => setLocal((s) => ({ ...s, enclosureType: e.target.value }))} className="w-full max-w-lg mt-1 px-3 py-2 border rounded">
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
            <option value="mixed">Mixed</option>
            <option value="aquatic">Aquatic</option>
            <option value="aviary">Aviary</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Temperature Min (°C)</label>
              <div className="flex-1">
              <input value={local.temperatureMinCelsius} onChange={(e) => setLocal((s) => ({ ...s, temperatureMinCelsius: e.target.value }))} className="w-full max-w-sm mt-1 px-3 py-2 border rounded" />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Temperature Max (°C)</label>
              <div className="flex-1">
              <input value={local.temperatureMaxCelsius} onChange={(e) => setLocal((s) => ({ ...s, temperatureMaxCelsius: e.target.value }))} className="w-full max-w-sm mt-1 px-3 py-2 border rounded" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Safety Level</label>
          <div className="flex-1">
            <select value={local.safetyLevel} onChange={(e) => setLocal((s) => ({ ...s, safetyLevel: e.target.value }))} className="w-full max-w-lg mt-1 px-3 py-2 border rounded">
              <option value="public_viewing">Public Viewing</option>
              <option value="restricted_access">Restricted Access</option>
              <option value="quarantine">Quarantine</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnclosureStep
