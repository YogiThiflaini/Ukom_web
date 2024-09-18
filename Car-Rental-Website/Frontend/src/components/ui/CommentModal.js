import { useState } from 'react';
import {
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  useDisclosure,
  Box,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import axios from 'axios';

const CommentModal = ({ carId }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [comment, setComment] = useState('');
    const toast = useToast();
  
    // Mengambil data pengguna dari localStorage
    const email = localStorage.getItem('email');
  
    const handleCommentSubmit = () => {
      axios.post('http://127.0.0.1:8000/api/comments', {
        car_id: carId,
        komentar: comment,
        email: email,
      })
      .then(response => {
        toast({
          title: 'Komentar berhasil ditambahkan.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setComment('');
        onClose();
      })
      .catch(error => {
        toast({
          title: 'Gagal menambahkan komentar.',
          description: error.response?.data?.message || error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
    };
  
    return (
      <>
        <Button
          leftIcon={<ChatIcon />}
          colorScheme="pink"
          onClick={onOpen}
        >
          Beri Review
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Tambah Review</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box mb={4}>
                <Text fontWeight="bold">Email : </Text>
                <Text>{email}</Text>
              </Box>
              <Textarea
                placeholder="Tulis komentar Anda di sini..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                mb={4}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleCommentSubmit}>
                Kirim
              </Button>
              <Button onClick={onClose} ml={3}>
                Tutup
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };  

export default CommentModal;
