import React, { useState, useRef } from 'react';
import DataGrid, { Column, Editing, Lookup, Popup, Position, Form, Paging, Button } from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import CustomStore from 'devextreme/data/custom_store';
import FileUploader from 'devextreme-react/file-uploader';
import { Popup as Popup2 } from 'devextreme-react/popup';
import { Button as Button2 } from 'devextreme-react/button';

import fetchData from '../../../api/fetchData';
import updateData from '../../../api/updateData';
import insertData from '../../../api/insertData';
import deleteData from '../../../api/deleteData';
import fetchFile from '../../../api/fetchFile';
import authHeader from '../../../api/auth-header';
import { useAuth } from '../../../contexts/auth';

export default function({ carerId }) {
	const { user } = useAuth();

	const [ selectedCarerSkill, setSelectedCarerSkill ] = useState();
	const [ documents, setDocuments ] = useState([]);
	const [ filePopupVisible, setFilePopupVisible ] = useState(false);

	const uploader = useRef();

	const renderFilePopupContent = () => {
		const onCellClick = (e) => {
			console.log('onCellClick(e)');
			console.log(e);

			if (e.rowType === 'data' && e.column && e.column.dataField === 'name') {
				const url = `/api/carer/${carerId}/document/${e.data.id}`;
				fetchFile(url)
					.then((res) => res.blob())
					.then((blob) => {
						var file = window.URL.createObjectURL(blob);
						window.open(file);
						//console.log('OK');
					})
					.catch((error) => {
						//console.log(error);
					});
			}
		};

		const renderFileNameAsLink = (e) => {
			console.log('renderFileNameAsLink(e)');
			//console.log(e);
			return <span style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>{e.data.name}</span>;
		};

		const removeDocument = (e) => {
			console.log('removeDocument(e)');
			//console.log(e);
			const url = `/api/carer/${carerId}/document/${e.data.id}`;
			deleteData(url);
		};

		return (
			<React.Fragment>
				<FileUploader
					selectButtonText="Attach File"
					labelText=""
					accept="pdf/*"
					onValueChanged={(e) => {
						e.component.option('uploadHeaders', authHeader());
						e.component.option(
							'uploadUrl',
							`/api/carer/${carerId}/document?carerSkillId=${selectedCarerSkill}`
						);
					}}
					onUploaded={(e) => {
						//console.log('onUploaded(e)');
						loadDocuments(selectedCarerSkill);
					}}
					ref={uploader}
				/>
				<DataGrid
					className={'dx-card wide-card'}
					dataSource={documents}
					showRowLines={false}
					remoteOperations={false}
					onCellClick={onCellClick}
					onRowRemoving={removeDocument}
				>
					<Editing mode="row" allowDeleting={true} />
					<Column dataField="name" caption="Name" dataType="string" cellRender={renderFileNameAsLink} />
					<Column dataField="size" caption="Size (bytes)" dataType="number" format="fixedPoint" />
					<Column dataField="dateModified" dataType="date" format="shortDateShortTime" />
					<Paging defaultPageSize={5} />
				</DataGrid>
				<Button2 text="Close" onClick={hideFilePopup} />
			</React.Fragment>
		);
	};

	async function loadDocuments(carerSkillId) {
		setDocuments(await fetchData(`/api/carer/${carerId}/document?carerSkillId=${carerSkillId}`));
	}

	const showFilePopup = (e) => {
		//console.log('showPopup()');
		//console.log(e);
		setSelectedCarerSkill(e.row.key);
		loadDocuments(e.row.key);
		setFilePopupVisible(true);
	};

	const hideFilePopup = (e) => {
		console.log('hidePopup()');
		console.log(e);

		setFilePopupVisible(false);
		console.log(uploader.current);
		//uploader.current.reset();
		//uploader.reset();
	};

	const approveSkill = async (e) => {
		console.log('approveSkill()');
		console.log(e);

		//if (e.row) {
		//	insertData(`/api/carer/${carerId}/skill/${e.row.key}/approve`, {});
		//}
		const now = new Date();
		const values = {
			approvedByEmployeeId : user.id,
			approvedDate         : now.toISOString(),
		};
		await carerSkillStore.update(e.row.key, values);
		setSelectedCarerSkill(e.row.key); // trigger a re-render of the DataGrid
	};

	const skillStore = new CustomStore({
		key      : 'id',
		loadMode : 'raw',
		load     : () => fetchData(`/api/ref/skill`),
	});

	const employeeStore = new CustomStore({
		key      : 'id',
		loadMode : 'raw',
		load     : () => fetchData(`/api/ref/employee`),
	});

	const carerSkillStore = new CustomStore({
		key    : 'id',
		load   : () => fetchData(`/api/carer/${carerId}/skill`),
		update : (id, values) => updateData(`/api/carer/${carerId}/skill/${id}`, values),
		insert : (values) => {
			insertData(`/api/carer/${carerId}/skill`, { ...values, carerId: carerId });
		},
		remove : (id) => deleteData(`/api/carer/${carerId}/skill/${id}`),
	});

	return (
		<React.Fragment>
			<DataGrid
				className={'dx-card wide-card'}
				dataSource={carerSkillStore}
				showBorders={true}
				remoteOperations={false}
				focusedRowEnabled={true}
				columnAutoWidth={true}
				columnHidingEnabled={true}
			>
				<Editing mode="popup" allowUpdating={true} allowDeleting={true} allowAdding={true}>
					<Popup title="Skill Details" showTitle={true} width={500} height={460}>
						<Position my="center" at="center" of={window} />
					</Popup>
					<Form colCount={1}>
						<Item itemType="group" colCount={2}>
							<Item dataField="skillId" />
							<Item dataField="referenceNo" />
							<Item dataField="dateGained" />
							{/*hasExpiry && <Item dataField="expiryDate" />*/}
							<Item dataField="expiryDate" />
						</Item>
						<Item dataField="comments" editorType="dxTextArea" editorOptions={{ height: 87 }} />
						<Item itemType="group" colCount={2}>
							<Item dataField="approvedByEmployeeId" />
							<Item dataField="approvedDate" />
						</Item>
					</Form>
				</Editing>

				<Column dataField="skillId" caption="Skill" dataType="number">
					<Lookup dataSource={skillStore} valueExpr="id" displayExpr="name" />
				</Column>
				<Column dataField="hasExpiry" visible={false} />
				<Column dataField="dateGained" dataType="date" />
				<Column dataField="expiryDate" dataType="date" />
				<Column dataField="referenceNo" dateType="string" />
				<Column dataField="carerSubmittedDate" dataType="date" />
				<Column dataField="approvedByEmployeeId" caption="Approved By" dataType="number">
					<Lookup dataSource={employeeStore} valueExpr="id" displayExpr="name" />
				</Column>
				<Column dataField="approvedDate" dataType="date" />
				<Column dataField="comments" dataType="string" />
				<Column type="buttons">
					<Button name="edit" />
					<Button text="Files" icon="file" hint="Upload files" onClick={showFilePopup} />
					<Button text="Approve" hint="Approve skill" onClick={approveSkill} />
					<Button name="delete" />
				</Column>
			</DataGrid>
			<Popup2
				title="Files"
				showTitle={true}
				width={600}
				height={550}
				visible={filePopupVisible}
				contentRender={renderFilePopupContent}
				onHiding={hideFilePopup}
				closeOnOutsideClick={true}
			/>
		</React.Fragment>
	);
}
