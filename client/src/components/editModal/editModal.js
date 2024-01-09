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
import { Avatar } from '@chakra-ui/react';
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
  const toast = useToast();

  async function onSubmit(e) {
    e.preventDefault();
    setIsSubmitted(true);

    if (form.email === '' || form.name === '' || form.instrument === '' || form.yearOfStudy === '') {
      return;
    }
    try {
      const id = memberID;

      const editedPerson = {
        email: form.email,
        name: form.name,
        instrument: form.instrument,
        yearOfStudy: form.yearOfStudy,
        profilePic: form.profilePic
      };

      // This will send a post request to update the data in the database.
      const response = await fetch(`http://localhost:5050/member/${token}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(editedPerson),
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      if (data.message == "Email Already Exists") {

        toast({
          title: 'Failed to Update Member',
          description: "Email Already in Use!",
          status: 'error',
          duration: 5000,
          isClosable: true,
        })

      } else if (response.status === 200) {
        toast({
          title: 'Request Successful',
          description: "Member Updated Successfully!",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      window.alert(error)
      return;
    }

    // Close the modal after successful submission
    onClose();

    setIsSubmitted(false);

    // Calling the callback function passed from the parent component, this function will call handleModalClose function in
    // membersScreen.js to re-render the table showing the updated member.
    afterCloseCallback();

  }

  function encode() {
    var selectedFileInput = document.getElementById("myinput");
    var selectedFiles = selectedFileInput.files;

    if (selectedFiles.length > 0) {
      var imageFile = selectedFiles[0];

      // Check if the file extension is valid (png, jpeg, or jpg)
      const allowedExtensions = ['png', 'jpeg', 'jpg'];
      const fileExtension = imageFile.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        // Invalid file extension, show alert and reset the input and the avatar
        window.alert('Only PNG, JPEG, and JPG files are allowed.');
        selectedFileInput.value = ''; // Clear the file input
        updateForm({ profilePic: null });
        document.getElementById("target").src = 'https://bit.ly/broken-link';
        return;
      }

      var fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        // Update the form state and the avatar with the loaded image
        const picture = fileLoadedEvent.target.result;
        updateForm({ profilePic: picture });
        document.getElementById("target").src = picture;

      };
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
                <Avatar key={form.profilePic || 'default-key'} size='2xl' bg='yellow.400' name={form.profilePic == null ? form.name : null} src={form.profilePic} id="target" />
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
