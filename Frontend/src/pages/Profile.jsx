import React from "react";
import { Link as RouterLink } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Flex, Image, Text, Link } from '@chakra-ui/react';
import CustomNavbar from "../components/CustomNavbar"


function Profile() {
  const { fullname, username, email, bio, image, status } = useSelector((state) => state.user)
  return (
    <>
      <CustomNavbar />
      <Flex w={"100%"} justify="center" mt={"8px"}>
        <Flex w={"50%"} borderWidth={"1px"} borderRadius={"lg"} p={4}>
          <Box w={"25%"}>
            <Image objectFit={"fill"} boxSize={"200px"} src={image} alt='https://fakeimg.pl/350x200' borderRadius={8} />
            <Text my={4} fontSize={16} fontWeight={500}>{fullname}</Text>
            <Link as={RouterLink}
              to="/edit-profile"
              _hover={"none"}
            > <Button colorScheme={"teal"}>Edit Profile</Button>
            </Link>

          </Box>
          <Box ml={4} w={"75%"}>
            <Text mb={4} fontSize={16} fontWeight={500}>{username}</Text>
            <Text mb={4} fontSize={16} fontWeight={500}>{email}</Text>
            <Text mb={4}>{bio}</Text>
            {
              status === 'unverified' ?
                <Text color={"red"} mb={4} fontSize={16} fontWeight={500}>Anauthorize user, please check your email to verify</Text>
                :
                null
            }
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default Profile