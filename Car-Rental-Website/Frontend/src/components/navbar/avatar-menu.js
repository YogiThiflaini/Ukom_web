import { FaUser } from "react-icons/fa";
import {
  Box,
  Text,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast,
  HStack,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const AvatarMenu = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const fullname =
    localStorage.getItem("firstname") + " " + localStorage.getItem("lastname");
  const email = localStorage.getItem("email");
  const profilePhoto = localStorage.getItem("profile_photo");
  const level = localStorage.getItem("level");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const to_route = useNavigate();
  const navigate = (route) => {
    to_route(route);
  };

  // console.log(email);
  // console.log(profilePhoto);

  const handleLogout = () => {
    axios
      .get("http://127.0.0.1:8000/api/logout")
      .then((response) => {
        localStorage.clear();
        window.location.reload(navigate("/"));
        toast({
          title: "Logout Successful",
          description: "Anda berhasil untuk melakukan logout.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      })
      .catch((e) => {
        toast({
          title: "Logout Failed",
          description: "Terjadi kesalahan saat logout.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      });
  };

  const [currentLanguage, setCurrentLanguage] = useState("en");

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <Box px={4} zIndex={2}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <Avatar size={"sm"} name={fullname} src={profilePhoto} />
            </MenuButton>
            <MenuList>
              <Box mt={4} textAlign="center">
                <Text fontWeight="bold">{fullname}</Text>
                <Text fontSize="sm" color={"gray"}>
                  {email}
                </Text>
              </Box>
              <MenuDivider />
              <MenuItem onClick={() => navigate("/")}>
                {t("menuList.home")}
              </MenuItem>
              {/* <MenuItem
                onClick={() => changeLanguage("en")}
                style={{ display: currentLanguage === "en" ? "none" : "block" }}
              >
                {t("menuList.english")}
              </MenuItem>
              <MenuItem
                onClick={() => changeLanguage("fr")}
                style={{ display: currentLanguage === "fr" ? "none" : "block" }}
              >
                {t("menuList.indo")}
              </MenuItem> */}
              {level === "user" && (
                <MenuItem onClick={() => navigate("/order")}>Orders</MenuItem>
              )}
              <MenuItem onClick={() => navigate("/profile")}>
                {t("menuList.profile")}
              </MenuItem>
              {level === "user" && (
                <MenuItem onClick={() => navigate("/comment")}>
                  Reviews
                </MenuItem>
              )}
              <MenuDivider />
              <MenuItem onClick={onOpen}>{t("menuList.logout")}</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("confirmLogout.title")}</ModalHeader>
          <ModalBody>
            <Text>{t("confirmLogout.message")}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose} mr={3}>
              {t("confirmLogout.cancel")}
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                handleLogout();
                onClose();
              }}
            >
              {t("confirmLogout.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AvatarMenu;
