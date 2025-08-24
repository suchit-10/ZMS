import React, { useState } from 'react'
import { useOnboard } from '../OnboardContext'
import { useToast } from '../../toast/ToastContext'

const AnimalStep: React.FC = () => {
  const { data, setData } = useOnboard()
  const [local, setLocal] = useState(() => ({
    name: data.animal?.name || '',
    species: data.animal?.species || '',
    sex: data.animal?.sex || 'Male',
    age: data.animal?.age || '',
    acquisitionDate: data.animal?.acquisitionDate || '',
    acquisitionType: data.animal?.acquisitionType || '',
  }))

  const [image, setImage] = useState<string | null>(data.animal?.image || null)
  const [file, setFile] = useState<File | null>(null)

  const { push } = useToast()

  const onFile = (f?: File) => {
    if (!f) return
    // client-side validation
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    const maxBytes = 2 * 1024 * 1024 // 2MB
    if (!allowed.includes(f.type)) {
      push('Invalid file type. Allowed: JPG, PNG, WEBP', 'error')
      return
    }
    if (f.size > maxBytes) {
      push('File too large. Max 2MB allowed.', 'error')
      return
    }

    setFile(f)
    const reader = new FileReader()
    reader.onload = () => setImage(String(reader.result))
    reader.readAsDataURL(f)
  }

  React.useEffect(() => {
    setData({ animal: { ...local, image: image ?? undefined, _file: file ?? undefined } })
  }, [local, image, file, setData])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Name</label>
          <div className="flex-1">
            <input value={local.name} onChange={(e) => setLocal((s) => ({ ...s, name: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Species</label>
          <div className="flex-1">
            <input value={local.species} onChange={(e) => setLocal((s) => ({ ...s, species: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Sex</label>
          <div className="flex-1 flex items-center space-x-6">
            <label className="flex items-center"><input type="radio" checked={local.sex === 'Male'} onChange={() => setLocal((s) => ({ ...s, sex: 'Male' }))} /> <span className="ml-2">Male</span></label>
            <label className="flex items-center"><input type="radio" checked={local.sex === 'Female'} onChange={() => setLocal((s) => ({ ...s, sex: 'Female' }))} /> <span className="ml-2">Female</span></label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Age</label>
          <div className="flex-1">
            <input value={local.age} onChange={(e) => setLocal((s) => ({ ...s, age: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <label className="md:w-40 text-sm font-medium text-gray-700 md:text-right mb-2 md:mb-0">Acquisition Date</label>
          <div className="flex-1">
            <input type="date" value={local.acquisitionDate} onChange={(e) => setLocal((s) => ({ ...s, acquisitionDate: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded" />
          </div>
        </div>

        {/* auto-synced to context */}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Photo</label>
        <div className="mt-2 border-dashed border-2 border-gray-200 rounded h-56 flex items-center justify-center bg-white">
          {image ? <img src={image} className="h-full w-full object-contain" /> : <span className="text-gray-400">Drag & drop or upload</span>}
        </div>
        <div className="mt-3 flex items-center space-x-3">
          <label className="inline-block px-4 py-2 bg-white border rounded cursor-pointer text-sm">
            Choose File
            <input className="hidden" type="file" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
          <span className="text-sm text-gray-600">{file ? file.name : 'No file chosen'}</span>
        </div>
      </div>
    </div>
  )
}

export default AnimalStep
