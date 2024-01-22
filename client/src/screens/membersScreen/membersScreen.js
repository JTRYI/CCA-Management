import React from 'react';
import './membersScreen.css';
import { Button, Input, InputGroup, InputRightElement, Table, TableContainer, Td, Tr, Thead, Th, Tbody, Avatar, Menu, MenuList, MenuItem, MenuButton, IconButton, Icon, MenuItemOption, MenuOptionGroup, Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import AddModal from '../../components/addModal/addModal';
import { FiMoreVertical } from 'react-icons/fi';
import { FaRegEye } from "react-icons/fa";
import { ImPencil } from "react-icons/im";
import { ImBin } from "react-icons/im";
import { BsFunnel } from "react-icons/bs";
import { FaSortAlphaUp } from "react-icons/fa";
import { FaSortNumericDownAlt } from "react-icons/fa";
import { FcClearFilters } from "react-icons/fc";

import EditModal from '../../components/editModal/editModal';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'
import ViewModal from '../../components/viewModal/viewModal';

const Member = (props) => {

  const viewProfileDisclosure = useDisclosure();
  const editProfileDisclosure = useDisclosure();
  const deleteProfileDisclosure = useDisclosure();
  const [viewProfileClicked, setViewProfileClicked] = useState(false);
  const [editProfileClicked, setEditProfileClicked] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user'));

  return (
    <Tr>
      <Td>
        <div className='name-profile'>
          <Avatar size='md' bg='yellow.400' name={props.member.profilePic == null ? props.member.name : null}  // Display name only if profilePic is null
            src={props.member.profilePic} style={{ marginRight: "10%" }} />
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
            <MenuItem icon={<FaRegEye />} onClick={() => {
              setViewProfileClicked(true);
              viewProfileDisclosure.onOpen();
            }}>
              View Profile
            </MenuItem>
            {viewProfileClicked && (
              <ViewModal isOpen={viewProfileDisclosure.isOpen}
                onClose={() => {
                  setViewProfileClicked(false);
                  viewProfileDisclosure.onClose();
                }}
                memberID={props.member._id} />
            )}

            <MenuItem icon={<ImPencil />} onClick={() => {
              setEditProfileClicked(true);
              editProfileDisclosure.onOpen();
            }}
              style={{ display: user.isAdmin ? 'block' : 'none' }}>
              Edit Profile
            </MenuItem>
            {editProfileClicked && (
              <EditModal
                isOpen={editProfileDisclosure.isOpen}
                onOpen={editProfileDisclosure.onOpen}
                onClose={() => {
                  setEditProfileClicked(false);
                  editProfileDisclosure.onClose();
                }}
                afterCloseCallback={props.handleModalClose}
                memberID={props.member._id} />
            )}

            <MenuItem icon={<ImBin />} onClick={deleteProfileDisclosure.onOpen} style={{ display: user.isAdmin ? 'block' : 'none' }}>
              Delete Member
            </MenuItem>
            <AlertDialog
              isOpen={deleteProfileDisclosure.isOpen}
              onClose={deleteProfileDisclosure.onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    {`Delete ${props.member.name}`}
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button onClick={deleteProfileDisclosure.onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme='red'
                      onClick={() => {
                        props.deleteMember(props.member._id);
                        deleteProfileDisclosure.onClose();
                      }} ml={3}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
};

function MembersScreen() {

  const [members, setMembers] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredMembers, setFilteredMembers] = useState(members);

  const [sortOrder, setSortOrder] = useState('asc');
  const [sortColumn, setSortColumn] = useState(null);
  const [isNameSorted, setIsNameSorted] = useState(false);
  const [isInstrumentSorted, setIsInstrumentSorted] = useState(false);
  const [isDateJoinedSorted, setIsDateJoinedSorted] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const toast = useToast();

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
      setMembers(members);
      setSelectedFilter('all');
    }

    getMembers();

    return;
  }, [updateTrigger]);

  const token = sessionStorage.getItem('token');

  //This method will delete a Member
  async function deleteMember(id) {
    await fetch(`http://localhost:5050/member/${token}/${id}`, {
      method: "DELETE"
    });

    const newMembers = members.filter((el) => el._id !== id);
    setMembers(newMembers);

    toast({
      title: 'Request Successful',
      description: "Member Deleted Successfully!",
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  // Function to convert date string to a sortable value
  const getSortableDateValue = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number);
    return year * 10000 + month * 100 + day;
  };

  // This method will handle sorting based on the selected column
  const handleSort = (column) => {
    // Toggle the sort order if the same column is clicked
    const newSortOrder = sortColumn === column ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
    setSortOrder(newSortOrder);
    setSortColumn(column);

    // Sort the members array based on the selected column and order
    let sortedMembers = [...filteredMembers];
    switch (column) {

      case 'name':
        sortedMembers.sort((a, b) => {
          const comparison = a[column].localeCompare(b[column]);
          return sortOrder === 'asc' ? comparison : -comparison;
        });
        setIsNameSorted(true);
        setIsInstrumentSorted(false);
        setIsDateJoinedSorted(false);
        break;

      case 'instrument':
        sortedMembers.sort((a, b) => {
          const comparison = a[column].localeCompare(b[column]);
          return sortOrder === 'asc' ? comparison : -comparison;
        });
        setIsNameSorted(false);
        setIsInstrumentSorted(true);
        setIsDateJoinedSorted(false);
        break;

      case 'dateJoined':
        sortedMembers.sort((a, b) => {
          const valueA = getSortableDateValue(a[column]);
          const valueB = getSortableDateValue(b[column]);

          return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        });

        setIsNameSorted(false);
        setIsInstrumentSorted(false);
        setIsDateJoinedSorted(true);

        break;
      default:
        break;
    }

    setFilteredMembers(sortedMembers);
  };

  // Function to handle canceling the sort/filter and return to the original order
  const handleCancelSortFilter = () => {
    setFilteredMembers([...members]); // Restore the original order
    setSelectedFilter('all');
    setIsNameSorted(false);
    setIsInstrumentSorted(false);
    setIsDateJoinedSorted(false);
  };



  useEffect(() => {
    // This effect will run whenever selectedFilter or members change
    let updatedFilteredMembers = members;

    if (selectedFilter !== 'all') {
      // Apply filtering based on the selected year
      updatedFilteredMembers = members.filter((member) => member.yearOfStudy === selectedFilter);
    }

    setFilteredMembers(updatedFilteredMembers);
    setIsNameSorted(false);
    setIsInstrumentSorted(false);
    setIsDateJoinedSorted(false);

  }, [selectedFilter, members]); // Dependency array to ensure this effect runs when these values change

  // This method will map out the members on the table based on the selected filter
  function filteredMemberList() {

    return filteredMembers.map((member) => (
      <Member
        member={member}
        key={member._id}
        handleModalClose={handleModalClose}
        deleteMember={() => {
          deleteMember(member._id);
        }}
      />
    ));
  }


  const user = JSON.parse(sessionStorage.getItem('user'));

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
            <h1>{filteredMembers.length} Members</h1>
            <Box key={selectedFilter} style={{ zIndex: 2 }}>
              <Menu>
                <MenuButton as={IconButton} variant='' icon={<BsFunnel />} style={{ fontSize: '20px', paddingLeft: '10%', marginTop: '2px' }} />
                <MenuList>
                  <MenuOptionGroup defaultValue={selectedFilter} title='Filters:' type='radio' onChange={(value) => setSelectedFilter(value)}>
                    <MenuItemOption value='all'>All Members</MenuItemOption>
                    <MenuItemOption value="1">Year 1</MenuItemOption>
                    <MenuItemOption value="2">Year 2</MenuItemOption>
                    <MenuItemOption value="3">Year 3</MenuItemOption>
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </Box>

            <Button rightIcon={<FcClearFilters />} colorScheme='orange' variant='ghost' height={8} margin={1} onClick={handleCancelSortFilter}>
            Clear
          </Button>

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

            style={{ visibility: user.isAdmin ? 'visible' : 'hidden' }}

          >Add
            {<img src='icons/plus-solid.svg' style={{ paddingLeft: '5px' }} />}
          </Button>
          <AddModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} afterCloseCallback={handleModalClose}></AddModal>
        </div>

        <TableContainer className='members-table-container' overflowY='auto'>
          <Table className='members-table' variant='striped' colorScheme='orange' size='sm'>
            <Thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
              <Tr>
                <Th paddingY={5} paddingStart={20} color='#996515' style={{ transform: 'translateY(7px)' }} >Name <FaSortAlphaUp style={{ fontSize: '14px', transform: 'translateY(-15px) translateX(45px)', cursor: 'pointer', color: isNameSorted ? '#996515' : 'black' }} onClick={() => handleSort('name')} /></Th>
                <Th color='#996515' style={{ transform: 'translateY(7px)' }}>Instrument <FaSortAlphaUp style={{ fontSize: '14px', transform: 'translateY(-15px) translateX(90px)', cursor: 'pointer', color: isInstrumentSorted ? '#996515' : 'black' }} onClick={() => handleSort('instrument')} /></Th>
                <Th color='#996515' style={{ transform: 'translateY(7px)' }}>Date Joined <FaSortNumericDownAlt style={{ fontSize: '14px', transform: 'translateY(-15px) translateX(88px)', cursor: 'pointer', color: isDateJoinedSorted ? '#996515' : 'black' }} onClick={() => handleSort('dateJoined')} /></Th>
                <Th color='#996515'>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>{filteredMemberList()}</Tbody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );

}


export default MembersScreen;
