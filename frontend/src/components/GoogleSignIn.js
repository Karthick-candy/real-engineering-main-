import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // Use jwt-decode to decode the JWT token

const GoogleSignIn = ({ onSuccess }) => {
  const handleSuccess = (response) => {
    // Decode the JWT token to get user details
    const decoded = jwtDecode(response.credential); // response.credential contains the JWT token
    console.log('Decoded JWT:', decoded);

    // Extract necessary user info like name, email, picture
    const userInfo = {
      name: decoded.name,
      email: decoded.email,
      profilePic: decoded.picture,
    };

    onSuccess(userInfo); // Pass user info to the parent component
  };

  const handleError = (error) => {
    console.error('Google Sign-In error:', error);
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap // Optionally add one-tap login if you want
    />
  );
};

export default GoogleSignIn;
