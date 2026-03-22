import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import API_BASE_URL from './config';
import reportWebVitals from './reportWebVitals';

// Visible in browser devtools; helps verify REACT_APP_API_URL on Render static builds
console.info('[NeuroTrain Lab] API base URL:', API_BASE_URL);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
