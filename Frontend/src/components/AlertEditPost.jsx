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

function AlertEditPost(props) {

  return (
    <>
      <Modal
        isOpen={props.state.confirmEdit}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg" fontWeight="bold">
            Update Post Feed
          </ModalHeader>
          <ModalCloseButton onClick={props.state.onCancelConfirmEdit} />

          <ModalBody>
            Are you sure? You can't undo this action afterwards.
          </ModalBody>

          <ModalFooter>
            <Button onClick={props.state.onCancelConfirmEdit}>
              Cancel
            </Button>
            <Button onClick={props.state.onConfirmEdit} colorScheme={"orange"} color="white" ml={3}>
              Edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AlertEditPost