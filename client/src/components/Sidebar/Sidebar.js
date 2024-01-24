import React, { useEffect } from 'react';
import { useState } from 'react';
import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { Avatar } from '@chakra-ui/react';


function Sidebar() {

  const user = JSON.parse(sessionStorage.getItem('user'));
  // console.log(user);

  const [isExpanded, setExpandState] = useState(false);

  const menuItems = [
    {
      text: "Home",
      icon: "icons/house-solid.svg"
    },
    {
      text: "Announcements",
      icon: "icons/bullhorn-solid.svg"
    },
    {
      text: "Members",
      icon: "icons/users-solid.svg"
    },
    {
      text: "Attendance",
      icon: "icons/calendar-days-solid.svg"
    },
    {
      text: "Logout",
      icon: "icons/right-from-bracket-solid.svg"
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setExpandState(false);
      }
    };

    // Attaching a event listening to check for screen resize, when screen resize, calls handleResize function
    window.addEventListener('resize', handleResize);

    // Calling it once to set the initial state
    handleResize();

    // Removing the event listener when the component is unmounted
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  return (
    <div className={isExpanded ? 'side-nav-container' : 'side-nav-container side-nav-container-NX'}>
      <div className='nav-upper'>
        <div className='nav-heading'>
          {isExpanded && (
            <div className='nav-brand'>
              <div className='band-logo' />
              <div className='band-title'>Band</div>
            </div>
          )}
          <button className={isExpanded ? 'hamburger hamburger-in' : 'hamburger hamburger-out'}
            onClick={() => {
              if (window.innerWidth > 768) {
                setExpandState(!isExpanded)
              }
            }
            }
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div className='nav-menu'>

          {
            menuItems.map(({ text, icon }) => (
              text === 'Logout' ? (
                <button
                  key={text}
                  //handle logout
                  onClick={() => {
                    navigate('/')
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('user');
                  }}
                  className={isExpanded ? 'menu-item' : 'menu-item menu-item-NX'}
                >
                  <img src={icon} alt='' srcSet="" />
                  {isExpanded && <p>{text}</p>}
                  {!isExpanded && <div className='tooltip'>{text}</div>}
                </button>
              ) : (
                <NavLink
                  key={text}
                  to={`/${text.toLowerCase()}`}
                  className={isExpanded ? 'menu-item' : 'menu-item menu-item-NX'}
                >
                  <img src={icon} alt='' srcSet="" />
                  {isExpanded && <p>{text}</p>}
                  {!isExpanded && <div className='tooltip'>{text}</div>}
                </NavLink>
              )
            ))
          }

        </div>
      </div>
      <div className='nav-footer'>
        <div className={isExpanded ? 'nav-details' : 'nav-details nav-details-NX'}>
          <Avatar size='md' bg='yellow.400' name={user.name} src={user.profilePic == null ? 'https://bit.ly/broken-link' : user.profilePic} style={{ margin: '0 15px' }} />
          <div className='nav-footer-info'>
            <p className='nav-footer-user-name'>{user.name}</p>
            <p className='nav-footer-user-role'>{user.isAdmin === true ? 'Administrator' : 'Member'}</p>
          </div>
        </div>

      </div>
    </div>
  );

}


export default Sidebar;
