import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "";
console.log(clientId);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);
