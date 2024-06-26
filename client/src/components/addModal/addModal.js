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
import { useState, useRef } from 'react';
import { ImCross } from "react-icons/im";


function AddModal({ isOpen, onOpen, onClose, afterCloseCallback }) {

  const initialRef = React.useRef(null);

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [showConfirm, setShowConfirm] = useState(false);
  const handleClickConfirm = () => setShowConfirm(!showConfirm);
  const [confirmPassword, setConfirmPassword] = useState("");

  const toast = useToast();

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  function selectFiles() {
    fileInputRef.current.click();
  }

  function onDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  }

  function onDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);

  }

  function onDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = event.dataTransfer.files;

    if (droppedFiles.length !== 1) {
      toast({
        title: 'Invalid File Count!',
        description: 'Please drop only one file.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (droppedFiles.length > 0) {
      const imageFile = droppedFiles[0];

      const allowedExtensions = ['png', 'jpeg', 'jpg'];
      const fileExtension = imageFile.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        toast({
          title: 'Invalid File Format!',
          description: 'Only PNG, JPEG, and JPG Files are Allowed!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        // Reset any previous selected file and update the form state
        updateForm({ profilePic: null });
        document.getElementById('target').src = 'https://bit.ly/broken-link';
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        const picture = fileLoadedEvent.target.result;
        updateForm({ profilePic: picture });
        document.getElementById('target').src = picture;
      };
      fileReader.readAsDataURL(imageFile);
    }
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
        // Invalid file extension, show toast and reset the input and the avatar
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

  function removeImage() {
    // Update the form state to indicate no profile picture
    updateForm({ profilePic: null });
    // Setting the source of the avatar image to a placeholder or broken link
    document.getElementById("target").src = 'https://bit.ly/broken-link';
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

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    instrument: '',
    yearOfStudy: '',
  });


  //These methoods will update the state properties
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  //This function will handle the submission
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

    if (form.password === '') {
      errors.push({ field: 'password', message: 'Password is missing.' });
    } else {

      if (form.password.includes(' ')) {
        errors.push({ field: 'password', message: 'Spacing is not allowed in the password.' });
      }

      // Check password length
      if (form.password.length < 8) {
        errors.push({ field: 'password', message: 'Password must be at least 8 characters long.' });
      }

      // Check if password contains a number
      if (!/\d/.test(form.password)) {
        errors.push({ field: 'password', message: 'Password must contain a number.' });
      }
    }

    if (confirmPassword !== form.password || confirmPassword == '') {
      errors.push({ field: 'confirmPassword', message: 'Passwords do not match.' });
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
    setConfirmPassword("");
    setValidationErrors({ email: "", password: "", confirmPassword: "", name: "", instrument: "", yearOfStudy: "" });
    // Calling the callback function passed from the parent component, this function will call handleModalClose function in
    // membersScreen.js to re-render the table showing the added member.
    afterCloseCallback();
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl' initialFocusRef={initialRef} scrollBehavior='inside'>
      <ModalOverlay />
      <ModalContent className='add-modal-content' alignItems="center" maxWidth='750px'>
        <form onSubmit={onSubmit}>
          <ModalHeader fontWeight='bold' color='#996515' textAlign="center" gridColumn="1 / -1">
            Add New Member
          </ModalHeader>
          <ModalCloseButton onClick={() => {
            onClose();
            afterCloseCallback();
            setForm({ email: "", password: "", name: "", instrument: "", yearOfStudy: "", profilePic: null });
            setConfirmPassword("");
            setValidationErrors({ email: "", password: "", confirmPassword: "", name: "", instrument: "", yearOfStudy: "" });
          }} />
          <ModalBody className='add-modal-body' overflowY='auto' maxHeight='62vh'>
            {/*Image Column will take up 1 fraction of modal space while All the input fields will also take up 1 fraction of the modal space for template columns */}
            <Grid templateColumns="1fr 1fr" gap={4} alignItems="center">
              {/* Left column for image */}
              <div className='upload-image-container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <div className='add-image' style={{ marginBottom: '20px' }}>
                  <Avatar key={form.profilePic || 'default-key'} size='2xl' bg='yellow.400' name={form.name} src={form.profilePic == null ? 'https://bit.ly/broken-link' : form.profilePic} id="target" />
                </div>

                <div className='card'>
                  <div className='drag-area' onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                    {isDragging ? (
                      <span className='select'> Drop Images Here</span>
                    ) : (
                      <p style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        Drag & Drop Image Here or
                        <span className='select' role='button' onClick={selectFiles}> Browse </span>
                      </p>

                    )}
                    <input id="myinput" type="file" onChange={encode} ref={fileInputRef} style={{ fontSize: '12px', color: '#996515', paddingTop: '20%' }}></input>
                  </div>
                </div>

                <Button leftIcon={<ImCross />} style={{ width: '250px', marginTop: '10px' }}
                  _hover={
                    {
                      backgroundColor: 'red'
                    }
                  }
                  onClick={removeImage}>Clear Image</Button>
              </div>

              {/* Right column for FormControls */}
              <VStack spacing={4} align="start" maxWidth='400px'>
                <FormControl isInvalid={validationErrors.email !== ''}>
                  <FormLabel color='#996515'>Email *</FormLabel>
                  <Input type='text' ref={initialRef} focusBorderColor='#996515'
                    value={form.email}
                    onChange={(e) => {
                      updateForm({ email: e.target.value })
                      // Clear the validation error when the user starts typing
                      setValidationErrors((prevErrors) => ({ ...prevErrors, email: '' }));
                    }} />
                  <FormErrorMessage>{validationErrors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={validationErrors.password !== ''}>
                  <FormLabel color='#996515' >Password *</FormLabel>
                  <InputGroup>
                    <Input type={show ? 'text' : 'password'} focusBorderColor='#996515'
                      value={form.password}
                      onChange={(e) => {
                        updateForm({ password: e.target.value })
                        // Clear the validation error when the user starts typing
                        setValidationErrors((prevErrors) => ({ ...prevErrors, password: '' }));
                      }} />
                    <InputRightElement width='4.5rem'>
                      <Button h='1.75rem' size='sm' onClick={handleClick} style={{ textDecoration: 'none' }} variant='link'> {/*setting variant to "link" for a simple text button*/}
                        {show ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{validationErrors.password}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={validationErrors.confirmPassword !== ''}>
                  <FormLabel color='#996515' >Confirm Password *</FormLabel>
                  <InputGroup>
                    <Input type={showConfirm ? 'text' : 'password'} focusBorderColor='#996515'
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        // Clear the validation error when the user starts typing
                        setValidationErrors((prevErrors) => ({ ...prevErrors, confirmPassword: '' }));
                      }} />
                    <InputRightElement width='4.5rem'>
                      <Button h='1.75rem' size='sm' onClick={handleClickConfirm} style={{ textDecoration: 'none' }} variant='link'> {/*setting variant to "link" for a simple text button*/}
                        {showConfirm ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{validationErrors.confirmPassword}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={validationErrors.name !== ''}>
                  <FormLabel color='#996515' >Name *</FormLabel>
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
                    <FormLabel color='#996515' >Instrument *</FormLabel>
                    <Select placeholder='Select Instrument' focusBorderColor='#996515'
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
                    <FormLabel color='#996515' >Year of Study *</FormLabel>
                    <Select placeholder='Select Year' focusBorderColor='#996515'
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
                setForm({ email: "", password: "", name: "", instrument: "", yearOfStudy: "", profilePic: null });
                setConfirmPassword("");
                setValidationErrors({ email: "", password: "", confirmPassword: "", name: "", instrument: "", yearOfStudy: "" });
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
              }>Add</Button>
          </ModalFooter>
        </form>
      </ModalContent>

    </Modal>
  );
}


export default AddModal;
