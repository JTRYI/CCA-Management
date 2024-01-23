import React, { useEffect, useState } from 'react';
import './announcementScreen.css';
import { Button, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { ImPencil } from "react-icons/im";
import { ImBin } from "react-icons/im";
import AddAnnouncementModal from '../../components/addAnnouncementModal/addAnnouncementModal';
import EditAnnouncementModal from '../../components/editAnnouncementModal/editAnnouncementModal'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'

const Announcement = (props) => {

  const editAnnouncementDisclosure = useDisclosure();
  const [editAnnouncementClicked, setEditAnnouncementClicked] = useState(false);

  const deleteAnnouncementDisclosure = useDisclosure();

  const user = JSON.parse(sessionStorage.getItem('user'));
  
  return (
    <div className='announcement-block' style={{ width: '100%', backgroundColor: 'white', height: 'auto', borderRadius: '15px', marginBottom: '20px' }}>
      <div className='padding-box' style={{ display: 'flex', flexDirection: 'column', padding: '20px', position: 'relative' }}>
        <h1 style={{ paddingBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>{props.announcement.title}</h1>
        <div className='edi-del-icons' style={{ display: 'flex', position: 'absolute', top: '20px', right: '20px' }}>
          <ImPencil style={{ marginRight: '15px', color: '#996515', cursor: 'pointer' , display: user.isAdmin ? 'block' : 'none' }} onClick={() => {
            setEditAnnouncementClicked(true);
            editAnnouncementDisclosure.onOpen();
          }} />
          {editAnnouncementClicked && (
            <EditAnnouncementModal isOpen={editAnnouncementDisclosure.isOpen}
              onClose={() => {
                setEditAnnouncementClicked(false);
                editAnnouncementDisclosure.onClose();
              }}
              announcementID={props.announcement._id}
              afterCloseCallback={props.handleModalClose} />
          )}
          <ImBin style={{ color: 'red', cursor: 'pointer', display: user.isAdmin ? 'block' : 'none' }} onClick={deleteAnnouncementDisclosure.onOpen} />
          <AlertDialog
              isOpen={deleteAnnouncementDisclosure.isOpen}
              onClose={deleteAnnouncementDisclosure.onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    {`Delete Announcement`}
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button onClick={deleteAnnouncementDisclosure.onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme='red'
                      onClick={() => {
                        props.deleteAnnouncement(props.announcement._id);
                        deleteAnnouncementDisclosure.onClose();
                      }} ml={3}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
        </div>
        <p style={{whiteSpace: 'pre-line'}}>{props.announcement.description}</p>
      </div>
    </div>
  );

}

function AnnouncementScreen() {

  const user = JSON.parse(sessionStorage.getItem('user'));
  const token = sessionStorage.getItem('token');

  const [announcements, setAnnouncement] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const toast = useToast();

  const handleModalClose = () => {
    // Toggle the updateTrigger to trigger re-render
    setUpdateTrigger((prev) => !prev);
  };

  useEffect(() => {
    async function getAnnouncements() {
      const response = await fetch(`http://localhost:5050/announcements/`);

      if (!response.ok) {
        const message = `Ah error occured: ${response.statusTest}`;
        window.alert(message);
        return;
      }

      const announcements = await response.json();
      setAnnouncement(announcements)
    }

    getAnnouncements();

    return;
  }, [updateTrigger])

  function announcementList() {
    return announcements.map((announcement) => {
      return (
        <Announcement
          announcement={announcement}
          key={announcement._id}
          handleModalClose={handleModalClose}
          deleteAnnouncement = {() => {
            deleteAnnouncement(announcement._id)
          }}
        />
      );
    })
  }

  //This method will delete a Announcement
  async function deleteAnnouncement(id) {
    await fetch(`http://localhost:5050/announcements/${token}/${id}`, {
      method: "DELETE"
    });

    const newAnnouncements = announcements.filter((el) => el._id !== id);
    setAnnouncement(newAnnouncements);

    toast({
      title: 'Request Successful',
      description: "Announcement Deleted Successfully!",
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  return (
    <div className="announcementScreen">
      <div className='top-head-anno'>
        <h1 style={{ fontWeight: 'bold', fontSize: '25px' }}>Announcements</h1>
        <Button backgroundColor='rgba(153, 101, 21, 0.5);'
          color={'white'} borderRadius={10} paddingLeft={8} paddingRight={7} height={8}
          borderColor='#996515'
          _hover={
            {
              backgroundColor: 'rgba(153, 101, 21, 1.0);'
            }
          }
          style={{ visibility: user.isAdmin ? 'visible' : 'hidden' }}

          onClick={() => {
            onOpen();
          }}
        >Add
          {<img src='icons/plus-solid.svg' style={{ paddingLeft: '5px' }} />}
        </Button>
        <AddAnnouncementModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} afterCloseCallback={handleModalClose}></AddAnnouncementModal>
      </div>

      <div className='announcements-container' style={{ marginTop: '30px' }}>
        {announcementList().length > 0 ? announcementList() : <Text fontSize='xl'>No Announcements Yet.</Text>}
      </div>
    </div>
  );

}

export default AnnouncementScreen;
