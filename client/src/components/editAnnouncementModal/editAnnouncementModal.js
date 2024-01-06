import React from 'react';

import './editAnnouncementModal.css';
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
import { FormControl, FormLabel, FormErrorMessage, Input, Textarea } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react';

function EditAnnouncementModal({ isOpen, onClose, afterCloseCallback, announcementID }) {

  const initialRef = React.useRef(null);

  const token = sessionStorage.getItem('token')

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const toast = useToast();

  useEffect(() => {
    async function fetchData() {
      const id = announcementID;
      const response = await fetch(`http://localhost:5050/announcements/${id.toString()}`);

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const announcement = await response.json();
      if (!announcement) {
        window.alert(`Announcement with id ${id} not found`);
        return;
      }
      setForm(announcement);
    }
    fetchData();
    return;

  }, [announcementID]);

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
      const id = announcementID;

      const editedAnnouncement = {
        title: form.title,
        description: form.description,

      };

      // This will send a post request to update the data in the database.
      const response = await fetch(`http://localhost:5050/announcements/${token}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(editedAnnouncement),
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.status === 200) {
        toast({
          title: 'Request Successful',
          description: "Announcement Updated Successfully!",
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
    // announcementScreen.js to re-render the announcement container showing the updated announcement.
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
      <ModalContent className='edit-announcement-modal-content'>
        <form onSubmit={onSubmit}>
          <ModalHeader fontWeight='bold' color='#996515' textAlign="center">Edit Announcement</ModalHeader>
          <ModalCloseButton onClick={() => { onClose(); setForm({ title: "", description: "" }); afterCloseCallback(); setIsSubmitted(false); }} />
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
              } onClick={() => { onClose(); setForm({ title: "", description: "" }); afterCloseCallback(); setIsSubmitted(false); }}>
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


export default EditAnnouncementModal;
