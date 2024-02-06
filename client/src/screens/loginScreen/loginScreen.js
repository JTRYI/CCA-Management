import React, { useEffect } from 'react';
import './loginScreen.css';
import LoginForm from '../../components/loginForm/loginForm';

function LoginScreen() {

  useEffect(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }, []);

  return (
    <div className="loginScreen">
      <LoginForm />
    </div>
  )
};


export default LoginScreen;
