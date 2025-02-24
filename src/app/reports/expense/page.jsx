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
import {
	SidebarTrigger,
} from "@/components/ui/sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { StatsComponent } from "./components/StatsCard";
import { ChartComponent } from "./components/Charts";

export default function ExpenseReports() {
	const [dateValue, setDateValue] = useState("");
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false)

	// Ensure component is mounted before accessing theme
	useEffect(() => {
		setMounted(true)
	}, [])

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
		<div className="flex flex-col w-full min-h-screen bg-gray-950 text-white">
			{/* Header */}
			<header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="/reports">Reports</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Expense Reports</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				{/* Dark Mode Toggle Button */}
				{mounted && (
					<Button
						variant="outline"
						size="icon"
						className="ml-auto bg-gray-800"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					>
						{theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
					</Button>
				)}
			</header>
			<div className="flex items-center justify-between p-4 pb-6">
				<h1 className="text-2xl font-bold">Expense Reports</h1>
				<div className="flex items-center gap-2">
					<div className="relative">
						<input
							type="text"
							placeholder="mm/dd/yyyy"
							className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded w-32 text-sm"
							value={dateValue}
							onChange={(e) => setDateValue(e.target.value)}
						/>
						<FileText className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					</div>
					<Button variant="outline" className="bg-blue-700 hover:bg-blue-800 border-none">
						<FileText className="h-4 w-4 mr-2" />
						Excel
					</Button>
					<Button variant="outline" className="bg-blue-700 hover:bg-blue-800 border-none">
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
					footerLabel="Today"
					footerValue="₹4500.00"
				/>

				{/* Monthly Expense Chart */}
				<ChartComponent
					title="Monthly Expense"
					data={monthlyData}
					period="month"
					gradientColor="#82ca9d"
					showDetails={true}
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

				<div className="bg-gray-800/50 rounded-lg overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow className="border-b border-gray-700">
								<TableHead className="text-gray-400 font-bold">Date</TableHead>
								<TableHead className="text-gray-400 font-bold">Category</TableHead>
								<TableHead className="text-gray-400 font-bold">Description</TableHead>
								<TableHead className="text-gray-400 font-bold text-right">Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{expenseDetails.map((expense, i) => (
								<TableRow key={i} className="border-b border-gray-700/50">
									<TableCell className="text-gray-300">{expense.date}</TableCell>
									<TableCell className="text-gray-300">{expense.category}</TableCell>
									<TableCell className="text-gray-300">{expense.description}</TableCell>
									<TableCell className="text-gray-300 text-right">{expense.amount}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
