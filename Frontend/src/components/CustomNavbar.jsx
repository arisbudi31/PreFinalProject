import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link, Button, Flex, Heading, Image, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react";
import { AiOutlineUser, AiOutlineLogout } from "react-icons/ai"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';

function CustomNavbar() {
  const navigate = useNavigate()

  const { username, image } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const onButtonLogout = () => {
    localStorage.removeItem("token")
    dispatch({ type: 'LOGOUT' })
    navigate("/")
  }

  return (
    <Flex as={"header"} w={"100%"} backgroundColor={"lightblue"}>
      <Flex w={"100%"} my={3} mx={100} justify={"space-between"} align="center">
        <Heading fontSize={24}>
          <Link as={RouterLink}
            to="/home"
            _hover={"none"}
          > Home
          </Link>
        </Heading>
        <Stack direction={"row"} align="center">
          <Image borderRadius='full'
            boxSize='45px'
            src={image}
            alt='profile' />
          <Menu>
            <MenuButton
              as={Button}
              aria-label="option"
              rightIcon={<ChevronDownIcon />}
              variant="none">
              {username}
            </MenuButton>
            <MenuList>

              <Link as={RouterLink}
                to="/profile"
                fontWeight={"bold"}
                _hover={"none"}
              > <MenuItem icon={<AiOutlineUser />}>My Profile</MenuItem>
              </Link>

              <MenuItem icon={<AiOutlineLogout />} onClick={onButtonLogout}> Logout</MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>
    </Flex>
  )
}

export default CustomNavbar