import React, { useState, useEffect } from 'react';
import DataGrid, { Column, Paging } from 'devextreme-react/data-grid';

import fetchData from '../../api/fetchData';

const ContactHistory = () => {
	const [ data, setData ] = useState(null);

	var url = `/api/contact-history`;
	useEffect(
		() => {
			async function fetchContactHistory() {
				try {
					let data = await fetchData(url);
					setData(data);
				} catch (e) {
					console.log(e);
				} finally {
				}
			}
			fetchContactHistory();
		},
		[ url ]
	);

	return (
		<React.Fragment>
			<DataGrid
				dataSource={data}
				showBorders={false}
				remoteOperations={false}
				hoverStateEnabled={true}
				columnAutoWidth={true}
				columnHidingEnabled={true}
				wordWrapEnabled={true}
			>
				<Column
					dataField="date"
					caption="Date"
					dataType="date"
					format="dd/MM/yyyy"
					sortIndex={0}
					sortOrder={'desc'}
				/>
				<Column dataField="employeeName" caption="Employee" dataType="string" hidingPriority={0} />
				<Column dataField="clientName" caption="Client" dataType="string" />
				<Column dataField="agencyName" caption="Agency" dataType="string" visible={false} />
				<Column dataField="comments" dataType="string" width={300} hidingPriority={1} />
				<Column dataField="followUpDate" caption="Follow Up On" dataType="date" format="dd/MM/yyyy" />
				<Column dataField="followUp" dataType="string" width={300} hidingPriority={2} />
				<Column dataField="followUpComplete" caption="Complete" dataType="boolean" />
				<Column dataField="printOnRoster" dataType="boolean" visible={false} />
				<Column dataField="addedDateTime" caption="Added At" dataType="string" visible={false} />
				<Column dataField="changedDateTime" caption="Changed At" dataType="string" visible={false} />
				<Paging defaultPageSize={8} />
			</DataGrid>
		</React.Fragment>
	);
};

export default ContactHistory;
