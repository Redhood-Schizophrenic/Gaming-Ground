'use client'
import React, { useState, useEffect } from 'react';
import { device_categories, devices } from './data';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import BookingCard from './components/BookingCard';

function Booking() {

	const [selectedCategory, setselectedCategory] = useState(device_categories[0])

	return (
		<section>
			<Select defaultValue={selectedCategory} onValueChange={(value) => { setselectedCategory(value); }} >
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Gaming Category" />
				</SelectTrigger>
				<SelectContent>
					{
						device_categories.map((category, index) => (

							<SelectItem key={index} value={category}>
								{category.name}
							</SelectItem>

						))
					}
				</SelectContent>
			</Select>

			<div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-4'>
				{
					devices
						.filter((device) => device.type === selectedCategory.name)
						.map((device, index) => (
							<BookingCard key={index} device={device} selectedCategory={selectedCategory} />
						))

				}
			</div>
		</section>
	)
}

export default Booking;
