import React from 'react'
import { useNavigate } from 'react-router-dom'

export interface Animal {
  id?: string
  name: string
  species: string
  age: string
  gender: 'Male' | 'Female' | string
  img?: string
}

const AnimalCard: React.FC<{ animal: Animal }> = ({ animal }) => {
  const navigate = useNavigate()
  const statusColor = animal.gender === 'Male' ? 'text-blue-600' : animal.gender === 'Female' ? 'text-pink-600' : 'text-gray-500'

  const handleClick = () => {
    if (animal.id) {
      navigate(`/animals/${animal.id}`)
    }
  }

  return (
    <article 
      className="bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="h-44 bg-gray-100 flex items-center justify-center">
        <img src="/images/logo-128.svg" alt={animal.name} className="h-full w-full object-contain p-4" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{animal.name}</h3>
        <p className="text-sm text-gray-500">{animal.species}</p>
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <span>Age: {animal.age}</span>
          <span className={`flex items-center space-x-2 ${statusColor}`}>
            <svg width="8" height="8" viewBox="0 0 8 8" className="inline-block" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="4" r="4"/></svg>
            <span className="text-sm">{animal.gender}</span>
          </span>
        </div>
      </div>
    </article>
  )
}

export default AnimalCard
