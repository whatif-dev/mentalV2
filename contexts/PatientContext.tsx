"use client"

import React, { createContext, useState, useContext, ReactNode } from 'react'

interface PatientContextType {
  selectedPatient: { id: string; name: string } | null
  setSelectedPatient: (patient: { id: string; name: string } | null) => void
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

export function PatientProvider({ children }: { children: ReactNode }) {
  const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null)

  return (
    <PatientContext.Provider value={{ selectedPatient, setSelectedPatient }}>
      {children}
    </PatientContext.Provider>
  )
}

export function usePatient() {
  const context = useContext(PatientContext)
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider')
  }
  return context
}