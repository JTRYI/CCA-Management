import React from 'react';
import './membersScreen.css';
import { Button, Input, InputGroup, InputRightElement, Table, TableContainer, Td, Tr, Thead, Th, Tbody } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const Member = (props) => (
  <Tr>
    <Td>
      <div className='name-profile'>
        <img src={props.member.profilePic == null ? 'icons/universal-access-solid.svg' : props.member.profilePic} />
        {props.member.name}
      </div>
    </Td>
    <Td>
     {props.member.instrument}
    </Td>
    <Td>
      {props.member.dateJoined}
    </Td>
    <Td className='dot-icon'>
      <img src='icons/ellipsis-vertical-solid.svg' />
    </Td>
  </Tr>
);

function MembersScreen() {

  const [members, setMembers] = useState([]);

  //This method fetches the members from the database
  useEffect(() => {
    async function getMembers() {
      const response = await fetch(`http://localhost:5050/members/`);

      if (!response.ok) {
        const message = `Ah error occured: ${response.statusTest}`;
        window.alert(message);
        return;
      }

      const members = await response.json();
      setMembers(members)
    }

    getMembers();

    return;
  }, [members.length]);

  //This method will map out the members on the table
  function memberList() {
    return members.map((member) => {
      return (
        <Member
          member={member}
          key={member._id}
        />
      );
    });
  }

  return (
    <div className="membersScreen">
      <div className='members-container'>
        <InputGroup className='search-bar'>
          <Input placeholder='Search Members' borderRadius={20}
            paddingLeft={8} color={'black'} focusBorderColor='#996515'
            //0 is the horizontal offset (no offset).
            //5px is the vertical offset (the shadow will be below the element by 4 pixels).
            //6px is the blur radius (the shadow will be blurred by 6 pixels).
            //rgba(0, 0, 0, 0.1) is the color of the shadow and 0.1 is the opacity of the shadow.
            boxShadow='0 5px 6px rgba(0, 0, 0, 0.3)'
            _hover={
              {
                borderColor: 'black'
              }
            }
          />
          <InputRightElement>
            <img src='icons/magnifying-glass-solid.svg'></img>
          </InputRightElement>
        </InputGroup>

        <div className='top-header'>
          <div className='left-side-headers'>
            <h1>{members.length} Members</h1>
            <img src='icons/arrow-down-wide-short-solid.svg' />
          </div>
          <Button className='right-side-header' backgroundColor='rgba(153, 101, 21, 0.5);'
            color={'white'} borderRadius={10} paddingLeft={8} paddingRight={7} height={8}
            borderColor='#996515'
            _hover={
              {
                backgroundColor: 'rgba(153, 101, 21, 1.0);'
              }
            }
          >Add
            {<img src='icons/plus-solid.svg' style={{ paddingLeft: '5px' }} />}
          </Button>
        </div>

        <TableContainer className='members-table-container'>
          <Table className='members-table' variant='striped' colorScheme='orange' size='sm'>
            <Thead>
              <Tr>
                <Th paddingY={5} paddingStart={20} color='#996515'>Name</Th>
                <Th color='#996515'>Instrument</Th>
                <Th color='#996515'>Date Joined</Th>
                <Th color='#996515'>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>{memberList()}</Tbody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );

}


export default MembersScreen;
