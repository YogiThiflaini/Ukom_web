import { Box, Flex, Hide, Image } from "@chakra-ui/react";

const HomePageImage = () => {
  return (
    <Hide below="md">
      <Flex w={["50%", "50%", "70%"]} alignItems="center" position="relative">
        <Box
          position="absolute"
          alignItems="center"
          borderRadius="2xl"
          bg= "linear-gradient(135deg, #FF69B4, #FFA500, #8A2BE2)"
          top={0}
          bottom={0}
          mx={"10"}
          w="90%"
          minW={"600px"}
        ></Box>
        <Image
          src="/images/mobil_home.png"
          top="20vh"
          left="-70px"
          position="absolute"
          minW={"750px"}
        />
      </Flex>
    </Hide>
  );
};

export default HomePageImage;
