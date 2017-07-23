import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'; // $ npm install bootstrap

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
