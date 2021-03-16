import React, { useState, useCallback, useEffect } from 'react';
import DataGrid, {
	Column,
	FilterRow,
	Form,
	Editing,
	Paging,
	Sorting,
	CompareRule,
	RequiredRule,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';

import notify from 'devextreme/ui/notify';

import insertData from '../../api/insertData';
import updateData from '../../api/updateData';
import deleteData from '../../api/deleteData';
import fetchData from '../../api/fetchData';

import { useAuth } from '../../contexts/auth';

const AvailabilityList = () => {
	const { user } = useAuth();
	const [ data, setData ] = useState(null);
	const [ weekDay, setWeekDay ] = useState({});
	const [ newAvail, setAvail ] = useState({});

	let startTimeFieldValue = null;

	useEffect(
		() => {
			async function fetchMyAPI() {
				try {
					setData(await fetchData(`/api/carer/${user.id}/availability`));
					setWeekDay(await fetchData(`/api/ref/weekday`));
				} catch (e) {
					console.log(e);
				} finally {
				}
			}
			fetchMyAPI();
		},
		[ user, newAvail ]
	);

	const insertOrUpdateAvailability = useCallback(
		async (data, isInsert) => {
			let startDate = new Date();
			let startTime = new Date(data['startTime']);
			startDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

			let endDate = new Date();
			let endTime = new Date(data['endTime']);
			endDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

			let newData = {
				weekDay                 : isNaN(data['day']) ? data['weekDay'] : data['day'], // if day field is not a number, use weekDay attribute
				startTime               : startDate,
				endTime                 : endDate,
				available24hrShift      : 'available24hrShift' in data ? data['available24hrShift'] : false,
				availableOvernightShift : 'availableOvernightShift' in data ? data['availableOvernightShift'] : false,
				comments                : 'comments' in data ? data['comments'] : '',
			};

			try {
				if (isInsert) {
					let response = await insertData(`/api/carer/${user.id}/availability`, newData);

					if (response.ok) {
						notify(
							{
								message  : 'You have successfully added a new availability slot',
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
								message  : 'Failed to add an availability slot',
								position : {
									my : 'center top',
									at : 'center top',
								},
							},
							'error',
							3000
						);
					}
				} else {
					let bookingId = String(data.id);
					let response = await updateData(`/api/carer/${user.id}/availability/${bookingId}`, newData);

					if (response.ok) {
						notify(
							{
								message  : 'You have successfully updated an availability slot',
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
								message  : 'Failed to update the availability slot',
								position : {
									my : 'center top',
									at : 'center top',
								},
							},
							'error',
							3000
						);
					}
				}
			} catch (e) {
				console.log(e);
			}

			setAvail(data); // trigger data refresh
		},
		[ user.id, setAvail ]
	);

	const removeAvailability = useCallback(
		async (data) => {
			try {
				let bookingId = String(data.id);
				let response = await deleteData(`/api/carer/${user.id}/availability/${bookingId}`);

				if (response.ok) {
					notify(
						{
							message  : 'You have successfully deleted an availability slot',
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
							message  : 'Failed to delete the availability slot',
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
			}

			setAvail(data); // trigger data refresh
		},
		[ user.id, setAvail ]
	);

	const handleBeforeEdit = (e) => {
		startTimeFieldValue = new Date(e.data['startTime']);
	};

	const handleStartTimeFieldChange = (e) => {
		if (e.name === 'value' && e.value !== '') {
			startTimeFieldValue = e.value;
		}
	};

	const colCountByScreen = {
		sm : 1,
		md : 2,
	};

	return (
		<DataGrid
			dataSource={data}
			showRowLines={true}
			columnAutoWidth={true}
			columnHidingEnabled={true}
			hoverStateEnabled={true}
			selection={{ mode: 'single' }}
			wordWrapEnabled={true}
			onEditingStart={handleBeforeEdit}
			onRowUpdating={(e) => {
				let newData = { ...e.oldData, ...e.newData };
				insertOrUpdateAvailability(newData, false);
			}}
			onRowInserting={(e) => {
				e.cancel = true; // do not insert row yet
				insertOrUpdateAvailability(e.data, true);
			}}
			onRowRemoving={(e) => {
				e.cancel = true; // do not remove row yet
				removeAvailability(e.data);
			}}
		>
			<Sorting mode="none" />
			<FilterRow visible={true} />
			<Editing mode="form" allowUpdating={true} allowAdding={true} allowDeleting={true}>
				<Form colCountByScreen={colCountByScreen} showValidationSummary={true}>
					<Item
						dataField="weekDay"
						editorType="dxSelectBox"
						editorOptions={{
							dataSource  : weekDay,
							valueExpr   : 'id',
							displayExpr : 'name',
							placeholder : 'Select a Day',
						}}
					>
						<RequiredRule message="Week Day is required" />
					</Item>
					<Item itemType="group" colCount={2}>
						<Item
							dataField="startTime"
							editorType="dxDateBox"
							editorOptions={{
								pickerType        : 'list',
								type              : 'time',
								acceptCustomValue : false,
								openOnFieldClick  : true,
								onOptionChanged   : handleStartTimeFieldChange,
							}}
						>
							<RequiredRule message="Start Time is required" />
						</Item>
						<Item
							dataField="endTime"
							editorType="dxDateBox"
							editorOptions={{
								pickerType        : 'list',
								type              : 'time',
								acceptCustomValue : false,
								openOnFieldClick  : true,
							}}
						>
							<RequiredRule message="Finish Time is required" />
							<CompareRule
								message="Finish Time must be after Start Time"
								comparisonTarget={() => startTimeFieldValue}
								comparisonType=">"
							/>
						</Item>
					</Item>
					<Item itemType="group" colCount={2}>
						<Item dataField="available24hrShift" />
						<Item dataField="availableOvernightShift" />
					</Item>
					<Item dataField="comments" editorType="dxTextArea" colSpan={2} />
				</Form>
			</Editing>
			<Column dataField="weekDay" visible={false} />
			<Column dataField="day" caption="Week Day" filterOperations={[ 'startswith' ]} defaultHidingPriority={0} />
			<Column
				dataField="startTime"
				dataType="datetime"
				format="shortTime"
				filterOperations={[ '>=', '<=' ]}
				defaultHidingPriority={1}
			/>
			<Column
				dataField="endTime"
				caption="Finish Time"
				dataType="datetime"
				format="shortTime"
				filterOperations={[ '>=', '<=' ]}
				defaultHidingPriority={2}
			/>
			<Column dataField="available24hrShift" caption="24 Hr Shift" />
			<Column dataField="availableOvernightShift" caption="Overnight" />
			<Column dataField="comments" filterOperations={[ 'contains' ]} />
			<Paging defaultPageSize={8} />
		</DataGrid>
	);
};

export default AvailabilityList;
