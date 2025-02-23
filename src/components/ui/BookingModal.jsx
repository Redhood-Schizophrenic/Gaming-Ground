'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addSession, fetchCustomerId, fetchCustomers, fetchInventory, fetchPricings } from '@/app/lib/api__structure';
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function BookingModal({ isOpen, onClose, station, onBookingSuccess, Data, fetchData }) {
    const [customerName, setCustomerName] = useState('');
    const [customerContact, setCustomerContact] = useState('');
    const [customers, setCustomers] = useState([]);
    const [games, setGames] = useState([]);
    const [snacks, setSnacks] = useState([]);
    const [selectedGame, setSelectedGame] = useState('');
    const [selectedSnack, setSelectedSnack] = useState('');
    const [noOfPlayers, setNoOfPlayers] = useState(1);
    const [durationHours, setDurationHours] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);
    const [rewardPoints, setRewardPoints] = useState(0);
    const [pricing, setPricing] = useState({
        single: 0,
        multiplayer: 0,
        overThree: 0,
        creditRate: 0.0,
        rupeeConversion: 0,
        redeemLimitMinPoints: 0,
        redeemLimitMaxRate: 0.0
    });

    useEffect(() => {
        const fetchData = async () => {
            const gamesData = await fetchInventory(1, 50, 'game');
            const snacksData = await fetchInventory(1, 50, 'snack');
            const pricingData = await fetchPricings({ branch_id: Data.BranchId })
            const fetchedCustomers = await fetchCustomers();
            setCustomers(fetchedCustomers);
            setGames(gamesData.items);
            setSnacks(snacksData.items);
            setPricing({
                single: pricingData.items[0].single_player,
                multiplayer: pricingData.items[0].multi_player,
                overThree: pricingData.items[0].over_three_player,
                creditRate: pricingData.items[0].credit_rate / 100,
                rupeeConversion: pricingData.items[0].rupee_conversion,
                redeemLimitMinPoints: pricingData.items[0].reedem_limit_min_points / (pricingData.items[0].rupee_conversion),
                redeemLimitMaxRate: pricingData.items[0].redeem_limit_max_rate / 100,
            });
        };

        fetchData();
    }, []);

    useEffect(() => {
        const calculateTotal = () => {
            let price = 0;
            if (noOfPlayers === 1) {
                price = pricing.single;
            } else if (noOfPlayers <= 3) {
                price = pricing.multiplayer;
            } else {
                price = pricing.overThree;
            }
            setTotalAmount(price * noOfPlayers * durationHours);
            setRewardPoints((price * noOfPlayers * durationHours * pricing.creditRate).toFixed(0));
        };

        calculateTotal();
    }, [noOfPlayers, pricing, durationHours]);

    const handleCustomerSearch = async (e) => {
        const value = e.target.value;
        setCustomerName(value);

        if (value.trim() === '') {
            setCustomers([]);
            setCustomerContact('');
            return;
        }

        // Check if the input matches a datalist option
        const selectedOption = document.querySelector(`option[value="${value}"]`);
        if (selectedOption) {
            const [name, contact] = selectedOption.text.split(' - ');
            setCustomerName(name);
            setCustomerContact(contact);
        }

        // Fetch customers for datalist
        const fetchedCustomers = await fetchCustomers(value);
        setCustomers(fetchedCustomers);
    };

    const handleSubmit = async () => {
        const CustomerId = await fetchCustomerId({ customerName, customerContact, userId: Data.UserId, branchId: Data.BranchId });

        const sessionData = {
            customer_id: CustomerId,
            device_id: station.id,
            game_id: selectedGame,
            branch_id: Data.BranchId,
            no_of_players: noOfPlayers,
            session_in: new Date().toISOString(),
            duration_hours: durationHours,
            total_amount: totalAmount,
            reward_points_earned: rewardPoints,
            snack_id: selectedSnack,
            status: 'active',
        };

        try {
            await addSession(sessionData);
            onBookingSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to book session:', error);
        } finally {
            await fetchData();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-800 text-white rounded-lg p-6">
                <DialogHeader>
                    <DialogTitle>Book a Session</DialogTitle>
                    <DialogDescription>
                        Please fill in the details below to book a session.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4 mt-8">
                    <div className='grid gap-2'>
                        <Label>Customer Name</Label>
                        <div className="relative">
                            <Input
                                type="text"
                                list="customerList"
                                placeholder="Customer Name"
                                value={customerName}
                                onChange={handleCustomerSearch}
                                className="border rounded p-2 w-full bg-gray-700 text-white"
                                required
                            />
                            <datalist id="customerList">
                                {customers.map(customer => (
                                    <option
                                        key={customer.id}
                                        value={customer.customer_name}
                                        data-contact={customer.customer_contact}
                                    >
                                        {customer.customer_name} - {customer.customer_contact}
                                    </option>
                                ))}
                            </datalist>
                        </div>
                    </div>
                    <div className='grid gap-2'>
                        <Label>Customer Contact</Label>
                        <Input
                            type="text"
                            placeholder="Contact"
                            value={customerContact}
                            onChange={(e) => setCustomerContact(e.target.value)}
                            className="border rounded p-2 w-full bg-gray-700 text-white"
                            required
                        />
                    </div>
                    {/* Rest of the form components remain the same */}
                    <div className='grid gap-2'>
                        <Label>Select Game</Label>
                        <Select
                            onValueChange={(value) => { setSelectedGame(value); }}
                        >
                            <SelectTrigger className='bg-gray-600 cursor-pointer'>
                                <SelectValue placeholder="Select Game" className="border rounded p-2 w-full bg-gray-700 text-white" />
                            </SelectTrigger>
                            <SelectContent className='bg-gray-600 cursor-pointer'>
                                {games.map(game => (
                                    <SelectItem key={game.id} value={game.id}>{game.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='grid gap-2'>
                        <Label>Snacks</Label>
                        <Select
                            onValueChange={(value) => { setSelectedSnack(value) }}
                        >
                            <SelectTrigger className='bg-gray-600 cursor-pointer'>
                                <SelectValue placeholder="Snacks Consumed" className="border rounded p-2 w-full bg-gray-700 text-white" />
                            </SelectTrigger>
                            <SelectContent className='bg-gray-600 cursor-pointer'>
                                {snacks.map(snack => (
                                    <SelectItem key={snack.id} value={snack.id}>{snack.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='grid gap-2'>
                        <Label>No of Players</Label>
                        <Input
                            type="number"
                            value={noOfPlayers}
                            onChange={(e) => setNoOfPlayers(Math.max(1, parseInt(e.target.value)))}
                            className="border rounded p-2 w-full bg-gray-700 text-white"
                            min="1"
                            required
                        />
                    </div>
                    <div className='grid gap-2'>
                        <Label>Duration (Hours)</Label>
                        <Input
                            type="number"
                            value={durationHours}
                            onChange={(e) => setDurationHours(Math.max(1, parseInt(e.target.value)))}
                            className="border rounded p-2 w-full bg-gray-700 text-white"
                            min="1"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <span>Total Amount: ₹{totalAmount}</span>
                        <span>Reward Points: {rewardPoints}</span>
                    </div>
                    <Button onClick={handleSubmit} className="mt-4 bg-blue-600 hover:bg-blue-700">
                        Confirm Booking
                    </Button>
                </div>
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none">
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
