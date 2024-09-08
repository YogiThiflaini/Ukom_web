// src/pages/Login.js
import { Center, Box, VStack } from "@chakra-ui/react";
import Navbar from "../components/navbar/Navbar";
import Card from "../components/form/card";
import SubCard from "../components/form/sub-card";
import LoginForm from "../components/form/login-form";
import { useTranslation } from "react-i18next";
import './styles.css'; // Pastikan file CSS sudah sesuai

function Login() {
  const { t } = useTranslation();

  return (
    <VStack className="loading-container">
      {/* Background Circles */}
      <div className="circle" />
      <div className="circle" />
      <div className="circle" />
      <div className="circle" />

      <Box alignSelf="start">
        <Navbar />
      </Box>
      <Center flexGrow={1} p={[4, 4, 0]} mt={[4, 8, 16]}>
        <Card>
          <SubCard
            textHoverColor="text-yellow"
            bgColor="bg-warning"
            route="/signup"
            question={t("form.loginMessage")}
            btnText="Sign Up"
          />
          <LoginForm />
        </Card>
      </Center>
    </VStack>
  );
}

export default Login;
