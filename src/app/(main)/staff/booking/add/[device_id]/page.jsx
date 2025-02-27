'use client';

import React, { useEffect, useState } from 'react'
import { devices, games, snacks } from '../../data';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import QuantityInput from '@/components/ui/quantity-input';
import { Button } from '@/components/ui/button';
import { BadgeIndianRupee, X } from 'lucide-react';

function NewSession({ params }) {
	const router = useRouter();
	const resolvedParams = React.use(params);
	const slug = resolvedParams.device_id || '';
	const [Device, setDevice] = useState({})

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [Players, setPlayers] = useState(1);
	const [Duration, setDuration] = useState(1)
	const [displayDiscount, setDisplayDiscount] = useState(false);
	const [formDetails, setformDetails] = useState({
		customer_name: '',
		customer_contact: '',
		game: {},
		snacks: [],
		DiscountRate: 0,
		DiscountAmt: 0
	});



	useEffect(() => {
		const getDeviceDetails = () => {
			setLoading(true);
			try {
				const device_info = devices.filter((device_data) => device_data.slug === slug);
				if (device_info?.length > 0) {
					setDevice(device_info[0] || {});
				} else {
					throw new Error('Device Not Found');
				}
			} catch (error) {
				setError(error.message);
				// Redirect to bookings page after a short delay
				setTimeout(() => {
					router.push('/staff/booking');
				}, 3000);
			} finally {
				setLoading(false);
			}
		}
		getDeviceDetails();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<div className="text-xl text-red-500 mb-4">Device not found</div>
				<div className="text-gray-600">Redirecting to bookings page...</div>
			</div>
		);
	}

	const handleSnacks = (snack_id) => {
		const snack_info = snacks.filter((snack) => snack.id === snack_id);
		console.log(snack_info);
		setformDetails({
			...formDetails,
			snacks: [...formDetails.snacks, { snack: snack_info[0], quantity: 1, price: 1 * snack_info[0].price }]
		});
	}

	const handleSnackQuantity = ({ value, props }) => {
		// Assuming props contains the snack index
		if (props !== null && typeof props === 'number') {
			const updatedSnacks = [...formDetails.snacks];
			updatedSnacks[props].quantity = value;

			setformDetails({
				...formDetails,
				snacks: updatedSnacks
			});
		}
	};

	return (
		<>
			<h1 className='font-bold text-xl pb-6 w-full'> Create a new session for {Device.name} </h1>
			<div className='grid md:grid-cols-2 gap-4'>
				<div>
					<Label>Customer Name</Label>
					<Input
						type='text'
						disabled={Device.status !== 'open'}
						value={formDetails.customer_name}
						onChange={(e) => setformDetails({ ...formDetails, customer_name: e.target.value })}
						placeholder='eg; John Doe'
					/>
				</div>
				<div>
					<Label>Customer Contact</Label>
					<Input
						type='text'
						disabled={Device.status !== 'open'}
						value={formDetails.customer_contact}
						onChange={(e) => setformDetails({ ...formDetails, customer_contact: e.target.value })}
						minLength={10}
						maxLength={10}
						placeholder='eg; 1234567890'
					/>
				</div>
				<div>
					<Label>Game</Label>
					<Select
						onValueChange={(value) => { setformDetails({ ...formDetails, game: value }) }}
						disabled={Device.status !== 'open'}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select Game" />
						</SelectTrigger>
						<SelectContent>
							{
								games
									.filter((game) => game.type === Device.type)
									.map((game, index) => (
										<SelectItem key={index} value={game.name}>{game.name}</SelectItem>
									))
							}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className='grid gap-4 mt-6 h-auto'>
				<h1 className='text-lg font-bold'>Snacks</h1>
				<div>
					<Label>Snacks</Label>
					<Select
						onValueChange={(value) => { handleSnacks(value) }}
						disabled={Device.status !== 'open'}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select Snacks" />
						</SelectTrigger>
						<SelectContent>
							{
								snacks
									.filter((item) => item.quantity > 0)
									.map((item, index) => (
										<SelectItem key={index} value={item.id}>{item.name}</SelectItem>
									))
							}
						</SelectContent>
					</Select>
					{
						formDetails.snacks.map((snack, index) => (
							<div key={index} className='flex w-full items-center justify-between'>
								<h1 className='font-bold text-lg'>{snack.snack.name}</h1>
								<QuantityInput
									value={snack.quantity}
									onChange={handleSnackQuantity}
									props={index}
									required={true}
								/>
							</div>
						))
					}
				</div>
			</div>

			{
				Device.type !== 'VR Gaming' && (

					<div className='grid md:grid-cols-2 gap-4 mt-6'>
						<div>
							<Label>No.Of Players</Label>
							<QuantityInput value={Players} onChange={setPlayers} required={true} />
						</div>
						<div>
							<Label>Duration(in hrs)</Label>
							<QuantityInput value={Duration} onChange={setDuration} required={true} />
						</div>
					</div>
				)
			}

			<Button
				className='mt-6'
				onClick={() => {
					if (displayDiscount) {
						setformDetails({ ...formDetails, DiscountAmt: 0 });
						setformDetails({ ...formDetails, DiscountRate: 0 });
					}
					setDisplayDiscount(!displayDiscount);
				}}
			>
				{!displayDiscount ? (
					<div className='flex gap-2 items-center'>
						<BadgeIndianRupee />
						<h1> Add Discount </h1>
					</div>
				) : (
					<div className='flex gap-2 items-center'>
						<X />
						<h1> Reset </h1>
					</div>
				)}
			</Button>
			{
				displayDiscount && (
					<div className='grid md:grid-cols-2 gap-4 mt-6'>
						<div>
							<Label>Discount (in Rs.)</Label>
							<Input
								type='number'
								disabled={formDetails.DiscountAmt !== 0}
								value={formDetails.DiscountRate}
								onChange={(e) => setformDetails({ ...formDetails, DiscountRate: e.target.value })}
								placeholder='Discount Amount'
							/>
						</div>
						<div>
							<Label>Discount (in %)</Label>
							<Input
								type='number'
								disabled={formDetails.DiscountRate !== 0}
								value={formDetails.DiscountAmt}
								onChange={(e) => setformDetails({ ...formDetails, DiscountAmt: e.target.value })}
								placeholder='Discount Percent(%)'
							/>
						</div>
					</div>
				)
			}

		</>
	)
}

export default NewSession;
