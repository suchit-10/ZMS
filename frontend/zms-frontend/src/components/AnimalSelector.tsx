import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { api } from '../lib/http-client'

interface Animal {
  _id: string
  name: string
  species: string
}

interface AnimalSelectorProps {
  selectedAnimalId: string
  onAnimalSelect: (animalId: string) => void
  preSelectedAnimal?: Animal
  disabled?: boolean
}

export const AnimalSelector = ({ 
  selectedAnimalId, 
  onAnimalSelect, 
  preSelectedAnimal,
  disabled = false
}: AnimalSelectorProps) => {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(!preSelectedAnimal && !selectedAnimalId)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!preSelectedAnimal) {
      fetchAnimals()
    }
  }, [preSelectedAnimal])

  useEffect(() => {
    if (preSelectedAnimal) {
      onAnimalSelect(preSelectedAnimal._id)
      setShowSearch(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSelectedAnimal]) // onAnimalSelect is now memoized in parent components

  const fetchAnimals = async () => {
    try {
      setLoading(true)
      const response = await api.get('/v1/animals')
      const data = (response as Record<string, unknown>)?.data || []
      setAnimals(Array.isArray(data) ? data as Animal[] : [])
    } catch (error) {
      console.error('Error fetching animals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAnimals = animals.filter(animal =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.species.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedAnimal = preSelectedAnimal || animals.find(a => a._id === selectedAnimalId)

  if (disabled && selectedAnimal) {
    return (
      <div className="p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-emerald-600 font-medium">
              {selectedAnimal.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{selectedAnimal.name}</div>
            <div className="text-sm text-gray-500">{selectedAnimal.species}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Animal <span className="text-red-500">*</span>
      </label>
      
      {showSearch ? (
        <div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for animal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading animals...</div>
          ) : (
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredAnimals.map((animal) => (
                <button
                  key={animal._id}
                  type="button"
                  onClick={() => {
                    onAnimalSelect(animal._id)
                    setShowSearch(false)
                  }}
                  className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-medium">
                      {animal.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{animal.name}</div>
                    <div className="text-sm text-gray-500">{animal.species}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : selectedAnimal ? (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 font-medium">
                {selectedAnimal.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{selectedAnimal.name}</div>
              <div className="text-sm text-gray-500">{selectedAnimal.species}</div>
            </div>
          </div>
          {!preSelectedAnimal && (
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="text-emerald-600 hover:text-emerald-700 text-sm"
            >
              Change
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default AnimalSelector
