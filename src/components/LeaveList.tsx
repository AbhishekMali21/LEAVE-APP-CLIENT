import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Leave {
	employeeResponse: {
		empId: string;
		empName: string;
	};
	leaveStartDate: string;
	leaveEndDate: string;
	leaveType: string;
	leaveReason: string;
}

interface LeaveListProps {
	empId: string;
	formReset?: boolean;
}

const LeaveList: React.FC<LeaveListProps> = ({ empId, formReset }) => {
	const [leaveList, setLeaveList] = useState<Leave[]>([]);

	useEffect(() => {
		if (formReset) {
			setLeaveList([]);
		} else {
			fetchLeaveData(empId);
		}
	}, [empId, formReset]);

	const fetchLeaveData = async (empId: string) => {
		try {
			const response = await fetch(
				`http://localhost:9090/api/leaves/employee/${empId}`
			);
			const data = await response.json();
			setLeaveList(data);
		} catch (error) {
			console.error('Error fetching leave data:', error);
		}
	};

	return (
		<LeaveListContainer>
			<h2>Leaves Taken by Employee ID: {empId}</h2>
			<Table>
				<thead>
					<tr>
						<th>Leave Type</th>
						<th>Start Date</th>
						<th>End Date</th>
						<th>Reason</th>
					</tr>
				</thead>
				<tbody>
					{leaveList.map((leave, index) => (
						<TableRow key={index} isOdd={index % 2 !== 0}>
							<td>{leave.leaveType}</td>
							<td>{leave.leaveStartDate}</td>
							<td>{leave.leaveEndDate}</td>
							<td>{leave.leaveReason}</td>
						</TableRow>
					))}
				</tbody>
			</Table>
		</LeaveListContainer>
	);
};

const LeaveListContainer = styled.div`
	margin: 0 auto;
	padding: 20px;
	max-width: 800px;
	padding-bottom: 50px;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-shadow: 0px 2px 4px #00000019;
`;

const Table = styled.table`
	width: 100%;
	border-collapse: collapse;

	th,
	td {
		padding: 8px;
		text-align: left;
		border-bottom: 1px solid #ddd;
	}

	th {
		background-color: #f2f2f2;
	}
`;

const TableRow = styled.tr<{ isOdd: boolean }>`
	background-color: ${(props) => (props.isOdd ? '#f2f2f2' : 'white')};
`;

export default LeaveList;
