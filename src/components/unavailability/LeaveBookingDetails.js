import React, { useState, useEffect, useCallback } from 'react';
import Form, { GroupItem, SimpleItem, RequiredRule, Label, CustomRule, CompareRule } from 'devextreme-react/form';
import 'devextreme-react/text-area';
import fetchData from '../../api/fetchData';
import deleteData from '../../api/deleteData';
import updateData from '../../api/updateData';
import { useAuth } from '../../contexts/auth';
import notify from 'devextreme/ui/notify';
import { Button } from 'devextreme-react/button';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import { confirm } from 'devextreme/ui/dialog';
const dateFns = require('date-fns');

//import { CheckBox } from 'devextreme-react/check-box';
//const dateFns = require('date-fns');

const LeaveBookingDetails = (props) => {
	const { user } = useAuth();
	const dateFormat = 'yyyy-MM-dd';
	const [ leaveTypes, setLeaveTypes ] = useState(null);
	let requiredFields = [ 'startDate', 'endDate', 'leaveTypeId' ];
	var data = props.data;

	if (props.data !== undefined) {
		data['startDate'] = new Date(data['startDate']);
		data['endDate'] = new Date(data['endDate']);
		data['startTime'] = data['startTime'] === undefined ? null : new Date(data['startDate']);
		data['endTime'] = data['endTime'] === undefined ? null : new Date(data['endDate']);
	}
	let currentStartTime = data['startTime'];
	let currentEndTime = data['endTime'];

	const isHavingrequiredData = () => {
		for (let i = 0; i < requiredFields.length; i++) {
			if (data[requiredFields[i]] == null) return false;
		}
		return true;
	};

	useEffect(
		() => {
			async function fetchMyAPI() {
				try {
					let result = await fetchData('/api/ref/leave');
					setLeaveTypes(result);
				} catch (e) {
					console.log(e);
				} finally {
				}
			}
			fetchMyAPI();
		},
		[ user.id ]
	);

	const showConfirmDialog = (e) => {
		let result = confirm('Are you sure to delete this leave event?', 'Confirm Delete');
		result.then((dialogResult) => {
			if (dialogResult) {
				confirmDelete();
			}
		});
	};
	const mergeDateTime = () => {
		if (data['startTime'] !== null) {
			data['startDate'].setHours(data['startTime'].getHours());
			data['startDate'].setMinutes(data['startTime'].getMinutes());
		} else {
			data['startDate'].setHours(0, 0, 0);
		}
		if (data['endTime'] !== null) {
			data['endDate'].setHours(data['endTime'].getHours());
			data['endDate'].setMinutes(data['endTime'].getMinutes());
		} else {
			data['endDate'].setHours(23, 59, 59);
		}
		data['endTime'] = null;
		data['startTime'] = null;
	};

	const handleStartTimeChange = (e) => {
		if (e.name === 'value' && e.value !== '') {
			currentStartTime = e.value;
		}
	};

	const handleEndTimeChange = (e) => {
		if (e.name === 'value' && e.value !== '') {
			currentEndTime = e.value;
		}
	};

	const validateDateTime = (e) => {
		let currentStartDate = dateFns.format(data['startDate'], dateFormat);
		let currentEndDate = dateFns.format(data['endDate'], dateFormat);

		if (currentStartDate < currentEndDate) {
			return true;
		} else if (currentStartDate === currentEndDate) {
			if (currentStartTime === null && currentEndTime === null) return true;
			if (currentStartTime === null && currentEndTime !== null) return false;
			if (currentStartTime !== null && currentEndTime === null) return false;
			if (currentStartTime < currentEndTime) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};

	const validateForm = (e) => {
		if (!e.component.validate().isValid) {
			// validationMessage = 'Input data on the form!';
			// messageType = "info"
			// notification(validationMessage, messageType)
		} else {
		}
	};

	const notification = (message, type) => {
		notify(
			{
				message  : message,
				position : {
					my : 'center top',
					at : 'center top',
				},
			},
			type,
			3000
		);
	};

	const onUpdate = useCallback(
		async (e) => {
			console.log(data);
			if (!validateDateTime()) {
				notification('End date should be after start date', 'warning');
			} else {
				if (isHavingrequiredData()) {
					notification('You have submitted the form', 'success');

					try {
						// Merge start date and start time, Merge finish date and end time
						mergeDateTime();
						// Fetch data
						let response = await updateData(`/api/carer/${props.carerId}/unavailability/${data.id}`, data);

						if (response.ok) {
							notify(
								{
									message  : 'You have successfully updated data',
									position : {
										my : 'center top',
										at : 'center top',
									},
								},
								'success',
								3000
							);

							props.onHiding();
							// props.setFormStatus(true);
							props.setDate(dateFns.format(data['startDate'], dateFormat));
						} else {
							notify(
								{
									message  : 'Failed to update data',
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
						notification(e, 'error');
					} finally {
					}
				} else {
					notification('Invalid/ Missing data on the form!', 'warning');
				}
			}
		},
		[ props, data ]
	);

	const confirmDelete = useCallback(
		async (e) => {
			notification('You have submitted the form', 'success');

			try {
				// Merge start date and start time, Merge finish date and end time
				mergeDateTime();
				// Fetch data
				let response = await deleteData(`/api/carer/${props.carerId}/unavailability/${data.id}`);

				if (response.ok) {
					notify(
						{
							message  : 'You have successfully deleted the leave event',
							position : {
								my : 'center top',
								at : 'center top',
							},
						},
						'success',
						3000
					);
					props.onHiding();
					// props.setFormStatus(true);
					props.setDate(dateFns.format(data['startDate'], dateFormat));
				} else {
					notify(
						{
							message  : 'Failed to delete the leave event ',
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
				notification(e, 'error');
			} finally {
			}
		},
		[ data, props ]
	);

	return (
		<React.Fragment>
			<Form
				formData={data}
				// onValueChanged = {validateForm}
				onContentReady={validateForm}
				showValidationSummary={true}
				// validationGroup="customerData"
				scrollingEnabled={true}
				showColonAfterLabel={true}
			>
				<GroupItem colCount={2}>
					<GroupItem colSpan={2} colCount={2}>
						<SimpleItem colSpan={1} dataField="startDate" editorType="dxDateBox" isRequired={true}>
							<RequiredRule message="Start Date is required" />
						</SimpleItem>
						<SimpleItem
							dataField="startTime"
							editorType="dxDateBox"
							editorOptions={{
								pickerType        : 'list',
								type              : 'time',
								acceptCustomValue : true,
								openOnFieldClick  : true,
								onOptionChanged   : handleStartTimeChange,
							}}
						/>
					</GroupItem>

					<GroupItem colSpan={2} colCount={2}>
						<SimpleItem colSpan={1} dataField="endDate" editorType="dxDateBox" isRequired={true}>
							<RequiredRule message="End Date is required" />
							<CompareRule
								message="End Date must be after Start Date"
								comparisonTarget={() => data['startDate']}
								comparisonType=">="
							/>
						</SimpleItem>
						<SimpleItem
							dataField="endTime"
							editorType="dxDateBox"
							editorOptions={{
								pickerType        : 'list',
								type              : 'time',
								acceptCustomValue : true,
								openOnFieldClick  : true,
								onOptionChanged   : handleEndTimeChange,
							}}
						>
							<CustomRule
								validationCallback={validateDateTime}
								message="End Time must be after Start Time"
							/>
						</SimpleItem>
					</GroupItem>

					<SimpleItem
						colSpan={2}
						dataField="leaveTypeId"
						editorType="dxSelectBox"
						isRequired={true}
						editorOptions={{
							dataSource  : leaveTypes,
							valueExpr   : 'id',
							displayExpr : 'name',
						}}
					>
						<RequiredRule message="Leave Type is required" />
					</SimpleItem>
					<SimpleItem colSpan={2} dataField="comments" />

					<GroupItem colSpan={2} colCount={2}>
						<SimpleItem colSpan={1} disabled={true} dataField="approvedDate" editorType="dxDateBox" />
						<SimpleItem colSpan={1} dataField="employeeName" disabled={true}>
							<Label text="Approved by" />
						</SimpleItem>
					</GroupItem>

					<SimpleItem colSpan={2} dataField="carerId" disabled={true} visible={false} />

					<GroupItem cssClass="second-group" colSpan={2} colCount={2}>
						<Toolbar colSpan={2}>
							<Item location="after" locateInMenu="auto">
								<Button text="Update" type="default" onClick={(e) => onUpdate(e)} />
							</Item>
							<Item location="before" locateInMenu="auto">
								<Button
									text="Delete"
									type="danger"
									//onClick={props.onHiding}
									onClick={(e) => showConfirmDialog(e)}
								/>
							</Item>
						</Toolbar>
					</GroupItem>
				</GroupItem>
			</Form>
		</React.Fragment>
	);
};

export default LeaveBookingDetails;
