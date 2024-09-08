import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  Image,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  return (
    <Box
      bg={"gray.200"}
      color={"gray.700"}
      borderTopWidth={1}
      borderStyle={"solid"}
      borderColor={"gray.300"}
    >
      <Container as={Stack} maxW={"4xl"} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={18}>
      
          <Stack >
            <ListHeader>Tentang Kami</ListHeader>
            <Link href={"#"}>{t("Alamat")}: Jl. Rajawali, Punggul, Gedangan</Link>
            <Link href={"#"}>{t("Email")}: yogithiflaini@gmail.com</Link>
            <Link href={"#"}>{t("Kontak")}: 081332122510</Link>
          </Stack>

          <Stack >
            <ListHeader>installApp</ListHeader>
            <Image
              src="images/appstore.png"
              alt="Download on the App Store"
              boxSize="130px"
              height="100%"
              objectFit="contain"
            />
            <Image
              src="images/playstore.png"
              alt="Get it on Google Play"
              boxSize="130px"
              height="100%"
              objectFit="contain"
            />
          </Stack>
        </SimpleGrid>
      </Container>
      <Container
        bg={"gray.200"}
        minW={"full"}
        maxW={"6xl"}
        py={8}
        align={"center"}
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={"gray.300"}
      >
        <Text>{t("footer.copyright")}</Text>
      </Container>
    </Box>
  );
};

export default Footer;