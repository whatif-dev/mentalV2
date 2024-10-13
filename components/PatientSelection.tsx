'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { usePatient } from '@/contexts/PatientContext';

interface Patient {
	id: string;
	name: string;
}

interface PatientSelectionProps {
	onSelect?: (patientId: string, patientName: string) => void;
}

export default function PatientSelection({ onSelect }: PatientSelectionProps) {
	const [open, setOpen] = React.useState(false);
	const [patients, setPatients] = React.useState<Patient[]>([]);
	const [search, setSearch] = React.useState('');
	const { selectedPatient, setSelectedPatient } = usePatient();

	React.useEffect(() => {
		fetchPatients();
	}, []);

	const fetchPatients = async () => {
		const { data, error } = await supabase
			.from('patients')
			.select('id, name')
			.order('name', { ascending: true });

		if (error) {
			console.error('Error fetching patients:', error);
		} else {
			setPatients(data || []);
		}
	};

	const addNewPatient = (newPatient: Patient) => {
		setPatients((prevPatients) =>
			[...prevPatients, newPatient].sort((a, b) => a.name.localeCompare(b.name))
		);
	};

	const filteredPatients = React.useMemo(
		() =>
			patients.filter((patient) =>
				patient.name.toLowerCase().includes(search.toLowerCase())
			),
		[patients, search]
	);

	const handlePatientSelect = (patient: Patient) => {
		setSelectedPatient(patient);
		if (onSelect) {
			onSelect(patient.id, patient.name);
		}
		setOpen(false);
	};

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{selectedPatient ? selectedPatient.name : 'Select patient...'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0">
				<div className="p-2">
					<Input
						placeholder="Search patient..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<ul className="max-h-[300px] overflow-auto">
					{filteredPatients.map((patient) => (
						<li
							key={patient.id}
							className={cn(
								'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
								selectedPatient?.id === patient.id &&
									'bg-accent text-accent-foreground'
							)}
							onClick={() => handlePatientSelect(patient)}
						>
							<Check
								className={cn(
									'mr-2 h-4 w-4',
									selectedPatient?.id === patient.id
										? 'opacity-100'
										: 'opacity-0'
								)}
							/>
							{patient.name}
						</li>
					))}
				</ul>
			</PopoverContent>
		</Popover>
	);
}
