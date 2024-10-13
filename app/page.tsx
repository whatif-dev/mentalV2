import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Calendar,
	FileText,
	PlusCircle,
	Users,
	TrendingUp,
	FileSignature,
} from 'lucide-react';
import RecentNotes from '@/components/RecentNotes';

export default function Home() {
	return (
		<div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
			<h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
				Welcome to MindCare Pro
			</h1>
			<p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
				Streamline your mental health practice management
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[
					{
						title: 'Appointments',
						icon: Calendar,
						href: '/appointments',
						description: 'Efficiently manage and schedule patient appointments',
					},
					{
						title: 'Patient Management',
						icon: FileText,
						href: '/patients',
						description: 'Seamlessly handle patient and insurance billing',
					},
					{
						title: 'Prescriptions (Rx)',
						icon: PlusCircle,
						href: '/rx',
						description: 'Manage patient prescriptions and medications',
					},
					{
						title: 'Billing',
						icon: Users,
						href: '/billing',
						description: 'Comprehensive patient information and history',
					},
					{
						title: 'Analytics',
						icon: TrendingUp,
						href: '/analytics',
						description: 'Gain insights with practice analytics and reports',
					},
					{
						title: 'Clinical Notes',
						icon: FileSignature,
						href: '/notes',
						description: 'Manage and review patient clinical notes',
					},
				].map((item, index) => (
					<Card
						key={index}
						className="hover:shadow-lg transition-shadow duration-300 border-gray-200 dark:border-gray-700"
					>
						<CardHeader className="bg-gray-50 dark:bg-gray-800">
							<CardTitle className="flex items-center text-gray-900 dark:text-white">
								<item.icon className="mr-2 h-6 w-6" />
								{item.title}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription className="mt-2 mb-4 text-gray-600 dark:text-gray-400">
								{item.description}
							</CardDescription>
							<Link href={item.href}>
								<Button className="w-full bg-gray-900 hover:bg-gray-700 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
									Go to {item.title}
								</Button>
							</Link>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="mt-8">
				<RecentNotes />
			</div>
		</div>
	);
}
