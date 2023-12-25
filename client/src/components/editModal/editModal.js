import React, { useEffect } from 'react';
import './editModal.css';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react'
import { FormControl, FormLabel, FormErrorMessage, Input, Select } from '@chakra-ui/react';
import { Grid, VStack, HStack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
import { useState } from 'react';

export default function EditModal({ isOpen, onOpen, onClose, afterCloseCallback, memberID }) {

  const initialRef = React.useRef(null);

  const [form, setForm] = useState({
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
      if (!member) {
        window.alert(`Member with id ${id} not found`);
        return;
      }
      setForm(member);
    }
    fetchData();
    return;

  }, [memberID]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  const [isSubmitted, setIsSubmitted] = useState(false);
  const token = sessionStorage.getItem('token')

  async function onSubmit(e) {
    e.preventDefault();
    setIsSubmitted(true);
    
    if (form.email === '' || form.name === '' || form.instrument === '' || form.yearOfStudy === '') {
      return;
    }

    const id = memberID;

    const editedPerson = {
      email: form.email,
      name: form.name,
      instrument: form.instrument,
      yearOfStudy: form.yearOfStudy,
      profilePic: form.profilePic
    };

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5050/member/${token}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(editedPerson),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    // Close the modal after successful submission
    onClose();

    setIsSubmitted(false);

    // Calling the callback function passed from the parent component, this function will call handleModalClose function in
    // membersScreen.js to re-render the table showing the updated member.
    afterCloseCallback();

  }

  let picture;
  function encode() {

    var selectedfile = document.getElementById("myinput").files;
    if (selectedfile.length > 0) {
      var imageFile = selectedfile[0];
      var fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        picture = fileLoadedEvent.target.result;
        updateForm({ profilePic: picture }); // Set the profilePic value in the form state
        document.getElementById("target").src = picture;
      }
      fileReader.readAsDataURL(imageFile);
    }

  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl' initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent className='edit-modal-content' alignItems="center" maxWidth='750px'>
        <form onSubmit={onSubmit}>
          <ModalHeader fontWeight='bold' color='#996515' textAlign="center" gridColumn="1 / -1">
            Edit Member
          </ModalHeader>
          <ModalCloseButton onClick={() => { onClose(); afterCloseCallback(); setIsSubmitted(false); }} />
          <ModalBody className='add-modal-body'>

            <Grid templateColumns="225px 1fr" gap={1} alignItems="center">
              {/* Left column for image */}
              <div className='update-image' >
                <img src={form.profilePic == null ? 'icons/universal-access-solid.svg' : form.profilePic} style={{ width: '125px', height: '125px', borderRadius: '50%' }} id="target" />
                <input id="myinput" type="file" onChange={encode} style={{ fontSize: '12px', color: '#996515', paddingTop: '20%' }}></input>
              </div>

              {/* Right column for FormControls */}
              <VStack spacing={4} align="start" maxWidth='400px'>
                <FormControl isInvalid={isSubmitted && form.email === ''}>
                  <FormLabel color='#996515'>Email</FormLabel>
                  <Input type='email' ref={initialRef} focusBorderColor='#996515'
                    value={form.email}
                    onChange={(e) => updateForm({ email: e.target.value })} />
                  <FormErrorMessage>Email is missing.</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={isSubmitted && form.name === ''}>
                  <FormLabel color='#996515' >Name</FormLabel>
                  <Input focusBorderColor='#996515'
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })} />
                  <FormErrorMessage>Name is missing.</FormErrorMessage>
                </FormControl>

                {/* Instrument and Year of Study in a row */}
                <HStack spacing={4} maxWidth='400px'>
                  <FormControl isInvalid={isSubmitted && form.instrument === ''}>
                    <FormLabel color='#996515' >Instrument</FormLabel>
                    <Select placeholder='Select Instrument' focusBorderColor='#996515'
                      value={form.instrument}
                      onChange={(e) => updateForm({ instrument: e.target.value })}>
                      <option value='Trumpet'>Trumpet</option>
                      <option value='Trombone'>Trombone</option>
                      <option value='Saxophone'>Saxophone</option>
                      <option value='French Horn'>French Horn</option>
                      <option value='Tuba'>Tuba</option>
                    </Select>
                    <FormErrorMessage>Instrument is missing.</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={isSubmitted && form.yearOfStudy === ''}>
                    <FormLabel color='#996515' >Year of Study</FormLabel>
                    <Select placeholder='Select Year' focusBorderColor='#996515'
                      value={form.yearOfStudy}
                      onChange={(e) => updateForm({ yearOfStudy: e.target.value })}>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </Select>
                    <FormErrorMessage>Year of study is missing.</FormErrorMessage>
                  </FormControl>
                </HStack>
              </VStack>
            </Grid>

          </ModalBody>
          <ModalFooter justifyContent='center' paddingTop={10}>
            <Button mr={6} backgroundColor='rgba(153, 101, 21, 0.5);'
              color='#996515' borderRadius={10} paddingLeft={8} paddingRight={8} height={8}
              borderColor='#996515'
              _hover={
                {
                  color: 'white'
                }
              } onClick={() => { onClose(); afterCloseCallback(); setIsSubmitted(false); }}>
              Cancel
            </Button>
            <Button type='submit' backgroundColor='rgba(153, 101, 21, 1);'
              color={'white'} borderRadius={10} paddingLeft={8} paddingRight={8} height={8}
              borderColor='#996515'
              _hover={
                {
                  color: 'black'
                }
              }>Update</Button>
          </ModalFooter>
        </form>
      </ModalContent>

    </Modal>
  );

}
