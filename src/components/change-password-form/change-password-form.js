import React, { useState, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { SingleCard } from '../../layouts';
import updateData from '../../api/updateData';

import Form, {
	Item,
	Label,
	ButtonItem,
	ButtonOptions,
	RequiredRule,
	CompareRule,
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import notify from 'devextreme/ui/notify';

export default function(props) {
	const history = useHistory();
	const [ loading, setLoading ] = useState(false);
	const formData = useRef({});
	
	const onSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			const { newPassword, oldPassword } = formData.current;
			setLoading(true);

			// Send reset password request
			const res = await updateData('/api/auth/change-password', {
				newPassword : newPassword,
				oldPassword : oldPassword,
			});

			const status = await res.json();

			if (status.success) {
				notify(status.message, 'success', 1000);
				history.push('/home');
			} else {
				notify(status.message, 'error', 1000);
			}
			setLoading(false);
		},
		[ history ]
	);

	//compares new password field and match
	const confirmPassword = (e) => {
		return formData.current.newPassword;
	};

	return (
		<SingleCard title="Change Password">
			<form onSubmit={onSubmit}>
				<Form formData={formData.current} disabled={loading}>
					<Item dataField={'oldPassword'} editorType={'dxTextBox'} editorOptions={oldPasswordEditorOptions}>
						<RequiredRule message="Old Password is required" />
						<Label visible={false} />
					</Item>

					<Item dataField={'newPassword'} editorType={'dxTextBox'} editorOptions={newPasswordEditorOptions}>
						<RequiredRule message="New Password is required" />
						
						<Label visible={false} />
					</Item>

					<Item
						dataField={'confirmedPassword'}
						editorType={'dxTextBox'}
						editorOptions={confirmedPasswordEditorOptions}
					>
						<RequiredRule message="Confirm Password is required" />
						<CompareRule message="New Password mismatch" comparisonTarget={confirmPassword} />

						<Label visible={false} />
					</Item>
					<ButtonItem>
						<ButtonOptions width={'100%'} type={'default'} useSubmitBehavior={true}>
							<span className="dx-button-text">
								{loading ? <LoadIndicator width={'24px'} height={'24px'} visible={true} /> : 'Confirm'}
							</span>
						</ButtonOptions>
					</ButtonItem>
				</Form>
			</form>
		</SingleCard>
	);
}

const oldPasswordEditorOptions = { stylingMode: 'filled', placeholder: 'Old Password', mode: 'password' };
const newPasswordEditorOptions = { stylingMode: 'filled', placeholder: 'New Password', mode: 'password' };
const confirmedPasswordEditorOptions = { stylingMode: 'filled', placeholder: 'Confirm Password', mode: 'password' };
