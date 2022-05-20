import React from "react";

import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,


} from "@chakra-ui/react"

function AlertEdit(props) {
  return (
    <>
      <AlertDialog
        isOpen={props.state.confirm}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Update Profile
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={props.state.onCancel}>
              Cancel
            </Button>
            <Button onClick={props.state.onConfirm} backgroundColor={"orange"} color="white" ml={3}>
              Edit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default AlertEdit