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
import { FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { Grid, VStack, HStack } from '@chakra-ui/react';
import { useState } from 'react';

function AddModal({ isOpen, onOpen, onClose, afterCloseCallback }) {

  const initialRef = React.useRef(null);

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


  const token = sessionStorage.getItem('token')

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    instrument: "",
    yearOfStudy: "",
    profilePic: null
  });

  //These methoods will update the state properties
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  //This function will handle the submission
  async function onSubmit(e) {
    e.preventDefault()

    //When a post request is sent to the create url, we'll add a new record to the database
    const newPerson = { ...form };

    await fetch(`http://localhost:5050/member/add/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
      .catch(error => {
        window.alert(error)
        return;
      });

    // Close the modal after successful submission
    onClose();

    setForm({ email: "", password: "", name: "", instrument: null, yearOfStudy: null, profilePic: null });
    // Call the callback function passed from the parent component
    afterCloseCallback();
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl' initialFocusRef={initialRef}
    >
      <ModalOverlay />

      <ModalContent className='add-modal-content' alignItems="center" justifyContent="center" maxWidth='750px'>
        <form onSubmit={onSubmit}>
          <ModalHeader fontWeight='bold' color='#996515'>Add New Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody className='add-modal-body'>

            <Grid templateColumns="225px 1fr" gap={1} alignItems="center" justifyContent="center">
              {/* Left column for image */}
              <div className='add-image' >
                <img src='icons/universal-access-solid.svg' style={{ width: '125px', height: '125px', borderRadius: '50%' }} id="target" />
                <input id="myinput" type="file" onChange={encode} style={{ fontSize: '12px', color: '#996515', paddingTop: '20%' }}></input>
              </div>

              {/* Right column for FormControls */}
              <VStack spacing={4} align="start" maxWidth='400px'>
                <FormControl>
                  <FormLabel color='#996515'>Email</FormLabel>
                  <Input type='email' ref={initialRef} focusBorderColor='#996515'
                    value={form.email}
                    onChange={(e) => updateForm({ email: e.target.value })} />
                </FormControl>

                <FormControl>
                  <FormLabel color='#996515' >Password</FormLabel>
                  <Input type='password' focusBorderColor='#996515'
                    value={form.password}
                    onChange={(e) => updateForm({ password: e.target.value })} />
                </FormControl>

                <FormControl>
                  <FormLabel color='#996515' >Name</FormLabel>
                  <Input focusBorderColor='#996515'
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })} />
                </FormControl>

                {/* Instrument and Year of Study in a row */}
                <HStack spacing={4} maxWidth='400px'>
                  <FormControl>
                    <FormLabel color='#996515' >Instrument</FormLabel>
                    <Select placeholder='Select Instrument' focusBorderColor='#996515'
                      onChange={(e) => updateForm({ instrument: e.target.value })}>
                      <option value='Trumpet'>Trumpet</option>
                      <option value='Trombone'>Trombone</option>
                      <option value='Saxophone'>Saxophone</option>
                      <option value='French Horn'>French Horn</option>
                      <option value='Tuba'>Tuba</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color='#996515' >Year of Study</FormLabel>
                    <Select placeholder='Select Year' focusBorderColor='#996515'
                      onChange={(e) => updateForm({ yearOfStudy: e.target.value })}>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </Select>
                  </FormControl>
                </HStack>
              </VStack>
            </Grid>

          </ModalBody>


          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => { onClose(); afterCloseCallback(); }}>
              Cancel
            </Button>
            <Button variant='ghost' type='submit'>Add</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}


export default AddModal;
