import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import Axios from "axios"
import { CheckIcon, CloseIcon } from "@chakra-ui/icons"
import { Box, Button, Heading, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

const API_URL = process.env.REACT_APP_API_URL

function Verification() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [message, setMessage] = useState(null)
  const { token } = useParams()

  useEffect(() => {
    console.log(token)

    Axios.patch(API_URL + `/users/verification`, {}, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        setMessage("Your Account has ben Verified")
      })
      .catch((error) => {
        console.log(error)
        dispatch({ type: 'ON_END' })
      })
  }, [])

  const onBtnLogin = () => {
    localStorage.removeItem("token")
    dispatch({ type: 'LOGOUT' })
    navigate("/")
  }
  return (
    <Box
      w={"50%"}
      borderWidth='1px'
      borderRadius='lg'
      mx={"auto"}
      textAlign="center"
      backgroundColor={"#318FC6"}
      mt={5}
      py={5}
    >
      <Heading as={"h3"} mb={3} color='white'>
        {message != null ?
          <>
            <CheckIcon /> {message}
          </>
          :
          <>
            <CloseIcon color={"orange"} />
            <Text color={"orange"}>Your Account not Verified</Text>
          </>
        }
      </Heading>
      <Text>
        {message != null ?
          <>
            <Text color={"white"} mb={3}>Click button below to connect with your friends</Text>
            <Button onClick={onBtnLogin}>Login Social Network</Button>
          </>
          :
          <Text color={"white"} mb={3}>There are something wrong</Text>
        }
      </Text>
    </Box>
  )
}

export default Verification