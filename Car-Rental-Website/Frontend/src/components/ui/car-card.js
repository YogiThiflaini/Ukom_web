import { useEffect, useRef, useState } from "react";
import {
  Button,
  Heading,
  HStack,
  Image,
  Text,
  Box,
  Textarea,
  Divider,
  SimpleGrid,
  GridItem,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { ChatIcon, DeleteIcon,EditIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthentication from "../../useAuthentication";

const CarCard = ({ props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { isLoggedIn } = useAuthentication();
  const toastIdRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const userEmail = localStorage.getItem('email'); // Ambil email dari localStorage

  // Ambil komentar berdasarkan car_id ketika komponen dimount
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/cars/${props.id}/comments`)
      .then(response => {
        setComments(response.data);
      })
      .catch(error => console.error("Gagal mengambil komentar", error));
  }, [props.id]);

  const handleRentNowClick = () => {
    if (isLoggedIn) {
      navigate(`/cars/${props.id}`);
    } else {
      toastIdRef.current = toast({
        title: "Anda belum login",
        description: "Silakan login untuk melanjutkan.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
        render: () => (
          <Box color="white" p={3} bg="red.500" borderRadius="md">
            <Text>Anda belum login</Text>
            <HStack justify="flex-end" spacing={3} mt={3}>
              <Button
                size="sm"
                variant="outline"
                colorScheme="grey"
                onClick={() => toast.close(toastIdRef.current)}
              >
                Kembali
              </Button>
              <Button
                size="sm"
                colorScheme="purple"
                onClick={() => {
                  toast.close(toastIdRef.current);
                  navigate("/login");
                }}
              >
                Login
              </Button>
            </HStack>
          </Box>
        ),
      });
    }
  };

  const handleEditClick = (comment) => {
    setSelectedComment(comment);
    setEditedComment(comment.komentar);
    onEditOpen();
  };

  const handleEditSubmit = () => {
    if (selectedComment) {
      axios.put(`http://127.0.0.1:8000/api/comments/${selectedComment.id}`, { komentar: editedComment })
        .then(response => {
          toast({
            title: "Comment updated successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          // Update the comments list
          setComments(comments.map(comment =>
            comment.id === selectedComment.id ? { ...comment, komentar: editedComment } : comment
          ));
          onEditClose();
        })
        .catch(error => {
          toast({
            title: "Failed to update comment",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  useEffect(() => {
    return () => {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
    };
  }, [navigate, toast]);

  const deleteComment = (commentId) => {
    axios.delete(`http://127.0.0.1:8000/api/comments/${commentId}`)
      .then(response => {
        toast({
          title: response.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setComments(comments.filter(comment => comment.id !== commentId));
        setConfirmDelete(false);
      })
      .catch(error => {
        toast({
          title: "Gagal menghapus komentar",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleDeleteClick = (commentId) => {
    setSelectedCommentId(commentId);
    setConfirmDelete(true);
  };

  const confirmDeleteComment = () => {
    if (selectedCommentId) {
      deleteComment(selectedCommentId);
    }
  };

  const photo1 = props.id <= 6 ? `/images/back${props.id}.webp` : props.photo1;
  const photo2 = props.id <= 6 ? `/images/front${props.id}.webp` : props.photo2;

  return (
    <div className="vehicle-card">
      <div className="details">
        <div className="thumb-gallery">
          <Box bg="gray.400" w="full" h="full">
            <Image
              className="first"
              objectFit="cover"
              h={"215px"}
              w={"full"}
              src={photo1}
            />
            <Image
              className="second"
              objectFit="cover"
              h={"215px"}
              w={"full"}
              src={photo2}
            />
          </Box>
        </div>

        <Box p={4}>
          <HStack alignItems="baseline" spacing={"auto"}>
            <Heading size={"md"} fontWeight="600">
              {props.brand}
            </Heading>
            <Heading size={"sm"} fontWeight="600">
              {props.model}
            </Heading>
          </HStack>
          <HStack py={3}>
            <Heading size={"md"} fontWeight="600" color="gray.600">
              Rp. {props.price.toLocaleString('id-ID')}
            </Heading>
            <Text color="gray.400">{t("carCard.perDay")}</Text>
          </HStack>

          <HStack py={2}>
            <Button
              w="full"
              onClick={handleRentNowClick}
              isDisabled={props.available === 0}
            >
              {props.available === 1
                ? t("carCard.rentNow")
                : t("carCard.notAvailable")}
            </Button>

            <IconButton
              aria-label="View Comments"
              icon={<ChatIcon />}
              onClick={onOpen}
            />
          </HStack>

          <Divider borderColor="gray.300" py={3} />

          <SimpleGrid columns={3} py={4} textAlign="center">
            <GridItem>
              <Heading fontWeight="400" color="gray.400" size="xs">
                {t("carCard.gearbox")}
              </Heading>
              <Text fontWeight="500" color="gray.600">
                {props.gearbox === "automatic" || props.gearbox === "manual"
                  ? t(`carCard.${props.gearbox.toLowerCase()}`)
                  : props.gearbox}
              </Text>
            </GridItem>
            <GridItem>
              <Heading fontWeight="400" color="gray.400" size="xs">
                {t("carCard.type")}
              </Heading>
              <Text fontWeight="500" color="gray.600">
                {props.fuel_type === "petrol" || props.fuel_type === "diesel"
                  ? t(`carCard.${props.fuel_type.toLowerCase()}`)
                  : props.fuel_type}
              </Text>
            </GridItem>
            <GridItem>
              <Heading fontWeight="400" color="gray.400" size="xs">
                {t("carCard.available")}
              </Heading>
              <Text fontWeight="500" color="gray.600">
                {props.available === 1
                  ? t("carCard.yes")
                  : props.available === 0
                  ? t("carCard.no")
                  : props.available}
              </Text>
            </GridItem>
          </SimpleGrid>

          <Divider borderColor="gray.300" py={0} />
        </Box>
      </div>

      {/* Modal untuk menampilkan komentar */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          style={{
            maxHeight: "300px", // Batasi tinggi container agar muncul scroll saat data lebih dari 4
            overflowY: "auto", // Aktifkan scroll secara vertikal
          }}
          >
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
                    <Text fontWeight="bold">{comment.firstname} {comment.lastname}</Text>
                    {userEmail === comment.email && (
                      <div gap={10}>
                      <IconButton
                        mr={2}
                        aria-label="Edit Comment"
                        bg="green"
                        icon={<EditIcon />}
                        onClick={() => handleEditClick(comment)}
                      />
                      <IconButton
                        aria-label="Delete Comment"
                        bg="red"
                        icon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(comment.id)}
                        />
                      </div>
                    )}
                  </HStack>
                  <Text>{comment.komentar}</Text>
                </Box>
              ))
            ) : (
              <Text>Belum ada review</Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={onClose}>
              Tutup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Konfirmasi hapus komentar */}
      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Apakah Anda yakin ingin menghapus komentar ini?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={confirmDeleteComment}>
              Hapus
            </Button>
            <Button colorScheme="blue" onClick={() => setConfirmDelete(false)}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for editing comments */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEditSubmit}>Simpan</Button>
            <Button colorScheme="red" onClick={onEditClose} ml={3}>Batal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CarCard;
