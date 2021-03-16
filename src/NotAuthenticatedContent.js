import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SingleCard } from './layouts';
import { LoginForm, ResetPasswordForm, ChangePasswordForm, CreateAccountForm, ResetPasswordTokenForm } from './components';
import appInfo from './app-info';

export default function () {
  return (
    <Switch>
      <Route exact path="/login">
				<SingleCard title={`${appInfo.title} Sign In`}>
					<LoginForm />
				</SingleCard>
			</Route>
			<Route exact path="/create-account">
				<SingleCard title={`${appInfo.title} Sign Up`}>
					<CreateAccountForm />
				</SingleCard>
			</Route>
			<Route exact path="/reset-password">
				<SingleCard
					title={`${appInfo.title} Reset Password`}
					description="Please enter the email address that you used to register, and we will send you an email
					with a link to reset your password."
				>
					<ResetPasswordForm />
				</SingleCard>
			</Route>
      <Route exact path="/reset-password-token/:recoveryCode">
				<SingleCard title={`${appInfo.title} Reset Password`}>
					<ResetPasswordTokenForm />
				</SingleCard>
			</Route>
			<Route exact path="/change-password">
				<SingleCard title={`${appInfo.title} Change Password`}>
					<ChangePasswordForm />
				</SingleCard>
			</Route>
			<Redirect to={'/login'} />
    </Switch>
  );
}
