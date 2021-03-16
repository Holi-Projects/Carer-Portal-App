import React, { useState, useEffect, useCallback } from 'react';
import Scheduler, { Resource, Editing } from 'devextreme-react/scheduler';
import { Popup } from 'devextreme-react/popup';
import { Button } from 'devextreme-react/button';
import { useScreenSize } from '../../utils/media-query';
import fetchData from '../../api/fetchData';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import LeaveBookingForm from './LeaveBookingForm.js';
import BookingDetails from '../booking/BookingDetails.js';
import LeaveBookingDetails from './LeaveBookingDetails.js'
import { LoadIndicator } from 'devextreme-react/load-indicator';

const dateFns = require('date-fns');

const UnavailableCalendar = (props) => {
	const getMonday = (d) => {
		d = new Date(d);
		var day = d.getDay(),
			diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
		return new Date(d.setDate(diff));
	};
	const dateFormat = 'yyyy-MM-dd';
	const defaultView = 'month';
	const views = [ 'day', 'week', 'month', 'agenda' ];
	const currentDate = getMonday(new Date());
	const [ date, setDate ] = useState(dateFns.format(currentDate, dateFormat));
	const [ view, setView ] = useState(defaultView);
	const [ popupStatus, setPopupStatus ] = useState(false);
	const [ popupType, setPopupType ] = useState("addLeaveEvent");
	const [ data, setData ] = useState(null);
	const [ formSubmitted, setFormStatus ] = useState(false);
	const [ currentEvent, setCurrentEvent ] = useState(null);
	const { isXSmall } = useScreenSize();
	const carerid = props.carerId
	let popupTitle = (popupType === "bookingEvent")?"Booking Details": "Leave Booking"

	var url = `/api/carer/${carerid}/calendar?view=${view}&date=${date}`;

	useEffect(
		() => {
			async function fetchMyAPI() {
				try {
					setData(await fetchData(url));
					setFormStatus(false);
				} catch (e) {
					// console.log(e);
				} finally {
				}
			}
			fetchMyAPI();
		},
		[ url, formSubmitted ]
	);

	const onClickAddButton = () => {
		setPopupStatus(true);
		setPopupType("addLeaveEvent");
	};

	const onOptionChanged = (e) => {
		if (views.includes(e.value)) {
			setView(e.value);
		}

		if (e.name === 'currentDate') {
			setDate(dateFns.format(e.value, dateFormat));
		}
	};

	const onHiding = () => {
		setPopupStatus(false);
	};

	const onAppointmentClick = useCallback(
		async ($event) => {
			$event.cancel = true;
			let id = $event.appointmentData.id;
				
			if ($event.appointmentData.eventTypeCode === 1) {
				console.log("$event.appointmentData.eventTypeCode === 1")
				let result = await fetchData(`/api/carer/${carerid}/unavailability/${id}`)
				console.log(`/api/carer/${carerid}/unavailability/${id}`)
				setCurrentEvent(result)
				setPopupType("leaveEvent")
				setPopupStatus(true);
				console.log(popupStatus)
			} 
			
			if ($event.appointmentData.eventTypeCode === 0) {
				console.log("$event.appointmentData.eventTypeCode ===0")
				let result = await fetchData(`/api/booking/${id}`)
				console.log(`/api/booking/${id}`)
				setCurrentEvent(result)
				setPopupType("bookingEvent")
				setPopupStatus(true);
				console.log(popupStatus)
			}
		},
		[ popupStatus, popupType, carerid ]
	);


	const renderContent = () => {

		if (popupType === "bookingEvent") {
			return <BookingDetails data={currentEvent} onHiding = {onHiding}  editMode={false} showConfirmBtn={false} />;
		} else if  (popupType === "leaveEvent") {
			return <LeaveBookingDetails onHiding = {onHiding} data={currentEvent}  setDate = {setDate} carerId = {carerid}/>;
		}  else if  (popupType === "addLeaveEvent") {
			return <LeaveBookingForm onHiding = {onHiding} carerId = {carerid} setDate = {setDate}/>;
		} else {
			return <h2>No data</h2>
		}
	};
	const renderAppointment = (model) => {

		return (
			<React.Fragment>
				<div className={model.appointmentData.eventTypeCode === 1 ? 'disable-date ' : ''}>
					<div className="dx-scheduler-appointment-title">{model.appointmentData.text}</div>
					<div className="dx-scheduler-appointment-content-date">
						{dateFns.format(new Date(model.appointmentData.startDate), "h:mmaaaaa'm'")}
						{' - '}
						{dateFns.format(new Date(model.appointmentData.endDate), "h:mmaaaaa'm'")}
					</div>
				</div>
			</React.Fragment>
		);
	};
	
	if (data === null) {
		return <LoadIndicator id="medium-indicator" height={40} width={40} />;
	}  
	
	
	const popupWidth = () => (isXSmall ? window.innerWidth : window.innerWidth / 2);
	const popupHeight = () => (isXSmall ? window.innerHeight : window.innerHeight*0.9);

	const typeFilters = [
		{
			id    : 0,
			color : '#03A9F4',
		},
		{
			id    : 1,
			color : '#e1e1e1',
		},
	];

	return (
		<React.Fragment>
			<Toolbar>
				<Item location="before" locateInMenu="never">
					<h3 className={'content-block'}>Unavailable Events</h3>
				</Item>

				<Item location="after" locateInMenu="auto">
					<Button text="Add" icon="plus" type="success" onClick={onClickAddButton} />
				</Item>
			</Toolbar>

			<div className={'dx-field'}>
				<Scheduler
					dataSource={data.events}
					views={views}
					adaptivityEnabled={isXSmall}
					defaultCurrentView={defaultView}
					defaultCurrentDate={currentDate}
					height={600}
					firstDayOfWeek={1}
					startDayHour={9}
					cellDuration={30}
					textExpr="text"
					startDateExpr="startDate"
					endDateExpr="endDate"
					allDayExpr="AllDay"
					onOptionChanged={onOptionChanged}
					// dataCellRender={renderDataContent}
					onAppointmentClick={onAppointmentClick}
					showAllDayPanel={true}
					appointmentRender={renderAppointment}
				>
					<Resource dataSource={typeFilters} fieldExpr="eventTypeCode" />
					<Editing allowDeleting={false} />
				</Scheduler>		
			</div>
			<Popup
					title={popupTitle}
					visible={popupStatus}
					contentRender={renderContent}
					onHiding={onHiding}
					showCloseButton={true}
					maxWidth={popupWidth}
					height = {popupHeight}
					key = {popupType}
				/>
		</React.Fragment>
	);
};

export default UnavailableCalendar;
