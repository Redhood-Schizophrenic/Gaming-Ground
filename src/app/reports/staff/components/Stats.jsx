import { Blue600, Green600, Purple600, Red600, Yellow600 } from "@/constants/colors"
import { CalendarX, HandCoins, MoveDown, MoveUp, UserCheck, Users } from "lucide-react"

export const StatsCard = () => {

	const Stats = [
		{
			title: 'Total Staff',
			mainText: '24',
			footer: (
				<div className="flex items-center gap-3 text-sm">
					<h1 className="text-green-500 flex items-center">
						<MoveUp size={15} /> +2.5%
					</h1>
					<span className="text-slate-500"> vs last month</span>
				</div>

			),
			icon: Users,
			iconColor: Blue600
		},
		{
			title: 'Present Today',
			mainText: '92%',
			footer: (
				<div className="flex items-center gap-3 text-sm">
					<h1 className="text-green-500 flex items-center">
						<MoveUp size={15} /> +1.2%
					</h1>
					<span className="text-slate-500"> vs yesterday</span>
				</div>

			),
			icon: UserCheck,
			iconColor: Green600
		},
		{
			title: 'Leave Requests',
			mainText: '5',
			footer: (
				<div className="flex items-center gap-3 text-sm">
					<span className="text-slate-500"> Pending approved </span>
				</div>

			),
			icon: CalendarX,
			iconColor: Yellow600
		},
		{
			title: 'Monthly Expenses',
			mainText: '₹12,450',
			footer: (
				<div className="flex items-center gap-3 text-sm">
					<h1 className="text-red-500 flex items-center">
						<MoveDown size={15} /> +3.5%
					</h1>
					<span className="text-slate-500"> vs last month</span>
				</div>

			),
			icon: HandCoins,
			iconColor: Purple600
		},
	]

	return (
		<>
			{
				Stats.map((stat, index) => (
					<div key={index} className="h-auto rounded-xl bg-gray-800 p-4">
						<div className="flex justify-between">
							<h1 className="text-gray-400">{stat.title}</h1>
							<stat.icon size={20} color={stat.iconColor} />
						</div>
						<div>
							<h1 className="font-bold text-xl">{stat?.mainText}</h1>
							<div className="mt-2">
								{stat?.footer}
							</div>
						</div>
					</div>
				))
			}
		</>
	)
}
