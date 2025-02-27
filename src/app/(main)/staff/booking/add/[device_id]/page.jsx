'use client';

import React, { useEffect, useState } from 'react'
import { CustomersData, device_pricings, devices, games, rewardSystemPricing, snacks, TimeList } from '../../data';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import QuantityInput from '@/components/ui/quantity-input';
import { Button } from '@/components/ui/button';
import { BadgeIndianRupee, Trash, X } from 'lucide-react';

function NewSession({ params }) {
	const router = useRouter();
	const resolvedParams = React.use(params);
	const slug = resolvedParams.device_id || '';
	const [Device, setDevice] = useState({})

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [Customers, setCustomers] = useState([]);
	const [Players, setPlayers] = useState(1);
	const [perPrice, setPerPrice] = useState(0);
	const [Duration, setDuration] = useState(1)
	const [displayDiscount, setDisplayDiscount] = useState(false);
	const [formDetails, setformDetails] = useState({
		customer_id: '',
		customer_name: '',
		customer_contact: '',
		game: {},
		snacks: [],
		subTotal: 0,
		DiscountRate: 0,
		DiscountAmt: 0,
		totalPrice: 0,
		rewardPoints: 0
	});
	const [Pricings, setPricings] = useState({
		single: 0,
		duo: 0,
		multi: 0,
		creditRate: 0,
	});

	useEffect(() => {
		const getDeviceDetails = () => {
			setLoading(true);
			try {
				const device_info = devices.filter((device_data) => device_data.slug === slug);
				if (device_info?.length > 0) {
					setDevice(device_info[0] || {});
					const pricing = device_pricings.filter((pricing) => pricing.device_type === device_info[0].type);
					setPricings({
						single: pricing[0].single,
						duo: pricing[0].duo,
						multi: pricing[0].multi,
						creditRate: rewardSystemPricing.creditRate
					});
					setCustomers(CustomersData);
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
	}, [router, slug]);

	// Calculate price whenever relevant factors change
	useEffect(() => {
		calcPrice();
	}, [formDetails.snacks, Players, Duration, formDetails.DiscountRate, formDetails.DiscountAmt, Device]);

	// Calculate the price based on all factors
	const calcPrice = () => {
		// Calculate snacks price
		const snacksTotal = formDetails.snacks.reduce((total, item) => {
			return total + (item.quantity * item.snack.price);
		}, 0);

		// Calculate gaming price based on device type
		let gamingPrice = 0;
		if (Device.type === 'VR Gaming') {
			// VR Gaming has a fixed price per session
			gamingPrice = Device.price;
		} else {
			// Other device types charge based on players and duration
			if (Players === 1) {
				setPerPrice(Pricings.single);
				gamingPrice = Pricings.single * Players * Duration;
			} else if (Players === 2) {
				setPerPrice(Pricings.duo);
				gamingPrice = Pricings.duo * Players * Duration;
			} else {
				setPerPrice(Pricings.multi);
				gamingPrice = Pricings.multi * Players * Duration;
			}
		}

		// Calculate subtotal
		const subTotal = snacksTotal + gamingPrice;

		// Calculate discount
		let discountAmount = 0;
		if (formDetails.DiscountRate > 0) {
			discountAmount = (subTotal * formDetails.DiscountRate) / 100;
		} else if (formDetails.DiscountAmt > 0) {
			discountAmount = formDetails.DiscountAmt;
		}

		// Calculate total after discount
		const totalAfterDiscount = subTotal - discountAmount;

		// Calculate reward points (assuming 1% of total)
		const rewardPoints = Math.round(totalAfterDiscount * Pricings.creditRate * 0.01);

		// Update form details with calculated values
		setformDetails(prev => ({
			...prev,
			subTotal: subTotal,
			DiscountAmt: discountAmount,
			totalPrice: totalAfterDiscount,
			rewardPoints: rewardPoints
		}));
	};

	const handleCustomerSearch = async (e) => {
		const value = e.target.value;

		// Update customer name in form details
		setformDetails(prev => ({
			...prev,
			customer_name: value
		}));

		if (value.trim() === '') {
			setCustomers([]);
			setformDetails(prev => ({
				...prev,
				customer_contact: ''
			}));
			return;
		}

		// Check if the input matches a datalist option
		const selectedOption = document.querySelector(`option[value="${value}"]`);
		if (selectedOption) {
			const [name, contact] = selectedOption.text.split(' - ');
			setformDetails(prev => ({
				...prev,
				customer_name: name,
				customer_contact: contact
			}));
		}

		// Fixed: Filter customers properly by name using a case-insensitive regex
		const fetchedCustomers = CustomersData.filter(
			(customer) => customer.customer_name.toLowerCase().includes(value.toLowerCase())
		);
		setCustomers(fetchedCustomers);
	};

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
		if (snack_info.length > 0) {
			// Check if the snack already exists in the list
			const existingSnackIndex = formDetails.snacks.findIndex(
				item => item.snack.id === snack_info[0].id
			);

			if (existingSnackIndex !== -1) {
				// If snack already exists, increase its quantity
				const updatedSnacks = [...formDetails.snacks];
				updatedSnacks[existingSnackIndex].quantity += 1;
				updatedSnacks[existingSnackIndex].price = updatedSnacks[existingSnackIndex].quantity * snack_info[0].price;

				setformDetails({
					...formDetails,
					snacks: updatedSnacks
				});
			} else {
				// Otherwise add new snack
				setformDetails({
					...formDetails,
					snacks: [...formDetails.snacks, {
						snack: snack_info[0],
						quantity: 1,
						price: snack_info[0].price
					}]
				});
			}
		}
	}

	const handleSnackQuantity = ({ value, props }) => {
		// Assuming props contains the snack index
		if (props !== null && typeof props === 'number') {
			const updatedSnacks = [...formDetails.snacks];
			updatedSnacks[props].quantity = value;
			updatedSnacks[props].price = value * updatedSnacks[props].snack.price;

			setformDetails({
				...formDetails,
				snacks: updatedSnacks
			});
		}
	};

	const handleRemoveSnack = (index) => {
		const updatedSnacks = [...formDetails.snacks];
		updatedSnacks.splice(index, 1);

		setformDetails({
			...formDetails,
			snacks: updatedSnacks
		});
	};

	const toggleDiscount = () => {
		if (displayDiscount) {
			setformDetails({
				...formDetails,
				DiscountAmt: 0,
				DiscountRate: 0
			});
		}
		setDisplayDiscount(!displayDiscount);
	};

	const handleDiscountRateChange = (e) => {
		const rate = parseFloat(e.target.value) || 0;
		setformDetails({
			...formDetails,
			DiscountRate: rate,
			DiscountAmt: rate > 0 ? (formDetails.subTotal * rate / 100) : 0
		});
	};

	const handleDiscountAmtChange = (e) => {
		const amt = parseFloat(e.target.value) || 0;
		setformDetails({
			...formDetails,
			DiscountAmt: amt,
		});
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
						onChange={handleCustomerSearch}
						placeholder='eg; John Doe'
						list="customerList"
					/>
					<datalist id="customerList">
						{Customers.map((customer, index) => (
							<option key={index} value={customer.customer_name}>
								{customer.customer_name} - {customer.customer_contact}
							</option>
						))}
					</datalist>
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
						onValueChange={(value) => {
							const selectedGame = games.find(game => game.name === value);
							setformDetails({ ...formDetails, game: selectedGame || {} })
						}}
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
							<div key={index} className='flex w-full items-center justify-between mt-2 p-2 border rounded'>
								<div className='grid gap-2'>
									<h1 className='font-bold text-xs'>{snack.snack.name}</h1>
									<span className='text-xs'>Price:  ₹{snack.price}</span>
								</div>
								<QuantityInput
									value={snack.quantity}
									onChange={handleSnackQuantity}
									props={index}
									required={true}
								/>
								<div className='flex items-center justify-end gap-4'>
									<button
										className='bg-red-500 text-white p-2 rounded-lg'
										size="sm"
										onClick={() => handleRemoveSnack(index)}
									>
										<Trash className="h-4 w-4" />
									</button>
								</div>
							</div>
						))
					}
				</div>
			</div>

			{
				Device.type !== 'VR Gaming' && (
					<div className='grid md:grid-cols-2 gap-4 mt-6'>
						<div>
							<Label>No. Of Players</Label>
							<QuantityInput value={Players} onChange={setPlayers} required={true} />
						</div>
						<div>
							<Label>Duration (in hrs)</Label>
							<Select
								defaultValue={Duration}
								onValueChange={(value) => { setDuration(value) }}
								disabled={Device.status !== 'open'}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Duration" />
								</SelectTrigger>
								<SelectContent>
									{
										TimeList
											.map((item, index) => (
												<SelectItem key={index} value={item.value}>{item.displayValue}</SelectItem>
											))
									}
								</SelectContent>
							</Select>
						</div>
					</div>
				)
			}

			<Button
				className='mt-6'
				onClick={toggleDiscount}
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
							<Label>Discount (in %)</Label>
							<Input
								type='number'
								value={formDetails.DiscountRate}
								onChange={handleDiscountRateChange}
								placeholder='Discount Percent(%)'
							/>
						</div>
						<div>
							<Label>Discount (in Rs.)</Label>
							<Input
								type='number'
								disabled={formDetails.DiscountRate !== 0}
								value={formDetails.DiscountAmt}
								onChange={handleDiscountAmtChange}
								placeholder='Discount Amount'
							/>
						</div>
					</div>
				)
			}

			{/* Order Summary */}
			<Card className="w-full h-auto mx-auto mt-8">
				<CardHeader>
					<CardTitle>Order Summary</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Gaming details */}
					{Device.type && (
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<div className='flex flex-col'>
									<span className="text-sm font-semibold">{Device.name} ({Device.type})</span>
									{Device.type !== 'VR Gaming' ? (
										<span className=" text-xs text-gray-300">
											₹{perPrice} × {Players} Players × {Duration} Hrs
										</span>
									) : (
										<span className="font-thin text-sm">₹{Device.price}</span>
									)}
								</div>
								<div>
									<span className='font-semibold'> ₹{Players * Duration * perPrice} </span>
								</div>
							</div>
						</div>
					)}

					{/* Snacks */}
					{formDetails.snacks.length > 0 && (
						<div className="space-y-2">
							<h3 className="text-sm font-medium">Snacks</h3>
							{formDetails.snacks.map((item, index) => (
								<div key={index} className="flex justify-between items-center">
									<span className="text-sm">{item.snack.name} (×{item.quantity})</span>
									<span className="font-semibold">₹{item.price}</span>
								</div>
							))}
						</div>
					)}

					{/* Totals */}
					<div className="space-y-2 pt-4 border-t">
						<div className="flex justify-between items-center">
							<span className="text-sm">Subtotal</span>
							<span className="font-semibold">₹{formDetails.subTotal}</span>
						</div>
						{
							displayDiscount && formDetails.DiscountAmt > 0 && (
								<div className="flex justify-between items-center">
									<span className="text-sm">
										Discount ({formDetails.DiscountRate > 0 ? `${formDetails.DiscountRate}%` : 'Fixed'})
									</span>
									<span className="font-semibold"> - ₹{formDetails.DiscountAmt}</span>
								</div>
							)
						}
						<div className='border-b w-full rounded-full'></div>
						<div className="flex justify-between items-center">
							<span className="font-semibold">Total</span>
							<span className="font-bold text-lg">₹{formDetails.totalPrice}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-semibold">Reward Points</span>
							<span className="font-bold text-lg">{formDetails.rewardPoints}</span>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						className="w-full"
						disabled={
							!formDetails.customer_name ||
							!formDetails.customer_contact ||
							!formDetails.game.name ||
							Device.status !== 'open'
						}
					>
						Create Session
					</Button>
				</CardFooter>
			</Card>
		</>
	)
}

export default NewSession;
