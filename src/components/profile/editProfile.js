import React from 'react';
import Form, {
	SimpleItem,
	GroupItem,
	ButtonItem,
	ButtonOptions,
	RequiredRule,
	EmailRule,
	StringLengthRule,
} from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { NumericRule } from 'devextreme-react/validator';

const EditProfile = (props) => {
	return (
		<div className={'content-block dx-card responsive-paddings'}>
			<Button
				style={{ float: 'right', marginTop: '10px' }}
				icon="clear"
				text="Cancel"
				onClick={props.refresh}
				type="default"
			/>
			<div className="long-title">
				<h4>Edit Details</h4>
			</div>
			<form onSubmit={props.onSubmit}>
				<Form formData={props.data}>
					<GroupItem colCount={2}>
						<GroupItem data-testid="second-group" caption="Personal Information" colSpan={1}>
							<SimpleItem dataField="address" colSpan={2}>
								<RequiredRule message="Address is required" />
							</SimpleItem>
							<GroupItem colCount={2}>
								<SimpleItem dataField="locality">
									<RequiredRule message="Locality is required" />
								</SimpleItem>
								<SimpleItem
									dataField="transportMode"
									editorType="dxSelectBox"
									editorOptions={props.transportOptions}
								/>
							</GroupItem>
							<GroupItem colCount={2}>
								<SimpleItem
									dataField="state"
									editorType="dxSelectBox"
									editorOptions={props.stateOptions}
								/>
								<SimpleItem dataField="postcode">
									<RequiredRule message="PostCode is required" />
									<NumericRule message="Must be valid PostCode" />
									<StringLengthRule min={4} max={4} message="PostCode must be 4 digits" />
								</SimpleItem>
							</GroupItem>
						</GroupItem>

						<GroupItem data-testid="third-group" caption="Contact Details" colSpan={1}>
							<SimpleItem dataField="homePhone" editorOptions={{ mask: '(00) 0000 0000', mode: 'tel' }} />
							<SimpleItem dataField="mobile" editorOptions={{ mask: '0000 000 000', mode: 'tel' }}>
								<RequiredRule message="Mobile is required" />
							</SimpleItem>

							<SimpleItem
								dataField="preferredContactMethod"
								editorType="dxRadioGroup"
								editorOptions={{ items: props.contactMethodItems, layout: 'horizontal' }}
							/>
						</GroupItem>

						<GroupItem data-testid="fourth-group" caption="Emergency Contact" colSpan={1}>
							<SimpleItem data-testid="emergencyName" dataField="emergencyName">
								<RequiredRule message="Emergency Name is required" />
							</SimpleItem>
							<SimpleItem
								dataField="emergencyMobile"
								editorOptions={{ mask: '0000 000 000', mode: 'tel' }}
							>
								<RequiredRule message="Emergency Mobile is required" />
							</SimpleItem>
							<SimpleItem dataField="emergencyEmail">
								<RequiredRule message="Emergency Email is required" />
								<EmailRule message="Email is invalid" />
							</SimpleItem>
						</GroupItem>

						<GroupItem data-testid="fifth-group" caption="Health" colSpan={1}>
							<SimpleItem
								data-testid="medicalNotes"
								dataField="medicalNotes"
								editorType="dxTextArea"
								editorOptions={{ height: 160 }}
							/>
						</GroupItem>
					</GroupItem>
					<ButtonItem>
						<ButtonOptions
							width={'100%'}
							type={'default'}
							text={'Confirm Changes'}
							useSubmitBehavior={true}
						/>
					</ButtonItem>
				</Form>
			</form>
		</div>
	);
};

export default EditProfile;
