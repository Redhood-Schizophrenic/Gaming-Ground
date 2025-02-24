import React from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function StaffTable() {
	// staff details data
	const staffDetails = [
		{
			username: 'John Doe',
			role: 'Staff',
			branch: 'Dombivli',
			leavesTaken: 12,
		},
		{
			username: 'Shashank',
			role: 'Admin',
			branch: 'Dombivli',
			leavesTaken: 0,
		},
	];

	return (
		<div className="bg-gray-800/50 rounded-lg overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="border-b border-gray-700">
						<TableHead className="text-gray-400 font-bold">Staff Member</TableHead>
						<TableHead className="text-gray-400 font-bold">Role</TableHead>
						<TableHead className="text-gray-400 font-bold">Branch</TableHead>
						<TableHead className="text-gray-400 font-bold">Leaves Taken</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{staffDetails.map((staff, i) => (
						<TableRow key={i} className="border-b border-gray-700/50">
							<TableCell className="text-gray-300">
								<div className="flex items-center gap-3">
									<Avatar>
										<AvatarFallback>
											{staff.username.at(0) || 'U'}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-medium">{staff?.username || 'Unknown'}</div>
										<div className="text-sm text-muted-foreground">
											{staff.role}
										</div>
									</div>
								</div>
							</TableCell>
							<TableCell className="text-gray-300">{staff.role}</TableCell>
							<TableCell className="text-gray-300">{staff.branch}</TableCell>
							<TableCell className="text-gray-300 ">{staff.leavesTaken} days</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export default StaffTable 
