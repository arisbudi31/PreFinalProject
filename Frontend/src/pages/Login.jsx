import React, { useRef, useState } from "react";
import Axios from "axios"
import { Box, Button, Flex, Heading, Input, Spinner, Text, Link, useToast } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, Navigate } from "react-router-dom"
import { useDispatch } from 'react-redux';

const API_URL = process.env.REACT_APP_API_URL

function Login() {
  const login = useRef("")
  const password = useRef("")

  const [loading, setLoading] = useState(false)

  const toast = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onButtonLogin = () => {
    setLoading(true)

    Axios.post(API_URL + "/users", {
      login: login.current.value,
      password: password.current.value
    })
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
          title: 'Login success',
          status: 'success',
          duration: 3000,
          isClosable: true
        })
      })
      .catch(err => {
        setLoading(false)
        // console.log(err.response.data.data)

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
          >Login to Social Network</Text>
          <Text marginBottom="15px">Username</Text>
          <Input ref={login} marginBottom="15px" type="text" placeholder="Masukkan username atau email anda" />

          <Text marginBottom="15px">Password</Text>
          <Input ref={password} marginBottom="25px" type="password" placeholder='*****' />

          <Button
            colorScheme='teal'
            variant='solid'
            disabled={loading}
            onClick={onButtonLogin}
          >
            {loading ? 'Loading....' : 'Login'}
          </Button>
          <Text my={"32px"}>Don't have account? click
            <Link as={RouterLink}
              to="/register"
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

export default Login