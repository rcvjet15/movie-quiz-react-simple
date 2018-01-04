import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import 'font-awesome/css/font-awesome.min.css'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker();