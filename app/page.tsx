import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, FileText, PlusCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Welcome to Mental Health Billing</h1>
      <p className="text-xl">Manage appointments, billing, and prescriptions with ease.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Schedule and manage patient appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/appointments">
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Go to Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Manage patient and insurance billing information</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/billing">
              <Button className="w-full"><FileText className="mr-2 h-4 w-4" />
                Go to Billing
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prescriptions (Rx)</CardTitle>
            <CardDescription>Manage patient prescriptions and medications</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/rx">
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Go to Prescriptions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}