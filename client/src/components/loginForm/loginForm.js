import React from 'react';
import PropTypes from 'prop-types';
import './loginForm.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, RadioGroup, Stack, Input } from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button
} from '@chakra-ui/react'

function LoginForm() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedRole, setSelectedRole] = useState('false'); // Default value 'false' for Member
  
  const handleInputChange = (e) => setEmail(e.target.value)
  const handlePasswordInputChange = (e) => setPassword(e.target.value)

  const isError = isSubmitted && email === '';
  const isPasswordError = isSubmitted && password === '';

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (email === '' || password === '') {
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isAdmin: selectedRole === 'true', // Convert string to boolean,
          email: email,
          password: password
        }),
      });

      const data = await response.json();
      // console.log(data);

      if (data.token) {
        // If the login is successful, navigate to the /home route
        setEmail('');
        setPassword('');
        navigate('/home');
        sessionStorage.setItem('token', data.token);
        // console.log(data.token);

      } else if (data.message == "Invalid Credentials") {
        // Handle login failure
        setEmail('');
        setPassword('');
        alert("Invalid Credentials!")
      }

    } catch (error) {
      console.error('An error occurred during login:', error);
    }

  };

  

  return (

    <div className="loginForm">
      <div className='form-heading'>
        <div className='logoImage' />
        <h1 className='cca-name'>Band</h1>
      </div>
      <form onSubmit={handleSubmit} className='form-container'>
        <span className='login-role'>Please select a domain:</span>
        <RadioGroup className='role-radio' defaultValue='false' colorScheme='yellow' onChange={(value) => setSelectedRole(value)}>
          <Stack spacing={4} direction='row'>
            <Radio value='false'>Member</Radio>
            <Radio value='true'>Administrator</Radio>
          </Stack>
        </RadioGroup>
        <FormControl className='email-form' isInvalid={isError}>
          <FormLabel color={'white'} >Email</FormLabel>
          <Input type='email' width="90%" textColor={'white'} focusBorderColor='white' value={email} onChange={handleInputChange} />
          <FormErrorMessage>Email is required.</FormErrorMessage>
        </FormControl>

        <FormControl className='password-form' isInvalid={isPasswordError}>
          <FormLabel color={'white'} >Password</FormLabel>
          <Input type='password' width="90%" textColor={'white'} focusBorderColor='white' value={password} onChange={handlePasswordInputChange} />
          <FormErrorMessage>Password is required.</FormErrorMessage>
        </FormControl>

        <Button type='submit' className='login-btn' color={'white'} backgroundColor="#996515" borderRadius="30" width="30%"
          _hover={{
            backgroundColor: '#996515', // Same as the normal background color
            boxShadow: '0 0 10px rgba(0, 0, 0, 1)', // Adjust the shadow
            color: 'black'
          }}
        >Login
        </Button>

      </form>
      
    </div>
    
    
  );

}

LoginForm.propTypes = {};

LoginForm.defaultProps = {};

export default LoginForm;
