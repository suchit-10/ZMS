import React from 'react'

const FilterChips: React.FC<{ options: string[]; value: string; onChange: (v: string) => void }> = ({ options, value, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      {options.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 py-1 rounded-full text-sm ${value === c ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}

export default FilterChips
