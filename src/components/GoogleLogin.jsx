import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const GoogleLoginComponent = () => {
  const navigate = useNavigate();
  const { setUserName, setUserId } = useUser(); // Access setUserId from context

  const handleLoginSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;

    try {
      const response = await axios.post('https://leboba.onrender.com/auth/google', { idToken });
      console.log('Backend response:', response.data);

      // Update the user's name and ID in the context
      setUserName(response.data.name);
      setUserId(response.data.userId); // Set userId from backend response

      // Redirect to the menu page
      navigate('/menu/1');
    } catch (error) {
      console.error('Error during authentication:', error);
      alert('Login failed! Please try again.');
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div>
        <h2>Login with Google</h2>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.error('Login Failed')}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;