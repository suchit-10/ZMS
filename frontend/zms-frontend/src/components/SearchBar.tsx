import React from 'react'

const SearchBar: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ value, onChange, placeholder }) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Search...'}
      className="w-full max-w-xl px-4 py-2 rounded-lg border border-gray-200 shadow-sm bg-white"
    />
  )
}

export default SearchBar
