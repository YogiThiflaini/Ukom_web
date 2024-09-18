import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    IconButton,
    Box,
    HStack,
    useDisclosure,
    Textarea,
    useToast,
  } from "@chakra-ui/react";
  import { ChatIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
  import { useState, useEffect } from "react";
  import axios from "axios";
  
  const ReviewButton = ({ comments: initialComments, carId }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } =
      useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } =
      useDisclosure();
    const [editedComment, setEditedComment] = useState("");
    const [selectedComment, setSelectedComment] = useState(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [comments, setComments] = useState(initialComments); // State untuk komentar
    const toast = useToast();
    const userEmail = localStorage.getItem("email");
  
    useEffect(() => {
      setComments(initialComments); // Inisialisasi ulang comments jika prop berubah
    }, [initialComments]);
  
    const handleEditClick = (comment) => {
      setSelectedComment(comment);
      setEditedComment(comment.komentar);
      onEditOpen();
    };
  
    const handleEditSubmit = () => {
      if (selectedComment) {
        axios
          .put(`http://127.0.0.1:8000/api/comments/${selectedComment.id}`, {
            komentar: editedComment,
          })
          .then((response) => {
            // Update comment di state tanpa refresh
            setComments((prevComments) =>
              prevComments.map((comment) =>
                comment.id === selectedComment.id
                  ? { ...comment, komentar: editedComment }
                  : comment
              )
            );
            toast({
              title: "Review komentar berhasil diperbarui",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            onEditClose();
          })
          .catch((error) => {
            toast({
              title: "Gagal memperbarui review komentar",
              description: error.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
      }
    };
  
    const handleDeleteClick = (commentId) => {
      setSelectedCommentId(commentId);
      onDeleteOpen();
    };
  
    const confirmDeleteComment = () => {
      if (selectedCommentId) {
        axios
          .delete(`http://127.0.0.1:8000/api/comments/${selectedCommentId}`)
          .then((response) => {
            // Hapus comment di state tanpa refresh
            setComments((prevComments) =>
              prevComments.filter((comment) => comment.id !== selectedCommentId)
            );
            toast({
              title: "Review komentar berhasil dihapus",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            onDeleteClose();
          })
          .catch((error) => {
            toast({
              title: "Gagal menghapus review komentar",
              description: error.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
      }
    };
  
    return (
      <>
        <IconButton aria-label="Lihat Komentar Review" icon={<ChatIcon />} onClick={onOpen} />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Review</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Box
                    key={comment.id}
                    p={4}
                    mb={2}
                    border="1px solid gray"
                    borderRadius="md"
                    bg="gray.50"
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="bold">
                        {comment.firstname} {comment.lastname}
                      </Text>
                      {userEmail === comment.email && (
                        <HStack>
                          <IconButton
                            aria-label="Edit Komentar Review"
                            bg="green"
                            icon={<EditIcon />}
                            onClick={() => handleEditClick(comment)}
                          />
                          <IconButton
                            aria-label="Hapus Komentar Review"
                            bg="red"
                            icon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(comment.id)}
                          />
                        </HStack>
                      )}
                    </HStack>
                    <Text>{comment.komentar}</Text>
                  </Box>
                ))
              ) : (
                <Text>Tidak ada komentar review yang tersedia.</Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Tutup
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
  
        {/* Konfirmasi Hapus Modal */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Konfirmasi Hapus</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Apakah kamu yakin ingin menghapus komentar review ini?</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={confirmDeleteComment}>
                Hapus
              </Button>
              <Button variant="ghost" onClick={onDeleteClose}>
                Batal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
  
        {/* Edit comment modal */}
        <Modal isOpen={isEditOpen} onClose={onEditClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Komentar Review</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleEditSubmit}>
                Simpan
              </Button>
              <Button variant="ghost" onClick={onEditClose}>
                Batal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default ReviewButton;
  