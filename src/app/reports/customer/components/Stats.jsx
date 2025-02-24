import { Blue600, Green600, Orange600, Purple600 } from "@/constants/colors"
import { Clock, IndianRupee, UserCheck, Users } from "lucide-react"

export const StatsCard = () => {

	const Stats = [
		{
			title: 'Total Customers',
			price: '2,420',
			icon: Users,
			iconClass: 'bg-blue-100 p-2 rounded-full',
			iconColor: Blue600
		},
		{
			title: 'Active Members',
			price: '1,000',
			icon: UserCheck,
			iconClass: 'bg-green-100 p-2 rounded-full',
			iconColor: Green600
		},
		{
			title: 'Total Revenue',
			price: '₹72,150',
			icon: IndianRupee,
			iconClass: 'bg-purple-100 p-2 rounded-full',
			iconColor: Purple600
		},
		{
			title: 'Avg. Session',
			price: '2.5 hrs',
			icon: Clock,
			iconClass: 'bg-orange-100 p-2 rounded-full',
			iconColor: Orange600
		},
	]

	return (
		<>
			{
				Stats.map((stat, index) => (
					<div key={index} className="h-[100px] rounded-xl bg-gray-800 p-4 flex justify-between">
						<div>
							<h1 className="text-gray-300">{stat.title}</h1>
							<p className="text-2xl font-semibold">{stat.price}</p>
						</div>
						<div className="flex justify-center items-center h-full">
							<div className={stat.iconClass}>
								<stat.icon size={20} color={stat.iconColor} />
							</div>
						</div>
					</div>
				))
			}
		</>
	)
}
