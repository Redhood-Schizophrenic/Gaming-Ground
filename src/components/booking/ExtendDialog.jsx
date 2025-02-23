'use client';
import { extendSession, fetchSessionByDeviceId } from '@/app/lib/api__structure';
import React, { useEffect, useState } from 'react'
import QuantityInput from '../ui/QuantityInput';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

function ExtendDialog({ deviceId, station, fetchData }) {

	const [session, setSession] = useState({});
	const [Players, setPlayers] = useState(1);
	const [Duration, setDuration] = useState(1);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		async function fetchSessionInfo() {
			const sessionInfo = await fetchSessionByDeviceId(deviceId);
			if (sessionInfo?.success) {
				setSession(sessionInfo.output)
				setPlayers(sessionInfo.output.no_of_players);
				setDuration(sessionInfo.output.duration_hours);
			}
		}
		fetchSessionInfo();
	}, []);

	if (!session?.id) {
		return (
			<></>
		)
	}

	async function handleExtend() {
		try {
			console.log(session);
			await extendSession({
				id: session?.id,
				duration: Duration,
				no_of_players: Players,
				branchId: session?.branch_id
			});
			setIsOpen(false);
		} catch (error) {
			console.log(error)
		} finally {
			await fetchData();
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
						Extend
					</h1>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Extend Session</DialogTitle>
						<DialogDescription>
							This action cannot be undone.
						</DialogDescription>
						<div className='py-6 flex lg:flex-row flex-col items-center justify-between'>
							<div className='flex flex-col gap-2'>
								<Label className='font-bold'> No of Players </Label>
								<QuantityInput value={Players} onChange={setPlayers} />
							</div>
							<div className='flex flex-col gap-2 lg:mt-0 mt-4'>
								<Label className='font-bold'> Duration(Hours) </Label>
								<QuantityInput value={Duration} onChange={setDuration} />
							</div>
						</div>
						<Button
							onClick={handleExtend}
						>
							Extend Session
						</Button>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default ExtendDialog;
