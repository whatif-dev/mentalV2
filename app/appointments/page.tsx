"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { supabase } from '@/lib/supabase'
import { usePatient } from '@/contexts/PatientContext'

interface Appointment {
  id: string;
  date: string;
  time: string;
}

export default function AppointmentsPage() {
  const { selectedPatient } = usePatient()
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    if (selectedPatient) {
      fetchAppointments(selectedPatient.id)
    }
  }, [selectedPatient])

  const fetchAppointments = async (patientId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: true })
      .order('time', { ascending: true })
    
    if (error) {
      console.error('Error fetching appointments:', error)
    } else {
      setAppointments(data || [])
    }
  }

  const handleScheduleAppointment = async () => {
    if (!selectedPatient) return

    const { data, error } = await supabase
      .from('appointments')
      .insert([{ patient_id: selectedPatient.id, date: appointmentDate, time: appointmentTime }])
    
    if (error) {
      console.error('Error scheduling appointment:', error)
    } else {
      console.log('Appointment scheduled successfully:', data)
      setAppointmentDate('')
      setAppointmentTime('')
      await fetchAppointments(selectedPatient.id)
    }
  }

  if (!selectedPatient) {
    return <div>Please select a patient from the sidebar.</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Appointments for {selectedPatient.name}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Schedule New Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointmentDate" className="text-right">
                Date
              </Label>
              <Input
                id="appointmentDate"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointmentTime" className="text-right">
                Time
              </Label>
              <Input
                id="appointmentTime"
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleScheduleAppointment}>Schedule Appointment</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No appointments scheduled for this patient.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}