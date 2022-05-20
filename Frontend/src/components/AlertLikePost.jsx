import React from "react";

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,



} from "@chakra-ui/react"

function AlertLikePost(props) {

  return (
    <>
      <Modal
        isOpen={props.state.confirm}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg" fontWeight="bold">
            Like Post
          </ModalHeader>
          <ModalCloseButton onClick={props.state.onCancelLike} />

          <ModalBody>
            {props.state.like ? "Like" : "Unlike"} this post?
          </ModalBody>

          <ModalFooter>
            <Button onClick={props.state.onCancelLike}>
              No
            </Button>
            <Button onClick={props.state.onConfirmLike} colorScheme={"blue"} color="white" ml={3}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AlertLikePost