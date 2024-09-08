import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Select,
  Text,
  useToast,
  Center,
  Container,
  Image,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const TopUpForm = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardSerial, setCardSerial] = useState("");
  const [bankName, setBankName] = useState("");
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [token, setToken] = useState("");
  const [approvalStatus, setApprovalStatus] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      setUserId(id);
    } else {
      toast({
        title: "Error!",
        description: "User ID tidak ditemukan. Silakan login terlebih dahulu.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  const handleTopUp = (e) => {
    e.preventDefault();

    if (!userId) {
      toast({
        title: "Error!",
        description: "User ID tidak ditemukan.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (paymentMethod === "Credit Card" && cardSerial.length < 12) {
      toast({
        title: "Error!",
        description: "Nomor kartu harus terdiri dari minimal 12 angka.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/payment", {
        user_id: userId,
        jumlah_saldo: amount,
        metode_pembayaran: paymentMethod,
        card_serial: cardSerial,
        nama_bank: bankName,
      })
      .then((response) => {
        setShowTokenForm(true);
        setApprovalStatus(response.data.data.admin_approval === 1);
      })
      .catch((error) => {
        toast({
          title: "Error!",
          description: "Gagal melakukan top-up.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleTokenVerification = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/verify-token", { token })
      .then((response) => {
        if (response.data.message === 'Token berhasil diverifikasi') {
          toast({
            title: "Success!",
            description: "Token berhasil diverifikasi, menunggu persetujuan admin.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setShowTokenForm(false);
          navigate('/profile');
        } else {
          toast({
            title: "Error!",
            description: "Token tidak valid atau saldo gagal diverifikasi.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch(() => {
        toast({
          title: "Error!",
          description: "Token tidak valid atau saldo gagal diverifikasi.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <Container maxW="md" bg="white" p={6} rounded="md" shadow="md">
        <Text fontSize="2xl" mb={4} textAlign="center">
          {showTokenForm ? "Verifikasi Token" : "Top-Up Saldo"}
        </Text>
        {!showTokenForm ? (
          <form onSubmit={handleTopUp}>
            <Stack spacing={4}>
              <FormControl mb={4} isRequired>
                <FormLabel>Jumlah Saldo</FormLabel>
                <Select
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Pilih jumlah saldo"
                >
                  <option value="10000">Rp 10.000</option>
                  <option value="20000">Rp 20.000</option>
                  <option value="50000">Rp 50.000</option>
                  <option value="100000">Rp 100.000</option>
                  <option value="500000">Rp 500.000</option>
                  <option value="1000000">Rp 1.000.000</option>
                  <option value="1500000">Rp 1.500.000</option>
                  <option value="2000000">Rp 2.000.000</option>
                  <option value="5000000">Rp 5.000.000</option>
                </Select>
              </FormControl>

              <FormControl mb={4} isRequired>
                <FormLabel>Metode Pembayaran</FormLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  placeholder="Pilih metode pembayaran"
                >
                  <option value="Credit Card">Kartu Kredit</option>
                  <option value="Bank Transfer">Transfer Bank</option>
                </Select>
              </FormControl>

              {paymentMethod === "Credit Card" && (
                <FormControl mb={4} isRequired>
                  <FormLabel>Nomor Kartu</FormLabel>
                  <Input
                    type="text"
                    value={cardSerial}
                    onChange={(e) => setCardSerial(e.target.value)}
                    placeholder="Masukkan nomor kartu"
                  />
                </FormControl>
              )}

              {paymentMethod === "Bank Transfer" && (
                <FormControl mb={4}>
                  <FormLabel>Nama Bank</FormLabel>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      {bankName || "Pilih nama bank"}
                    </MenuButton>
                    <MenuList>
                      {banks.map((bank) => (
                        <MenuItem key={bank.value} onClick={() => setBankName(bank.value)}>
                          <Image src={bank.img} alt={bank.label} boxSize="20px" mr="10px" />
                          {bank.label}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </FormControl>
              )}

              <Button colorScheme="blue" type="submit" width="full">
                Top-Up Saldo
              </Button>
            </Stack>
          </form>
        ) : (
          <form onSubmit={handleTokenVerification}>
            <Stack spacing={4}>
              <FormControl mb={4} isRequired>
                <FormLabel>Token</FormLabel>
                <Input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Masukkan token"
                />
              </FormControl>

              <Button colorScheme="blue" type="submit" width="full">
                Verifikasi Token
              </Button>

              {approvalStatus && (
                <Text color="green.500" textAlign="center">
                  Top-up sudah disetujui.
                </Text>
              )}
            </Stack>
          </form>
        )}
      </Container>
    </Center>
  );
};

const banks = [
  { value: "BRI", label: "Bank Rakyat Indonesia (BRI)", img: "/images/banks/bri.jpg" },
  { value: "BCA", label: "Bank Central Asia (BCA)", img: "/images/banks/bca.jpg" },
  { value: "BNI", label: "Bank Negara Indonesia (BNI)", img: "/images/banks/bni.jpg" },
  { value: "Mandiri", label: "Bank Mandiri", img: "/images/banks/mandiri.jpg" },
  { value: "CIMB Niaga", label: "Bank CIMB Niaga", img: "/images/banks/cimb.jpg" },
  { value: "Permata", label: "Bank Permata", img: "/images/banks/permata.jpg" },
  { value: "Syariah Indonesia", label: "Bank Syariah Indonesia", img: "/images/banks/bsi.jpg" },
  { value: "Tabungan Negara", label: "Bank Tabungan Negara (BTN)", img: "/images/banks/btn.jpg" },
  { value: "Mega", label: "Bank Mega", img: "/images/banks/mega.jpg" },
];

export default TopUpForm;
