import React from 'react';
import './loginForm.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, RadioGroup, Stack, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button
} from '@chakra-ui/react'

function LoginForm() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('');

  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const [selectedRole, setSelectedRole] = useState('false'); // Default value 'false' for Member
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    code: '',
  });

  const navigate = useNavigate();

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check for individual fields missing
    if (email === '') {
      errors.push({ field: 'email', message: 'Email is missing.' });

    } else if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Invalid email format.' });

    } else if (email.length > 50) {
      errors.push({ field: 'email', message: 'Email must be at most 50 characters.' });

    }

    if (password === '') {
      errors.push({ field: 'password', message: 'Password is missing.' });

    }

    if (twoFAEnabled) {
      if (code === '') {
        errors.push({ field: 'code', message: '2FA Code is Required.' });
      }
    }

    // Update validation errors state with accumulated errors
    setValidationErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      errors.forEach((error) => {
        newErrors[error.field] = error.message;
      });
      return newErrors;
    });

    // If there are errors, prevent form submission
    if (errors.length > 0) {
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
          password: password,
          code: code
        }),
      });

      const data = await response.json();
      // console.log(data);

      if (data.codeRequested) {
        setTwoFAEnabled(true);
        toast({
          title: 'Verify with 2FA',
          description: 'Enter Code from Authenticator App used to Enable 2FA.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        })
      }

      if (data.message == "Invalid 2FA Code") {
        setCode('');
        errors.push({ field: 'code', message: 'Invalid 2FA Code.' });
        // Update validation errors state with the error message
        setValidationErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          errors.forEach((error) => {
            newErrors[error.field] = error.message;
          });
          return newErrors;
        });
      }

      if (data.token) {
        // If the login is successful, navigate to the /home route
        setEmail('');
        setPassword('');
        setCode('');
        navigate('/home');
        sessionStorage.setItem('token', data.token);

        if (!twoFAEnabled) {
          toast({
            title: 'Secure Your Account!',
            description: 'Enable Two-Factor Authentication!',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'Login Successful!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
        }

      } else if (data.message == "Invalid Credentials") {
        // Handle login failure
        setEmail('');
        setPassword('');
        setCode('');
        setTwoFAEnabled(false);
        errors.push({ field: 'email', message: 'Invalid email or password.' });
        errors.push({ field: 'password', message: 'Invalid email or password.' });
        // Update validation errors state with the error message
        setValidationErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          errors.forEach((error) => {
            newErrors[error.field] = error.message;
          });
          return newErrors;
        });
        setValidationErrors((prevErrors) => ({ ...prevErrors, code: '' }));
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
        <FormControl className='email-form' isInvalid={validationErrors.email !== ''}>
          <FormLabel color={'white'} >Email</FormLabel>
          <Input type='text' width="90%" textColor={'white'} focusBorderColor='white' value={email}
            onChange={
              (e) => {
                setTwoFAEnabled(false);
                setValidationErrors((prevErrors) => ({ ...prevErrors, code: '' }));
                setEmail(e.target.value);
                // Clear the validation error when the user starts typing
                setValidationErrors((prevErrors) => ({ ...prevErrors, email: '' }));
              }} />
          <FormErrorMessage>{validationErrors.email}</FormErrorMessage>
        </FormControl>

        <FormControl className='password-form' isInvalid={validationErrors.password !== ''}>
          <FormLabel color={'white'} >Password</FormLabel>
          <InputGroup>
            <Input type={show ? 'text' : 'password'} width="90%" textColor={'white'} focusBorderColor='white' value={password}
              onChange={
                (e) => {
                  setTwoFAEnabled(false);
                  setValidationErrors((prevErrors) => ({ ...prevErrors, code: '' }));
                  setPassword(e.target.value);
                  // Clear the validation error when the user starts typing
                  setValidationErrors((prevErrors) => ({ ...prevErrors, password: '' }));
                }} />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={handleClick} style={{ transform: 'translateX(-45px)', textDecoration: 'none' }} variant='link'> {/*setting variant to "link" for a simple text button*/}
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{validationErrors.password}</FormErrorMessage>
        </FormControl>

        {twoFAEnabled && <FormControl className='code-form' isInvalid={validationErrors.code !== ''}>
          <FormLabel color={'white'} >2FA Code</FormLabel>
          <Input type='text' width="90%" textColor={'white'} focusBorderColor='white' value={code}
            placeholder='Enter 2FA Code'
            onChange={
              (e) => {
                setCode(e.target.value);
                // Clear the validation error when the user starts typing
                setValidationErrors((prevErrors) => ({ ...prevErrors, code: '' }));
              }} />
          <FormErrorMessage>{validationErrors.code}</FormErrorMessage>
        </FormControl>}

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
