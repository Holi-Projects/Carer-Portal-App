import React, { useState, useRef, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Form, { Item, Label, ButtonItem, ButtonOptions, RequiredRule, EmailRule } from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import notify from 'devextreme/ui/notify';
import insertData from '../../api/insertData';
import './reset-password-form.scss';

const notificationText = "We've sent a link to reset your password. Check your inbox.";

export default function(props) {
	const history = useHistory();
	const [ loading, setLoading ] = useState(false);
	const formData = useRef({});

	const onSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			const { email } = formData.current;
			setLoading(true);

			// Send reset password request
			const userType = 'carer';
			const res = await insertData('/api/auth/reset', { userType, email });
			const data = await res.json();
			if (data.message) {
				notify(data.message, 'error', 600);
			}
			setLoading(false);

			history.push('/login');
			notify(notificationText, 'success', 2500);
		},
		[ history ]
	);

	return (
		<form className={'reset-password-form'} onSubmit={onSubmit}>
			<Form formData={formData.current} disabled={loading}>
				<Item dataField={'email'} editorType={'dxTextBox'} editorOptions={emailEditorOptions}>
					<RequiredRule message="Email is required" />
					<EmailRule message="Email is invalid" />
					<Label visible={false} />
				</Item>
				<ButtonItem>
					<ButtonOptions
						elementAttr={submitButtonAttributes}
						width={'100%'}
						type={'default'}
						useSubmitBehavior={true}
					>
						<span className="dx-button-text">
							{loading ? (
								<LoadIndicator width={'24px'} height={'24px'} visible={true} />
							) : (
								'Reset my password'
							)}
						</span>
					</ButtonOptions>
				</ButtonItem>
				<Item>
					<div className={'login-link'}>
						Return to <Link to={'/login'}>Sign In</Link>
					</div>
				</Item>
			</Form>
		</form>
	);
}

const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Email', mode: 'email' };
const submitButtonAttributes = { class: 'submit-button' };
