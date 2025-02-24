"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Banknote, Database, FileChartPie, UserCog, Users } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from "@/components/ui/sidebar"

export function AppSidebar({ ...props }) {
	const pathname = usePathname()

	// Dynamic data based on pathname
	const data = {
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/avatars/shadcn.jpg",
		},

		navMain: [
			{
				title: "Reports",
				url: "#",
				icon: FileChartPie,
				isActive: true,
				items: [
					{
						title: "Financial Reports",
						url: "/reports/financial",
						icon: Database,
					},
					{
						title: "Expenses Reports",
						url: "/reports/expense",
						icon: Banknote,
					},
					{
						title: "Customer Reports",
						url: "/reports/customer",
						icon: Users,
					},
					{
						title: "Staff Reports",
						url: "/reports/staff",
						icon: UserCog,
					},
				].map((item) => ({
					...item,
					isSelected: item.url === pathname, // Dynamically set isSelected
				})),
			},
		],
	}

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
