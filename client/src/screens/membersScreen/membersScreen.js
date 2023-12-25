import React from 'react';
import './membersScreen.css';
import { Button, Input, InputGroup, InputRightElement, Table, TableContainer, Td, Tr, Thead, Th, Tbody, Avatar, Menu, MenuList, MenuItem, MenuButton, IconButton, Icon } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import AddModal from '../../components/addModal/addModal';
import { FiMoreVertical } from 'react-icons/fi';
import { FaRegEye } from "react-icons/fa";
import { ImPencil } from "react-icons/im";
import { ImBin } from "react-icons/im";
import EditModal from '../../components/editModal/editModal';

const Member = (props) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editProfileClicked, setEditProfileClicked] = useState(false);

  return (
    <Tr>
      <Td>
        <div className='name-profile'>
          <Avatar size='md' name={props.member.name} src={props.member.profilePic == null ? 'https://bit.ly/broken-link' : props.member.profilePic} style={{ marginRight: "10%" }} />
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
        <Menu>
          <MenuButton as={IconButton} variant='' icon={<Icon as={FiMoreVertical} />} style={{ transform: 'translateX(8px)' }} />
          <MenuList>
            <MenuItem icon={<FaRegEye />}>
              View Profile
            </MenuItem>
            <MenuItem icon={<ImPencil />} onClick={() => {
              setEditProfileClicked(true);
              onOpen(props.member._id);
            }}>
              Edit Profile
            </MenuItem>
            {editProfileClicked && (
              <EditModal
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={() => {
                  setEditProfileClicked(false);
                  onClose();
                }}
                afterCloseCallback={props.handleModalClose}
                memberID={props.member._id} />
            )}
            <MenuItem icon={<ImBin />}>
              Delete Profile
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
};

function MembersScreen() {

  const [members, setMembers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const handleModalClose = () => {
    // Toggle the updateTrigger to trigger re-render
    setUpdateTrigger((prev) => !prev);
  };

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
  }, [updateTrigger]);

  //This method will map out the members on the table
  function memberList() {
    return members.map((member) => {
      return (
        <Member
          member={member}
          key={member._id}
          handleModalClose={handleModalClose}
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
            onClick={() => {
              onOpen();
            }}

          >Add
            {<img src='icons/plus-solid.svg' style={{ paddingLeft: '5px' }} />}
          </Button>
          <AddModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} afterCloseCallback={handleModalClose}></AddModal>
        </div>

        <TableContainer className='members-table-container' overflowY='auto'>
          <Table className='members-table' variant='striped' colorScheme='orange' size='sm'>
            <Thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
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