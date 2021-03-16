export const navigation = [
	{
		text : 'Home',
		path : '/home',
		icon : 'home',
	},

	{
		text : 'Profile',
		path : '/profile',
		icon : 'user',
	},
	{
		text  : 'Bookings',
		icon  : 'event',
		items : [
			{
				text : 'All Bookings',
				path : '/rosters',
			},
			{
				text : 'Unconfirmed Shifts',
				path : '/unconfirmed-shifts',
			},
		],
	},
	{
		text  : 'Timetable',
		icon  : 'clock',
		items : [
			{
				text : 'Availability',
				path : '/availability',
			},
			{
				text : 'Unavailability',
				path : '/unavailability',
			},
		],
	},
	{
		text : 'Contact',
		path : '/contact',
		icon : 'message',
	},
	{
		text  : 'Forms',
		icon  : 'warning',
		items : [
			{
				text : 'Incident Report',
				path : '/incident-report',
			},
			{
				text : 'Injury Claim',
				path : '/injury-claim',
			},

			{
				text : 'Past Submissions',
				path : '/past-submissions',
			},
		],
	},
];
