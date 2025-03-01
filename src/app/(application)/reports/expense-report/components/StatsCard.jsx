import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";


export const StatsComponent = ({ Stats }) => {
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
