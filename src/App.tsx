import React from 'react';
import LeaveDetailsForm from './components/LeaveDetailsForm';

const App: React.FC = () => {
	const handleSubmit = (data: any) => {
		console.log('Submitted data:', data);
	};

	return (
		<div>
			<br />
			<br />
			<LeaveDetailsForm onSubmit={handleSubmit} />
		</div>
	);
};

export default App;
