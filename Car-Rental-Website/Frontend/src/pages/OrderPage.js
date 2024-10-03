import {
  Box,
  Container,
  HStack,
  TableContainer,
  Thead,
  Table,
  Tr,
  Th,
  Td,
  Tbody,
  VStack,
  Heading,
  Spacer,
  Divider,
  Text,
  Button,
  useToast,
  Input,
  Image,
  FormControl,
  FormLabel,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Select,
} from "@chakra-ui/react";
import ProfileDrawer from "../components/ui/profile-drawer";
import HomeSidebarContent from "../components/home/home-sidebar-content";
import NavbarLinks from "../components/navbar/NavbarLinks";
import AvatarMenu from "../components/navbar/avatar-menu";
import Navbar from "../components/navbar/Navbar";
import axios from "axios";
import React,{ useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Footer from '../components/footer.js'

function Order() {
  const { t } = useTranslation();
  const user_id = localStorage.getItem("id");
  const [rents, setRents] = useState([]);
  const [balance, setBalance] = useState(0);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isTopUpConfirmOpen, setIsTopUpConfirmOpen] = useState(false);
  const [isPaymentConfirmOpen, setIsPaymentConfirmOpen] = useState(false);
  const [isFullyPaid, setIsFullyPaid] = useState(false); // State for fully paid popup
  const [selectedRentId, setSelectedRentId] = useState(null);
  const [topUpAmountToConfirm, setTopUpAmountToConfirm] = useState('');
  const [paymentRentId, setPaymentRentId] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();
  const navigation = useNavigate();
  const navigate = (route) => navigation(route);
  const [statusFilter, setStatusFilter] = useState("");
  const [returnedFilter, setReturnedFilter] = useState("");
  const [data, setData] = useState([]);
  const [topUpHistory, setTopUpHistory] = useState([]);
  const [isTopUpHistoryOpen, setIsTopUpHistoryOpen] = useState(false);

  const [isTokenPopupOpen, setIsTokenPopupOpen] = useState(false);
const [token, setToken] = useState('');
const [activeFilter, setActiveFilter] = useState('all');
 
  const handleTokenSubmit = () => {
  axios.post(`http://127.0.0.1:8000/api/users/${user_id}/validate-topup-token`, { token })
    .then((response) => {
      toast({
        title: "Token valid",
        description: "Token valid. Anda dapat melanjutkan top-up.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsTokenPopupOpen(false);
      setIsTopUpConfirmOpen(true); // Buka popup top-up
    })
    .catch((error) => {
      toast({
        title: "Token tidak valid",
        description: error.response?.data?.message || "Token tidak valid atau sudah kadaluarsa.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });
};

useEffect(()=>{
  axios
  .get(`http://127.0.0.1:8000/api/users/${user_id}`)
  .then((response) => {
    setBalance(response.data.data.saldo_dana || 0);
    // console.log(balance);
  }
        )
        
      }, [])
      
      const [originalRents, setOriginalRents] = useState([]); 
      useEffect(() => {
        if (user_id) {
          axios
        .get(`http://127.0.0.1:8000/api/users/${user_id}/rents`)
        .then((response) => {
          setOriginalRents(response.data.data); // Simpan data asli
          setRents(response.data.data); // Tampilkan data asli awalnya
        })
        .catch((error) => {
          console.error("Gagal untuk mengambil data", error);
        });
      }
    }, [user_id]);
    
    // Handle filter agar hanya satu yang aktif pada satu waktu
    const handleFilter = (filterType) => {
      let filteredRents = originalRents; // Selalu mulai dengan data asli
      setActiveFilter(filterType);
    
    switch (filterType) {
      case 'notPaidOrNotReturned':
        filteredRents = originalRents.filter(
          (rent) => rent.status !== 'lunas' || rent.returned !== 'sudah_kembali'
        ).filter(
          (rent) => rent.cancel !== 1 // Tambahkan filter untuk memastikan rental dengan cancel=1 tidak termasuk
        );
        break;
      case 'paidAndReturned':
        filteredRents = originalRents.filter(
          (rent) => rent.status === 'lunas' && rent.returned === 'sudah_kembali'
        );
        break;
      case 'cancelled':
        filteredRents = originalRents.filter((rent) => rent.cancel === 1);
        break;
        default:
          // Jika filter 'all' atau default, tampilkan semua data
          filteredRents = originalRents;
    }
    
    setRents(filteredRents); // Update data yang sedang ditampilkan
  };  
  
  const handleTopUp = () =>{
    setIsTopUpConfirmOpen(true)
  }

  // const handleTopUp = () => {
  //   axios.post(`http://127.0.0.1:8000/api/users/${user_id}/send-topup-token`)
  //     .then((response) => {
  //       toast({
  //         title: "Token terkirim",
  //         description: "Token verifikasi telah dikirim ke email Anda.",
  //         status: "success",
  //         duration: 5000,
  //         isClosable: true,
  //       });
  //       setIsTokenPopupOpen(true); // Buka popup untuk masukkan token
  //     })
  //     .catch((error) => {
  //       toast({
  //         title: "Gagal mengirim token",
  //         description: error.response?.data?.message || "Terjadi kesalahan saat mengirim token.",
  //         status: "error",
  //         duration: 5000,
  //         isClosable: true,
  //       });
  //     });
  // };
  

  const [amount, setAmount] = useState(0);

  // const user_id = localStorage.getItem('id');
  const handleTopUps = () => {
    if (amount < 10000) {
      toast({
        title: "Saldo tidak mencukupi",
        description: "Saldo yang dimasukkan minimal Rp 10.000 untuk melanjutkan pembayaran.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return; // Menghentikan proses jika saldo kurang dari atau sama dengan 10.000
    }else{
      axios.post(`http://localhost:8000/api/users/${user_id}/update-balance`, { amount })
        .then(response => {
          const snapToken = response.data.snapToken;
          setIsTopUpConfirmOpen(false);
    
          window.snap.pay(snapToken, {
            onSuccess: function(result) {
              // Jika pembayaran berhasil, panggil API untuk memperbarui saldo
              axios.post(`http://localhost:8000/api/users/${user_id}/confirm-topup`, { amount })
                .then(() => {
                  alert("Top-up berhasil!");
                  window.location.reload();
                })
                .catch(error => {
                  console.error("Gagal memperbarui saldo:", error);
                  alert("Terjadi kesalahan saat memperbarui saldo.");
                });
            },
            onPending: function(result) {
              alert("Menunggu pembayaran!");
            },
            onError: function(result) {
              alert("Pembayaran gagal!");
            }
          });
        })
        .catch(error => {
          console.error("Terjadi kesalahan saat top-up:", error);
        });
    }
  };  

  const handlePayment = (rentId) => {
    setPaymentRentId(rentId);
    setIsPaymentConfirmOpen(true);
  };

  const confirmPayment = () => {
    if (paymentAmount < 10000) {
      toast({
        title: "Saldo tidak mencukupi",
        description: "Saldo yang dimasukkan minimal Rp 10.000 untuk melanjutkan pembayaran.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return; // Menghentikan proses jika saldo kurang dari atau sama dengan 10.000
    } else{
      if (user_id && paymentRentId && paymentAmount) {
        const rent = rents.find(r => r.id === paymentRentId);
        if (rent) {
          const amountToPay = Math.min(parseFloat(paymentAmount), rent.price);
          const remainingBalance = balance - amountToPay;
    
          if (amountToPay <= balance) {
            axios
              .post(`http://127.0.0.1:8000/api/rents/${paymentRentId}/pay`, { amount: amountToPay })
              .then((response) => {
                console.log("Response after balance update:", response);
                setRents((prevRents) => prevRents.map(rent => rent.id === paymentRentId ? { ...rent, pays: amountToPay } : rent));
                setBalance(response.data.balance || 0);
                toast({
                  title: "Pembayaran berhasil",
                  description: "Pembayaran telah berhasil diproses.",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                setPaymentAmount('');
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              })
              .catch((error) => {
                console.error("Gagal untuk melakukan pembayaran atau memperbarui saldo", error);
                toast({
                  title: "Gagal melakukan pembayaran",
                  description: "Tidak bisa melakukan pembayaran atau memperbarui saldo. Silahkan coba lagi nanti",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                });
              })
              .finally(() => {
                setIsPaymentConfirmOpen(false);
                setPaymentRentId(null);
                if (amountToPay >= rent.price) {
                  setIsFullyPaid(true); // Show fully paid popup
                }
              });
          } else {
            toast({
              title: "Pembayaran gagal",
              description: "Jumlah pembayaran melebihi saldo.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        }
      }
    }
  };
  
  function ConfirmPaymentPopup({ isOpen, onClose, onConfirm }) {
    const cancelRef = React.useRef();
  
    return (
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Konfirmasi Pembayaran
            </AlertDialogHeader>
  
            <AlertDialogBody>
              Apakah Anda yakin ingin membayar semua tagihan yang belum lunas? Saldo dana Anda akan dikurangi sebesar total tagihan.
              <Text mt={2} color="red.500">
              Total pembayaran adalah sebesar : Rp. {
                rents
                  .filter(rent => rent.cancel !== 1) // Hanya termasuk rental yang cancel tidak sama dengan 1
                  .reduce((totalPrice, rent) => totalPrice + rent.price, 0) -
                rents
                  .filter(rent => rent.cancel !== 1) // Hanya termasuk rental yang cancel tidak sama dengan 1
                  .reduce((totalPays, rent) => totalPays + (rent.pays || 0), 0)
              }
              </Text>
            </AlertDialogBody>
  
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Batal
              </Button>
              <Button colorScheme="purple" onClick={onConfirm} ml={3}>
                Konfirmasi
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  }

  const handleShowTopUpHistory = () => {
    axios
      .get(`http://127.0.0.1:8000/api/topups/user/${user_id}`)
      .then((response) => {
        setTopUpHistory(response.data);
        setIsTopUpHistoryOpen(true);
      })
      .catch((error) => {
        console.error("Gagal untuk mengambil riwayat top-up", error);
        toast({
          title: "Gagal mengambil riwayat",
          description: "Tidak bisa mengambil riwayat top-up. Silahkan coba lagi nanti",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }

  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

    const handlePayAll = () => {
      const unpaidRents = rents.filter(rent => rent.status !== 'lunas' && rent.cancel !== 1);
      const totalAmountToPay = unpaidRents.reduce((total, rent) => total + (rent.price - rent.pays), 0);
      
      handleClosePopup();

      if (totalAmountToPay > balance) {
        toast({
          title: "Saldo Tidak Cukup",
          description: "Jumlah total yang harus dibayar melebihi saldo saat ini.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      else if (totalAmountToPay === 0) { // Perbaikan operator perbandingan
        toast({
          title: "Tidak ada pembayaran",
          description: "Tidak ada rental yang dibayar saat ini.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    
      handleClosePopup(); 
    
      axios
        .post(`http://127.0.0.1:8000/api/rents/pay-all`, { user_id, unpaidRents })
        .then((response) => {
          setRents(response.data.updatedRents);
          setBalance(response.data.newBalance);
          toast({
            title: "Pembayaran Berhasil",
            description: "Semua pembayaran telah berhasil diproses.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          // setTimeout(() => {
          //   window.location.reload();
          // }, 3000);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Gagal untuk melakukan pembayaran", error);
          toast({
            title: "Pembayaran Gagal",
            description: "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi nanti.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    };    
  

  const handleCancelClick = (rentId) => {
    setSelectedRentId(rentId);
    setIsAlertOpen(true);
  };

  const handleCancel = () => {
    if (selectedRentId !== null) {
      axios
        .put(`http://127.0.0.1:8000/api/rents/${selectedRentId}/cancel`) // Mengganti DELETE dengan PUT
        .then(() => {
          setRents((prevRents) =>
            prevRents.map((rent) =>
              rent.id === selectedRentId ? { ...rent, cancel: 1 } : rent
            )
          );
          toast({
            title: "Order dibatalkan.",
            description: "Order telah berhasil dibatalkan.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((error) => {
          console.error("Gagal untuk membatalkan pesanan", error);
          toast({
            title: "Gagal membatalkan.",
            description: "Tidak bisa membatalkan order. Silahkan coba lagi nanti.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        })
        .finally(() => {
          setIsAlertOpen(false);
          setSelectedRentId(null);
        });
    }
  };  
  const no = 0; 
  
  const TopUpHistoryPopup = ({ isOpen, onClose, topUpHistory, no }) => (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Riwayat Top-Up
          </AlertDialogHeader>
          <AlertDialogBody>
            {topUpHistory.length === 0 ? (
              <p>Anda belum pernah melakukan top-up.</p>
            ) : (
              <TableContainer
              style={{
                maxHeight: "300px", // Batasi tinggi container agar muncul scroll saat data lebih dari 4
                overflowY: "auto", // Aktifkan scroll secara vertikal
              }}
              >
                <Table variant="striped" size="md">
                  <Thead>
                    <Tr>
                      <Th>No</Th>
                      <Th>Tanggal</Th>
                      <Th>Jumlah</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {topUpHistory.map((entry, no) => (
                      <Tr key={entry.id}>
                        <Td>{no + 1}</Td>
                        <Td>{entry.topup_date}</Td>
                        <Td>Rp. {entry.topup_amount.toLocaleString('id-ID')}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Tutup
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );

  return (
    <>
      <Navbar
        sidebarContent={<HomeSidebarContent />}
        links={<NavbarLinks />}
        buttons={<AvatarMenu />}
      />
      <Container h="120vh" maxW="120vw" py={20} mb={6}>
        <VStack mb={15}>
          <Box w={"90%"}>
            <HStack>
              <Heading size={["lg", "xl"]}>{t("profile.heading")}</Heading>
              <Spacer />
              {/* <ProfileDrawer /> */}
            </HStack>
            <Divider my={5} />
            <Box>
              <div style={{ display: 'flex', width: '100%' }}>
                <Button
                  onClick={() => handleFilter('all')}
                  style={{
                    flex: 1,
                    margin: '0 4px',
                    backgroundColor: activeFilter === 'all' ? 'blue' : '#d3d3d3',
                    color: activeFilter === 'all' ? 'white' : 'black'
                  }}
                >
                  Semua
                </Button>
                <Button
                  onClick={() => handleFilter('notPaidOrNotReturned')}
                  style={{
                    flex: 1,
                    margin: '0 4px',
                    backgroundColor: activeFilter === 'notPaidOrNotReturned' ? 'blue' : '#d3d3d3',
                    color: activeFilter === 'notPaidOrNotReturned' ? 'white' : 'black'
                  }}
                >
                  Proses Penyewaan
                </Button>
                <Button
                  onClick={() => handleFilter('paidAndReturned')}
                  style={{
                    flex: 1,
                    margin: '0 4px',
                    backgroundColor: activeFilter === 'paidAndReturned' ? 'blue' : '#d3d3d3',
                    color: activeFilter === 'paidAndReturned' ? 'white' : 'black'
                  }}
                >
                  Selesai
                </Button>
                <Button
                  onClick={() => handleFilter('cancelled')}
                  style={{
                    flex: 1,
                    margin: '0 4px',
                    backgroundColor: activeFilter === 'cancelled' ? 'blue' : '#d3d3d3',
                    color: activeFilter === 'cancelled' ? 'white' : 'black'
                  }}
                >
                  Dibatalkan
                </Button>
              </div>
            </Box>
            <TableContainer
              style={{
                maxHeight: "350px", // Batasi tinggi container agar muncul scroll saat data lebih dari 4
                overflowY: "auto", // Aktifkan scroll secara vertikal
              }}
            >
              <Table variant="striped" size={["md", "md", "lg"]}>
                <Thead>
                  <Tr>
                    <Th>No</Th>
                    <Th>Foto</Th>
                    <Th>{t("profile.brand")}</Th>
                    <Th>{t("profile.model")}</Th>
                    <Th>{t("profile.type")}</Th>
                    <Th>{t("profile.price")}</Th>
                    <Th>{t("profile.gearbox")}</Th>
                    <Th>{t("profile.rentalDate")}</Th>
                    <Th>{t("profile.returnDate")}</Th>
                    <Th>{t("profile.pays")}</Th>
                    <Th>{t("profile.status")}</Th>
                    <Th>{t("profile.cancelOrder")}</Th>
                    <Th>{t("profile.pay")}</Th>
                    <Th>{t("profile.returned")}</Th>
                  </Tr>
                </Thead>
                {rents.length === 0 ? (
                  <Tbody>
                    <Tr>
                      <Td colSpan={20}>
                        <Text textAlign="center">{t("profile.noData")}</Text>
                      </Td>
                    </Tr>
                  </Tbody>
                ) : (
                  <Tbody>
                    {rents.map((rent, no) => (
                      <Tr key={rent.id}>
                        <Td>{no + 1}</Td>
                        <Td>
                          <Image
                            src={`${rent.car.photo2}`}
                            alt={`Car ${rent.car.brand}`}
                            boxSize="100%" // You can adjust the size as needed
                            h={"full"}
                            objectFit="cover"
                          />
                        </Td>
                        <Td>{rent.car.brand}</Td>
                        <Td>{rent.car.model}</Td>
                        <Td>{rent.car.fuel_type}</Td>
                        <Td>Rp. {rent.price.toLocaleString('id-ID')}</Td>
                        <Td>{rent.car.gearbox}</Td>
                        <Td>{rent.rental_date}</Td>
                        <Td>{rent.return_date}</Td>
                        <Td>Rp. {rent.pays.toLocaleString('id-ID')}</Td>
                        <Td>
                          {rent.status}
                        </Td>
                        <Td>
                          {rent.pays !== 0 ? (
                            <Text fontWeight="bold" color="red.500">
                              Tidak bisa dibatalkan
                            </Text>
                          ) : rent.cancel === 0 ? (
                            <Button
                              colorScheme="red"
                              onClick={() => handleCancelClick(rent.id)}
                            >
                              {t("profile.cancel")}
                            </Button>
                          ) : (
                            <Text fontWeight="bold" color="red.800">
                              Pesanan dibatalkan
                            </Text>
                          )}
                        </Td>
                        <Td>
                          {rent.status === 'lunas' ? (
                            <Text fontWeight="bold" color="green.500">Selesai</Text>
                          ) : rent.cancel === 1 ? (
                            <Text fontWeight="bold" color="orange.500">Tidak Bayar</Text>
                          ) : (
                            <Button
                              colorScheme="teal"
                              onClick={() => handlePayment(rent.id)}
                            >
                              {t("profile.pay")}
                            </Button>
                          )}
                        </Td>
                        <Td>
                          {rent.returned}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                )}
              </Table>
            </TableContainer>
            <>
              <Button colorScheme="blue" onClick={handleOpenPopup} m={4}>
                Bayar Semua
              </Button>

              <ConfirmPaymentPopup 
                isOpen={isPopupOpen} 
                onClose={handleClosePopup} 
                onConfirm={handlePayAll} 
              />
            </>
            <HStack mt={5}>
              <Spacer />
              <FormControl>
                <Text fontSize="lg" >{t("profile.balance")}: Rp. {balance.toLocaleString('id-ID')}</Text>
                <HStack mb={6}>
                  <FormLabel >{t("profile.topUpAmount")}:</FormLabel>
                  <Button
                   mt={1} colorScheme="blue" onClick={handleTopUp}>
                    {t("profile.topUp")}
                  </Button>
                  <Button colorScheme="teal" onClick={handleShowTopUpHistory}>
                    Riwayat Top-Up
                  </Button>
                </HStack>
                <TopUpHistoryPopup 
                  isOpen={isTopUpHistoryOpen} 
                  onClose={() => setIsTopUpHistoryOpen(false)} 
                  topUpHistory={topUpHistory} 
                />
              </FormControl>
            </HStack>
          </Box>
        </VStack>
        <Footer />
      </Container>


      {/* popup untuk virifikasitoken */}
      <AlertDialog
      isOpen={isTokenPopupOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setIsTokenPopupOpen(false)}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Masukkan Token Verifikasi</AlertDialogHeader>
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Token</FormLabel>
              <Input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setIsTokenPopupOpen(false)}>
              Batal
            </Button>
            <Button colorScheme="blue" onClick={handleTokenSubmit} ml={3}>
              Konfirmasi
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>

      {/* Popup Dialog for Confirmation of Top-Up */}
      <AlertDialog
        isOpen={isTopUpConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsTopUpConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("profile.topUpConfirmation")}
            </AlertDialogHeader>
            <AlertDialogBody>
              <HStack>
                <FormLabel>Rp. </FormLabel>
                <Input
                  id="top-up-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Masukkan nilai"
                />
              </HStack>
              <Text mt={4}>{t("profile.confirmTopUpAmount")}: Rp. {amount}</Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsTopUpConfirmOpen(false)}>
                {t("profile.cancel")}
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleTopUps}
                ml={3}
              >
                {t("profile.confirm")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Popup Dialog for Payment Confirmation */}
      <AlertDialog
        isOpen={isPaymentConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsPaymentConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("profile.paymentConfirmation")}
            </AlertDialogHeader>
            <AlertDialogBody>
              <FormControl>
                <FormLabel htmlFor="payment-amount">{t("profile.paymentAmount")}:</FormLabel>
                <HStack>
                <FormLabel htmlFor="payment-amount">Rp.</FormLabel>
                <Input
                  id="payment-amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
                </HStack>
                <Text mt={2} color="red.500">
                  {t("profile.pembayaranSewaKurang")} Rp. {rents.find(rent => rent.id === paymentRentId)?.price - (rents.find(rent => rent.id === paymentRentId)?.pays || 0)}
                </Text>
              </FormControl>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsPaymentConfirmOpen(false)}>
                {t("profile.cancel")}
              </Button>
              <Button
                colorScheme="purple"
                onClick={confirmPayment}
                ml={3}
              >
                {t("profile.confirm")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Popup Dialog for Fully Paid */}
      <AlertDialog
        isOpen={isFullyPaid}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsFullyPaid(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("profile.paymentCompleted")}
            </AlertDialogHeader>
            <AlertDialogBody>
              {t("profile.paymentFullyPaid")}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsFullyPaid(false)}>
                {t("profile.close")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("profile.cancelOrder")}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t("profile.confirmCancelOrder")}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                {t("profile.cancel")}
              </Button>
              <Button
                colorScheme="red"
                onClick={handleCancel}
                ml={3}
              >
                {t("profile.confirm")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default Order;
