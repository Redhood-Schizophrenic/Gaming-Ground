'use client';

import React, { useState, useEffect } from 'react'
import { StatsCard } from './components/Stats';
import { ChartComponent } from './components/Chart';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import StaffTable from './components/Table';
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchStaffReportsStats } from '@/lib/reports/Staffs';

function StaffReports() {

	// Weekly expense chart data
	const weeklyData = [
		{ month: "Jan", value: 40 },
		{ month: "Feb", value: 32 },
		{ month: "Mar", value: 48 },
		{ month: "Apr", value: 36 },
		{ month: "May", value: 42 },
	];

	// Monthly expense chart data
	const monthlyData = [
		{ month: "Jan", value: 50000 },
		{ month: "Feb", value: 48000 },
		{ month: "Mar", value: 52000 },
		{ month: "Apr", value: 45000 },
		{ month: "May", value: 51000 }
	];

	useEffect(() => {
		async function fetchData() {
			const stats_data = await fetchStaffReportsStats();
			console.log(stats_data);
		}
		fetchData();
	}, []);


	return (
		<div className="flex flex-col w-full min-h-screen">

			{/* Stats Cards */}
			<div className="p-6">
				<div className="grid auto-rows-min gap-4 md:grid-cols-4">
					<StatsCard />
				</div>
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-2 gap-4 p-4">
				<ChartComponent
					title="Attendance Trends"
					data={weeklyData}
					period="month"
					showDetails={true}
				/>

				<ChartComponent
					title="Leave Distribution"
					data={monthlyData}
					period="month"
					showDetails={true}
				/>
			</div>

			{/* Table Section */}
			<div className='p-4'>
				<Card className="w-full">
					<CardHeader className="pb-2 flex flex-row justify-between items-center w-full">
						<CardTitle className='w-full'>
							<div className='flex w-full justify-between items-center'>
								<h1>
									Staff Overview
								</h1>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline">Roles</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-56">
										<DropdownMenuLabel>Filter Roles</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuCheckboxItem>	Staff </DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem>	Admin </DropdownMenuCheckboxItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<StaffTable />
					</CardContent>
				</Card>
			</div>

		</div>
	)
}

export default StaffReports;
