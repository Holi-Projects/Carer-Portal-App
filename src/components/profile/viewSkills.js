import React, { useState, useRef } from 'react';
import DataGrid, { Column, Editing, FormItem } from 'devextreme-react/data-grid';
import FileUploader from 'devextreme-react/file-uploader';
import CustomStore from 'devextreme/data/custom_store';
import fetchData from '../../api/fetchData';
import { useAuth } from '../../contexts/auth';
import updateData from '../../api/updateData';
import fetchFile from '../../api/fetchFile';
import authHeader from '../../api/auth-header';
import notify from 'devextreme/ui/notify';
import Popup from 'devextreme-react/popup';
import deleteData from '../../api/deleteData';

const ViewSkill = (props) => {
	const { user } = useAuth();
	const [ docFile, setDocFile ] = useState([]);
	const grid = useRef(null);
	const [ fileRowID, setFileRow ] = useState();
	const [ visible, setVisible ] = useState(false);

	const skills = new CustomStore({
		key      : 'id',
		loadMode : 'raw',
		load     : () => fetchData(`/api/carer/${user.id}/skill`),
		update   : (id, values) => {
			console.log(values);
			updateData(`/api/carer/${user.id}/skill/${id}`, values);
			notify('Skill Update Successful', 'success', 3000);
		},
	});

	async function getFile(rowID) {
		setDocFile(await fetchData(`/api/carer/${user.id}/document?carerSkillId=${rowID}`));
	}

	const viewFile = (id) => {
		let url = `/api/carer/${user.id}/document/${id}`;
		fetchFile(url)
			.then((res) => res.blob())
			.then((blob) => {
				var file = window.URL.createObjectURL(blob);
				window.open(file);
				console.log('OK');
			})
			.catch((error) => {
				console.log(error);
			});
	};

	//A function to display a popup containing info on a skill files
	const renderFilesPage = () => {
		const fileLink = (e) => {
			//console.log(e)
			return (
				<span
					style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
					onClick={() => viewFile(e.data.id)}
				>
					{e.data.name}
				</span>
			);
		};

		console.log(docFile);
		console.log(fileRowID);
  
		const removeDocument = (e) => {
			//console.log(e.data.id);
			const url = `/api/carer/${user.id}/document/${e.data.id}`;
			deleteData(url);
			notify('File Deleted Successfully', 'success', 3000);
		};

		return (
			<React.Fragment>
				<DataGrid
					dataSource={docFile}
					showBorders={true}
					columnAutoWidth={true}
					columnHidingEnabled={true}
					onRowRemoving={removeDocument}
				>
					<Editing mode="row" allowDeleting={true} />
					<Column dataField="name" caption="File" cellRender={fileLink} />
					<Column dataField="size" caption="Size (bytes)" dataType="number" format="fixedPoint" />
					<Column dataField="dateModified" dataType="date" format="shortDateShortTime" />
				</DataGrid>
				<FileUploader
					selectButtonText="Attach File"
					labelText=""
					accept="pdf/*"
					uploadMode="useButtons"
					onValueChanged={(e) => {
						e.component.option('uploadHeaders', authHeader());
						e.component.option('uploadUrl', `/api/carer/${user.id}/document?carerSkillId=${fileRowID}`);
					}}
					onUploaded={(e) => {
						notify('File Uploaded Successfully', 'success', 3000);
						getFile(fileRowID);
						console.log(e);
					}}
				/>
			</React.Fragment>
		);
	};

	return (
		<React.Fragment>
			<DataGrid
				dataSource={skills}
				selection={{ mode: 'single' }}
				showBorders={true}
				hoverStateEnabled={true}
				columnHidingEnabled={true}
				ref={grid}
			>
				<Editing mode="form" allowUpdating={true} />

				<Column dataField="name">
					<FormItem editorOptions={{ readOnly: true }} />
				</Column>
				<Column dataField="description">
					<FormItem editorOptions={{ readOnly: true }} />
				</Column>
				<Column dataField="hasExpiryDate">
					<FormItem visible={false} />
				</Column>
				<Column dataField="dateGained" dataType="date" />
				<Column dataField="expiryDate" dataType="date" />
				<Column dataField="referenceNo" dataType="referenceNo" />
				<Column dataField="comments" dataType="comments" />
				<Column dataField="carerSubmittedDate" dataType="date" caption="Date Submitted">
					<FormItem visible={false} />
				</Column>
				<Column dataField="approvedByEmployeeName" caption="Approved By">
					<FormItem visible={false} />
				</Column>
				<Column dataField="approvedDate" dataType="date">
					<FormItem visible={false} />
				</Column>

				<Column
					caption="Files"
					cellRender={(e) => (
						<span
							style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
							onClick={() => {
								setVisible(true);
								setFileRow(e.row.key);
								getFile(e.row.key);
							}}
						>
							View Files
						</span>
					)}
				>
					<FormItem visible={false} />
				</Column>
			</DataGrid>

			<Popup
				title="Files"
				showTitle={true}
				width={600}
				height={550}
				visible={visible}
				contentRender={renderFilesPage}
				onHiding={() => setVisible(false)}
				closeOnOutsideClick={true}
			/>
		</React.Fragment>
	);
};

export default ViewSkill;
