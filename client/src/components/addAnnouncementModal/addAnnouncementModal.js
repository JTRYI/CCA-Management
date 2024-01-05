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

    if (form.title === '' || form.description === '') {
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
    setIsSubmitted(false);

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
          <ModalCloseButton onClick={() => { onClose(); setForm({ title: "", description: "" });  afterCloseCallback(); setIsSubmitted(false); }} />
          <ModalBody pb={6}>
            <FormControl isInvalid={isSubmitted && form.title === ''}>
              <FormLabel color='#996515'>Title</FormLabel>
              <Input ref={initialRef} placeholder='Enter Title'
                focusBorderColor='#996515'
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })} />
              <FormErrorMessage>Title is missing.</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={isSubmitted && form.description === ''}>
              <FormLabel color='#996515'>Description</FormLabel>
              <Textarea placeholder='Enter Description'
                focusBorderColor='#996515'
                height='200px'
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}></Textarea>
              <FormErrorMessage>Description is missing.</FormErrorMessage>
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
              } onClick={() => { onClose(); setForm({ title: "", description: ""}); afterCloseCallback(); setIsSubmitted(false); }}>
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
