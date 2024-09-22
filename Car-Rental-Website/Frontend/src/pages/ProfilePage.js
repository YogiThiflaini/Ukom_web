import {
  Box,
  Container,
  VStack,
  Heading,
  Avatar,
  Text,
  Divider,
  Button,
  Flex,
  Grid,
  GridItem
} from "@chakra-ui/react";
import ProfileDrawer from "../components/ui/profile-drawer";
import HomeSidebarContent from "../components/home/home-sidebar-content";
import NavbarLinks from "../components/navbar/NavbarLinks";
import AvatarMenu from "../components/navbar/avatar-menu";
import Navbar from "../components/navbar/Navbar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

function Profile() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    id: "",
    firstname: "",
    lastname: "",
    telephone: "",
    email: "",
    alamat: "",
    saldo_dana: "",
    profile_photo: ""
  });
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("id"); 
    setProfile({
      id: userId,
      firstname: localStorage.getItem("firstname"),
      lastname: localStorage.getItem("lastname"),
      telephone: localStorage.getItem("telephone"),
      email: localStorage.getItem("email"),
      alamat: localStorage.getItem("alamat"),
      profile_photo: localStorage.getItem("profile_photo")
    });
    if (userId) {
      axios
        .get(`http://127.0.0.1:8000/api/users/${userId}`)
        .then((response) => {
          setBalance(response.data.data.saldo_dana || 0);
        })
        .catch((error) => {
          console.error("Error fetching balance:", error);
        });
    }
  }, []);

  const updateProfileState = (updatedProfile) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
  };

  return (
    <>
      <Navbar
        sidebarContent={<HomeSidebarContent />}
        links={<NavbarLinks />}
        buttons={<AvatarMenu />}
      />
      <Container maxW="container.lg" py={10}>
        <VStack spacing={6}>
          <Heading>{t("profile.head")}</Heading>

          <Box
            w="100%"
            maxW="lg"
            p={8}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
          >
            <VStack spacing={6}>
              <Avatar
                size="2xl"
                name={`${profile.firstname} ${profile.lastname}`}
                src={profile.profile_photo}
              />
              <Divider />
              <Box w="100%">
                <Grid templateColumns="150px 1fr" gap={2}>
                  <GridItem>
                    <Text fontWeight="bold">Nama :</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{`${profile.firstname} ${profile.lastname}`}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="bold">Email :</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{profile.email}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="bold">Telepon :</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{profile.telephone}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="bold">Alamat :</Text>
                  </GridItem>
                  <GridItem>
                    <Text>{profile.alamat}</Text>
                  </GridItem>
                  <GridItem>
                    <Text fontWeight="bold">Saldo anda :</Text>
                  </GridItem>
                  <GridItem>
                    <Text>Rp. {balance.toLocaleString('id-ID')}</Text>
                  </GridItem>
                </Grid>
              </Box>
              <Divider />
              <ProfileDrawer updateProfileState={updateProfileState} />
            </VStack>
          </Box>
        </VStack>
      </Container>
    </>
  );
}

export default Profile;
