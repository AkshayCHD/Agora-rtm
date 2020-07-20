import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import themeObject from "./config/theme";

const theme = createMuiTheme(themeObject);
ReactDOM.render(
  <MuiThemeProvider theme={theme}>
		<App />
	</MuiThemeProvider>,
	 document.getElementById('root')
);
registerServiceWorker();
