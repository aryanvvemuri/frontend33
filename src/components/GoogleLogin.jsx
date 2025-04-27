import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLoginComponent = ({ setUserName, setUserEmail }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;

    try {
      // Send the ID token to your backend
      const response = await axios.post('http://localhost:3000/auth/google', { idToken });
      console.log('Backend response:', response.data);

      // Update the user's name and email
      setUserName(response.data.name);
      setUserEmail(response.data.email);

      // Redirect based on email
      if (response.data.email === 'tylerr13@tamu.edu') {
        navigate('/manager'); // Redirect to manager screen
      } else {
        navigate('/menu/1'); // Redirect to customer menu
      }
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
