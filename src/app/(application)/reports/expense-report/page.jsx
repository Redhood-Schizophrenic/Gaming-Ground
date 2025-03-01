"use client";

import { startOfWeek, startOfMonth, format, parseISO } from "date-fns";
import { Blue600, Green600, Purple600, Red600 } from "@/constants/colors";
import { GiAutoRepair } from "react-icons/gi";
import { FaChartLine, FaMicrochip, FaWallet } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { StatsComponent } from "./components/StatsCard";
import { ChartComponent } from "./components/Charts";
import { Input } from "@/components/ui/input";
import { getExpenses } from "@/lib/Cashlog";

const categories = [
	"Repairs / Maintainence",
	"Snacks & Drinks Expenses",
	"New Hardware/Equipment",
	"Miscellaneous",
];

export default function ExpenseReports() {
	const [dateValue, setDateValue] = useState("");
	const [Expenses, setExpenses] = useState([]);
	const [Stats, setStats] = useState({
		repairs: 0,
		snacks: 0,
		new_hardware: 0,
		miscellaneous: 0,
	});
	const [weeklyData, setWeeklyData] = useState([]);
	const [monthlyData, setMonthlyData] = useState([]);
	const [ExpenseCategory, setExpenseCategory] = useState('');
	const [initialExpenses, setInitialExpenses] = useState([]);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await getExpenses();
				console.log(response);

				// Aggregate expenses by category
				const StatsCalc = response?.reduce((acc, expense) => {
					if (categories.includes(expense?.category)) {
						acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
					}
					return acc;
				}, {});

				setStats({
					repairs: StatsCalc?.["Repairs / Maintainence"] || 0,
					snacks: StatsCalc?.["Snacks & Drinks Expenses"] || 0,
					new_hardware: StatsCalc?.["New Hardware/Equipment"] || 0,
					miscellaneous: StatsCalc?.["Miscellaneous"] || 0,
				});

				// Convert expenses into a date-keyed object
				const weeklyExpenses = {};
				const monthlyExpenses = {};
				const today = new Date();
				const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
				const monthStart = startOfMonth(today);
				response.forEach((expense) => {
					const expenseDate = parseISO(expense.created);
					const dayKey = format(expenseDate, "EEE"); // Mon, Tue, ...
					const monthKey = format(expenseDate, "MMM"); // Jan, Feb, ...
					// Weekly Aggregation
					if (expenseDate >= weekStart) {
						weeklyExpenses[dayKey] = (weeklyExpenses[dayKey] || 0) + expense.amount;
					}
					// Monthly Aggregation
					if (expenseDate >= monthStart) {
						monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + expense.amount;
					}
				});

				// Format weekly data
				const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
				const formattedWeeklyData = weekDays.map((day) => ({
					day,
					value: weeklyExpenses[day] || 0,
				}));

				// Format monthly data
				const formattedMonthlyData = Object.keys(monthlyExpenses).map((month) => ({
					month,
					value: monthlyExpenses[month],
				}));

				setWeeklyData(formattedWeeklyData);
				setMonthlyData(formattedMonthlyData);
				setExpenses(response);
				setInitialExpenses(response);
			} catch (error) {
				console.log(error);
			}
		}
		fetchData();
	}, []);

	const StatsVar = [
		{
			title: 'Repairs / Maintainence',
			price: `₹ ${Stats?.repairs || 0}`,
			icon: GiAutoRepair,
			iconClass: 'bg-blue-100 p-2 rounded-full',
			iconColor: Blue600
		},
		{
			title: 'Snacks & Drinks Expenses',
			price: `₹ ${Stats?.snacks || 0}`,
			icon: FaChartLine,
			iconClass: 'bg-green-100 p-2 rounded-full',
			iconColor: Green600
		},
		{
			title: 'New Hardware/Equipment',
			price: `₹ ${Stats?.new_hardware || 0}`,
			icon: FaMicrochip,
			iconClass: 'bg-red-100 p-2 rounded-full',
			iconColor: Red600
		},
		{
			title: 'Miscellaneous Expense',
			price: `₹ ${Stats?.miscellaneous || 0}`,
			icon: FaWallet,
			iconClass: 'bg-purple-100 p-2 rounded-full',
			iconColor: Purple600
		},
	];

	function handleExpenseChange(value) {
		try {
			setExpenseCategory(value);
			const ExpensesData = initialExpenses?.filter((expense) => expense.category === value);
			setExpenses(ExpensesData);
		} catch (error) {
			console.log(error);
		}
	}

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
				<div className="grid auto-rows-min gap-4 md:grid-cols-4">
					<StatsComponent Stats={StatsVar} />
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
						<Select onValueChange={(value) => handleExpenseChange(value)}>
							<SelectTrigger className="w-auto pr-4 cursor-pointer">
								<SelectValue placeholder='All Categories' />
							</SelectTrigger>
							<SelectContent>
								{categories.map((category) => (
									<SelectItem key={category} value={category} className='cursor-pointer'>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
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
