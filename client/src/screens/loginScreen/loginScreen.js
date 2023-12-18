import React from 'react';
import PropTypes from 'prop-types';
import './loginScreen.css';
import LoginForm from '../../components/loginForm/loginForm';

const LoginScreen = () => (
  <div className="loginScreen">
        <LoginForm/>
  </div>
);

LoginScreen.propTypes = {};

LoginScreen.defaultProps = {};

export default LoginScreen;
