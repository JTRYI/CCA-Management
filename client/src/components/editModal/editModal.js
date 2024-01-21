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

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    name: '',
    instrument: '',
    yearOfStudy: ''
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


  const token = sessionStorage.getItem('token')
  const toast = useToast();

  async function onSubmit(e) {
    e.preventDefault();

    const errors = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check for individual fields missing
    if (form.email === '') {
      errors.push({ field: 'email', message: 'Email is missing.' });
    } else if (!emailRegex.test(form.email)) {
      errors.push({ field: 'email', message: 'Invalid email format.' });
    } else if (form.email.length > 50) {
      errors.push({ field: 'email', message: 'Email must be at most 50 characters.' });
    }

    if (form.name === '') {
      errors.push({ field: 'name', message: 'Name is missing.' });
    } else {
      // Check maximum characters for name
      if (form.name.length > 50) {
        errors.push({ field: 'name', message: 'Name must be at most 50 characters.' });
      }
    }

    if (form.instrument === '') {
      errors.push({ field: 'instrument', message: 'Instrument is missing.' });
    }

    if (form.yearOfStudy === '') {
      errors.push({ field: 'yearOfStudy', message: 'Year of study is missing.' });
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

        errors.push({ field: 'email', message: 'Email already in use.' });
        // Update validation errors state with the error message
        setValidationErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          errors.forEach((error) => {
            newErrors[error.field] = error.message;
          });
          return newErrors;
        });

        // Return without closing the modal if there is an error
        return;

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
      window.alert(error);
      return;
    }

    // Close the modal after successful submission
    onClose();

    // Calling the callback function passed from the parent component, this function will call handleModalClose function in
    // membersScreen.js to re-render the table showing the updated member.
    afterCloseCallback();

  }

  function encode() {
    var selectedFileInput = document.getElementById("myinput");
    // Get the selected files from the input element
    var selectedFiles = selectedFileInput.files;

    // Check if at least one file is selected
    if (selectedFiles.length > 0) {
      // Get the first (and usually only) file from the selected files
      var imageFile = selectedFiles[0];

      // Check if the file extension is valid (png, jpeg, or jpg)
      const allowedExtensions = ['png', 'jpeg', 'jpg'];
      const fileExtension = imageFile.name.split('.').pop().toLowerCase();

      // If the file extension is not in the allowedExtensions array
      if (!allowedExtensions.includes(fileExtension)) {
        // Invalid file extension, show Toast and reset the input and the avatar
        toast({
          title: 'Invalid File Format!',
          description: "Only PNG, JPEG, and JPG Files are Allowed!",
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        selectedFileInput.value = ''; // Clear the file input
        // Update the form state to indicate no profile picture
        updateForm({ profilePic: null });
        // Setting the source of the avatar image to a placeholder or broken link
        document.getElementById("target").src = 'https://bit.ly/broken-link';
        return;
      }

      // If the file extension is valid, create a FileReader to read the file
      var fileReader = new FileReader();
      // Defining a callback function to be executed when the file is loaded
      fileReader.onload = function (fileLoadedEvent) {
        // Get the base64-encoded data URL of the loaded image
        const picture = fileLoadedEvent.target.result;
        // Update the form state and the avatar with the loaded image
        updateForm({ profilePic: picture });
        document.getElementById("target").src = picture;

      };
      // Read the file as a data URL (base64-encoded)
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
          <ModalCloseButton onClick={() => {
            onClose();
            afterCloseCallback();
            setValidationErrors({ email: "", name: "", instrument: "", yearOfStudy: "" });
          }} />
          <ModalBody className='edit-modal-body'>

            <Grid templateColumns="225px 1fr" gap={1} alignItems="center">
              {/* Left column for image */}
              <div className='update-image' >
                <Avatar key={form.profilePic || 'default-key'} size='2xl' bg='yellow.400' name={form.profilePic == null ? form.name : null} src={form.profilePic} id="target" />
                <input id="myinput" type="file" onChange={encode} style={{ fontSize: '12px', color: '#996515', paddingTop: '20%' }}></input>
              </div>

              {/* Right column for FormControls */}
              <VStack spacing={4} align="start" maxWidth='400px'>
                <FormControl isInvalid={validationErrors.email !== ''}>
                  <FormLabel color='#996515'>Email</FormLabel>
                  <Input type='text' ref={initialRef} focusBorderColor='#996515'
                    value={form.email}
                    onChange={(e) => {
                      updateForm({ email: e.target.value })
                      // Clear the validation error when the user starts typing
                      setValidationErrors((prevErrors) => ({ ...prevErrors, email: '' }));
                    }} />
                  <FormErrorMessage>{validationErrors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={validationErrors.name !== ''}>
                  <FormLabel color='#996515' >Name</FormLabel>
                  <Input focusBorderColor='#996515'
                    value={form.name}
                    onChange={(e) => {
                      updateForm({ name: e.target.value })
                      // Clear the validation error when the user starts typing
                      setValidationErrors((prevErrors) => ({ ...prevErrors, name: '' }));
                    }} />
                  <FormErrorMessage>{validationErrors.name}</FormErrorMessage>
                </FormControl>

                {/* Instrument and Year of Study in a row */}
                <HStack spacing={4} maxWidth='400px'>
                  <FormControl isInvalid={validationErrors.instrument !== ''}>
                    <FormLabel color='#996515' >Instrument</FormLabel>
                    <Select placeholder='Select Instrument' focusBorderColor='#996515'
                      value={form.instrument}
                      onChange={(e) => {
                        updateForm({ instrument: e.target.value })
                        // Clear the validation error when the user starts typing
                        setValidationErrors((prevErrors) => ({ ...prevErrors, instrument: '' }));
                      }}>
                      <option value='Trumpet'>Trumpet</option>
                      <option value='Trombone'>Trombone</option>
                      <option value='Saxophone'>Saxophone</option>
                      <option value='French Horn'>French Horn</option>
                      <option value='Tuba'>Tuba</option>
                    </Select>
                    <FormErrorMessage>{validationErrors.instrument}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={validationErrors.yearOfStudy !== ''}>
                    <FormLabel color='#996515' >Year of Study</FormLabel>
                    <Select placeholder='Select Year' focusBorderColor='#996515'
                      value={form.yearOfStudy}
                      onChange={(e) => {
                        updateForm({ yearOfStudy: e.target.value })
                        // Clear the validation error when the user starts typing
                        setValidationErrors((prevErrors) => ({ ...prevErrors, yearOfStudy: '' }));
                      }}>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </Select>
                    <FormErrorMessage>{validationErrors.yearOfStudy}</FormErrorMessage>
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
              } onClick={() => {
                onClose();
                afterCloseCallback();
                setValidationErrors({ email: "", name: "", instrument: "", yearOfStudy: "" });
              }}>
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
