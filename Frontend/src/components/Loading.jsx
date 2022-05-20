import { Modal, ModalOverlay, ModalContent, ModalBody, CircularProgress, Flex } from "@chakra-ui/react"


function Loading(props) {

  return (
    <>
      <Modal isOpen={props.state.loading}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody border={"none"}>
            <Flex w={"100%"} justify="center" align={"center"}>
              <CircularProgress isIndeterminate value={50} color="blue" />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Loading