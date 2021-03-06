import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import notify from 'devextreme/ui/notify';
import Form, { Item, Label, ButtonItem, ButtonOptions, RequiredRule, EmailRule } from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import { useAuth } from '../../contexts/auth';
import './login-form.scss';

export default function(props) {
	const { logIn } = useAuth();
	const [ loading, setLoading ] = useState(false);
	const formData = useRef({});

	const onSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			const { email, password } = formData.current;
			setLoading(true);

			const res = await logIn(email, password);
			if (res.message) {
				//console.log(res.message);
				notify(res.message, 'error', 600);
			}
			setLoading(false);
		},
		[ logIn ]
	);

	return (
		<form className={'login-form'} onSubmit={onSubmit}>
			<Form formData={formData.current} disabled={loading}>
				<Item dataField={'email'} editorType={'dxTextBox'} editorOptions={emailEditorOptions}>
					<RequiredRule message="Email is required" />
					<EmailRule message="Email is invalid" />
					<Label visible={false} />
				</Item>
				<Item dataField={'password'} editorType={'dxTextBox'} editorOptions={passwordEditorOptions}>
					<RequiredRule message="Password is required" />
					<Label visible={false} />
				</Item>
				<Item dataField={'rememberMe'} editorType={'dxCheckBox'} editorOptions={rememberMeEditorOptions}>
					<Label visible={false} />
				</Item>
				<ButtonItem>
					<ButtonOptions width={'100%'} type={'default'} useSubmitBehavior={true}>
						<span className="dx-button-text">
							{loading ? <LoadIndicator width={'24px'} height={'24px'} visible={true} /> : 'Sign In'}
						</span>
					</ButtonOptions>
				</ButtonItem>
				<Item>
					<div className={'link'}>
						<Link to={'/reset-password'}>Forgot password?</Link>
					</div>
				</Item>
			</Form>
		</form>
	);
}

const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Email', mode: 'email' };
const passwordEditorOptions = { stylingMode: 'filled', placeholder: 'Password', mode: 'password' };
const rememberMeEditorOptions = { text: 'Remember me', elementAttr: { class: 'form-text' } };
