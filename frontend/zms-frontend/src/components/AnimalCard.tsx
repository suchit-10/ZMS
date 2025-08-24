import React from 'react'

export interface Animal {
  id?: string
  name: string
  species: string
  age: string
  health: 'Excellent' | 'Good' | 'Fair' | string
  img?: string
}

const AnimalCard: React.FC<{ animal: Animal }> = ({ animal }) => {
  const statusColor = animal.health === 'Excellent' ? 'text-emerald-600' : animal.health === 'Good' ? 'text-emerald-500' : 'text-amber-500'

  return (
    <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="h-44 bg-gray-100 flex items-center justify-center">
        {animal.img ? (
          <img src={animal.img} alt={animal.name} className="h-full w-full object-cover" />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{animal.name}</h3>
        <p className="text-sm text-gray-500">{animal.species}</p>
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <span>Age: {animal.age}</span>
          <span className={`flex items-center space-x-2 ${statusColor}`}>
            <svg width="8" height="8" viewBox="0 0 8 8" className="inline-block" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="4" r="4"/></svg>
            <span className="text-sm">{animal.health}</span>
          </span>
        </div>
      </div>
    </article>
  )
}

export default AnimalCard
