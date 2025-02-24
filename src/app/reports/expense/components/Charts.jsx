"use client";

import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip
} from "recharts";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ExpenseChart component to be reused for both weekly and monthly charts
export const ChartComponent = ({
	title,
	data,
	period = "day", // 'day' or 'month'
	gradientColor = "#8884d8",
	showDetails = false,
	footerLabel = "",
	footerValue = "",
}) => {
	const dataKey = period === "day" ? "day" : "month";
	const gradientId = `${period}Gradient`;

	return (
		<Card className="bg-gray-800 border-none text-white">
			<CardHeader className="pb-2 flex flex-row justify-between items-center">
				<CardTitle className="text-base font-medium">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={data}
							margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
						>
							<defs>
								<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor={gradientColor} stopOpacity={0.8} />
									<stop offset="95%" stopColor={gradientColor} stopOpacity={0.2} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#444" />
							<XAxis
								dataKey={dataKey}
								axisLine={false}
								tickLine={false}
								tick={{ fill: '#aaa', fontSize: 12 }}
							/>
							<YAxis hide={true} />
							<Tooltip
								contentStyle={{ backgroundColor: '#333', border: 'none' }}
								labelStyle={{ color: '#fff' }}
							/>
							<Area
								type="monotone"
								dataKey="value"
								stroke={gradientColor}
								fillOpacity={1}
								fill={`url(#${gradientId})`}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>

				{showDetails ? (
					<div className="flex justify-center mt-4">
						<Button variant="outline" className="bg-white/80 hover:bg-white hover:text-blue-500 text-blue-500 font-black border-none w-[60%]">
							Details
						</Button>
					</div>
				) : (
					<div className="flex justify-between items-center mt-4 text-sm border-t border-white p-4">
						<span className="text-gray-400">{footerLabel}</span>
						<span className="font-medium">{footerValue}</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
