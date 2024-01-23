import React from 'react';
import './addAnnouncementModal.css';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Textarea,
  useToast
} from '@chakra-ui/react'
import { useState } from 'react';

function AddAnnouncementModal({ isOpen, onClose, afterCloseCallback }) {

  const initialRef = React.useRef(null);

  const token = sessionStorage.getItem('token')

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    title: '',
    description: ''
  });

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

    const errors = [];

    // Check for individual fields missing
    if (form.title === '') {
      errors.push({ field: 'title', message: 'Title is missing.' });
    } else {

      // Check maximum characters for title
      if (form.title.length > 80) {
        errors.push({ field: 'title', message: 'Title must be at most 80 characters.' });
      }
    }

    // Calculate the number of newline characters in the description
    const newlineCount = (form.description.match(/\n/g) || []).length;

    // Check for individual fields missing
    if (form.description.trim() === '') {
      errors.push({ field: 'description', message: 'Description is missing.' });
    } else if (newlineCount > 8) {
      // Check if the description has more than 8 lines
      errors.push({ field: 'description', message: 'Description must have at most 8 lines.' });
    } else if (form.description.length > 350) {
      // Check maximum characters for description
      errors.push({ field: 'description', message: 'Description must be at most 350 characters.' });
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
      //When a post request is sent to the create url, we'll add a new announcement to the database
      const newAnnouncement = { ...form };

      const response = await fetch(`http://localhost:5050/announcements/add/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnnouncement),
      })

      if (response.status === 200) {
        toast({
          title: 'Request Successful',
          description: "Announcement Added Successfully!",
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

    setForm({ title: "", description: "" });

    // Calling the callback function passed from the parent component, this function will call handleModalClose function in
    // announcementScreen.js to re-render the announcement container showing the added announcement.
    afterCloseCallback();
  }

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      size='2xl'
    >
      <ModalOverlay />
      <ModalContent className='add-announcement-modal-content'>
        <form onSubmit={onSubmit}>
          <ModalHeader fontWeight='bold' color='#996515' textAlign="center">Add New Announcement</ModalHeader>
          <ModalCloseButton onClick={() => {
            onClose();
            setForm({ title: "", description: "" });
            afterCloseCallback();
            setValidationErrors({ title: "", description: "" });
          }} />
          <ModalBody pb={6}>
            <FormControl isInvalid={validationErrors.title !== ''}>
              <FormLabel color='#996515'>Title *</FormLabel>
              <Input ref={initialRef} placeholder='Enter Title'
                focusBorderColor='#996515'
                value={form.title}
                onChange={(e) => {
                  updateForm({ title: e.target.value })
                  // Clear the validation error when the user starts typing
                  setValidationErrors((prevErrors) => ({ ...prevErrors, title: '' }));
                }} />
              <FormErrorMessage>{validationErrors.title}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={validationErrors.description !== ''}>
              <FormLabel color='#996515'>Description *</FormLabel>
              <Textarea placeholder='Enter Description (Max 350 Characters & 8 Lines)'
                focusBorderColor='#996515'
                height='200px'
                value={form.description}
                onChange={(e) => {
                  updateForm({ description: e.target.value })
                  // Clear the validation error when the user starts typing
                  setValidationErrors((prevErrors) => ({ ...prevErrors, description: '' }));
                }}

              ></Textarea>
              <FormErrorMessage>{validationErrors.description}</FormErrorMessage>
            </FormControl>

          </ModalBody>

          <ModalFooter justifyContent='center' paddingTop={6}>
            <Button mr={6} backgroundColor='rgba(153, 101, 21, 0.5);'
              color='#996515' borderRadius={10} paddingLeft={8} paddingRight={8} height={8}
              borderColor='#996515'
              _hover={
                {
                  color: 'white'
                }
              } onClick={() => {
                onClose();
                setForm({ title: "", description: "" });
                afterCloseCallback();
                setValidationErrors({ title: "", description: "" });
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


export default AddAnnouncementModal;
