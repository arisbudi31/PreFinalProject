import React, { useRef, useState } from "react";
import Axios from "axios";
import { Box, Link, Button, Flex, Heading, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, Navigate } from "react-router-dom"
import { useDispatch } from 'react-redux';

const API_URL = process.env.REACT_APP_API_URL

function Register() {
  const username = useRef("")
  const email = useRef("")
  const password = useRef("")
  const re_password = useRef("")

  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onButtonRegister = () => {
    setLoading(true)
    Axios.post(API_URL + '/users/register', {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
      re_password: re_password.current.value
    }
    )
      .then(response => {
        setLoading(false)

        Axios.get(API_URL + '/users', {
          headers: {
            'authorization': response.headers.authorization
          }
        }).then(resp => {
          const data = resp.data.data

          localStorage.setItem("token", data.uid)

          dispatch({ type: 'LOGIN', payload: data })
        }).catch(err => {
          console.log(err)
        })

        // -> redirect to home page
        navigate('/home')

        toast({
          position: "top",
          title: 'Register success',
          status: 'success',
          duration: 3000,
          isClosable: true
        })


      })
      .catch(err => {
        console.log(err.response.data.data)
        setLoading(false)

        toast({
          position: 'top',
          title: err.response.data.data,
          status: 'error',
          duration: 3000,
          isClosable: true
        })

      })
  }

  const token = localStorage.getItem('token')
  if (token) return <Navigate to="/home" />

  return (
    <Box w={"100%"}>
      <Flex w="100%"
        alignItems="center"
        justifyContent="center"
        flexDirection={"column"}
        marginTop={"32px"}
      >
        <Heading color={"blue.300"}>Social Network</Heading>
        <Box
          w="630px"
          backgroundColor="#FFFFFF"
          px="5%"
          py="3%"
          marginTop="5%"
          boxShadow="base"
        >
          <Text
            textAlign={"center"}
            mb={"32px"}
            fontSize={"18px"}
            fontWeight={"bold"}
          >Register to Social Network</Text>
          <Text marginBottom="15px">Username</Text>
          <Input ref={username} marginBottom="15px" type="text" placeholder="Masukkan username anda" />

          <Text marginBottom="15px">Email</Text>
          <Input ref={email} marginBottom="25px" type="email" placeholder="Masukkan email anda" />

          <Text marginBottom="15px">Password</Text>
          <Input ref={password} marginBottom="25px" type="password" placeholder='*****' />


          <Text marginBottom="15px">Ulangi Password</Text>
          <Input ref={re_password} marginBottom="25px" type="password" placeholder='*****' />

          <Button
            colorScheme='teal'
            variant='solid'
            disabled={loading}
            onClick={onButtonRegister}
          >
            {loading ? 'Loading....' : 'Register'}
          </Button>
          <Text my={"32px"}>Already have account? click
            <Link as={RouterLink}
              to="/"
              fontWeight={"bold"}
              _hover={{ textDecoration: "underline", textDecorationColor: "green" }}
            > here
            </Link>
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default Register