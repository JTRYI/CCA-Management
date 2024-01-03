import React from 'react';
import './viewModal.css';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Avatar,
  Tag
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';


function ViewModal({onClose, isOpen, memberID}) {
  
  const [form, setForm] = useState({
    dateJoined: "",
    email: "",
    name: "",
    instrument: "",
    yearOfStudy: "",
    profilePic: null
  });

  useEffect(() => {
    async function fetchData() {
      const id = memberID;
      const response = await fetch(`http://localhost:5050/member/${id.toString()}`);

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const member = await response.json();
      console.log(member);
      if (!member) {
        window.alert(`Member with id ${id} not found`);
        return;
      }
      setForm(member);
    }
    fetchData();
    return;

  }, [memberID]);

  return (
    
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent style={{display: 'flex', alignItems: 'center'}}>
        <Avatar size='xl' name={form.profilePic == null ? form.name : null}  // Display name only if profilePic is null
                src={form.profilePic} style={{transform: 'translateY(-45px)'}} />
          <ModalHeader style={{transform: 'translateY(-45px)'}}>{form.name}</ModalHeader>
          <ModalBody style={{display: 'flex', flexDirection: 'column', alignItems:'center', transform: 'translateY(-35px)'}}>
            <p style={{paddingBottom: '10px'}}> <Tag colorScheme='orange'>Email</Tag> {form.email}</p>
            <p style={{paddingBottom: '10px'}}> <Tag colorScheme='orange'>Instrument</Tag> {form.instrument}</p>
            <p style={{paddingBottom: '10px'}}> <Tag colorScheme='orange'>Joined</Tag> {form.dateJoined}</p>
            <p> <Tag colorScheme='orange'>Year</Tag> {form.yearOfStudy}</p>
          </ModalBody>
          <ModalFooter>
          <Button backgroundColor='rgba(153, 101, 21, 0.5);'
          color={'white'} borderRadius={10} paddingLeft={8} paddingRight={8} height={8}
          borderColor='#996515'
          _hover={
            {
              backgroundColor: 'rgba(153, 101, 21, 1.0);'
            }
          }
          onClick={onClose}

          transform='translateY(-20px)'
          
        >Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
  );
}


export default ViewModal;
