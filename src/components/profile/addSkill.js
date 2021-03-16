import React, { useState, useEffect, useCallback } from 'react';
import TextBox from 'devextreme-react/text-box';
import { Validator, RequiredRule } from 'devextreme-react/validator';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
import fetchData from '../../api/fetchData';
import DateBox from 'devextreme-react/date-box';
import insertData from '../../api/insertData';
import { useAuth } from '../../contexts/auth';

const AddSkill = (props) => {
	const [ refNo, setRef ] = useState('');
	const [ certDate, setDate ] = useState('');
	const [ expDate, setExpDate ] = useState('');
	const [ comment, setComment ] = useState('');
	const [ list, setList ] = useState();
	const [ data, setData ] = useState(null);
	const { user } = useAuth();

	useEffect(() => {
		async function fetchMyAPI() {
			try {
				setList(await fetchData('/api/ref/skill'));
			} catch (e) {
				console.log(e);
			} finally {
			}
		}
		fetchMyAPI();
	}, []);

	const onFormSubmit = useCallback(
		async (e) => {
			e.preventDefault();


			//changes the skill Id to id to match record schema
			delete Object.assign(data, { skillId: data.id }).id;
			const submitData = {
				dateGained  : certDate,
				expiryDate  : expDate,
				comments    : comment,
				referenceNo : refNo,
			};
			Object.assign(data, submitData);
			console.log(data);

			const res = await insertData(`/api/carer/${user.id}/skill`, data);

			const status = await res.json();
			console.log(status);

			notify(
				{
					message  : 'Skill Successfully Added',
					position : {
						my : 'center top',
						at : 'center top',
					},
				},
				'success',
				3000
			);
			props.clearSkill();
		},
		[ data, certDate, comment, expDate, user, props, refNo ]
	);


	//populates the form when a skill type is selected from a dropdown
	const selected = (val) => {
		if (list !== undefined) {
			list.forEach((item) => {
				if (item.name === val) {
					setData(item);
					return item;
				}

				return null;
			});
		}
	};

	return (
		<form id="form" onSubmit={onFormSubmit}>
			<div className="dx-fieldset">
				<div className="dx-field">
					<div className="dx-field-label">Skill Name:</div>
					<SelectBox
						name="certType"
						placeholder="e.g AGED CERT III"
						dataSource={list}
						displayExpr="name"
						className="dx-field-value"
						onValueChanged={(e) => {
							console.log(e);
							selected(e.value.name);
						}}
					>
						<Validator>
							<RequiredRule message="Select a Certificate Type" />
						</Validator>
					</SelectBox>
				</div>
				<div className="dx-field">
					<div className="dx-field-label">Description:</div>
					<TextBox
						name="desc"
						placeholder="description of certificate"
						value={data !== null ? data.description : null}
						className="dx-field-value"
					/>
				</div>

				<div className="dx-field">
					<div className="dx-field-label">Reference No:</div>
					<TextBox
						name="refNo"
						placeholder="Certificate Number"
						className="dx-field-value"
						value={refNo}
						onValueChanged={(e) => setRef(e.value)}
					/>
				</div>

				<div className="dx-field">
					<div className="dx-field-label">Date Gained:</div>
					<DateBox
						name="date obtain"
						placeholder="DD/MM/YY"
						onValueChanged={(e) => setDate(e.value)}
						type="date"
					>
						<Validator>
							<RequiredRule message="Enter Date issued" />
						</Validator>
					</DateBox>
				</div>
				<div className="dx-field">
					<div className="dx-field-label">Expiry Date:</div>
					<DateBox
						name="expiry date"
						placeholder="DD/MM/YY"
						onValueChanged={(e) => setExpDate(e.value)}
						type="date"
					/>
				</div>

				<div className="dx-field">
					<div className="dx-field-label">Comments:</div>
					<TextBox
						name="comment"
						placeholder="Add a comment"
						className="dx-field-value"
						value={comment}
						onValueChanged={(e) => setComment(e.value)}
					/>
				</div>
			</div>

			<div style={{ textAlign: '-webkit-center' }}>
				<Button className="button" text="Add Skill" type="success" useSubmitBehavior={true} />
				<Button
					className="button"
					text="Cancel"
					type="danger"
					style={{ marginLeft: '50px' }}
					onClick={() => props.clearSkill()}
				/>
			</div>
		</form>
	);
};

export default AddSkill;
