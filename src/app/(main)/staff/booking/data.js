import colors from "@/constants/colors";
import { FaPlaystation } from "react-icons/fa6";
import { LiaVrCardboardSolid } from "react-icons/lia";
import { GiSteeringWheel } from "react-icons/gi";
import { BsHeadsetVr } from "react-icons/bs";

export const devices = [
	{
		name: 'PS-1',
		type: 'Playstation',
		slug: 'ps-1',
		status: 'open'
	},
	{
		name: 'PS-2',
		type: 'Playstation',
		slug: 'ps-2',
		status: 'open'
	},
	{
		name: 'PS-3',
		type: 'Playstation',
		slug: 'ps-3',
		status: 'booked'
	},
	{
		name: 'PS-4',
		type: 'Playstation',
		slug: 'ps-4',
		status: 'open'
	},
	{
		name: 'VR-1',
		type: 'VR Gaming',
		slug: 'vr-1',
		status: 'open'
	},
	{
		name: 'VR-2',
		type: 'VR Gaming',
		slug: 'vr-2',
		status: 'booked'
	},
	{
		name: 'CSM-1',
		type: 'Car Simulator',
		slug: 'csm-1',
		status: 'open'
	},
	{
		name: 'CSM-2',
		type: 'Car Simulator',
		slug: 'csm-2',
		status: 'open'
	},
	{
		name: 'CSM-3',
		type: 'Car Simulator',
		slug: 'csm-3',
		status: 'open'
	},
];

export const device_categories = [
	{
		name: 'Playstation',
		icon: FaPlaystation,
		iconClass: 'bg-gray-800 p-2 rounded-full',
		iconColor: colors.Gray600,
	},
	{
		name: 'VR Gaming',
		icon: BsHeadsetVr,
		iconClass: 'bg-gray-800 p-2 rounded-full',
		iconColor: colors.Gray600,
	},
	{
		name: 'Car Simulator',
		icon: GiSteeringWheel,
		iconClass: 'bg-gray-800 p-2 rounded-full',
		iconColor: colors.Gray600,
	},
]


export const games = [
	{
		name: 'Mortal Kombat',
		type: 'Playstation',
		played_time: 76,
	},
	{
		name: 'WWE 2k24',
		type: 'Playstation',
		played_time: 70,
	},
	{
		name: 'FIFA 2025',
		type: 'Playstation',
		played_time: 63,
	},
	{
		name: 'Rocket League',
		type: 'Playstation',
		played_time: 56,
	},
	{
		name: 'Boxing',
		type: 'VR Gaming',
		played_time: 47,
		price: 80
	},
	{
		name: 'Roller Coaster',
		type: 'VR Gaming',
		played_time: 69,
		price: 60
	},
	{
		name: 'Mortal Kombat',
		type: 'Car Simulator',
		played_time: 76,
	},
	{
		name: 'WWE 2k24',
		type: 'Car Simulator',
		played_time: 70,
	},
	{
		name: 'FIFA 2025',
		type: 'Car Simulator',
		played_time: 63,
	},
	{
		name: 'Rocket League',
		type: 'Car Simulator',
		played_time: 56,
	},
]

export const snacks = [
	{
		id: 1,
		name: 'Kurkure',
		type: 'Eatable',
		price: 25,
		quantity: 80,
	},
	{
		id: 2,
		name: 'Lays',
		type: 'Eatable',
		price: 25,
		quantity: 50,
	},
	{
		id: 3,
		name: 'Smoodh',
		type: 'Drinkable',
		price: 15,
		quantity: 90,
	},
	{
		id: 4,
		name: 'Water',
		type: 'Drinkable',
		price: 15,
		quantity: 0,
	},
]
