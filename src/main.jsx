import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { applyBrandVariables } from './config/brand.js';
import './styles/global.css';

applyBrandVariables();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
