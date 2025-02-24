'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Download, FileText } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useState } from 'react'

function Header() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false)

	return (
		<>

			<header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="/reports">Reports</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Customer Reports</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				{/* Dark Mode Toggle Button */}
				{mounted && (
					<Button
						variant="outline"
						size="icon"
						className="ml-auto bg-gray-800"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					>
						{theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
					</Button>
				)}
			</header>
			<div className="flex items-center justify-between p-4 pb-6">
				<h1 className="text-2xl font-bold">Customer Reports</h1>
				<div className='flex gap-2 items-center'>
					<div className="flex items-center gap-2">
						<Button variant="outline" className="bg-blue-700 hover:bg-blue-800 border-none">
							<Download className="h-4 w-4 mr-2" />
							Export
						</Button>
					</div>
				</div>
			</div>
		</>
	)
}

export default Header
