import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import 'date-fns';

import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import './LoginPage.css'
import { authService } from '../../helpers/services/auth'
import { Button } from '@material-ui/core';
import { history } from '../../helpers/services/history'

function LoginPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [selectedDate, setSelectedDate] = useState(new Date('2014-08-18T21:11:54'));
	const login = async () => {
		try {
			await authService.login(name, email, selectedDate);
			history.push('/');
		} catch(error) {
			console.log("Error: ", error)
		}
	}
	return (
		<div className="login-container">
			<Card className="login-card">
				<div className="input-container">
					<TextField onChange={(e) => setName(e.target.value)}
						label="Name"
						variant="outlined"
						className="input-field"
					/>
				</div>
				<div className="input-container">
					<TextField
						label="Email"
						onChange={(e) => setEmail(e.target.value)}
						variant="outlined"
						className="input-field"
					/>
				</div>
				<div className="input-container">
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDatePicker
							className="input-field"
							margin="normal"
							id="date-picker-dialog"
							label="Date picker dialog"
							format="MM/dd/yyyy"
							variant="outlined"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							KeyboardButtonProps={{
								'aria-label': 'change date',
							}}
						/>
					</MuiPickersUtilsProvider>
				</div>
				<div className="input-container">
					<Button className="login-button" variant="contained" color="primary" onClick={login}>Login</Button>
				</div>
			</Card>
		</div>
	)
}
export default LoginPage;
