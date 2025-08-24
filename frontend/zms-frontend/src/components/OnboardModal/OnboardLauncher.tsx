import React, { useState } from 'react'
import AddAnimalButton from '../AddAnimalButton'
import OnboardModal from './OnboardModal'

const OnboardLauncher: React.FC = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <AddAnimalButton onClick={() => setOpen(true)} />
      {open && <OnboardModal onClose={() => setOpen(false)} />}
    </>
  )
}

export default OnboardLauncher
