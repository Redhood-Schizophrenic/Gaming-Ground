import React from 'react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { TbDeviceGamepad3Filled } from "react-icons/tb";
import { BookX, CirclePlus, Clock, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BsController } from 'react-icons/bs';
import Link from 'next/link';

const InteractiveButtons = ({ device }) => {
	return (
		<>
			{
				device.status === 'open' ? (
					<Link href={`/staff/booking/add/${device.slug}`} className='w-full' >
						<Button className='w-full'> Book Now </Button>
					</Link>
				) : (
					<div className='grid grid-cols-3 gap-4 w-full'>
						<Button variant='success' className='flex gap-2 items-center'>
							<CirclePlus />
							<h1 className='lg:block hidden'> Extend </h1>
						</Button>
						<Button variant='warning' className='flex gap-2 items-center'>
							<Cookie />
							<h1 className='lg:block hidden'> Snacks </h1>
						</Button>
						<Button variant='destructive' className='flex gap-2 items-center'>
							<BookX />
							<h1 className='lg:block hidden'> End </h1>
						</Button>
					</div>
				)
			}
		</>
	)

}

function BookingCard({ device, selectedCategory }) {
	return (
		<Card>
			<CardHeader>
				<div className='grid md:grid-cols-2 gap-4'>
					<div className='flex items-center gap-2'>
						<selectedCategory.icon />
						<CardTitle>
							{device.name}
						</CardTitle>
					</div>
					<h1
						className={` text-center py-1 px-2 rounded-lg text-sm
							${device.status === 'open' ? 'bg-green-800/20 text-green-500' : 'bg-red-800/20 text-red-500'}
						`}
					>
						{
							device.status === 'open' ? 'Available' : 'Occupied'
						}
					</h1>
				</div>
			</CardHeader>
			{
				selectedCategory.name === 'Playstation' ? (
					<>

						<CardContent>
							<div className='flex items-center gap-2'>
								<BsController className='w-4 h-4' />
								<h1>No. of Players: 4</h1>
							</div>
							<div className='flex items-center gap-2'>
								<Clock className='w-4 h-4' />
								<h1>Next Session: 8:00pm</h1>
							</div>
						</CardContent>
						<CardFooter>
							<InteractiveButtons device={device} />
						</CardFooter>

					</>
				) : (
					selectedCategory.name === 'VR Gaming' ? (
						<>

							<CardContent>
								<div className='flex items-center gap-2'>
									<TbDeviceGamepad3Filled className='w-4 h-4' />
									<h1>Boxing</h1>
								</div>
							</CardContent>
							<CardFooter>
								<InteractiveButtons device={device} />
							</CardFooter>

						</>
					) : (
						<>
							<CardFooter>
								<InteractiveButtons device={device} />
							</CardFooter>

						</>
					)
				)
			}
		</Card>
	)
}

export default BookingCard	
