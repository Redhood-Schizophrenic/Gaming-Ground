'use client';

import React, { useEffect, useState } from 'react'
import { StatsCard } from './components/Stats';
import { ChartComponent } from './components/Charts';
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Blue600, Green600, Orange600, Purple600, Red600 } from "@/constants/colors"
import { Clock, IndianRupee, UserCheck, Users } from "lucide-react"
import { Gamepad, Trophy } from 'lucide-react';
import { fetchCustomerData, fetchCustomerStats } from '@/lib/reports/Customers';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';

function CustomerReports() {
	const [Stats, setStats] = useState([
		{ title: 'Total Customers', price: 0, icon: Users, iconClass: 'bg-blue-100 p-1.5 rounded-full', iconColor: Blue600 },
		{ title: 'Active Members', price: 0, icon: UserCheck, iconClass: 'bg-green-100 p-1.5 rounded-full', iconColor: Green600 },
		{ title: 'Total Revenue', price: '₹0', icon: IndianRupee, iconClass: 'bg-purple-100 p-1.5 rounded-full', iconColor: Purple600 },
		{ title: 'Max Session', price: '0 hr', icon: Clock, iconClass: 'bg-orange-100 p-1.5 rounded-full', iconColor: Orange600 },
	]);
	const [monthlyData, setMonthlyData] = useState([]);
	const [RevenueBreakDown, setRevenueBreakDown] = useState([
		{ title: 'Gaming Sessions', icon: Gamepad, description: '2,145 sessions', iconClass: 'bg-blue-100 p-2 rounded-full', iconColor: Blue600, amount: '₹0' },
		{ title: 'Food & Beverages', icon: Trophy, description: '1,256 orders', iconClass: 'bg-green-100 p-2 rounded-full', iconColor: Green600, amount: '₹0' }
	]);
	const [gamesData, setGamesData] = useState([])

	useEffect(() => {
		async function fetchData() {
			try {
				// <--- Fetch customer stats --->
				const customers = await fetchCustomerStats();

				// Update Stats state
				setStats((prevStats) =>
					prevStats.map((stat) => {
						if (stat.title === "Total Customers") {
							return { ...stat, price: customers?.total_customers || 0 };
						}
						if (stat.title === "Active Members") {
							return { ...stat, price: customers?.active_members || 0 };
						}
						if (stat.title === "Total Revenue") {
							return { ...stat, price: `₹${customers?.total_revenue || 0}` };
						}
						if (stat.title === "Max Session") {
							return { ...stat, price: `${customers?.max_session ? `${customers?.max_session} hr` : `${customers?.max_session} hrs` || 0}` };
						}
						return stat;
					})
				);

				setRevenueBreakDown((prevStats) => (
					prevStats.map((stat) => {
						if (stat.title === "Gaming Sessions") {
							return { ...stat, amount: `₹${customers?.session_price || 0}` };
						}
						if (stat.title === "Food & Beverages") {
							return { ...stat, amount: `₹${customers?.snacks_price || 0}` };
						}
						return stat;
					})
				));

				setGamesData(customers?.popular_games || [])

				// <--- Fetch customer data for charts --->
				const response = await fetchCustomerData();

				// Initialize an object to store customer counts by month
				const monthlyGrowth = {};

				// Process each customer
				if (Array.isArray(response) && response.length > 0) {
					response.forEach((customer) => {
						// Skip if no creation date
						if (!customer?.created) return;

						try {
							// Parse the date (handle different date formats)
							let customerDate;
							try {
								customerDate = parseISO(customer.created);
							} catch {
								// Fallback if the date format is different
								customerDate = new Date(customer.created);
							}

							// Skip invalid dates
							if (isNaN(customerDate.getTime())) return;

							// Get month key (Jan, Feb, etc.)
							const monthKey = format(customerDate, "MMM");

							// Increment count for this month
							monthlyGrowth[monthKey] = (monthlyGrowth[monthKey] || 0) + 1;
						} catch (err) {
							console.error("Error processing customer date:", err);
						}
					});
				} else {
					console.log("No customer data or invalid format:", response);
				}

				// Format the monthly data for the chart
				const formattedMonthlyData = Object.keys(monthlyGrowth)
					.map((month) => ({
						month,
						value: monthlyGrowth[month],
					}))
					.sort((a, b) => {
						// Sort months chronologically
						const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
						return months.indexOf(a.month) - months.indexOf(b.month);
					});
				setMonthlyData(formattedMonthlyData);

			} catch (error) {
				console.error("Error fetching customer data:", error);
			}
		}

		fetchData();
	}, []);

	return (
		<div className="flex flex-col w-full min-h-screen">

			{/* Stats Cards */}
			<div className="p-6">
				<div className="grid auto-rows-min gap-4 md:grid-cols-4">
					<StatsCard Stats={Stats} />
				</div>
			</div>

			{/* Charts Section */}
			<div className="p-4">
				<ChartComponent
					title="Customer Growth"
					data={monthlyData}
					period="month"
				/>
			</div>

			{/* Cards Section */}
			<div className='grid grid-cols-1 md:grid-cols-2 p-4 gap-4'>
				{/* Revenue Breakdown Card */}
				<Card>
					<CardHeader className="pb-2 flex flex-row justify-between items-center">
						<CardTitle className="text-xl font-bold pb-2">Revenue Breakdown</CardTitle>
					</CardHeader>
					<CardContent>
						{RevenueBreakDown.map((item, index) => (
							<div key={index} className="flex justify-between items-center mb-4 last:mb-0">
								<div className="flex items-center gap-3">
									<div className={item.iconClass}>
										<item.icon size={20} color={item.iconColor} />
									</div>
									<div>
										<h3 className="font-medium">{item.title}</h3>
										<p className="text-xs text-gray-400">{item.description}</p>
									</div>
								</div>
								<span className="font-bold">{item.amount}</span>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Popular Games Card */}
				<Card>
					<CardHeader className="pb-2 flex flex-row justify-between items-center">
						<CardTitle className="text-xl font-bold pb-2">Popular Games</CardTitle>
					</CardHeader>
					<CardContent>
						{gamesData.map((game, index) => (
							<div key={index} className="flex items-center mb-4 last:mb-0">
								<div className="flex items-center gap-3">
									{game?.image ? (
										<div className="relative w-12 h-12">
											<Image
												src={game.image}
												alt={game.name || "Game image"}
												width={48}
												height={48}
												className="rounded-md object-contain"
											/>
										</div>
									) : (
										<div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
											<Gamepad size={24} className="text-gray-400" />
										</div>
									)}
									<h3 className="font-medium">{game.name}</h3>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default CustomerReports;
