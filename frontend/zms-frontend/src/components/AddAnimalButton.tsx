import React from 'react'

const AddAnimalButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm shadow-md"
      style={{ boxShadow: '0 2px 6px rgba(16, 185, 129, 0.12)' }}
    >
      Add Animal
    </button>
  )
}

export default AddAnimalButton
