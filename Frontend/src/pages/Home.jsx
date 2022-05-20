import React, { useRef, useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom"
import Axios from "axios";
import { useSelector } from 'react-redux';
import { Box, Button, Flex, Image, Textarea, Text, Menu, MenuButton, MenuList, MenuItem, Input, Heading } from '@chakra-ui/react';
import { BsEmojiNeutral, BsEmojiHeartEyesFill, BsChatLeftText, BsFillShareFill, BsImageFill } from "react-icons/bs"

import CustomNavbar from "../components/CustomNavbar";
import { UpDownIcon, EditIcon, DeleteIcon, CloseIcon } from "@chakra-ui/icons";
import AlertEditPost from "../components/AlertEditPost";
import AlertDeletePost from "../components/AlertDeletePost";
import Loading from "../components/Loading";
import { useToast } from '@chakra-ui/react';
import AlertLikePost from "../components/AlertLikePost";

const API_URL = process.env.REACT_APP_API_URL

function Home() {
  const token = localStorage.getItem("token")
  const { image, username } = useSelector((state) => state.user)
  const content = useRef("")
  const [post, setPost] = useState([])
  const toast = useToast()
  const [media, setMedia] = useState(null)
  const [saveImage, setSaveImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null)
  const [id, setId] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [confirmEdit, setConfirmEdit] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [like, setLike] = useState(false)

  const onButtonPost = () => {
    // setPost()
    Axios.post(API_URL + "/stories", {
      content: content.current.value,
    }, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setLoading(true)
        console.log(res.data.data.insertId)
        const formData = new FormData()
        console.log(media)

        if (media) {
          formData.append("id", res.data.data.insertId)
          formData.append("image", saveImage, saveImage.name)

          Axios.post(API_URL + "/stories/image-post/", formData, {
            headers: {
              'authorization': `Bearer ${token}`
            }
          })
            .then(response => {
              Axios.get(API_URL + "/stories", {
                headers: {
                  'authorization': `Bearer ${token}`
                }
              })
                .then(res => {
                  setLoading(false)
                  // console.log(res.data.data)
                  setPost(res.data.data)
                  content.current.value = ""
                  setMedia(null)
                  toast({
                    position: "top",
                    title: "Post data success",
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                  })
                })
                .catch(err => {
                  console.log(err)
                })
            })
            .catch(err => {
              console.log(err)
            })
        }
        else {
          Axios.get(API_URL + "/stories", {
            headers: {
              'authorization': `Bearer ${token}`
            }
          })
            .then(res => {
              setLoading(false)
              // console.log(res.data.data)
              setPost(res.data.data)
              content.current.value = ""
              setMedia(null)
              toast({
                position: "top",
                title: "Post data success",
                status: 'success',
                duration: 2000,
                isClosable: true
              })
            })
            .catch(err => {
              console.log(err)
            })
        }

      })
      .catch(err => {
        console.log(err)
      })
  }

  const onButtonEdit = (id) => {
    // console.log("edit")
    setEditId(id)
  }

  const onDisplayConfirm = () => {
    setConfirmEdit(true)
  }

  const onConfirmEdit = () => {
    setConfirmEdit(true)
    // console.log("edit confirm")

    Axios.patch(API_URL + `/stories/${editId}`, {
      content: content.current.value,
    },
      {
        headers: {
          'authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        setEditId(null)
        setConfirmEdit(false)
        setLoading(true)
        Axios.get(API_URL + `/stories`, {
          headers: {
            'authorization': `Bearer ${token}`
          }
        })
          .then(res => {
            setLoading(false)
            setPost(res.data.data)

            toast({
              position: "top",
              title: "Data Updated",
              status: 'success',
              duration: 2000,
              isClosable: true
            })
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
  }

  const onButtonDelete = (id) => {
    setId(id)
    setConfirmDelete(true)
    // console.log("delete")
  }

  const onConfirmDelete = () => {
    // console.log("data deleted")
    setConfirmDelete(false)
    setLoading(true)

    Axios.delete(API_URL + `/stories/${id}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        Axios.get(API_URL + `/stories`, {
          headers: {
            'authorization': `Bearer ${token}`
          }
        })
          .then(res => {
            setLoading(false)
            setPost(res.data.data)

            toast({
              position: "top",
              title: "Data Deleted",
              status: 'success',
              duration: 2000,
              isClosable: true
            })
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
  }

  const onButtonCancel = () => {
    setConfirm(false)
    setConfirmDelete(false)
    setEditId(null)
  }

  const onCancelConfirmEdit = () => {
    setConfirmEdit(false)
  }

  const onBtnUnLike = (idLike) => {
    setId(idLike)
    setConfirm(true)
    setLike(false)
  }

  const onBtnLike = (idLike) => {
    setId(idLike)
    setConfirm(true)
    setLike(true)
  }

  const onCancelLike = () => {
    setConfirm(false)
  }

  const onConfirmLike = () => {
    Axios.get(API_URL + `/stories/${id}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        // console.log(res.data.data)
        let liked = res.data.data[0].likes
        if (like) {
          liked += 1
        } else {
          if (liked !== 0) {
            liked -= 1
          } else {
            liked = 0
          }
        }
        setConfirm(false)

        Axios.patch(API_URL + `/stories/likes/${id}`, {
          likes: liked,
          is_like: like
        }, {
          headers: {
            'authorization': `Bearer ${token}`
          }
        })
          .then(res2 => {
            setId(null)
            Axios.get(API_URL + `/stories`, {
              headers: {
                'authorization': `Bearer ${token}`
              }
            })
              .then(res3 => {
                setLoading(false)
                setPost(res3.data.data)

              })
              .catch(err => {
                console.log(err)
              })
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
  }

  const onHandlerMedia = (e) => {
    setSaveImage(e.target.files[0])
    setMedia(URL.createObjectURL(e.target.files[0]))
  }

  useEffect(() => {
    // setLoading(true)
    Axios.get(API_URL + `/stories`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        // setLoading(false)
        setPost(res.data.data)

      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  return (
    <>
      <CustomNavbar />
      <Loading state={{ loading }} />
      <AlertEditPost state={{ confirmEdit, onCancelConfirmEdit, onConfirmEdit }} />
      <AlertDeletePost state={{ confirmDelete, onButtonCancel, onConfirmDelete }} />
      <AlertLikePost state={{ confirm, like, onCancelLike, onConfirmLike }} />
      <Flex w={"100%"} align={"center"} justify="center" mt={"8px"} direction={"column"}>
        <Flex w={"50%"} borderWidth={"1px"} borderRadius={"lg"} p={4} mb={5}>
          <Box w={"15%"}>
            <Image objectFit={"cover"} boxSize={"100px"} src={image} alt='Image picture' borderRadius={8} />

          </Box>
          <Box w={"85%"} ml={8}>
            <Textarea mb={3} ref={content} height={"100px"} type="text" placeholder='What is your dreams?' />
            {
              media ?
                <Image
                  objectFit={"fit"}
                  boxSize={"100vw"} mb={2}
                  height={"200px"}
                  src={media}
                  alt='Image post'
                  borderRadius={8} /> :
                null
            }
            <Flex justify={"flex-end"} align="center">

              <Heading as={"h1"} mt={2} mr={5}>
                <label htmlFor="img"><BsImageFill cursor={"pointer"} /></label>
                <Input id="img" display={"none"} type="file" onChange={onHandlerMedia} />
              </Heading>
              <Button mt={2} colorScheme={"blue"} onClick={onButtonPost}>Post</Button>
            </Flex>
          </Box>
        </Flex>

        {
          post.map(p => {
            return (
              <>
                <Flex direction={"column"} w={"50%"} borderWidth={"1px"} borderRadius={"lg"} p={4} my={3}>
                  <Flex w={"100%"} direction={"row"}>
                    <Image objectFit={"fit"} boxSize={"60px"} src={image} alt='Image picture' borderRadius={8} />
                    <Flex ml={3} direction={"column"} justify={"space-between"}>
                      <Text>{username}</Text>
                      <Text>published: {p.created_at}</Text>
                    </Flex>
                    <Box float={"right"} ml={"auto"}>
                      <Menu>
                        <MenuButton>
                          {<UpDownIcon />}
                        </MenuButton>
                        <MenuList>
                          <MenuItem onClick={() => onButtonEdit(p.id)}>{<EditIcon color={"orange"} mr={2} />} Edit</MenuItem>
                          <MenuItem onClick={() => onButtonDelete(p.id)}>{<DeleteIcon color={"red"} mr={2} />} Delete</MenuItem>
                          <MenuItem onClick={onButtonCancel}>{<CloseIcon color={"black"} mr={2} />} Cancel</MenuItem>
                        </MenuList>
                      </Menu>
                    </Box>
                  </Flex>
                  <Box w={"100%"} mt={5}>
                    {
                      editId !== p.id ?
                        <>
                          <Text mb={2}>{p.content}</Text>
                          {
                            p.image ? <Image height={"200px"} src={p.image} /> : <Image src={p.image} />
                          }

                        </> :
                        <>
                          <Textarea mb={2} defaultValue={p.content} ref={content} height={"100px"} type="text" />
                          {
                            p.image ? <Image height={"200px"} src={p.image} /> : <Image src={p.image} />
                          }
                          <Button onClick={onDisplayConfirm} colorScheme={"teal"} mr={2}>Save</Button>
                          <Button onClick={onButtonCancel} colorScheme={"red"}>Cancel</Button>
                        </>
                    }
                  </Box>
                  <Flex w={"20%"} mt={8} justify={"space-between"}>
                    <Flex direction={"row"}>
                      {
                        p.is_like ?
                          <>
                            <BsEmojiHeartEyesFill cursor={"pointer"} onClick={() => onBtnUnLike(p.id)} />
                          </> :
                          <>
                            <BsEmojiNeutral cursor={"pointer"} onClick={() => onBtnLike(p.id)} />
                          </>
                      }
                      <Text ml={2}>{p.likes}</Text>
                    </Flex>

                    <BsChatLeftText ml={5} />
                    <BsFillShareFill ml={5} />
                  </Flex>
                </Flex>
              </>
            )
          })
        }
      </Flex>
    </>
  );
}

export default Home;