import React, { useEffect, useState } from 'react';
import './announcementScreen.css';
import { Button } from '@chakra-ui/react';
import { ImPencil } from "react-icons/im";
import { ImBin } from "react-icons/im";

const Announcement = (props) => {

  return (
    <div className='announcement-block' style={{ width: '100%', backgroundColor: 'white', height: 'auto', borderRadius: '15px', marginBottom: '20px' }}>
      <div className='padding-box' style={{ display: 'flex', flexDirection: 'column', padding: '20px', position: 'relative' }}>
        <h1 style={{ paddingBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>{props.announcement.title}</h1>
        <div className='edi-del-icons' style={{ display: 'flex', position: 'absolute', top: '20px', right: '20px'}}>
          <ImPencil style={{ marginRight: '15px', color: '#996515' }} />
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
  }, [])

  function announcementList() {
    return announcements.map((announcement) => {
      return (
        <Announcement
          announcement={announcement}
          key={announcement._id}
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
        >Add
          {<img src='icons/plus-solid.svg' style={{ paddingLeft: '5px' }} />}
        </Button>
      </div>

      <div className='announcements-container' style={{ marginTop: '30px' }}>
        {announcementList()}
      </div>
    </div>
  );

}

export default AnnouncementScreen;
