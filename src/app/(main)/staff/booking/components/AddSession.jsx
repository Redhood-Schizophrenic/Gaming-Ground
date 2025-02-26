'use client';

import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
function AddSession({ device }) {

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='w-full'> Book Now </Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>New Session</DialogTitle>
					<DialogDescription>
						Create a New Session for {device.name}
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid items-start gap-2">
						<Label> Customer Name </Label>
						<Input
							type='text'
							placeholder='eg; John Doe'
						/>
					</div>
					<div className="grid items-start gap-2">
						<Label> Customer Contact </Label>
						<Input
							type='text'
							placeholder='eg; 1234567890'
						/>
					</div>
				</div>
				<DialogFooter>
					<Button className='w-full' type="submit">Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default AddSession
