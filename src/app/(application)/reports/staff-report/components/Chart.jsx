"use client";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
	Cell
} from "recharts";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Blue600 } from "@/constants/colors";

// Chart component with alternating colored bars
export const ChartComponent = ({
	title,
	data,
	period = "day", // 'day' or 'month'
	primaryColor = "#FFFFFF",
	secondaryColor = "#3B82F6", // Blue color
}) => {
	const dataKey = period === "day" ? "day" : "month";

	return (
		<Card>
			<CardHeader className="pb-2 flex flex-row justify-between items-center">
				<CardTitle className="text-base font-bold">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={data}
							margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
						>
							<CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#444" />
							<XAxis
								dataKey={dataKey}
								axisLine={false}
								tickLine={false}
								tick={{ fill: '#aaa', fontSize: 12 }}
							/>
							<YAxis hide={true} />
							<Tooltip
								contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }}
								labelStyle={{ color: '#fff' }}
								cursor={{ fill: 'rgba(100, 100, 100, 0.2)' }}
							/>
							<Bar
								dataKey="value"
								radius={[4, 4, 0, 0]}
								barSize={30}
								fill={Blue600}
							>
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={index % 2 === 0 ? primaryColor : secondaryColor}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
};
