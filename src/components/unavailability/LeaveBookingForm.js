import React, { useState, useEffect, useCallback } from 'react';
import Form, { GroupItem, SimpleItem, RequiredRule, CustomRule, CompareRule } from 'devextreme-react/form';
import 'devextreme-react/text-area';
import fetchData from '../../api/fetchData';
import insertData from '../../api/insertData';
import { useAuth } from '../../contexts/auth';
import notify from 'devextreme/ui/notify';
import { Button } from 'devextreme-react/button';
import Toolbar, { Item } from 'devextreme-react/toolbar';
const dateFns = require('date-fns');

const LeaveBookingForm = (props) => {
	const { user } = useAuth();
	const dateFormat = 'yyyy-MM-dd';
	let validationMessage = '';
	const [ leaveTypes, setLeaveTypes ] = useState(null);
	let today = new Date();
	let requiredFields = [ 'startDate', 'endDate', 'leaveTypeId' ];
	var data = {
		carerId       : user.id,
		startDate     : new Date(),
		startTime     : null,
		endDate       : new Date(),
		comments      : null,
		endTime       : null,
		leaveTypeId   : null,
		submittedDate : today.toISOString(),
	};

	let currentStartTime = data['startTime'];
	let currentEndTime = data['endTime'];

	//const [ data, setData ] = useState(formData);
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

	const validateForm = (e) => {
		if (!e.component.validate().isValid) {
			// validationMessage = 'Input data on the form!';
			// messageType = "info"
			// notification(validationMessage, messageType)
		} else {
		}
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

	const onSubmit = useCallback(
		async (e) => {
			if (!validateDateTime()) {
				notification('End date should be after start date', 'warning');
			} else {
				if (isHavingrequiredData()) {
					notification('You have submitted the form', 'success');

					try {
						// Merge start date and start time, Merge finish date and end time
						mergeDateTime();
						// Fetch data
						let result = await insertData(`/api/carer/${props.carerId}/unavailability`, data);

						// Check status code
						if (result.status === 500) {
							notification(result.statusText, 'error');
						} else {
							props.onHiding();
							// props.setFormStatus(true);
							props.setDate(dateFns.format(data['startDate'], dateFormat));
							notification('Succesfully added a new leave booking!', 'success');
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
		[ data, validationMessage, dateFns ]
	);

	return (
		<React.Fragment>
			<Form
				formData={data}
				onContentReady={validateForm}
				showValidationSummary={true}
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
								message="End date should be after start date"
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

					<SimpleItem colSpan={2} dataField="carerId" disabled={true} visible={false} />

					<GroupItem cssClass="second-group" colSpan={2} colCount={2}>
						<Toolbar colSpan={2}>
							<Item location="after" locateInMenu="auto">
								<Button text="Submit" type="success" onClick={(e) => onSubmit(e)} />
							</Item>
							<Item location="after" locateInMenu="auto">
								<Button text="Cancel" type="normal" onClick={props.onHiding} />
							</Item>
						</Toolbar>
					</GroupItem>
				</GroupItem>
			</Form>
		</React.Fragment>
	);
};

export default LeaveBookingForm;
