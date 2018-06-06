import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if (!window.location.origin) {
	window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
}

ReactDOM.render(<App />, document.getElementById('root'));