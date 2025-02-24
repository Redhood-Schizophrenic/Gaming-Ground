'use client';
import React from 'react'
import Header from './components/Header';
import { StatsCard } from './components/Stats';
import { ChartComponent } from './components/Charts';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Blue600, Green600, Purple600, Red600, Yellow600 } from '@/constants/colors';
import { Gamepad, Crown, Users, Trophy, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { FaPlaystation, FaXbox } from 'react-icons/fa6';

function CustomerReports() {
	// Monthly expense chart data
	const monthlyData = [
		{ month: "Jan", value: 50000 },
		{ month: "Feb", value: 48000 },
		{ month: "Mar", value: 52000 },
		{ month: "Apr", value: 45000 },
		{ month: "May", value: 51000 }
	];

	// Revenue Breakdown data
	const revenueData = [
		{
			title: 'Gaming Sessions',
			icon: Gamepad,
			description: '2,145 sessions',
			iconClass: 'bg-blue-100 p-2 rounded-full',
			iconColor: Blue600,
			amount: '₹25,478'
		},
		{
			title: 'Food & Beverages',
			icon: Trophy,
			description: '1,256 orders',
			iconClass: 'bg-green-100 p-2 rounded-full',
			iconColor: Green600,
			amount: '₹19,811'
		}
	];

	// Membership Status data
	const membershipData = [
		{
			title: 'Premium Members',
			icon: Crown,
			percentage: '+12.5%',
			trend: 'up',
			iconClass: 'bg-purple-100 p-2 rounded-full',
			iconColor: Purple600 // Purple color
		},
		{
			title: 'Standard Members',
			icon: Users,
			percentage: '-3.2%',
			trend: 'down',
			iconClass: 'bg-yellow-100 p-2 rounded-full',
			iconColor: Yellow600 // Yellow color
		}
	];

	// Popular Games data
	const gamesData = [
		{
			title: 'FIFA 2025',
			status: 'Popular',
			icon: FaPlaystation,
			iconClass: 'bg-red-100 p-2 rounded-full',
			iconColor: Red600

		},
		{
			title: 'Mortal Kombat',
			status: 'Trending',
			icon: FaXbox,
			iconClass: 'bg-blue-100 p-2 rounded-full',
			iconColor: Blue600 // Purple color
		}
	];

	return (
		<div className="flex flex-col w-full min-h-screen bg-gray-950 text-white">
			{/* Header */}
			<Header />

			{/* Stats Cards */}
			<div className="p-6">
				<div className="grid auto-rows-min gap-4 md:grid-cols-4">
					<StatsCard />
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
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4'>
				{/* Revenue Breakdown Card */}
				<Card className="bg-gray-800 border-none text-white">
					<CardHeader className="pb-2 flex flex-row justify-between items-center">
						<CardTitle className="text-xl font-bold pb-2">Revenue Breakdown</CardTitle>
					</CardHeader>
					<CardContent>
						{revenueData.map((item, index) => (
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

				{/* Membership Status Card */}
				<Card className="bg-gray-800 border-none text-white">
					<CardHeader className="pb-2 flex flex-row justify-between items-center">
						<CardTitle className="text-xl font-bold pb-2">Membership Status</CardTitle>
					</CardHeader>
					<CardContent>
						{membershipData.map((item, index) => (
							<div key={index} className="flex justify-between items-center mb-4 last:mb-0">
								<div className="flex items-center gap-3">
									<div className={item.iconClass}>
										<item.icon size={20} color={item.iconColor} />
									</div>
									<h3 className="font-medium">{item.title}</h3>
								</div>
								<div className={`flex items-center ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
									{item.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
									<span className="font-medium">{item.percentage}</span>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Popular Games Card */}
				<Card className="bg-gray-800 border-none text-white">
					<CardHeader className="pb-2 flex flex-row justify-between items-center">
						<CardTitle className="text-xl font-bold pb-2">Popular Games</CardTitle>
					</CardHeader>
					<CardContent>
						{gamesData.map((game, index) => (
							<div key={index} className="flex justify-between items-center mb-4 last:mb-0">
								<div className="flex items-center gap-3">
									<div className={game.iconClass}>
										<game.icon size={20} color={game.iconColor} />
									</div>
									<h3 className="font-medium">{game.title}</h3>
								</div>
								<span className={`text-xs px-3 py-1 rounded-full ${game.status === 'Popular'
									? 'bg-red-900/30 text-red-400'
									: 'bg-blue-900/30 text-blue-400'
									}`}>
									{game.status}
								</span>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default CustomerReports;
