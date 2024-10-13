'use client';

import { useState, useEffect } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

interface Note {
	id: string;
	note_date: string;
	content: string;
}

export default function RecentNotes() {
	const { selectedPatient } = usePatient();
	const [recentNotes, setRecentNotes] = useState<Note[]>([]);

	useEffect(() => {
		if (selectedPatient) {
			fetchRecentNotes(selectedPatient.id);
		}
	}, [selectedPatient]);

	const fetchRecentNotes = async (patientId: string) => {
		const { data, error } = await supabase
			.from('patient_notes')
			.select('*')
			.eq('patient_id', patientId)
			.order('note_date', { ascending: false })
			.limit(5);

		if (error) {
			console.error('Error fetching recent notes:', error);
		} else {
			setRecentNotes(data || []);
		}
	};

	if (!selectedPatient) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Notes</CardTitle>
			</CardHeader>
			<CardContent>
				{recentNotes.length > 0 ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Note</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{recentNotes.map((note) => (
								<TableRow key={note.id}>
									<TableCell>{note.note_date}</TableCell>
									<TableCell>
										{note.content.length > 50
											? `${note.content.substring(0, 50)}...`
											: note.content}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<p>No recent notes available.</p>
				)}
				<div className="mt-4">
					<Link
						href="/notes"
						className="text-blue-500 hover:underline"
					>
						View all notes
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
