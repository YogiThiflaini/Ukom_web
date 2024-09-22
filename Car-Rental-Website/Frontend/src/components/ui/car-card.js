import { useEffect, useState, useRef } from "react";
import {
  Button,
  Heading,
  HStack,
  Image,
  Text,
  Box,
  Divider,
  SimpleGrid,
  GridItem,
  useToast,
  Icon,
  Badge, 
  Alert, AlertIcon, AlertTitle, AlertDescription,
} from "@chakra-ui/react";
import { FaGasPump, FaCheckCircle, FaTimesCircle, FaChair, FaStar} from "react-icons/fa"; // Ikon untuk tampilan
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import useAuthentication from "../../useAuthentication";
import ReviewButton from "./ReviewButton"; // Modal untuk komentar
import ManualIcon from "./manual.png"; // Modal untuk komentar
import AutomaticIcon from "./metic.png"; // Modal untuk komentar

const CarCard = ({ props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { isLoggedIn } = useAuthentication();
  const toastIdRef = useRef();
  const [comments, setComments] = useState([]);
  const [isHovered, setIsHovered] = useState(false); // State untuk hover
  const photo1 = props.id <= 6 ? `/images/back${props.id}.webp` : props.photo1;
  const photo2 = props.id <= 6 ? `/images/front${props.id}.webp` : props.photo2;

  // Ambil komentar berdasarkan car_id ketika komponen dimount
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/cars/${props.id}/comments`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => console.error("Gagal mengambil komentar", error));
  }, [props.id]);

  const handleRentNowClick = () => {
    if (isLoggedIn) {
      navigate(`/cars/${props.id}`);
    } else {
      toastIdRef.current = toast({
        position: "top", // Menempatkan toast di bagian atas
        duration: null,  // Toast tetap ada sampai ditutup oleh pengguna
        render: () => (
          <Alert status="warning" variant="solid">
            <AlertIcon />
            <Box>
              <AlertTitle>Anda belum login!</AlertTitle>
              <AlertDescription>Silakan login untuk melanjutkan: </AlertDescription>
            </Box>
            <Button
              colorScheme="red"
              size="sm"
              ml={4}
              onClick={() => {
                toast.closeAll();
              }}
            >
              Kembali
            </Button>
            <Button
              colorScheme="blue"
              size="sm"
              ml={4}
              onClick={() => {
                toast.closeAll();
                navigate("/login");
              }}
            >
              Login
            </Button>
          </Alert>
        ),
      });
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      w="100%"
      onMouseEnter={() => setIsHovered(true)} // Set state hover
      onMouseLeave={() => setIsHovered(false)} // Reset state hover
      position="relative"
    >
      <Box position="relative">
        {/* Ganti gambar saat hover */}
        <Image
          src={isHovered ? photo1 : photo2} // Tampilkan photo1 saat hover
          alt={`${props.brand} ${props.model}`}
          w="370px"
          h="250px"
          objectFit="cover"
          transition="1.0s ease" // Tambahkan transisi untuk efek halus
        />
        {/* Label Direkomendasikan */}
        {props.recommended && (
          <Box
            position="absolute"
            top="10px"
            right="10px"
            bg="blue.500"
            color="white"
            px={3}
            py={1}
            borderRadius="md"
            fontSize="sm"
            fontWeight="bold"
            zIndex={1}
          >
            <HStack>
            <FaStar color="yellow"/>
            <Text>Rekomendasi</Text>
            </HStack>
          </Box>
        )}
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          bgGradient="linear(to-b, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0))"
          display="flex"
          alignItems="flex-end"
          justifyContent="space-between"
          p={4}
          color="white"
        >
          <Heading size="lg" fontWeight="600"textShadow="2px 2px 4px rgba(0, 0, 0, 0.7)">
            {props.brand} {props.model}
          </Heading>
          <Text fontSize="sm" fontWeight="bold" textShadow="2px 2px 4px rgba(0, 0, 0, 0.7)">
            Rp. {props.price.toLocaleString("id-ID")} {t("carCard.perDay")}
          </Text>
        </Box>
      </Box>

      <Box p={6}>
        {/* Tombol untuk menyewa dan ulasan */}
        <HStack justify="space-between" mb={4}>
          <Button
            colorScheme="teal"
            onClick={handleRentNowClick}
            isDisabled={props.available === 0}
            w="full"
            _hover={{ bg: "green.400", color: "white" }} // Efek hover
          >
            {props.available === 1
              ? t("carCard.rentNow")
              : t("carCard.notAvailable")}
          </Button>
          <ReviewButton
            comments={comments}
            carId={props.id}
            _hover={{ bg: "gray.500", color: "white" }} // Efek hover untuk tombol Komentar
          />
        </HStack>

        <Divider />

        {/* Informasi mobil dengan ikon */}
        <SimpleGrid columns={4} spacing={2} py={4} textAlign="center">
        <GridItem>
          <Image
            src={props.gearbox === "automatic" ? AutomaticIcon : ManualIcon}
            alt={props.gearbox === "automatic" ? "Automatic Gearbox" : "Manual Gearbox"}
            boxSize={5}
            ml={6}
          />
          <Text mt={2} fontWeight="500">
            {props.gearbox === "automatic" || props.gearbox === "manual"
              ? t(`carCard.${props.gearbox.toLowerCase()}`)
              : props.gearbox}
          </Text>
        </GridItem>
          <GridItem>
            <Icon as={FaGasPump} color="gray.500" boxSize={5} />
            <Text mt={2} fontWeight="500">
              {props.fuel_type === "petrol" || props.fuel_type === "diesel"
                ? t(`carCard.${props.fuel_type.toLowerCase()}`)
                : props.fuel_type}
            </Text>
          </GridItem>
          <GridItem>
            <Icon as={FaChair} color="gray.500" boxSize={5} />
            <Text mt={2} fontWeight="500">
              {props.kursi} kursi
            </Text>
          </GridItem>
          <GridItem>
            {props.available ?(
            <Icon
              as={FaCheckCircle}
              color={"green.400"}
              boxSize={5}
            />
          ):(
            <Icon
              as={FaTimesCircle}
              color={"red.400"}
              boxSize={5}
            />
            )}
            <Text mt={2} fontWeight="500">
              {props.available === 1 ? t("carCard.yes") : t("carCard.no")}
            </Text>
          </GridItem>
          
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default CarCard;
