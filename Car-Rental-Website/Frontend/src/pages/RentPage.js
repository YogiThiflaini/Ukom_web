import {
  Center,
  FormLabel,
  Input,
  HStack,
  Box,
  Button,
  Image,
  VStack,
  Text,
  Heading,
  Spacer,
  Stack,
  SimpleGrid,
  GridItem,
  Divider,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Checkbox,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/navbar/Navbar";
import AvatarMenu from "../components/navbar/avatar-menu";
import HomeSidebarContent from "../components/home/home-sidebar-content";
import NavbarLinks from "../components/navbar/NavbarLinks";
import { AuthContext } from "../AuthContext";

function Rent() {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const navigate = (route) => navigation(route);
  let params = useParams();
  const toast = useToast();
  const [car, setCar] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmRent, setConfirmRent] = useState(null);
  const [isResponsible, setIsResponsible] = useState(false);

  const rentalDate = useRef("");
  const returnDate = useRef("");
  const cancelRef = useRef();

  // const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/cars/${params.id}`)
      .then((response) => {
        setCar(response.data.data[0]);
      });
  }, [params.id]);

  useEffect(() => {
    calculatePrice();
  }, []);

  const calculatePrice = () => {
    const rental_date = Date.parse(rentalDate.current.value);
    const return_date = Date.parse(returnDate.current.value);
    const now = new Date().getTime();

    if (rental_date < now || return_date < now || return_date < rental_date) {
      setTotalPrice(0);
    } else {
      const rentDuration = (return_date - rental_date) / (1000 * 60 * 60 * 24);

      if (rentDuration === 0) {
        setTotalPrice(car.price);
      } else {
        const price = rentDuration * car.price;
        setTotalPrice(price);
      }
    }
  };

  const handleRentalDateChange = () => calculatePrice();
  const handleReturnDateChange = () => calculatePrice();

  const handleRentConfirmation = () => {
    setIsDialogOpen(true);
  };

  const rentACar = () => {
    const rental_date = Date.parse(rentalDate.current.value);
    const return_date = Date.parse(returnDate.current.value);
    const now = new Date().getTime();
    const rentDuration = return_date - rental_date;

    if (rental_date < now || return_date < now) {
      toast({
        title: "Tanggal sewa atau kembali tidak valid",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (rentDuration < 0) {
      toast({
        title: "Tanggal sewa harus sebelum tanggal kembali",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      let price;
      if (rentDuration === 0) {
        price = car.price;
      } else {
        price = (rentDuration / (1000 * 60 * 60 * 24)) * car.price;
      }

      const rent = {
        rental_date: rentalDate.current.value,
        return_date: returnDate.current.value,
        price: price,
        user_id: localStorage.getItem("id"),
        car_id: params.id,
      };

      axios
        .post("http://127.0.0.1:8000/api/rents", rent)
        .then(() => {
          toast({
            title: "Rental berhasil dibuat!",
            description: "Penyewaan mobil Anda telah berhasil.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          navigate("/cars");
        })
        .catch((error) => {
          toast({
            title: "Rental gagal dibuat",
            description: "Tanggal sewa harus diisi!!",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          console.error("Error creating rent:", error);
        });
    }
  };

  return (
    <>
      <Navbar
        sidebarContent={<HomeSidebarContent />}
        links={<NavbarLinks />}
        buttons={<AvatarMenu />}
      />
      <Center h={"100vh"} m={["5%", "10%", "12%", "13%", "0%"]}>
        <Stack
          direction={{ base: "column", lg: "row" }}
          boxShadow="2xl"
          h={"auto"}
          w={"80%"}
          borderRadius="15px"
          overflow={"hidden"}
        >
          <Box w={{ base: "100%", lg: "50%" }}>
            <Image src={car.photo2} objectFit="cover" h={"full"}></Image>
          </Box>
          <Box w={{ base: "100%", lg: "50%" }} p={"5%"} bg={"white"} h={"full"}>
            <VStack alignItems={"center"} spacing={"3"}>
              <Heading fontWeight={"500"}>{car.brand}</Heading>

              <FormLabel fontWeight="600" color="gray.600">
                {t("profile.rentalDate")}
              </FormLabel>
              <Input
                type={"date"}
                ref={rentalDate}
                onChange={handleRentalDateChange}
              />
              <FormLabel fontWeight="600" color="gray.600">
                {t("profile.returnDate")}
              </FormLabel>
              <Input
                type={"date"}
                ref={returnDate}
                onChange={handleReturnDateChange}
              />

              <Divider borderColor="gray.300" py={3} />
              <SimpleGrid w={"full"} columns={3} py={3} textAlign="center">
                <GridItem>
                  <Heading fontWeight="500" color="gray.400" size="xs">
                    {t("profile.gearbox")}
                  </Heading>
                  <Text fontWeight="600" color="gray.600">
                    {car.gearbox === "automatic" || car.gearbox === "manual"
                      ? t(`carCard.${car.gearbox.toLowerCase()}`)
                      : car.gearbox}
                  </Text>
                </GridItem>
                <GridItem>
                  <Heading fontWeight="500" color="gray.400" size="xs">
                    {t("profile.type")}
                  </Heading>
                  <Text fontWeight="600" color="gray.600">
                    {car.fuel_type === "petrol" || car.fuel_type === "diesel"
                      ? t(`carCard.${car.fuel_type.toLowerCase()}`)
                      : car.fuel_type}
                  </Text>
                </GridItem>
                <GridItem>
                  <Heading fontWeight="500" color="gray.400" size="xs">
                    {t("carCard.available")}
                  </Heading>
                  <Text fontWeight="600" color="gray.600">
                    {car.available === 1
                      ? t("carCard.yes")
                      : car.available === 0
                      ? t("carCard.no")
                      : car.available}
                  </Text>
                </GridItem>
              </SimpleGrid>
              <Divider borderColor="gray.300" py={0} />

              <HStack w={"full"} justify={"space-between"}>
                <Text fontWeight="600" color="gray.600">
                  Total
                </Text>
                <Spacer />
                <Text
                  color="gray.600"
                  fontSize="2xl"
                  fontWeight={["bold", "extrabold"]}
                >
                  RP. {totalPrice.toLocaleString('id-ID')}
                </Text>
              </HStack>
              <Button onClick={handleRentConfirmation} w={"full"}>
                {t("carCard.confirmRent")}
              </Button>
            </VStack>
          </Box>
        </Stack>
      </Center>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("confirmRent.title")}
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text mb={4}>{t("confirmRent.message")}</Text>
              <Checkbox
                isChecked={isResponsible}
                onChange={(e) => setIsResponsible(e.target.checked)}
              >
                {t("confirmRent.responsibility")}
              </Checkbox>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                {t("confirmRent.cancel")}
              </Button>
              <Button
                colorScheme="teal"
                onClick={() => {
                  if (isResponsible) {
                    setIsDialogOpen(false);
                    rentACar();
                  } else {
                    toast({
                      title: "Anda harus menyetujui tanggung jawab.",
                      status: "warning",
                      duration: 5000,
                      isClosable: true,
                    });
                  }
                }}
                ml={3}
              >
                {t("confirmRent.confirm")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default Rent;
