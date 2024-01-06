import React, { useEffect, useState } from 'react';
import './announcementScreen.css';
import { Button, useDisclosure } from '@chakra-ui/react';
import { ImPencil } from "react-icons/im";
import { ImBin } from "react-icons/im";
import AddAnnouncementModal from '../../components/addAnnouncementModal/addAnnouncementModal';
import EditAnnouncementModal from '../../components/editAnnouncementModal/editAnnouncementModal'

const Announcement = (props) => {

  const editAnnouncementDisclosure = useDisclosure();
  const [editAnnouncementClicked, setEditAnnouncementClicked] = useState(false);

  return (
    <div className='announcement-block' style={{ width: '100%', backgroundColor: 'white', height: 'auto', borderRadius: '15px', marginBottom: '20px' }}>
      <div className='padding-box' style={{ display: 'flex', flexDirection: 'column', padding: '20px', position: 'relative' }}>
        <h1 style={{ paddingBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>{props.announcement.title}</h1>
        <div className='edi-del-icons' style={{ display: 'flex', position: 'absolute', top: '20px', right: '20px' }}>
          <ImPencil style={{ marginRight: '15px', color: '#996515', cursor: 'pointer' }} onClick={() => {
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
          <ImBin style={{ color: 'red' }} />
        </div>
        <p>{props.announcement.description}</p>
      </div>
    </div>
  );

}

function AnnouncementScreen() {

  const user = JSON.parse(sessionStorage.getItem('user'));

  const [announcements, setAnnouncement] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateTrigger, setUpdateTrigger] = useState(false);

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
        />
      );
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
        {announcementList()}
      </div>
    </div>
  );

}

export default AnnouncementScreen;
