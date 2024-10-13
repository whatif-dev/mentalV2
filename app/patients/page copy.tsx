// "use client"

// import { useState, useEffect } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { supabase } from '@/lib/supabase'
// import { usePatient } from '@/contexts/PatientContext'

// interface Appointment {
//   id: string;
//   date: string;
//   time: string;
// }

// export default function BillingPage() {
//   const { selectedPatient } = usePatient()
//   const [patientInfo, setPatientInfo] = useState({
//     fullName: '',
//     dob: '',
//     gender: '',
//     phone: '',
//     email: '',
//     address: '',
//     city: '',
//     state: '',
//     zip: '',
//   })

//   const [responsibleParty, setResponsibleParty] = useState({
//     insuranceType: '',
//     fullName: '',
//     dob: '',
//     phone: '',
//     email: '',
//   })

//   const [insuranceInfo, setInsuranceInfo] = useState({
//     carrierName: '',
//     groupNumber: '',
//     phone: '',
//     subscriberRelationship: '',
//   })

//   const [editingPatientInfo, setEditingPatientInfo] = useState(false)
//   const [editingResponsibleParty, setEditingResponsibleParty] = useState(false)
//   const [editingInsuranceInfo, setEditingInsuranceInfo] = useState(false)

//   // Appointment-related state
//   const [appointmentDate, setAppointmentDate] = useState('')
//   const [appointmentTime, setAppointmentTime] = useState('')
//   const [appointments, setAppointments] = useState<Appointment[]>([])

//   useEffect(() => {
//     if (selectedPatient) {
//       fetchPatientDetails(selectedPatient.id)
//       fetchAppointments(selectedPatient.id)
//     }
//   }, [selectedPatient])

//   const fetchPatientDetails = async (patientId: string) => {
//     const { data: patientData, error: patientError } = await supabase
//       .from('patients')
//       .select('*')
//       .eq('id', patientId)
//       .single()
    
//     if (patientError) {
//       console.error('Error fetching patient details:', patientError)
//     } else if (patientData) {
//       setPatientInfo({
//         fullName: patientData.name,
//         dob: patientData.dob || '',
//         gender: patientData.gender || '',
//         phone: patientData.phone || '',
//         email: patientData.email || '',
//         address: patientData.address || '',
//         city: patientData.city || '',
//         state: patientData.state || '',
//         zip: patientData.zip || '',
//       })
//     }

//     const { data: billingData, error: billingError } = await supabase
//       .from('billing')
//       .select('*')
//       .eq('patient_id', patientId)
//       .single()
    
//     if (billingError) {
//       console.error('Error fetching billing details:', billingError)
//     } else if (billingData) {
//       setResponsibleParty(billingData.responsible_party || {})
//       setInsuranceInfo(billingData.insurance_info || {})
//     } else {
//       // Reset billing information if no data is found
//       setResponsibleParty({
//         insuranceType: '',
//         fullName: '',
//         dob: '',
//         phone: '',
//         email: '',
//       })
//       setInsuranceInfo({
//         carrierName: '',
//         groupNumber: '',
//         phone: '',
//         subscriberRelationship: '',
//       })
//     }
//   }

//   const fetchAppointments = async (patientId: string) => {
//     const { data, error } = await supabase
//       .from('appointments')
//       .select('*')
//       .eq('patient_id', patientId)
//       .order('date', { ascending: true })
//       .order('time', { ascending: true })
    
//     if (error) {
//       console.error('Error fetching appointments:', error)
//     } else {
//       setAppointments(data || [])
//     }
//   }

//   const handleInputChange = (section: string, field: string, value: string) => {
//     switch (section) {
//       case 'patientInfo':
//         setPatientInfo(prev => ({ ...prev, [field]: value }))
//         break
//       case 'responsibleParty':
//         setResponsibleParty(prev => ({ ...prev, [field]: value }))
//         break
//       case 'insuranceInfo':
//         setInsuranceInfo(prev => ({ ...prev, [field]: value }))
//         break
//     }
//   }

//   const handleSave = async (section: string) => {
//     if (!selectedPatient) return

//     switch (section) {
//       case 'patientInfo':
//         await updatePatientInfo()
//         setEditingPatientInfo(false)
//         break
//       case 'responsibleParty':
//       case 'insuranceInfo':
//         await updateBillingInfo()
//         setEditingResponsibleParty(false)
//         setEditingInsuranceInfo(false)
//         break
//     }
//   }

//   const updatePatientInfo = async () => {
//     if (!selectedPatient) return

//     const { error } = await supabase
//       .from('patients')
//       .update({
//         name: patientInfo.fullName,
//         dob: patientInfo.dob,
//         gender: patientInfo.gender,
//         phone: patientInfo.phone,
//         email: patientInfo.email,
//         address: patientInfo.address,
//         city: patientInfo.city,
//         state: patientInfo.state,
//         zip: patientInfo.zip,
//       })
//       .eq('id', selectedPatient.id)
    
//     if (error) {
//       console.error('Error updating patient information:', error)
//     } else {
//       console.log('Patient information updated successfully')
//     }
//   }

//   const updateBillingInfo = async () => {
//     if (!selectedPatient) return

//     const { error } = await supabase
//       .from('billing')
//       .upsert({
//         patient_id: selectedPatient.id,
//         responsible_party: responsibleParty,
//         insurance_info: insuranceInfo,
//       })
    
//     if (error) {
//       console.error('Error updating billing information:', error)
//     } else {
//       console.log('Billing information updated successfully')
//     }
//   }

//   const handleScheduleAppointment = async () => {
//     if (!selectedPatient) return

//     const { data, error } = await supabase
//       .from('appointments')
//       .insert([{ patient_id: selectedPatient.id, date: appointmentDate, time: appointmentTime }])
    
//     if (error) {
//       console.error('Error scheduling appointment:', error)
//     } else {
//       console.log('Appointment scheduled successfully:', data)
//       setAppointmentDate('')
//       setAppointmentTime('')
//       await fetchAppointments(selectedPatient.id)
//     }
//   }

//   if (!selectedPatient) {
//     return <div>Please select a patient from the sidebar.</div>
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold">Billing and Appointments for {selectedPatient.name}</h1>
      
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex justify-between items-center">
//             Patient Information
//             <Button onClick={() => setEditingPatientInfo(!editingPatientInfo)}>
//               {editingPatientInfo ? 'Cancel' : 'Edit'}
//             </Button>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 gap-4">
//             {Object.entries(patientInfo).map(([key, value]) => (
//               <div key={key} className="space-y-2">
//                 <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
//                 <Input
//                   id={key}
//                   value={value}
//                   onChange={(e) => handleInputChange('patientInfo', key, e.target.value)}
//                   disabled={!editingPatientInfo}
//                 />
//               </div>
//             ))}
//           </div>
//           {editingPatientInfo && (
//             <Button className="mt-4" onClick={() => handleSave('patientInfo')}>Save Patient Info</Button>
//           )}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex justify-between items-center">
//             Responsible Party
//             <Button onClick={() => setEditingResponsibleParty(!editingResponsibleParty)}>
//               {editingResponsibleParty ? 'Cancel' : 'Edit'}
//             </Button>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 gap-4">
//             {['insuranceType', 'fullName', 'dob', 'phone', 'email'].map((key) => (
//               <div key={key} className="space-y-2">
//                 <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
//                 {key === 'insuranceType' ? (
//                   <Select
//                     value={responsibleParty[key as keyof typeof responsibleParty]}
//                     onValueChange={(newValue) => handleInputChange('responsibleParty', key, newValue)}
//                     disabled={!editingResponsibleParty}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select insurance type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Cash">Cash</SelectItem>
//                       <SelectItem value="PPO">PPO</SelectItem>
//                       <SelectItem value="HMO">HMO</SelectItem>
//                       <SelectItem value="State">State</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 ) : (
//                   <Input
//                     id={key}
//                     value={responsibleParty[key as keyof typeof responsibleParty]}
//                     onChange={(e) => handleInputChange('responsibleParty', key, e.target.value)}
//                     disabled={!editingResponsibleParty}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//           {editingResponsibleParty && (
//             <Button className="mt-4" onClick={() => handleSave('responsibleParty')}>Save Responsible Party Info</Button>
//           )}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex justify-between items-center">
//             Insurance Information
//             <Button onClick={() => setEditingInsuranceInfo(!editingInsuranceInfo)}>
//               {editingInsuranceInfo ? 'Cancel' : 'Edit'}
//             </Button>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 gap-4">
//             {Object.entries(insuranceInfo).map(([key, value]) => (
//               <div key={key} className="space-y-2">
//                 <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
//                 {key === 'subscriberRelationship' ? (
//                   <Select
//                     value={value}
//                     onValueChange={(newValue) => handleInputChange('insuranceInfo', key, newValue)}
//                     disabled={!editingInsuranceInfo}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select relationship" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Father">Father</SelectItem>
//                       <SelectItem value="Mother">Mother</SelectItem>
//                       <SelectItem value="Guardian">Guardian</SelectItem>
//                       <SelectItem value="Self">Self</SelectItem>
//                       <SelectItem value="Other">Other</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 ) : (
//                   <Input
//                     id={key}
//                     value={value}
//                     onChange={(e) => handleInputChange('insuranceInfo', key, e.target.value)}
//                     disabled={!editingInsuranceInfo}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//           {editingInsuranceInfo && (
//             <Button className="mt-4" onClick={() => handleSave('insuranceInfo')}>Save Insurance Info</Button>
//           )}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Schedule New Appointment</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="appointmentDate" className="text-right">
//                 Date
//               </Label>
//               <Input
//                 id="appointmentDate"
//                 type="date"
//                 value={appointmentDate}
//                 onChange={(e) => setAppointmentDate(e.target.value)}
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="appointmentTime" className="text-right">
//                 Time
//               </Label>
//               <Input
//                 id="appointmentTime"
//                 type="time"
//                 value={appointmentTime}
//                 onChange={(e) => setAppointmentTime(e.target.value)}
//                 className="col-span-3"
//               />
//             </div>
//             <div className="flex justify-end">
//               <Button onClick={handleScheduleAppointment}>Schedule Appointment</Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Appointments</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {appointments.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Time</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {appointments.map((appointment) => (
//                   <TableRow key={appointment.id}>
//                     <TableCell>{appointment.date}</TableCell>
//                     <TableCell>{appointment.time}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <p>No appointments scheduled for this patient.</p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }