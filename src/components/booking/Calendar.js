import React, { useState, useEffect } from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import { Popup } from 'devextreme-react/popup';
import { Button } from 'devextreme-react/button';
import { useScreenSize } from '../../utils/media-query';
import fetchData from '../../api/fetchData';
import BookingDetails from './BookingDetails';
import { bookingStatusFilters } from './filters';
import SelectBox from 'devextreme-react/select-box';
import './calendar.scss';
import Toolbar, { Item } from 'devextreme-react/toolbar';
const dateFns = require('date-fns');

const Calendar = () => {
	const getMonday = (d) => {
		d = new Date(d);
		var day = d.getDay(),
			diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
		return new Date(d.setDate(diff));
	};

	const dateFormat = 'yyyy-MM-dd';
	const defaultView = 'agenda';
	const views = [ 'day', 'week', 'month', 'agenda' ];
	const currentDate = getMonday(new Date());

	const [ date, setDate ] = useState(dateFns.format(currentDate, dateFormat));
	const [ view, setView ] = useState(defaultView);
	const [ popupStatus, setPopupStatus ] = useState(false);
	const [ data, setData ] = useState(null);
	const [ currentBooking, setCurrentBooking ] = useState(null);
	const [ selectedShiftCode, setSelectedShiftCode ] = useState(1);

	const { isXSmall } = useScreenSize();
	var url = `/api/booking?view=${view}&date=${date}`;
	useEffect(
		() => {
			async function fetchMyAPI() {
				try {
					let data = await fetchData(url);
					console.log(data);
					console.log(selectedShiftCode);
					let filteredData =
						selectedShiftCode === 0
							? data
							: data.filter((item) => item.shiftStatusCode === selectedShiftCode);
					console.log(filteredData);
					setData(filteredData);
				} catch (e) {
					console.log(e);
				} finally {
				}
			}
			fetchMyAPI();
		},
		[ url, selectedShiftCode ]
	);

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

	const renderContent = () => {
		return <BookingDetails data={currentBooking} editMode={false} showConfirmBtn={false} />;
	};

	const Field = (data) => {
		return (
			<div>
				<Button className="square-icon" style={{ backgroundColor: data.color }} type="success" />
				<span> </span>
				{data.text}
			</div>
		);
	};

	const onAppointmentClick = async ($event) => {
		$event.cancel = true;
		let bookingId = $event.appointmentData.id;
		await fetchData(`/api/booking/${bookingId}`)
			.then((result) => {
				setCurrentBooking(result);
				setPopupStatus(true);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	// const popupWidth = () => window.innerWidth / 2.5;
	const popupWidth = () => (isXSmall ? window.innerWidth : window.innerWidth / 2.5);

	const renderLabel = () => {
		return isXSmall ? (
			<span />
		) : (
			<div className={'dx-field'}>
				<h2>{bookingStatusFilters[selectedShiftCode].text}</h2>
			</div>
		);
	};

	function onValueChanged(e) {
		setSelectedShiftCode(e.value);
	}
	return (
		<React.Fragment>
			<Toolbar>
				<Item location="before" locateInMenu="never" render={renderLabel} />

				<Item location="after" locateInMenu="auto">
					<SelectBox
						dataSource={bookingStatusFilters}
						displayExpr="text"
						valueExpr="id"
						defaultValue={bookingStatusFilters[selectedShiftCode].id}
						itemRender={Field}
						// fieldRender={renderField}
						onValueChanged={onValueChanged}
						style={{ minWidth: 200 }}
					/>
				</Item>

				<Item location="after" locateInMenu="auto">
					<Button
						className="square-icon"
						style={{ backgroundColor: bookingStatusFilters[selectedShiftCode].color }}
						type="success"
					/>
				</Item>
			</Toolbar>

			<div className={'dx-field'}>
				<Scheduler
					dataSource={data}
					views={views}
					adaptivityEnabled={isXSmall}
					defaultCurrentView={defaultView}
					defaultCurrentDate={currentDate}
					height={600}
					firstDayOfWeek={1}
					startDayHour={9}
					endDayHour={19}
					cellDuration={30}
					textExpr="text"
					startDateExpr="startDate"
					endDateExpr="endDate"
					allDayExpr="AllDay"
					onOptionChanged={onOptionChanged}
					onAppointmentClick={onAppointmentClick}
				>
					<Resource dataSource={bookingStatusFilters} fieldExpr="shiftStatusCode" label="Shift status" />
				</Scheduler>
				<Popup
					title="Booking Details"
					visible={popupStatus}
					contentRender={renderContent}
					onHiding={onHiding}
					showCloseButton={true}
					maxWidth={popupWidth}
				/>
			</div>
		</React.Fragment>
	);
};

export default Calendar;
