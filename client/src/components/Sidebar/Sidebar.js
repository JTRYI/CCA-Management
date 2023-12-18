import React from 'react';
import { useState } from 'react';
import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';


function Sidebar() {

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
          <img src='icons/universal-access-solid.svg' />
          <div className='nav-footer-info'>
            <p className='nav-footer-user-name'>IamAdmin</p>
            <p className='nav-footer-user-role'>Administrator</p>
          </div>
        </div>
        <img className='user-edit' src='icons/user-pen-solid.svg' />
      </div>
    </div>
  );

}


export default Sidebar;
