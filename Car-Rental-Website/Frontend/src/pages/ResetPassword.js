// src/pages/ResetPassword.js
import { Center, Box, VStack } from "@chakra-ui/react";
import Navbar from "../components/navbar/Navbar";
import Card from "../components/form/card";
import SubCard from "../components/form/sub-card";
import PasswordForm from "../components/form/password-form";
import { useTranslation } from "react-i18next";
import './styles.css'; 

function ResetPassword() {
  const { t } = useTranslation();

  return (
    <VStack className="loading-container" style={{overflowY: 'auto' }}>
      {/* Gelembung Animasi sebagai background */}
      {[...Array(300)].map((_, i) => {
        const size = Math.random() * 50 + 10; // Ukuran acak
        return (
          <div
            key={i}
            className="bubble"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${Math.random() * 100}%`, // Posisi acak
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 5}s`, // Durasi acak
              animationDelay: `${Math.random() * -10}s`, // Delay acak
              '--x-dir': `${(Math.random() * 2 - 1) * 100}vw`, // Arah acak
              '--y-dir': `${(Math.random() * 2 - 1) * 100}vh`,
              '--scale': Math.random() * 1.5 + 0.5, // Skala acak
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 80%)` // Warna acak
            }}
          />
        );
      })}
      
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
