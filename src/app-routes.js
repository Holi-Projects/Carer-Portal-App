import { withNavigationWatcher } from './contexts/navigation';
import changePasswordForm from '../src/components/change-password-form/change-password-form';
import {
	HomePage,
	ProfilePage,
	RostersPage,
	AvailabilityPage,
	ContactPage,
	IncidentReportPage,
	UnconfirmedShiftsPage,
	UnavailabilityPage,
	InjuryClaimPage,
	PastSubmissionsPage,
} from './pages';

const routes = [
	{
		path      : '/changePassword',
		component : changePasswordForm,
	},
	{
		path      : '/profile',
		component : ProfilePage,
	},
	{
		path      : '/home',
		component : HomePage,
	},
	{
		path      : '/rosters',
		component : RostersPage,
	},
	{
		path      : '/unconfirmed-shifts',
		component : UnconfirmedShiftsPage,
	},
	{
		path      : '/availability',
		component : AvailabilityPage,
	},
	{
		path      : '/unavailability',
		component : UnavailabilityPage,
	},
	{
		path      : '/contact',
		component : ContactPage,
	},
	{
		path      : '/incident-report',
		component : IncidentReportPage,
	},
	{
		path      : '/injury-claim',
		component : InjuryClaimPage,
	},
	{
		path      : '/past-submissions',
		component : PastSubmissionsPage,
	},
];

export default routes.map((route) => {
	return {
		...route,
		component : withNavigationWatcher(route.component),
	};
});
