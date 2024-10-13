'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, PlusCircle, UserPlus, Clock, Home } from 'lucide-react';
import PatientSelection from '@/components/PatientSelection';
import { usePatient } from '@/contexts/PatientContext';
import AddPatientModal from '@/components/AddPatientModal';

const Navigation = () => {
	const pathname = usePathname();
	const { selectedPatient } = usePatient();
	const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
	const [patientSelectionKey, setPatientSelectionKey] = useState(0);

	const links = [
		{ href: '/schedule', label: 'Appointments', icon: Clock },
		{ href: '/patients', label: 'Patients', icon: FileText },
		{ href: '/rx', label: 'Rx', icon: PlusCircle },
	];

	const handlePatientAdded = (newPatient: { id: string; name: string }) => {
		// Force re-render of PatientSelection component
		setPatientSelectionKey((prevKey) => prevKey + 1);
	};

	return (
		<nav className="flex flex-col w-64 bg-gray-100 p-4">
			<Link href="/">
				<Button variant="ghost" className="w-full justify-start mb-8">
					<Home className="mr-2 h-6 w-6" />
					Home
				</Button>
			</Link>
			<div className="mb-4">
				<PatientSelection key={patientSelectionKey} />
			</div>
			<Button
				variant="outline"
				className="mb-4 w-full"
				onClick={() => setIsAddPatientModalOpen(true)}
			>
				<UserPlus className="mr-2 h-4 w-4" />
				Add New Patient
			</Button>
			{selectedPatient && (
				<p className="mb-4 text-sm font-medium">
					Selected: {selectedPatient.name}
				</p>
			)}
			{links.map((link) => {
				const Icon = link.icon;
				return (
					<Link
						key={link.href}
						href={link.href}
					>
						<Button
							variant="ghost"
							className={cn(
								'w-full justify-start mb-2',
								pathname === link.href && 'bg-gray-200'
							)}
						>
							<Icon className="mr-2 h-4 w-4" />
							{link.label}
						</Button>
					</Link>
				);
			})}
			<AddPatientModal
				isOpen={isAddPatientModalOpen}
				onClose={() => setIsAddPatientModalOpen(false)}
				onPatientAdded={handlePatientAdded}
			/>
		</nav>
	);
};

export default Navigation;
