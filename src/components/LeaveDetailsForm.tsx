import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LeaveList from './LeaveList';

interface EmployeeRequest {
	empId: string;
	empName: string;
}

interface LeaveDetails {
	employeeRequest: EmployeeRequest;
	leaveStartDate: string;
	leaveEndDate: string;
	leaveType: string;
	leaveReason: string;
}

interface LeaveDetailsFormProps {
	onSubmit: (formData: LeaveDetails) => void;
}

const LeaveTypeOptions = [
	{ value: 'PL', label: 'Paid Leave' },
	{ value: 'LWP', label: 'Leave Without Pay' },
	{ value: 'SL', label: 'Sick Leave' },
	{ value: 'CL', label: 'Casual Leave' },
	{ value: 'ML', label: 'Maternity Leave' },
	{ value: 'WL', label: 'Wedding Leave' },
	{ value: 'HDL', label: 'Holiday' },
];

const LeaveDetailsForm: React.FC<LeaveDetailsFormProps> = ({ onSubmit }) => {
	const [formData, setFormData] = useState<LeaveDetails>({
		employeeRequest: { empId: '', empName: '' },
		leaveStartDate: '',
		leaveEndDate: '',
		leaveType: '',
		leaveReason: '',
	});

	const [employeeData, setEmployeeData] = useState<EmployeeRequest[]>([]);
	const [selectedEmpName, setSelectedEmpName] = useState('');
	const [formReset, setFormReset] = useState(false);

	useEffect(() => {
		fetchEmployeeData();
	}, []);

	const fetchEmployeeData = async () => {
		try {
			const response = await fetch('http://localhost:9090/api/emp/all');
			const data = await response.json();
			setEmployeeData(data);
		} catch (error) {
			console.error('Error fetching employee data:', error);
		}
	};

	const handleEmpIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedEmpId = e.target.value;
		const selectedEmp = employeeData.find((emp) => emp.empId === selectedEmpId);
		if (selectedEmp) {
			setSelectedEmpName(selectedEmp.empName);
			setFormData((prevData) => ({
				...prevData,
				employeeRequest: {
					empId: selectedEmpId,
					empName: selectedEmp.empName,
				},
			}));
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch('http://localhost:9090/api/leaves/save', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				console.log('Leave details submitted successfully!');
			} else {
				console.error('Error submitting leave details:', response.statusText);
			}
		} catch (error) {
			console.error('Error submitting leave details:', error);
		}
	};

	const handleReset = () => {
		setSelectedEmpName('');
		setFormData({
			employeeRequest: { empId: '', empName: '' },
			leaveStartDate: '',
			leaveEndDate: '',
			leaveType: '',
			leaveReason: '',
		});
		setFormReset(true);
	};

	const handleLeaveTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			leaveType: value,
		}));
	};

	return (
		<>
			<FormContainer>
				<FormHeader>
					<h2>Leave Details Form</h2>
				</FormHeader>
				<Form onSubmit={handleSubmit}>
					<InputLabel htmlFor='empId'>
						Employee ID<Required>*</Required>
					</InputLabel>
					<Select
						id='empId'
						name='empId'
						value={formData.employeeRequest.empId}
						onChange={handleEmpIdChange}
					>
						<option value=''>Select Employee ID</option>
						{employeeData.map((emp) => (
							<option key={emp.empId} value={emp.empId}>
								{emp.empId}
							</option>
						))}
					</Select>

					<InputLabel htmlFor='empName'>Employee Name</InputLabel>
					<Input
						type='text'
						id='empName'
						name='empName'
						value={selectedEmpName}
						onChange={handleInputChange}
						disabled
					/>

					<InputLabel htmlFor='leaveStartDate'>
						Leave Start Date<Required>*</Required>
					</InputLabel>
					<Input
						type='date'
						id='leaveStartDate'
						name='leaveStartDate'
						value={formData.leaveStartDate}
						onChange={handleInputChange}
					/>

					<InputLabel htmlFor='leaveEndDate'>
						Leave End Date<Required>*</Required>
					</InputLabel>
					<Input
						type='date'
						id='leaveEndDate'
						name='leaveEndDate'
						value={formData.leaveEndDate}
						onChange={handleInputChange}
					/>

					<InputLabel htmlFor='leaveType'>
						Leave Type<Required>*</Required>
					</InputLabel>
					<Select
						id='leaveType'
						name='leaveType'
						value={formData.leaveType}
						onChange={handleLeaveTypeChange}
					>
						<option value=''>
							Select Leave Type<Required>*</Required>
						</option>
						{LeaveTypeOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</Select>

					<InputLabel htmlFor='leaveReason'>
						Leave Reason<Required>*</Required>
					</InputLabel>
					<Textarea
						id='leaveReason'
						name='leaveReason'
						value={formData.leaveReason}
						onChange={handleInputChange}
					/>

					<ButtonContainer>
						<SubmitButton type='submit' onClick={handleSubmit}>
							Submit
						</SubmitButton>
						<ResetButton type='button' onClick={handleReset}>
							Reset
						</ResetButton>
					</ButtonContainer>
				</Form>
			</FormContainer>
			<LeaveList
				empId={formData.employeeRequest.empId}
				empName={formData.employeeRequest.empName}
			/>
			{/* formReset={formReset} */}
		</>
	);
};

const FormContainer = styled.div`
	max-width: 400px;
	margin: 0 auto;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-shadow: 0px 2px 4px #00000019;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;

	label {
		margin-bottom: 5px;
		font-weight: bold;
	}

	input,
	textarea {
		padding: 10px;
		margin-bottom: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}
`;

const FormHeader = styled.div`
	text-align: center;
	margin-bottom: 20px;
`;

const InputLabel = styled.label`
	margin-bottom: 5px;
	font-weight: bold;
`;

const Input = styled.input`
	padding: 10px;
	margin-bottom: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
`;

const Textarea = styled.textarea`
	padding: 10px;
	margin-bottom: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
	resize: vertical;
`;

const Select = styled.select`
	padding: 10px;
	margin-bottom: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const SubmitButton = styled.button`
	padding: 10px;
	background-color: #007bff;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;

	&:hover {
		background-color: #0056b3;
	}
	width: 47%;
`;

const ResetButton = styled.button`
	padding: 10px;
	background-color: #f8f9fa;
	color: #333;
	border: none;
	border-radius: 5px;
	cursor: pointer;

	&:hover {
		background-color: #e2e6ea;
	}
	width: 47%;
`;

const Required = styled.span`
	color: red;
	margin-left: 4px;
`;

export default LeaveDetailsForm;
