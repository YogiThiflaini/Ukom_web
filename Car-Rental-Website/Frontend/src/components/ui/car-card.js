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
  IconButton,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import useAuthentication from "../../useAuthentication";
import ReviewButton from "./ReviewButton"; // Mengimpor modal untuk komentar

const CarCard = ({ props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { isLoggedIn } = useAuthentication();
  const toastIdRef = useRef();
  const [comments, setComments] = useState([]);
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
        title: "Anda belum login",
        description: "Silakan login untuk melanjutkan.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="vehicle-card">
      <div className="details">
      <div className="thumb-gallery">
          <Box bg="gray.400" w="full" h="full">
            <Image
              className="first"
              objectFit="cover"
              h={"215px"}
              w={"full"}
              src={photo1}
            />
            <Image
              className="second"
              objectFit="cover"
              h={"215px"}
              w={"full"}
              src={photo2}
            />
          </Box>
        </div>

        <Box p={4}>
          <HStack alignItems="baseline" spacing={"auto"}>
            <Heading size={"md"} fontWeight="600">
              {props.brand}
            </Heading>
            <Heading size={"sm"} fontWeight="600">
              {props.model}
            </Heading>
          </HStack>
          <HStack py={3}>
            <Heading size={"md"} fontWeight="600" color="gray.600">
              Rp. {props.price.toLocaleString("id-ID")}
            </Heading>
            <Text color="gray.400">{t("carCard.perDay")}</Text>
          </HStack>

          <HStack py={2}>
            <Button
              w="full"
              onClick={handleRentNowClick}
              isDisabled={props.available === 0}
            >
              {props.available === 1
                ? t("carCard.rentNow")
                : t("carCard.notAvailable")}
            </Button>

            {/* Tombol Komentar, yang sekarang terpisah di komponen lain */}
            <ReviewButton comments={comments} carId={props.id} />
          </HStack>

          <Divider borderColor="gray.300" py={3} />

          <SimpleGrid columns={3} py={4} textAlign="center">
            <GridItem>
              <Heading fontWeight="400" color="gray.400" size="xs">
                {t("carCard.gearbox")}
              </Heading>
              <Text fontWeight="500" color="gray.600">
                {props.gearbox === "automatic" || props.gearbox === "manual"
                  ? t(`carCard.${props.gearbox.toLowerCase()}`)
                  : props.gearbox}
              </Text>
            </GridItem>
            <GridItem>
              <Heading fontWeight="400" color="gray.400" size="xs">
                {t("carCard.type")}
              </Heading>
              <Text fontWeight="500" color="gray.600">
                {props.fuel_type === "petrol" || props.fuel_type === "diesel"
                  ? t(`carCard.${props.fuel_type.toLowerCase()}`)
                  : props.fuel_type}
              </Text>
            </GridItem>
            <GridItem>
              <Heading fontWeight="400" color="gray.400" size="xs">
                {t("carCard.available")}
              </Heading>
              <Text fontWeight="500" color="gray.600">
                {props.available === 1
                  ? t("carCard.yes")
                  : props.available === 0
                  ? t("carCard.no")
                  : props.available}
              </Text>
            </GridItem>
          </SimpleGrid>

          <Divider borderColor="gray.300" py={0} />
        </Box>
      </div>
    </div>
  );
};

export default CarCard;
