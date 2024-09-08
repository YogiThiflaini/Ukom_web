// src/pages/ResetPassword.js
import { Center, Box, VStack } from "@chakra-ui/react";
import Navbar from "../components/navbar/Navbar";
import Card from "../components/form/card";
import SubCard from "../components/form/sub-card";
import PasswordForm from "../components/form/password-form";
import { useTranslation } from "react-i18next";

function ResetPassword() {
  const { t } = useTranslation();

  return (
    <VStack h="100vh">
      <Box alignSelf="start">
        <Navbar />
      </Box>
      <Center flexGrow={1} p={[4, 4, 0]} mt={[4, 8, 16]}>
        <Card>
          <SubCard
            textHoverColor="text-yellow"
            bgColor="bg-warning"
            route="/signup"
            question="Ingat Password"
            btnText="Sign Up"
          />
          <PasswordForm />
        </Card>
      </Center>
    </VStack>
  );
}

export default ResetPassword;
