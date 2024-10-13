"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { supabase } from '@/lib/supabase'
import { usePatient } from '@/contexts/PatientContext'

export default function RxPage() {
  const { selectedPatient } = usePatient()
  const [medication, setMedication] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [prescriptions, setPrescriptions] = useState([])

  useEffect(() => {
    if (selectedPatient) {
      fetchPrescriptions(selectedPatient.id)
    }
  }, [selectedPatient])

  const fetchPrescriptions = async (patientId: string) => {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId)
    
    if (error) {
      console.error('Error fetching prescriptions:', error)
    } else {
      setPrescriptions(data || [])
    }
  }

  const handleAddPrescription = async () => {
    if (!selectedPatient) return

    const { data, error } = await supabase
      .from('prescriptions')
      .insert([{ patient_id: selectedPatient.id, medication, dosage, frequency, status: 'active' }])
    
    if (error) {
      console.error('Error adding prescription:', error)
    } else {
      console.log('Prescription added successfully:', data)
      setMedication('')
      setDosage('')
      setFrequency('')
      fetchPrescriptions(selectedPatient.id)
    }
  }

  const handleDiscontinuePrescription = async (id: string) => {
    const { data, error } = await supabase
      .from('prescriptions')
      .update({ status: 'discontinued' })
      .eq('id', id)
    
    if (error) {
      console.error('Error discontinuing prescription:', error)
    } else {
      console.log('Prescription discontinued successfully:', data)
      fetchPrescriptions(selectedPatient.id)
    }
  }

  if (!selectedPatient) {
    return <div>Please select a patient from the sidebar.</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Prescriptions (Rx) for {selectedPatient.name}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Prescription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medication">Medication</Label>
              <Input id="medication" value={medication} onChange={(e) => setMedication(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input id="dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Input id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} />
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddPrescription}>Add Prescription</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell>{prescription.medication}</TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell>{prescription.frequency}</TableCell>
                  <TableCell>{prescription.status}</TableCell>
                  <TableCell>
                    {prescription.status === 'active' && (
                      <Button variant="destructive" onClick={() => handleDiscontinuePrescription(prescription.id)}>
                        Discontinue
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}