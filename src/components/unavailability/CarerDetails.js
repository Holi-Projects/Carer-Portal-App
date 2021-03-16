import React, { useCallback } from 'react';
import Form, { GroupItem, SimpleItem, Label, RequiredRule, EmailRule, PatternRule } from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import TextArea from 'devextreme-react/text-area';
import notify from 'devextreme/ui/notify';
import { Button } from 'devextreme-react/button';
import updateData from '../../../api/updateData';
import { useSystemParameter } from '../../../contexts/system-parameter';

//const CarerDetailsForm = () =>

export default function({
	carer,
	// stateOptions = {
	// 	items : [ 'ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA' ],
	// },
	phoneOptions = { mask: '0000 000 000' },
}) {
	const {
		//		systemParameters,
		contactMethods,
		//		languages,
		genders,
		stateOptions,
		//		ethnicities,
		//		clientCategories,
		//		clients,
		//		pricingGroups,
	} = useSystemParameter();

	const contactMethodItems = [];
	contactMethods &&
		contactMethods.forEach((item) => {
			contactMethodItems.push(item.contactMethod);
		});
	let validationMessage = 'You have submitted the form';

	// const onFieldDataChanged = useCallback(
	// 	async (e) => {
	// 		console.log('onFieldDataChanged')
	// 		console.log(e)
	// 		notify(
	// 			{
	// 				message  : 'You have changed field data',
	// 				position : {
	// 					my : 'center top',
	// 					at : 'center top',
	// 				},
	// 			},
	// 			'success',
	// 			3000
	// 		);
	// 		console.log(e);
	// 		console.log(carer);
	// 		//e.preventDefault();
	// 	},
	// 	[ carer ]
	// );

	const validationRules = {
		required   : [ { type: 'required', message: 'Value is required.' } ],
		numberOnly : [ { message: 'Invalid value', pattern: '/^[0-9]+$/' } ],
	};

	const validateForm = (e) => {
		console.log(e.component.validate());
		if (!e.component.validate().isValid) {
			validationMessage = 'There are invalid data on the form';
		}
	};

	const onFieldDataChanged = (e) => {

		// if (!e.component.validate().isValid) {
			// validationMessage = 'Form changed';
		// }
	};

	const onSubmit = useCallback(
		async (e) => {
			notify(
				{
					message  : validationMessage,
					position : {
						my : 'center top',
						at : 'center top',
					},
				},
				'success',
				3000
			);

			try {
				//setLoading(true);
				await updateData(`/api/carer/${carer.id}`, carer);
				// if (result.status === 201) validationMessage = 'Succesfully updated the form!';
				// console.log(result);
			} catch (e) {
				// setError(e);
				// validationMessage = 'Error! Can not update the form!';
				// console.log(e);
				//throw new Error('Data Loading Error');
			} finally {
				//setLoading(false);
			}
			//e.stopPropagation();
			//e.preventDefault();
		},
		[ carer, validationMessage]
	);

	return (
		<React.Fragment>
			{carer ? ( // conditional should no longer be needed.
				<div>
					{/* <form > */}
					<Form formData={carer} onContentReady={validateForm} onFieldDataChanged = {onFieldDataChanged}>
						<GroupItem cssClass="first-group" colCount={4}>
							<GroupItem caption="Name & Address" colSpan={1}>
								<GroupItem colCount={2}>
									<SimpleItem dataField="firstName" />
									<SimpleItem dataField="lastName" />
								</GroupItem>
								<SimpleItem dataField="address" isRequired={true}>
									<TextArea value={carer.address} height={87} />
								</SimpleItem>
								<SimpleItem dataField="locality" />
								<GroupItem colCount={2}>
									<SimpleItem
										dataField="state"
										editorType="dxSelectBox"
										editorOptions={stateOptions}
									/>
									<SimpleItem dataField="postcode" />
								</GroupItem>
							</GroupItem>
							<GroupItem caption="Contact Details" colSpan={1}>
								<GroupItem colCount={2}>
									<SimpleItem dataField="businessPhone" />
									<SimpleItem dataField="mobile" editorOptions={phoneOptions} />
								</GroupItem>
								<GroupItem colCount={2}>
									<SimpleItem dataField="fax">
										<PatternRule message="Invalid value" pattern={/^[0-9]+$/} />
									</SimpleItem>
									<SimpleItem dataField="homePhone">
										<PatternRule message="Invalid value" pattern={/^[0-9]+$/} />
									</SimpleItem>
								</GroupItem>
								{/*<SimpleItem dataField="otherPhone" />*/}
								{/* <SimpleItem dataField="email" />	 */}
								<SimpleItem dataField="email" editorType="dxTextBox">
									<RequiredRule message="Email is required" />
									<EmailRule message="Email is invalid" />
									{/* <AsyncRule
										message="Email is already registered"
										validationCallback={asyncEmailValidation} /> */}
								</SimpleItem>
								<SimpleItem
									dataField="preferredContactMethod"
									editorType="dxRadioGroup"
									editorOptions={{
										dataSource  : contactMethods,
										valueExpr   : 'contactMethod',
										displayExpr : 'contactMethod',
										layout      : 'horizontal',
									}}
								/>
							</GroupItem>
							<GroupItem caption="Emergency Contact" colSpan={1}>
								<SimpleItem dataField="emergencyName" />
								<SimpleItem dataField="emergencyPhone" />
								<SimpleItem dataField="emergencyMobile" editorOptions={{ mask: '0000 000 000' }} />
								<SimpleItem dataField="emergencyEmail" />
							</GroupItem>
							{/*<GroupItem caption="Background">
									<SimpleItem dataField="dateOfBirth" editorType="dxDateBox" editorOptions={birthDateOptions} />
								</GroupItem>*/}
							<GroupItem caption="Misc">
								<GroupItem colCount={2}>
									<SimpleItem
										dataField="dateOfBirth"
										editorType="dxDateBox"
										validationRules={validationRules.required}
									/>
									<SimpleItem
										dataField="gender"
										editorType="dxSelectBox"
										editorOptions={{
											dataSource  : genders,
											valueExpr   : 'code',
											displayExpr : 'name',
										}}
									/>
								</GroupItem>
								<SimpleItem dataField="Company" />
								<GroupItem colCount={2}>
									<SimpleItem dataField="ABN" />
									<SimpleItem dataField="taxFileNo" />
								</GroupItem>
								<GroupItem colCount={2}>
									<SimpleItem dataField="transportMode" />
									<SimpleItem dataField="cardId">
										<Label text="MYOB Card ID" />
									</SimpleItem>
								</GroupItem>
							</GroupItem>
						</GroupItem>
						<GroupItem cssClass="second-group" colCount={2}>
							<SimpleItem
								dataField="notes"
								editorType="dxHtmlEditor"
								editorOptions={{ height: '185px', valueType: 'html' }}
							>
								{/* <HtmlEditor height={185} value={carer.notes} valueType="html" /> */}
							</SimpleItem>
							<SimpleItem
								dataField="medicalNotes"
								editorType="dxHtmlEditor"
								editorOptions={{ height: '185px', valueType: 'html' }}
							>
								{/* <HtmlEditor height={185}  valueType="html" /> */}
							</SimpleItem>
						</GroupItem>
						<GroupItem cssClass="second-group" colCount={2}>
							<Button
								width={120}
								onClick={(e) => onSubmit(e)}
								text="Submit"
								type="default"
								stylingMode="contained"
								useSubmitBehavior={true}
							/>
						</GroupItem>
					</Form>
					{/* </form> */}
				</div>
			) : (
				<LoadIndicator width={'24px'} height={'24px'} visible={true} />
			)}
		</React.Fragment>
	);
}
