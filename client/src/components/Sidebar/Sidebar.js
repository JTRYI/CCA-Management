import React, { useEffect } from 'react';
import { useState } from 'react';
import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';


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
            onClick={() => setExpandState(!isExpanded)}
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
          <img src={user.profilePic == null ? 'icons/universal-access-solid.svg' : user.profilePic} />
          <div className='nav-footer-info'>
            <p className='nav-footer-user-name'>{user.name}</p>
            <p className='nav-footer-user-role'>{user.isAdmin === true ? 'Administrator' : 'Member'}</p>
          </div>
        </div>
        <img className='user-edit' src='icons/user-pen-solid.svg' />
      </div>
    </div>
  );

}


export default Sidebar;
