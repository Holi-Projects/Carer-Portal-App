import React, { useMemo, useCallback } from 'react';
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import { useAuth } from '../../contexts/auth';
import './user-panel.scss';
import { useHistory } from 'react-router-dom';


export default function({ menuMode }) {
	const { user, logOut } = useAuth();

	const history = useHistory();

	const profile = useCallback(
		async (e) => {
			history.push('/profile');
		},
		[ history ]
	);

	const changePassword = useCallback(
		async (e) => {
			history.push('/changePassword');
		},[history]
	);

	const menuItems = useMemo(
		() => [
			{
				text    : 'Profile',
				icon    : 'user',
				onClick : profile,
			},{
				text    : 'Change Password',
				icon    : 'refresh',
				onClick : changePassword,
			},
			{
				text    : 'Logout',
				icon    : 'runner',
				onClick : logOut,
			},
		],
		[ logOut, profile,changePassword ]
	);

	return (
		<div className={'user-panel'}>
			<div className={'user-info'}>
				<div className={'image-container'}>
					<div
						style={{
							background     : `url(${user.photo}) no-repeat #fff`,
							backgroundSize : 'cover',
						}}
						className={'user-image'}
					/>
				</div>
				<div className={'user-name'}>
					{user.firstName} {user.lastName}
				</div>
			</div>

			{menuMode === 'context' && (
				<ContextMenu
					items={menuItems}
					target={'.user-button'}
					showEvent={'dxclick'}
					width={210}
					cssClass={'user-menu'}
				>
					<Position my={'top center'} at={'bottom center'} />
				</ContextMenu>
			)}
			{menuMode === 'list' && <List className={'dx-toolbar-menu-action'} items={menuItems} />}
		</div>
	);
}
