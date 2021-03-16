import React, { useCallback } from 'react';
import ScrollView from 'devextreme-react/scroll-view';
import Form, { ButtonItem, Item, ButtonOptions } from 'devextreme-react/form';
import TextBox from 'devextreme-react/text-box';
import 'devextreme-react/text-area';
import { NumericRule } from 'devextreme-react/validator';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import { useScreenSize } from '../../utils/media-query';

import updateData from '../../api/updateData';

const BookingDetails = ({ data, editMode, setFormSubmitted, showConfirmBtn }) => {
	const { isXSmall } = useScreenSize();

	const screenByWidth = (width) => (width < 720 ? 'sm' : 'md');

	const colCountByScreen = {
		sm : 1,
		md : 2,
	};

	const showConfirmDialog = (data) => {
		let result = confirm('Are you sure you want to confirm this shift?', 'Confirm Shift');
		result.then((dialogResult) => {
			if (dialogResult) {
				confirmShift(data);
				setFormSubmitted(dialogResult);
			}
		});
	};

	const confirmShift = useCallback(async (data) => {
		try {
			let bookingId = String(data['id']);

			let response = await updateData(`/api/booking/${bookingId}`, {
				event              : 'confirmShift',
				carerKMs           : data['carerKMs'] == null ? 0 : data['carerKMs'],
				carerDisbursements : data['carerDisbursements'],
				carerComments      : data['carerComments'],
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
	}, []);

	const handleSubmit = (e) => {
		showConfirmDialog(data);
		e.preventDefault();
	};

	// display a link if there is a phone or mobile phone supplied
	const renderPhoneField = (data) => {
		let fieldValue = data.editorOptions.value;
		let dynamicLink = '';

		// if fieldValue is numeric
		if (!isNaN(parseFloat(fieldValue)) && isFinite(fieldValue)) {
			dynamicLink = '<a href="tel:' + fieldValue + '">' + fieldValue + '</a>'; // problem: not being rendered as a link
		} else {
			dynamicLink = fieldValue;
		}

		return <TextBox readOnly={true} value={dynamicLink} />;
	};

	return (
		<ScrollView showScrollBarMode="onScroll">
			<form onSubmit={handleSubmit}>
				<Form
					formData={data}
					colCountByScreen={colCountByScreen}
					minColWidth={233}
					colCount="auto"
					screenByWidth={screenByWidth}
					readOnly={editMode ? false : true}
				>
					<Item dataField="taskName" editorOptions={{ readOnly: true }} />
					<Item dataField="clientName" editorOptions={{ readOnly: true }} />
					<Item dataField="clientHomePhone2" editorOptions={{ readOnly: true }} render={renderPhoneField} />
					<Item dataField="clientMobilePhone2" editorOptions={{ readOnly: true }} render={renderPhoneField} />
					<Item dataField="clientAddress" colSpan={2} editorOptions={{ readOnly: true }} />
					<Item
						dataField="startTime"
						editorType="dxDateBox"
						editorOptions={{
							type     : 'time',
							readOnly : true,
						}}
					/>
					<Item
						dataField="endTime"
						editorType="dxDateBox"
						editorOptions={{
							type     : 'time',
							readOnly : true,
						}}
					/>
					<Item dataField="24hrShift" editorOptions={{ readOnly: true }} />
					<Item dataField="overnightShift" editorOptions={{ readOnly: true }} />
					<Item dataField="carerKMs">
						<NumericRule message="Must be a valid number" />
					</Item>
					<Item dataField="carerDisbursements">
						<NumericRule message="Must be a valid number" />
					</Item>
					<Item dataField="carerComments" colSpan={2} />
					<ButtonItem colSpan={2} horizontalAlignment={isXSmall ? 'left' : 'right'}>
						<ButtonOptions
							disabled={editMode ? false : true}
							visible={showConfirmBtn}
							type="default"
							text="Mark as Complete"
							useSubmitBehavior={true}
						/>
					</ButtonItem>
				</Form>
			</form>
		</ScrollView>
	);
};

export default BookingDetails;
