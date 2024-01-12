import React from 'react';
import './addModal.css';
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
import { FormControl, FormLabel, FormErrorMessage, Input, Select, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Grid, VStack, HStack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react';
import { useState } from 'react';


function AddModal({ isOpen, onOpen, onClose, afterCloseCallback }) {

  const initialRef = React.useRef(null);

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);


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
        // Invalid file extension, show alert and reset the input and the avatar
        window.alert('Only PNG, JPEG, and JPG files are allowed.');
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


  const token = sessionStorage.getItem('token')

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    instrument: "",
    yearOfStudy: "",
    profilePic: null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const toast = useToast();

  //These methoods will update the state properties
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  //This function will handle the submission
  async function onSubmit(e) {
    e.preventDefault();
    setIsSubmitted(true);

    if (form.email === '' || form.password === '' || form.name === '' || form.instrument === '' || form.yearOfStudy === '') {
      return;

    }

    try {
      //When a post request is sent to the create url, we'll add a new member to the database
      const newMember = { ...form };

      const response = await fetch(`http://localhost:5050/member/add/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      })

      const data = await response.json();

      if (data.message == "Email Already in Use") {

        toast({
          title: 'Failed to Add Member',
          description: "Email Already in Use!",
          status: 'error',
          duration: 5000,
          isClosable: true,
        })

      } else if (response.status === 200) {
        toast({
          title: 'Request Successful',
          description: "Member Added Successfully!",
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

    setForm({ email: "", password: "", name: "", instrument: "", yearOfStudy: "", profilePic: null });
    setIsSubmitted(false);

    // Calling the callback function passed from the parent component, this function will call handleModalClose function in
    // membersScreen.js to re-render the table showing the added member.
    afterCloseCallback();
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl' initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent className='add-modal-content' alignItems="center" maxWidth='750px'>
        <form onSubmit={onSubmit}>
          <ModalHeader fontWeight='bold' color='#996515' textAlign="center" gridColumn="1 / -1">
            Add New Member
          </ModalHeader>
          <ModalCloseButton onClick={() => { onClose(); afterCloseCallback(); setForm({ email: "", password: "", name: "", instrument: "", yearOfStudy: "", profilePic: null }); setIsSubmitted(false); }} />
          <ModalBody className='add-modal-body'>

            <Grid templateColumns="225px 1fr" gap={1} alignItems="center">
              {/* Left column for image */}
              <div className='add-image' >
                <Avatar key={form.profilePic || 'default-key'} size='2xl' bg='yellow.400' name={form.name} src={form.profilePic == null ? 'https://bit.ly/broken-link' : form.profilePic} id="target" />
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

                <FormControl isInvalid={isSubmitted && form.password === ''}>
                  <FormLabel color='#996515' >Password</FormLabel>
                  <InputGroup>
                    <Input type={show ? 'text' : 'password'} focusBorderColor='#996515' value={form.password} onChange={(e) => updateForm({ password: e.target.value })} />
                    <InputRightElement width='4.5rem'>
                      <Button h='1.75rem' size='sm' onClick={handleClick} style={{ textDecoration: 'none' }} variant='link'> {/*setting variant to "link" for a simple text button*/}
                        {show ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>Password is missing.</FormErrorMessage>
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
              } onClick={() => { onClose(); afterCloseCallback(); setForm({ email: "", password: "", name: "", instrument: "", yearOfStudy: "", profilePic: null }); setIsSubmitted(false); }}>
              Cancel
            </Button>
            <Button type='submit' backgroundColor='rgba(153, 101, 21, 1);'
              color={'white'} borderRadius={10} paddingLeft={8} paddingRight={8} height={8}
              borderColor='#996515'
              _hover={
                {
                  color: 'black'
                }
              }>Add</Button>
          </ModalFooter>
        </form>
      </ModalContent>

    </Modal>
  );
}


export default AddModal;
