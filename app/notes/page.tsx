'use client';

import { useState, useEffect } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Pencil } from 'lucide-react';

interface Note {
	id: string;
	note_date: string;
	content: string;
}

export default function NotesPage() {
	const { selectedPatient } = usePatient();
	const [notes, setNotes] = useState<Note[]>([]);
	const [editingNote, setEditingNote] = useState<Note | null>(null);
	const [newNote, setNewNote] = useState('');
	const [noteDate, setNoteDate] = useState('');

	useEffect(() => {
		if (selectedPatient) {
			fetchNotes(selectedPatient.id);
		}
	}, [selectedPatient]);

	const fetchNotes = async (patientId: string) => {
		const { data, error } = await supabase
			.from('patient_notes')
			.select('*')
			.eq('patient_id', patientId)
			.order('note_date', { ascending: false });

		if (error) {
			console.error('Error fetching notes:', error);
		} else {
			setNotes(data || []);
		}
	};

	const handleAddOrUpdateNote = async () => {
		if (!selectedPatient || !newNote || !noteDate) return;

		if (editingNote) {
			const { error } = await supabase
				.from('patient_notes')
				.update({ note_date: noteDate, content: newNote })
				.eq('id', editingNote.id);

			if (error) {
				console.error('Error updating note:', error);
			} else {
				console.log('Note updated successfully');
			}
		} else {
			const { error } = await supabase
				.from('patient_notes')
				.insert([
					{
						patient_id: selectedPatient.id,
						note_date: noteDate,
						content: newNote,
					},
				]);

			if (error) {
				console.error('Error adding note:', error);
			} else {
				console.log('Note added successfully');
			}
		}

		setNewNote('');
		setNoteDate('');
		setEditingNote(null);
		await fetchNotes(selectedPatient.id);
	};

	const handleEditNote = (note: Note) => {
		setEditingNote(note);
		setNewNote(note.content);
		setNoteDate(note.note_date);
	};

	if (!selectedPatient) {
		return <div>Please select a patient from the sidebar.</div>;
	}

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">
				Clinical Notes for {selectedPatient.name}
			</h1>

			<Card>
				<CardHeader>
					<CardTitle>{editingNote ? 'Edit Note' : 'Add/Edit Notes'}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="noteDate"
								className="block text-sm font-medium text-gray-700"
							>
								Date
							</label>
							<input
								type="date"
								id="noteDate"
								value={noteDate}
								onChange={(e) => setNoteDate(e.target.value)}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
							/>
						</div>
						<div>
							<label
								htmlFor="newNote"
								className="block text-sm font-medium text-gray-700"
							>
								Note
							</label>
							<Textarea
								id="newNote"
								value={newNote}
								onChange={(e) => setNewNote(e.target.value)}
								rows={4}
								placeholder="Enter clinical note here..."
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
							/>
						</div>
						<div className="flex justify-between">
							<Button onClick={handleAddOrUpdateNote}>
								{editingNote ? 'Update Note' : 'Add Note'}
							</Button>
							{editingNote && (
								<Button
									variant="outline"
									onClick={() => {
										setEditingNote(null);
										setNewNote('');
										setNoteDate('');
									}}
								>
									Cancel Edit
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Previous Notes</CardTitle>
				</CardHeader>
				<CardContent>
					{notes.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Note</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{notes.map((note) => (
									<TableRow key={note.id}>
										<TableCell>{note.note_date}</TableCell>
										<TableCell>{note.content}</TableCell>
										<TableCell>
											<Button
												variant="ghost"
												onClick={() => handleEditNote(note)}
											>
												<Pencil className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<p>No notes available for this patient.</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
