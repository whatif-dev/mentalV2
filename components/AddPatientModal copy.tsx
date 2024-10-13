// "use client"

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import { supabase } from '@/lib/supabase'
// import { usePatient } from '@/contexts/PatientContext'

// interface AddPatientModalProps {
//   isOpen: boolean
//   onClose: () => void
// }

// export default function AddPatientModal({ isOpen, onClose }: AddPatientModalProps) {
//   const [name, setName] = useState('')
//   const [dob, setDob] = useState('')
//   const [gender, setGender] = useState('')
//   const [phone, setPhone] = useState('')
//   const [email, setEmail] = useState('')
//   const { setSelectedPatient } = usePatient()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     const { data, error } = await supabase
//       .from('patients')
//       .insert([{ name, dob, gender, phone, email }])
//       .select()

//     if (error) {
//       console.error('Error adding new patient:', error)
//     } else if (data && data.length > 0) {
//       console.log('New patient added successfully:', data[0])
//       setSelectedPatient({ id: data[0].id, name: data[0].name })
//       onClose()
//       resetForm()
//     }
//   }

//   const resetForm = () => {
//     setName('')
//     setDob('')
//     setGender('')
//     setPhone('')
//     setEmail('')
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add New Patient</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">
//                 Name
//               </Label>
//               <Input
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="col-span-3"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="dob" className="text-right">
//                 Date of Birth
//               </Label>
//               <Input
//                 id="dob"
//                 type="date"
//                 value={dob}
//                 onChange={(e) => setDob(e.target.value)}
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="gender" className="text-right">
//                 Gender
//               </Label>
//               <Input
//                 id="gender"
//                 value={gender}
//                 onChange={(e) => setGender(e.target.value)}
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="phone" className="text-right">
//                 Phone
//               </Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="email" className="text-right">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="col-span-3"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="submit">Add Patient</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }