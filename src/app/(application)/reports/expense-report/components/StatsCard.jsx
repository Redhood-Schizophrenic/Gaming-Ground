import { Blue600, Green600, Red600 } from "@/constants/colors"
import { FaChartLine, FaMicrochip, FaWallet } from "react-icons/fa6"
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";


export const StatsComponent = () => {

	const Stats = [
		{
			title: 'Repairs / Maintainence',
			price: '₹85,420',
			icon: FaWallet,
			iconClass: 'bg-blue-100 p-2 rounded-full',
			iconColor: Blue600
		},
		{
			title: 'Snacks & Drinks Expenses',
			price: '₹35,000',
			icon: FaChartLine,
			iconClass: 'bg-green-100 p-2 rounded-full',
			iconColor: Green600
		},
		{
			title: 'New Hardware/Equipment',
			price: '₹72,150',
			icon: FaMicrochip,
			iconClass: 'bg-red-100 p-2 rounded-full',
			iconColor: Red600
		},
	]

	return (
		<>
			{
				Stats.map((stat, index) => (
					<Card key={index} className='px-4 py-2'>
						<div className="flex items-center justify-between">
							<CardHeader>
								<CardDescription>{stat.title}</CardDescription>
								<CardTitle>{stat.price}</CardTitle>
							</CardHeader>
							<div className="flex justify-center items-center h-full">
								<div className={stat.iconClass}>
									<stat.icon size={20} color={stat.iconColor} />
								</div>
							</div>
						</div>
					</Card>
				))
			}
		</>
	)
}
// <div key={index} className="h-[100px] rounded-xl bg-gray-800 p-4 flex justify-between"> <div>
// 	<h1 className="text-gray-300">{stat.title}</h1>
// 	<p className="text-2xl font-semibold">{stat.price}</p>
// </div>
// 	<div className="flex justify-center items-center h-full">
// 		<div className={stat.iconClass}>
// 			<stat.icon size={20} color={stat.iconColor} />
// 		</div>
// 	</div>
// </div>
