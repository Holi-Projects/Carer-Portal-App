import React from 'react';
import './availability.scss';
import AvailabilityList from '../../components/availability/AvailabilityList';

export default () => {
	return (
		<React.Fragment>
			<h2 className={'content-block'}>General Availability</h2>
			<div className={'content-block'}>
				<div className={'dx-card responsive-paddings'}>
					<AvailabilityList />
				</div>
			</div>
		</React.Fragment>
	);
};
