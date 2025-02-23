'use client';
import { endSession, fetchCustomerById, fetchPricings, fetchSessionByDeviceId } from '@/app/lib/api__structure';
import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

function CloseDialog({ deviceId, station, fetchData }) {

	const [session, setSession] = useState({});
	// For Redeemption
	const [AvailablePoint, setAvailablePoint] = useState(0);
	const [rupeeConversion, setrupeeConversion] = useState(0);
	const [minRedeemPoints, setminRedeemPoints] = useState(0);
	const [maxRedeemPoint, setmaxRedeemPoint] = useState(0);
	const [RedeemAmount, setRedeemAmount] = useState(0); // Points
	const [AmountPayable, setAmountPayable] = useState(0);
	const [originalAmount, setOriginalAmount] = useState(0); // Store original amount
	// For Session Close
	const [PaymentMode, setPaymentMode] = useState('')
	// UI
	const [isOpen, setIsOpen] = useState(false);
	const [ErrorDisplay, setErrorDisplay] = useState('');

	useEffect(() => {
		async function fetchSessionInfo() {
			const sessionInfo = await fetchSessionByDeviceId(deviceId);
			if (sessionInfo?.success) {
				const customer = await fetchCustomerById({ customerId: sessionInfo?.output.customer_id });
				const pricing = await fetchPricings({ branch_id: sessionInfo?.output.branch_id });
				setAvailablePoint(customer.total_rewards);
				setrupeeConversion(pricing.items[0].rupee_conversion);
				setminRedeemPoints(pricing.items[0].reedem_limit_min_points);
				const maxReedeemPoints = sessionInfo.output.total_amount * pricing.items[0].redeem_limit_max_rate * 0.1;
				setmaxRedeemPoint(customer.total_rewards > maxReedeemPoints ? maxReedeemPoints.toFixed(0) : customer.total_rewards)
				setAmountPayable(sessionInfo.output.total_amount)
				setOriginalAmount(sessionInfo.output.total_amount)
				setAvailablePoint(customer.total_rewards);
				setSession(sessionInfo.output)
			}
		}
		fetchSessionInfo();
	}, []);

	if (!session?.id) {
		return (
			<></>
		)
	}

	async function handleClose() {
		try {
			const result = await endSession({
				sessionId: session?.id,
				AmountPayable: AmountPayable,
				RedeemAmount: RedeemAmount,
				PaymentMode: PaymentMode
			});
			console.log(result);
			setIsOpen(false);
		} catch (error) {
			console.log(error)
		} finally {
			await fetchData();
		}
	}

	function handleReedemAmountChange(e) {
		e.preventDefault();
		const redeem_points = Number(e.target.value);

		try {
			if (redeem_points > maxRedeemPoint) {
				setErrorDisplay(`Can't redeem more than ${maxRedeemPoint} GG Points`);
				setRedeemAmount(maxRedeemPoint);
				// Calculate amount payable with max points
				const redeem_amount = maxRedeemPoint * rupeeConversion * 0.01;
				setAmountPayable((originalAmount - redeem_amount).toFixed(0));
			} else {
				setErrorDisplay('');
				setRedeemAmount(redeem_points);
				// Calculate amount payable with entered points
				const redeem_amount = redeem_points * rupeeConversion * 0.01;
				setAmountPayable((originalAmount - redeem_amount).toFixed(0));
			}
		} catch (error) {
			console.error('Error in handleReedemAmountChange:', error);
		}
	}


	return (
		<>
			<Dialog
				open={isOpen}
				onOpenChange={setIsOpen}
				className='w-full'
			>
				<DialogTrigger className='w-full'>
					<h1
						disabled={station?.status === 'open'}
						className={`mt-4 text-sm text-white w-full bg-blue-500 py-2.5 px-4 font-bold rounded-full ${station?.status === 'open' && 'hidden'}`}
					>
						Close

					</h1>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Close Session</DialogTitle>
						<DialogDescription>
							This action cannot be undone.
						</DialogDescription>
						<div className='pt-6 pb-4'>
							<div className='flex flex-wrap items-center justify-between'>
								<h1 className='font-bold pb-6'>Available Points: {AvailablePoint} GG</h1>
								<h1 className='font-bold pb-6'>Amount Payable: Rs.{AmountPayable}</h1>
							</div>
							{
								AvailablePoint > minRedeemPoints ?
									(
										<>
											<Label> Points Reedemed </Label>
											<Input
												type='number'
												value={RedeemAmount}
												onChange={handleReedemAmountChange}
												max={maxRedeemPoint}
											/>
											<Label>Can reedem points upto: {maxRedeemPoint} GG </Label>
										</>
									)
									: (
										<Label className='text-red-500'>Not enough points to redeem... </Label>
									)
							}
							{
								ErrorDisplay && (<h1 className='text-red-500 text-xs italic'>{ErrorDisplay}</h1>)
							}
						</div>

						<div className='py-4 grid gap-2'>
							<Label>Payment Mode</Label>
							<Select
								onValueChange={(value) => { setPaymentMode(value); }}
							>
								<SelectTrigger className='cursor-pointer'>
									<SelectValue placeholder="Select Payment Mode" />
								</SelectTrigger>
								<SelectContent className='cursor-pointer'>
									<SelectItem value='Cash'>Cash</SelectItem>
									<SelectItem value='Upi'>Upi</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Button
							onClick={handleClose}
							className='mt-6'
						>
							Close Session
						</Button>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default CloseDialog;
