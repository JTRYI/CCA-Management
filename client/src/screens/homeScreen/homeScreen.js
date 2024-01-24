import React from 'react';
import './homeScreen.css';
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
import { useNavigate } from 'react-router-dom';


function HomeScreen() {

  
  const navigate = useNavigate();

  return (
    <div className="homeScreen">
      <div className='home-banner' />

      <Accordion allowMultiple marginTop='20px'>
        
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

      <Button colorScheme='red' variant='ghost' marginTop='5px' 
      fontSize='20px' 
      color='red'
      onClick={() => {
        navigate('/enable2FA');
      }}>
        Update/Enable 2FA
      </Button>
    </div>
  );
};

export default HomeScreen;
