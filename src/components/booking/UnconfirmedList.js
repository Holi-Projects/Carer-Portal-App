import React, { useCallback, useState, useEffect } from 'react';
import DataGrid, { Column, Button, Paging } from 'devextreme-react/data-grid';
import { Popup, Position } from 'devextreme-react/popup';
import { SpeedDialAction } from 'devextreme-react/speed-dial-action';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';

import { useScreenSize } from '../../utils/media-query';
import fetchData from '../../api/fetchData';
import updateData from '../../api/updateData';
import { useAuth } from '../../contexts/auth';

import BookingDetails from './BookingDetails';

const UnconfirmedList = (props) => {
	const { user } = useAuth();
	const [ data, setData ] = useState(null);
	const [ currentBooking, setCurrentBooking ] = useState(null);
	const [ isDetailPopupShown, setIsDetailPopupShown ] = useState(false);
	const [ isInEditMode, setIsInEditMode ] = useState(false);
	const [ formSubmitted, setFormSubmitted ] = useState(false);

	const { isXSmall } = useScreenSize();

	const carerId = String(user['id']);
	var url = `/api/booking?view=all&carerId=${carerId}&status=unconfirmed`;
	useEffect(
		() => {
			async function fetchBookings() {
				try {
					let data = await fetchData(url);
					setData(data);
					props.onFetchData(data.length);
				} catch (e) {
					console.log(e);
				} finally {
				}
			}
			fetchBookings();
		},
		[ url, props ]
	);

	const showBookingForm = async ({ data }) => {
		let bookingId = data.id;

		await fetchData(`/api/booking/${bookingId}`)
			.then((result) => {
				setCurrentBooking(result);
				setIsDetailPopupShown(true);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const confirmShift = useCallback(
		async (id) => {
			try {
				const bookingId = String(id);

				let response = await updateData(`/api/booking/${bookingId}`, {
					event : 'confirmShift',
				});
				console.log(response);

				if (response.ok) {
					notify(
						{
							message  : 'You have successfully confirmed the shift details',
							position : {
								my : 'center top',
								at : 'center top',
							},
						},
						'success',
						3000
					);

					// refresh datagrid and update count
					props.onFetchData(data.length - 1);
				} else {
					notify(
						{
							message  : 'Failed to confirm the shift',
							position : {
								my : 'center top',
								at : 'center top',
							},
						},
						'error',
						3000
					);
				}
			} catch (e) {
				console.log(e);
			} finally {
			}
		},
		[ data, props ]
	);

	const showConfirmDialog = ({ row }) => {
		let bookingId = row.data.id;

		let result = confirm('Are you sure you want to confirm this shift?', 'Confirm Shift');
		result.then((dialogResult) => {
			if (dialogResult) {
				confirmShift(bookingId);
			}
		});
	};

	const showStartDialog = () => {
		let result = confirm('Are you sure you want to start this shift?', 'Start Shift');
		result.then((dialogResult) => {
			if (dialogResult) {
				startShift(currentBooking.id);
				hideBookingPopup();
			}
		});
	};

	const startShift = useCallback(async (id) => {
		try {
			const bookingId = String(id);

			let response = await updateData(`/api/booking/${bookingId}`, {
				event : 'carerShiftStart',
			});
			console.log(response);

			if (response.ok) {
				notify(
					{
						message  : 'You have successfully started the shift',
						position : {
							my : 'center top',
							at : 'center top',
						},
					},
					'success',
					3000
				);
			} else {
				notify(
					{
						message  : 'Failed to start the shift',
						position : {
							my : 'center top',
							at : 'center top',
						},
					},
					'error',
					3000
				);
			}
		} catch (e) {
			console.log(e);
		} finally {
		}
	}, []);

	const showFinishDialog = () => {
		let result = confirm('Are you sure you want to finish this shift?', 'Finish Shift');
		result.then((dialogResult) => {
			if (dialogResult) {
				finishShift(currentBooking.id);
				hideBookingPopup();
			}
		});
	};

	const finishShift = useCallback(async (id) => {
		try {
			const bookingId = String(id);

			let response = await updateData(`/api/booking/${bookingId}`, {
				event : 'carerShiftEnd',
			});
			console.log(response);

			if (response.ok) {
				notify(
					{
						message  : 'You have successfully finished the shift',
						position : {
							my : 'center top',
							at : 'center top',
						},
					},
					'success',
					3000
				);
			} else {
				notify(
					{
						message  : 'Failed to finish the shift',
						position : {
							my : 'center top',
							at : 'center top',
						},
					},
					'error',
					3000
				);
			}
		} catch (e) {
			console.log(e);
		} finally {
		}
	}, []);

	const hideBookingPopup = () => {
		setIsDetailPopupShown(false);
		setIsInEditMode(false);
	};

	const renderContent = () => {
		return (
			<BookingDetails
				id="bookingForm"
				data={currentBooking}
				editMode={isInEditMode}
				setFormSubmitted={handleFormSubmitted}
				showConfirmBtn={true}
			/>
		);
	};

	const handleFormSubmitted = (newValue) => {
		setFormSubmitted(newValue);
		hideBookingPopup();

		// refresh datagrid and update count
		props.onFetchData(data.length - 1);
	};

	const popupWidth = () => (isXSmall ? window.innerWidth : window.innerWidth / 2.5);

	const handleEditBtnClick = () => {
		isInEditMode ? setIsInEditMode(false) : setIsInEditMode(true);
	};

	const BookingFormBtn = () => (
		<React.Fragment>
			<SpeedDialAction
				onClick={handleEditBtnClick}
				index={1}
				{...{
					...(isInEditMode
						? { label: 'Cancel Edit', icon: 'close' }
						: { label: 'Edit Shift Details', icon: 'edit' }),
				}}
			>
				{isXSmall ? (
					<Position at="bottom" offset="144 -92" of="#bookingForm" />
				) : (
					<Position at="bottom" offset="20 -118" of="#bookingForm" />
				)}
			</SpeedDialAction>
			<SpeedDialAction label="Start Shift" icon="video" index={3} onClick={showStartDialog} />
			<SpeedDialAction label="Finish Shift" icon="square" index={2} onClick={showFinishDialog} />
		</React.Fragment>
	);

	return (
		<React.Fragment>
			<DataGrid
				dataSource={data}
				showBorders={false}
				columnAutoWidth={true}
				hoverStateEnabled={true}
				columnHidingEnabled={true}
				selection={{ mode: 'single' }}
				wordWrapEnabled={true}
				onRowClick={showBookingForm}
				repaintChangesOnly={true}
			>
				<Column defaultHidingPriority={2} type="buttons">
					<Button hint="Confirm Shift" icon="check" onClick={showConfirmDialog} />
				</Column>
				<Column
					defaultHidingPriority={2}
					caption="Date"
					dataField="startDate"
					dataType="datetime"
					format="dd/MM/yyyy"
					sortIndex={0}
					sortOrder={'desc'}
				/>
				<Column
					defaultHidingPriority={2}
					caption="Start Time"
					dataField="startDate"
					dataType="datetime"
					format="shortTime"
				/>
				<Column
					defaultHidingPriority={2}
					caption="End Time"
					dataField="endDate"
					dataType="datetime"
					format="shortTime"
				/>
				<Column dataField="description" />
				<Column dataField="clientName" />
			</DataGrid>
			<Popup
				title="Booking Details"
				visible={isDetailPopupShown}
				contentRender={renderContent}
				onHiding={hideBookingPopup}
				showCloseButton={true}
				maxWidth={popupWidth}
				dragEnabled={false}
			/>
			{isDetailPopupShown && <BookingFormBtn />}
			<Paging defaultPageSize={8} />
		</React.Fragment>
	);
};

export default UnconfirmedList;
