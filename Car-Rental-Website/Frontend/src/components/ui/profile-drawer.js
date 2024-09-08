import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Stack,
  Box,
  FormLabel,
  Input,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function ProfileDrawer() {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const firstField = React.useRef();
  const user_id = localStorage.getItem("id");
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    telephone: "",
    alamat: "",
    profile_photo: null, // Add this line
  });

  useEffect(() => {
    setFormData({
      firstname: localStorage.getItem("firstname"),
      lastname: localStorage.getItem("lastname"),
      alamat: localStorage.getItem("alamat"),
      telephone: localStorage.getItem("telephone"),
      profile_photo: null, // Reset photo field
    });
  }, []);

  const handleChange = (e) => {
    if (e.target.id === "profile_photo") {
      setFormData({ ...formData, [e.target.id]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = () => {
    setIsConfirmOpen(true); // Open confirmation modal
  };

  const confirmUpdate = () => {
    const data = new FormData();
    data.append('firstname', formData.firstname);
    data.append('lastname', formData.lastname);
    data.append('telephone', formData.telephone);
    data.append('alamat', formData.alamat);
    if (formData.profile_photo) {
      data.append('profile_photo', formData.profile_photo);
    }

    axios
      .post(`http://127.0.0.1:8000/api/user/${user_id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        toast({
          title: t("profile.updateSuccess"),
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        const updatedUser = response.data.data;
        localStorage.setItem("firstname", updatedUser.firstname);
        localStorage.setItem("lastname", updatedUser.lastname);
        localStorage.setItem("telephone", updatedUser.telephone);
        localStorage.setItem("alamat", updatedUser.alamat);
        localStorage.setItem("profile_photo", updatedUser.profile_photo);
        setIsConfirmOpen(false); // Close confirmation modal
        onClose(); // Close drawer
      })
      .catch((error) => {
        toast({
          title: t("profile.updateError"),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error(error);
        setIsConfirmOpen(false); // Close confirmation modal
      });
  };

  return (
    <>
      <Button
        leftIcon={<EditIcon color={"white"} />}
        colorScheme="telegram"
        onClick={onOpen}
      >
        {t("profile.editProfile")}
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerHeader borderBottomWidth="1px">
            {t("profile.modifyProfile")}
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="firstname">
                  {t("profile.firstname")}
                </FormLabel>
                <Input
                  ref={firstField}
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </Box>

              <Box>
                <FormLabel htmlFor="lastname">
                  {t("profile.lastname")}
                </FormLabel>
                <Input
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </Box>

              <Box>
                <FormLabel htmlFor="telephone">
                  {t("profile.phoneNumber")}
                </FormLabel>
                <Input
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="alamat">
                  {t("form.alamat")}
                </FormLabel>
                <Input
                  id="alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                />
              </Box>

              <Box>
                <FormLabel htmlFor="profile_photo">
                  {t("profile.profilePhoto")}
                </FormLabel>
                <Input
                  id="profile_photo"
                  name="profile_photo"
                  type="file"
                  onChange={handleChange}
                />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              {t("profile.cancel")}
            </Button>
            <Button colorScheme="green" px={7} onClick={handleSubmit}>
              {t("profile.save")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Confirmation Modal */}
      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("confirmUpdate.title")}</ModalHeader>
          <ModalBody>
            <Text>{t("confirmUpdate.message")}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setIsConfirmOpen(false)} mr={3}>
              {t("confirmUpdate.cancel")}
            </Button>
            <Button
              colorScheme="green"
              onClick={confirmUpdate}
            >
              {t("confirmUpdate.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileDrawer;
