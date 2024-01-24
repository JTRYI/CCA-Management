import React from 'react';
import './homeScreen.css';
import { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  Image,
  Input,
  Button,

} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';


function HomeScreen() {

  const toast = useToast();

  const token = sessionStorage.getItem('token');
  const [qrImage, setQRImage] = useState('');

  const [form, setForm] = useState({ code: "" });

  async function getQR() {
    try {
      const response = await fetch(`http://localhost:5050/qrImage/${token}`);
      const { qrImage, success } = await response.json();

      if (success) {
        setQRImage(qrImage);
      } else {

        toast({
          title: 'Error Fetching QR Code',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })

      }

    } catch (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }

  }

  async function submit2FACode(e) {
    e.preventDefault();

    try {
      const new2FACode = { ...form };

      const response = await fetch(`http://localhost:5050/set2FA/${token}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new2FACode),
      })

      const responseData = await response.json();
      console.log(responseData);

      if (responseData.message === "Invalid 2FA Code, Not Verified.") {
        toast({
          title: 'Invalid Code, Verification Failed!',
          description: "Please enter a Valid Code!",
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: '2FA Set Up Complete!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error(error);
      // toast({
      //   title: 'Error',
      //   description: error,
      //   status: 'error',
      //   duration: 5000,
      //   isClosable: true,
      // })
    }
  }

  return (
    <div className="homeScreen">
      <div className='home-banner' />

      <Accordion allowMultiple marginTop='20px'>
        <AccordionItem border={'none'}>
          <h2 style={{ color: 'red', fontWeight: 'bold' }}>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left' fontSize='20px' onClick={() => {
                getQR();
              }}>
                Update/Enable 2FA
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>

            <Image
              id='qrcode'
              boxSize='150px'
              objectFit='cover'
              src={qrImage}
            />

            <form onSubmit={submit2FACode}>
              <Input placeholder='Enter 2FA Code' onChange={(e) => {
                setForm(prevForm => ({ ...prevForm, code: e.target.value }));
              }}></Input>
              <Button type='submit'>SET</Button>
            </form>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border={'none'} >
          <h2 style={{ color: '#996515', fontWeight: 'bold' }}>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left' fontSize='20px'>
                About
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text style={{ wordSpacing: '0.15em' }}>
              Hello, members of the BAND, this CCA Management website is specially designed
              for you all to view updates/announcements about the CCA, members of the CCA,
              your attendance and many more.
            </Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border={'none'}>
          <h2 style={{ color: '#996515', fontWeight: 'bold' }}>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left' fontSize='20px'>
                CCA Timing
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text style={{ wordSpacing: '0.15em' }}>
              Tuesday, 7pm to 9pm
              <br />
              Do arrive 15 minutes earlier to prepare your instruments!
            </Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border={'none'}>
          <h2 style={{ color: '#996515', fontWeight: 'bold' }}>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left' fontSize='20px'>
                CCA Venue
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text style={{ wordSpacing: '0.15em' }}>Auditorium 3, Block 5 Level 7</Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border={'none'}>
          <h2 style={{ color: '#996515', fontWeight: 'bold' }}>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left' fontSize='20px'>
                Teacher in Charge
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text style={{ wordSpacing: '0.15em' }}>
              Name: Mr Robert Tan <br />
              Email: roberttan@gmail.com <br />
              Contact: (+65) 9867 4444
            </Text>
          </AccordionPanel>
        </AccordionItem>

      </Accordion>
    </div>
  );
};

export default HomeScreen;
