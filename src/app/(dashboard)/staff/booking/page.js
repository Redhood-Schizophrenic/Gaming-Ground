'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchInventory, fetchSessions } from '@/app/lib/api__structure'; // Import fetchInventory function
import { Clock, TvMinimal } from 'lucide-react';
import BookingModal from "@/components/ui/BookingModal"; // Import the BookingModal component
import { useSession } from '@/app/context/SessionContext';
import ExtendDialog from '@/components/booking/ExtendDialog';
import CloseDialog from '@/components/booking/CloseDialog';

export default function BookingPage() {
    const [stations, setStations] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [BranchId, setBranchId] = useState('');
    const [UserId, setUserId] = useState('');
    const [selectedStation, setSelectedStation] = useState(null);
    const { user } = useSession();


    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        setBranchId(user.branch_id[0]);
        setUserId(user.id);
        try {
            const deviceData = await fetchInventory(1, 50, 'device'); // Fetch devices
            const sessionsData = await fetchSessions();
            setStations(deviceData.items);
            setSessions(sessionsData.items);
        } catch (error) {
            console.error('Failed to fetch devices:', error);
            toast.error('Failed to load devices');
        } finally {
            setLoading(false);
        }
    };

    const getNextAvailableTime = (id, status) => {
        const session = sessions.find(s => id === s?.expand?.device_id?.id);
        if (session && session.status === 'Occupied' && status === 'booked') {
            return new Date(session.session_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return 'Now';
    };

    const handleBooking = (station) => {
        setSelectedStation(station);
        setIsModalOpen(true);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
                {
                    stations.map((station, index) => (
                        <Card key={index} className='p-4 text-lg bg-gray-800 border border-blue-800/30'>
                            <CardTitle></CardTitle>
                            <CardContent>
                                <div className='flex items-center justify-between'>
                                    <h1 className='text-lg font-semibold'>{station.name}</h1>
                                    <p className={`text-sm rounded-full px-3 py-1.5
                                        ${station.status === 'open' ? 'bg-green-800/60 text-green-500' : (
                                            station.status === 'booked' ? 'bg-red-800/30 text-red-500' :
                                                'bg-gray-800/60 text-gray-500'
                                        )}
                                    `}>
                                        {station.status}
                                    </p>
                                </div>
                                <div className='pt-4 w-full flex flex-col gap-1.5'>
                                    <div className='flex gap-2 text-base items-center text-gray-400'>
                                        <Clock size={20} /><h1>No. of Players: 4</h1>
                                    </div>
                                    <div className='flex gap-2 text-base items-center text-gray-400'>
                                        <TvMinimal size={20} /><h1>Next Session: 09:00 PM</h1>
                                    </div>
                                    <Button
                                        disabled={station.status !== 'open'}
                                        onClick={() => handleBooking(station)}
                                        className={`mt-4 text-white font-bold rounded-lg ${station.status !== 'open' && 'hidden'}`}
                                    >
                                        Book Now
                                    </Button>
                                    <div className='flex items-center gap-3 w-full'>
                                        {
                                            station.status !== open && (
                                                <>
                                                    <ExtendDialog
                                                        deviceId={station.id}
                                                        station={station}
                                                        fetchData={fetchStations}
                                                    />
                                                    <CloseDialog
                                                        deviceId={station.id}
                                                        station={station}
                                                        fetchData={fetchStations}
                                                    />
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                station={selectedStation}
                onBookingSuccess={() => {
                    setIsModalOpen(false);
                    // Optionally refresh the booking page or show a success message
                }}
                Data={{ BranchId, UserId }}
                fetchData={fetchStations}
            />
        </div>
    );
}
