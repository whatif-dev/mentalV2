'use client';

import { useState, useEffect } from 'react';
import { format, parseISO, isSameDay, addDays, subDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Appointment {
	id: string;
	patient_id: string;
	date: string;
	time: string;
	patient_name?: string; // We'll add this as an optional property
	patients: { name: string };
}

export default function SchedulePage() {
	const [date, setDate] = useState<Date>(new Date());
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [editingAppointment, setEditingAppointment] =
		useState<Appointment | null>(null);
	const [newTime, setNewTime] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	useEffect(() => {
		fetchAppointments();
	}, [date]);

	const fetchAppointments = async () => {
		const { data, error } = await supabase
			.from('appointments')
			.select(
				`
        id,
        patient_id,
        date,
        time,
        patients (name)
      `
			)
			.eq('date', format(date, 'yyyy-MM-dd'))
			.order('time');

		if (error) {
			console.error('Error fetching appointments:', error);
		} else {
			console.log('Fetched appointments:', data);
			setAppointments(
			  (data as any[])?.map((app) => ({
			    id: app.id,
			    patient_id: app.patient_id,
			    date: app.date,
			    time: app.time,
			    patients: app.patients,
			    patient_name: app.patients.name || 'Unknown',
			  })) || []
			);
		}
	};

	const handleEditAppointment = (appointment: Appointment) => {
		setEditingAppointment(appointment);
		setNewTime(appointment.time);
		setIsDialogOpen(true);
	};

	const handleSaveAppointment = async () => {
		if (!editingAppointment) return;

		const { error } = await supabase
			.from('appointments')
			.update({ time: newTime })
			.eq('id', editingAppointment.id);

		if (error) {
			console.error('Error updating appointment:', error);
		} else {
			setIsDialogOpen(false);
			fetchAppointments();
		}
	};

	const handleDeleteAppointment = async (appointmentId: string) => {
		const { error } = await supabase
			.from('appointments')
			.delete()
			.eq('id', appointmentId);

		if (error) {
			console.error('Error deleting appointment:', error);
		} else {
			fetchAppointments();
		}
	};

	const timeSlots = Array.from({ length: 24 }, (_, i) => {
		const hour = i % 12 || 12;
		const ampm = i < 12 ? 'AM' : 'PM';
		return `${hour}:00 ${ampm}`;
	});

	const formatAppointmentTime = (time: string) => {
		const [hours, minutes] = time.split(':');
		const hour = parseInt(hours, 10);
		const ampm = hour >= 12 ? 'PM' : 'AM';
		const formattedHour = hour % 12 || 12;
		return `${formattedHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
	};

	const getAppointmentHour = (time: string) => {
		const [hours] = time.split(':');
		return parseInt(hours, 10);
	};

	const handlePreviousDay = () => {
		setDate((prevDate) => subDays(prevDate, 1));
	};

	const handleNextDay = () => {
		setDate((prevDate) => addDays(prevDate, 1));
	};

	return (
		<div className="flex space-x-6 p-6 bg-gray-50 min-h-screen">
			<div className="w-1/3">
				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle>Select Date</CardTitle>
					</CardHeader>
					<CardContent>
						<Calendar
							mode="single"
							selected={date}
							onSelect={(newDate) => newDate && setDate(newDate)}
							className="rounded-md border"
						/>
					</CardContent>
				</Card>
			</div>
			<div className="w-2/3">
				<Card className="shadow-lg">
					<CardHeader className="border-b">
						<div className="flex items-center justify-between">
							<Button
								variant="outline"
								size="icon"
								onClick={handlePreviousDay}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<CardTitle>Schedule for {format(date, 'MMMM d, yyyy')}</CardTitle>
							<Button
								variant="outline"
								size="icon"
								onClick={handleNextDay}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent className="p-0">
						<div className="divide-y divide-gray-200">
							{timeSlots.map((time, index) => {
								const [slotHour, slotAmPm] = time.split(' ');
								const slotHourNum =
									parseInt(slotHour, 10) +
									(slotAmPm === 'PM' && slotHour !== '12' ? 12 : 0);

								const appointmentsAtTime = appointments.filter((app) => {
									const appHour = getAppointmentHour(app.time);
									return appHour === slotHourNum;
								});

								return (
									<div
										key={time}
										className={`flex items-center p-4 ${
											index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
										}`}
									>
										<div className="w-24 font-medium text-gray-600">{time}</div>
										<div className="flex-1 ml-4 space-y-2">
											{appointmentsAtTime.map((app) => (
												<div
													key={app.id}
													className="bg-blue-100 p-3 rounded-lg shadow text-blue-800 border border-blue-200 flex justify-between items-center"
												>
													<span className="font-semibold">
														{app.patient_name} -{' '}
														{formatAppointmentTime(app.time)}
													</span>
													<div>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleEditAppointment(app)}
														>
															<Pencil className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleDeleteAppointment(app.id)}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											))}
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>

			<Dialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Appointment</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<label
								htmlFor="name"
								className="text-right"
							>
								Patient
							</label>
							<Input
								id="name"
								value={editingAppointment?.patient_name || ''}
								className="col-span-3"
								disabled
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<label
								htmlFor="time"
								className="text-right"
							>
								Time
							</label>
							<Input
								id="time"
								type="time"
								value={newTime}
								onChange={(e) => setNewTime(e.target.value)}
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button onClick={handleSaveAppointment}>Save changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
