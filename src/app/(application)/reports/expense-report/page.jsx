"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Filter, Plus, Sun, Moon } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { StatsComponent } from "./components/StatsCard";
import { ChartComponent } from "./components/Charts";
import { Input } from "@/components/ui/input";
import { getExpenses } from "@/lib/Cashlog";

export default function ExpenseReports() {
	const [dateValue, setDateValue] = useState("");
	const [Expenses, setExpenses] = useState([]);


	useEffect(() => {
		async function fetchData() {
			try {
				const response = await getExpenses();
				setExpenses(response);
			} catch (error) {
				console.log(error);
			}
		}
		fetchData();
	}, []);

	// Weekly expense chart data
	const weeklyData = [
		{ day: "Mon", value: 4000 },
		{ day: "Tue", value: 3200 },
		{ day: "Wed", value: 4800 },
		{ day: "Thu", value: 3600 },
		{ day: "Fri", value: 4200 },
		{ day: "Sat", value: 3800 }
	];

	// Monthly expense chart data
	const monthlyData = [
		{ month: "Jan", value: 50000 },
		{ month: "Feb", value: 48000 },
		{ month: "Mar", value: 52000 },
		{ month: "Apr", value: 45000 },
		{ month: "May", value: 51000 }
	];

	// Expense details data
	const expenseDetails = [
		{
			date: "2025-01-15",
			category: "Hardware",
			description: "Gaming PC Components",
			amount: "₹45,000"
		},
		{
			date: "2025-01-14",
			category: "Electricity",
			description: "Monthly Bill",
			amount: "₹12,500"
		},
		{
			date: "2025-01-13",
			category: "Gaming Licenses",
			description: "Annual Subscription",
			amount: "₹15,000"
		}
	];

	return (
		<div className="flex flex-col w-full min-h-screen">
			<div className="flex items-center justify-between p-4 pb-6">
				<h1 className="text-2xl font-bold">Expense Reports</h1>
				<div className="flex items-center gap-2">
					<div className="relative">
						<Input
							type="text"
							placeholder="mm/dd/yyyy"
							value={dateValue}
							onChange={(e) => setDateValue(e.target.value)}
						/>
						<FileText className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					</div>
					<Button>
						<FileText className="h-4 w-4 mr-2" />
						Excel
					</Button>
					<Button>
						<Download className="h-4 w-4 mr-2" />
						PDF
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="p-6">
				<div className="grid auto-rows-min gap-4 md:grid-cols-3">
					<StatsComponent />
				</div>
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-2 gap-4 p-4">
				{/* Weekly Expense Chart */}
				<ChartComponent
					title="Weekly Expense"
					data={weeklyData}
					period="day"
					gradientColor="#8884d8"
				/>

				{/* Monthly Expense Chart */}
				<ChartComponent
					title="Monthly Expense"
					data={monthlyData}
					period="month"
					gradientColor="#82ca9d"
				/>
			</div>

			{/* Expense Details Section */}
			<div className="p-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-medium">Expense Details</h2>
					<div className="flex gap-2">
						<Button variant="outline" className="bg-blue-700 hover:bg-blue-800 border-none flex items-center">
							<Filter className="h-4 w-4 mr-2" />
							All Categories
						</Button>
						<Button variant="outline" className="bg-blue-700 hover:bg-blue-800 border-none flex items-center">
							<Plus className="h-4 w-4 mr-2" />
							Add Expense
						</Button>
					</div>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Author</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Expenses.map((expense, i) => (
							<TableRow key={i}>
								<TableCell>{expense.date}</TableCell>
								<TableCell>{expense.author}</TableCell>
								<TableCell>{expense?.category}</TableCell>
								<TableCell>{expense.description}</TableCell>
								<TableCell>{expense.amount}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
