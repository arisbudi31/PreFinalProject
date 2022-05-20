import React, { useState, useRef } from "react";
import Axios from "axios";
import { Link as RouterLink, useNavigate, Navigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Flex, Heading, Image, Text, Input, useToast, Textarea } from '@chakra-ui/react';
import CustomNavbar from "../components/CustomNavbar"
import AlertEdit from "../components/AlertEdit";

const API_URL = process.env.REACT_APP_API_URL

function EditProfile() {
  const usernameEdit = useRef("")
  const fullnameEdit = useRef("")
  const bioEdit = useRef("")
  const { fullname, username, email, bio, image, status } = useSelector((state) => state.user)
  const [saveImage, setSaveImage] = useState(null)
  const [imageEdit, setImageEdit] = useState(image)
  const dispatch = useDispatch()

  const token = localStorage.getItem("token")

  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const toast = useToast()
  const navigate = useNavigate()

  const onButtonCancel = () => {
    navigate('/profile')
  }

  const onCancel = () => {
    setConfirm(false)
  }

  const onButtonEdit = () => {
    setConfirm(true)
  }

  const imageEditHandler = (e) => {
    setSaveImage(e.target.files[0])
    setImageEdit(URL.createObjectURL(e.target.files[0]))
    console.log(URL.createObjectURL(e.target.files[0]))
  }

  const onBtnResendEmail = () => {
    setLoading(true)
    Axios.post(API_URL + '/users/verification/resend', { email },
      {
        headers: {
          'authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        setLoading(false)

        toast({
          position: "top",
          title: 'Email has been resend',
          status: 'success',
          duration: 2000,
          isClosable: true
        })

      })
      .catch(err => {
        setLoading(false)

        toast({
          position: "top",
          title: 'Terjadi kesalahan',
          status: 'error',
          duration: 2000,
          isClosable: true
        })

      })
  }

  const onSavePicture = () => {
    setLoading(true)
    if (!saveImage) {
      setLoading(false)
      return toast({
        position: "top",
        title: 'Gambar perlu di upload',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }

    const formData = new FormData()

    formData.append("image", saveImage, saveImage.name)

    Axios.post(API_URL + "/users/upload", formData, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setLoading(false)
        // console.log(response.data.data)
        toast({
          position: "top",
          title: 'Gambar berhasil di upload',
          status: 'success',
          duration: 2000,
          isClosable: true
        })

      })
      .catch(err => {
        console.log(err)
      })
  }

  const onConfirm = (e) => {
    setLoading(true)
    setConfirm(false)

    Axios.put(API_URL + "/users/edit", {
      username: usernameEdit.current.value,
      fullname: fullnameEdit.current.value,
      bio: bioEdit.current.value,
    }, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setLoading(false)
        // console.log(response.data.data)

        dispatch({ type: 'EDIT', payload: response.data.data })

        toast({
          position: "top",
          title: 'Edit profile success',
          status: 'success',
          duration: 2000,
          isClosable: true
        })
        // -> redirect to home profile
        setRedirect(true)

      })
      .catch(err => {
        setLoading(false)
        toast({
          position: "top",
          title: err.response.data.data,
          status: 'error',
          duration: 2000,
          isClosable: true
        })
        console.log(err)
      })

  }

  return (
    <>
      <CustomNavbar />
      <AlertEdit state={{ confirm, onCancel, onConfirm }} />
      {
        redirect ? <Navigate to='/profile' /> : null
      }
      <Box w={"100%"}>
        <Flex w="100%"
          alignItems="center"
          justifyContent="center"
          flexDirection={"column"}
          marginTop={"32px"}
        >
          <Heading color={"blue.300"}>Edit Profile</Heading>

          {
            status === "verified" ? null :
              <>
                <Text color={"orange"} my={2}>Unverified user, please check your email</Text>
                <Button
                  onClick={onBtnResendEmail}
                  mt={2}
                  colorScheme='blue'
                  variant='solid'
                  disabled={loading}
                >{loading ? 'Loading....' : 'Request resend email verification'}</Button>
              </>
          }
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
            >Edit Profile Social Network</Text>
            <Text marginBottom="15px">Fullname</Text>
            <Input defaultValue={fullname} ref={fullnameEdit} marginBottom="15px" type="text" />

            <Text marginBottom="15px">Username</Text>
            <Input defaultValue={username} ref={usernameEdit} marginBottom="15px" type="text" />

            <Text marginBottom="15px">Email</Text>
            <Input defaultValue={email} marginBottom="25px" type="email" disabled />

            <Text marginBottom="15px">Bio</Text>
            <Textarea defaultValue={bio} height={"200px"} ref={bioEdit} marginBottom="25px" type="text" />


            <Text marginBottom="15px">Profile Picture</Text>
            <Image objectFit={"cover"} boxSize={"100px"} mb={2}
              src={imageEdit}
              alt='Image Profile'
              borderRadius={8} />
            <Box>
              <Input
                onChange={imageEditHandler}
                marginBottom="25px"
                type="file"
                accept="image/*" w={"50%"} />
              <Button ml={2} disabled={loading} onClick={onSavePicture}>Upload picture</Button>
            </Box>

            <Button
              colorScheme='teal'
              variant='solid'
              disabled={loading}
              onClick={onButtonEdit}
            >
              {loading ? 'Loading....' : 'Save'}
            </Button>

            <Button
              ml={3}
              colorScheme='red'
              variant='solid'
              disabled={loading}
              onClick={onButtonCancel}
            >
              Cancel
            </Button>

          </Box>
        </Flex>
      </Box>
    </>
  )
}

export default EditProfile