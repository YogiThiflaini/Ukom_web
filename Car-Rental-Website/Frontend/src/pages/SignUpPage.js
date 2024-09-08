import { VStack, Box, Center } from "@chakra-ui/react";
import Navbar from "../components/navbar/Navbar";
import Card from "../components/form/card";
import SubCard from "../components/form/sub-card";
import SignUpForm from "../components/form/signup-form";
import { useTranslation } from "react-i18next";
import './styles.css'

function SignUp() {
  const { t } = useTranslation();
  return (
    <VStack h="120vh">
       <div className="circle" />
      <div className="circle" />
      <div className="circle" />
      <div className="circle" />
      <Box alignSelf="start">
        <Navbar />
      </Box>
      <Center flexGrow={1} p={4}>
        <Card>
          <SubCard
            textHoverColor="text-red"
            bgColor="bg-danger"
            route="/login"
            question={t("form.signupMessage")}
            btnText="Log In"
          />
          <SignUpForm />
        </Card>
      </Center>
    </VStack>
  );
}

export default SignUp;
