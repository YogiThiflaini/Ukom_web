import {
  Box,
  TableContainer,
  Thead,
  Table,
  Tr,
  Th,
  Td,
  Tbody,
  IconButton,
  Heading,
  Flex,
  Stack,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useToast,
  Button,
  FormLabel,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Select,
  Text,
  Input,
  Image,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons"; 
import AvatarMenu from "../components/navbar/avatar-menu";
import SidebarContent from "../components/dashboard/sidebar-content";
import SearchInput from "../components/search";
import axios from "axios";
import { useContext, useState, useRef, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import EditItemDrawer from "../components/dashboard/edit-drawer";
import { showToast } from "../components/toast-alert";
import CreateItemDrawer from "../components/dashboard/create-drawer";
import SearchContext from "../SearchContext";
import { useTranslation } from "react-i18next";
import { FaRegBell, FaUser } from "react-icons/fa";
import Statistics from './RentStatistics';
import Admin from './Admin';
import ReviewButton from "../components/ui/ReviewButton";
import { useCallback } from 'react';
import { debounce } from 'lodash';

function Dashboard() {
  const { t } = useTranslation();
  const toast = useToast();
  const { searchResults, setSearchResults } = useContext(SearchContext);
  const [data, setData] = useState([]);
  const [header, setHeader] = useState([
    <>
    <Statistics/>
    <Admin />
    </>
  ]);
  const [type, setType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [returnedFilter, setReturnedFilter] = useState("");
  const [gearboxFilter, setGearboxFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [appFilter, setAppFilter] = useState("");
  const [adappFilter, setAdappFilter] = useState("");
  const [cancelFilter, setCancelFilter] = useState("");
  const [createdAtFilter, setCreatedAtFilter] = useState("");
  const [rentalDateFilter, setRentalDateFilter] = useState("");  
  const [rentalDate, setRentalDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [createdAtRange, setCreatedAtRange] = useState({ start: "", end: "" });  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const cancelRef = useRef();
  // const [selectedButton, setSelectedButton] = useState("Requests");
  const [emailFilter, setemailFilter] = useState("");
  const [comments, setComments] = useState([]);
  const [showOperations, setShowOperations] = useState(false);
  const [brandFilter, setBrandFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  useEffect(() => {
    // Reset filters based on the type
    setStatusFilter("");
    setReturnedFilter("");
    setRentalDateFilter("");
    setCreatedAtFilter("");
    setGearboxFilter("");
    setFuelFilter("");
    setAppFilter("");
    setAdappFilter("");
    setCancelFilter("");
    setBrandFilter("");
    setNameFilter("");
    setLevelFilter("");
  }, [type]);

  const handleButtonClick = (buttonType) => {
    setType(buttonType); // Update the type and fetch data accordingly
    handleData(buttonType);
  };

  const handleUpdateBannedStatus = useCallback(
    debounce((userId, currentStatus) => {
      console.log(currentStatus);
      const newStatus = currentStatus === 0 ? 1 : 0;
  
      axios
        .put(`http://127.0.0.1:8000/api/users/${userId}/update-banned-status`, {
          banned: newStatus,
        })
        .then((response) => {
          showToast(toast, response.data.message, "success", "Success");
          setData((prevData) =>
            prevData.map((item) =>
              item.id === userId ? { ...item, banned: newStatus } : item
            )
          );
        })
        .catch((error) => {
          showToast(toast, "Error updating banned status", "error", "Error");
          console.error("Error updating banned status:", error);
        });
    }, 300), // Delay 300ms
    []
  );
  
  const handleData = (type) => {
    // Reset data dan header sebelum memuat data baru
    setData([]);
    setHeader(["Tunggu Sebentar....."]);
    if (type === "Users") {
      axios.get("http://127.0.0.1:8000/api/users").then((response) => {
        setHeader(["no", "id", "profile_photo", "firstname", "lastname", "telephone", "email", "alamat","level", "saldo_dana"]);
        // Mengurutkan data berdasarkan id
        const sortedUsers = response.data.data.sort((a, b) => a.id - b.id);
        setData(sortedUsers);
        setType("users");
        setTimeout(() => {
          setShowOperations(true);
        }, 500);
      }).catch(error => {
        console.error("Error fetching users:", error);
      });
    } else if (type === "Cars") {
      axios.get("http://127.0.0.1:8000/api/cars").then((response) => {
        setHeader([
          "no",
          "id",
          "photo2",
          "brand",
          "model",
          "gearbox",
          "fuel_type",
          "price",
          "kursi",
          "available",
          "kondisi",
        ]);
        // Mengurutkan data berdasarkan id
        const sortedCars = response.data.data.sort((a, b) => a.id - b.id);
        setData(sortedCars);
        setType("cars");
        setTimeout(() => {
          setShowOperations(true);
        }, 500);
  
        // Ambil komentar terkait mobil
        const carIds = sortedCars.map(car => car.id);
        Promise.all(carIds.map(id => 
          axios.get(`http://127.0.0.1:8000/api/cars/${id}/comments`)
        ))
        .then(responses => {
          const allComments = responses.flatMap(response => response.data);
          setComments(allComments);
        })
        .catch(error => {
          console.error("Error fetching car comments:", error);
        });
      }).catch(error => {
        console.error("Error fetching cars:", error);
      });
    } else if (type === "Rents") {
      axios.get("http://127.0.0.1:8000/api/rents").then((response) => {
        setHeader([
          "no",
          "id",
          "rental_date",
          "return_date",
          "photo2",
          "price",
          "user_id",
          "email",
          "car_id",
          "pays",
          "status",
          "returned",
          "cancel",
        ]);
        // Mengurutkan data berdasarkan id
        const sortedRents = response.data.data.sort((a, b) => a.id - b.id);
        setData(sortedRents);
        setType("rents");
        setTimeout(() => {
          setShowOperations(true);
        }, 500);
      }).catch(error => {
        console.error("Error fetching rents:", error);
      });
    } else if (type === "Historys") {
      axios.get(`http://127.0.0.1:8000/api/topups`).then((response) => {
        setHeader([
          "no",
          "id",
          "user_id",
          "firstname",
          "lastname",
          "email",
          "topup_amount",
          "topup_date"
        ]);
        // Mengurutkan data berdasarkan id
        const sortedHistory = response.data.sort((a, b) => a.id - b.id);
        setData(sortedHistory);
        setType("historys");
        setTimeout(() => {
          setShowOperations(true);
        }, 500);
      }).catch(error => {
        console.error("Error fetching topup history:", error);
      });
    } else if (type === "Requests") {
      axios.get(`http://127.0.0.1:8000/api/requests`).then((response) => {
        setHeader([
          "no",
          "id",
          "user_id",
          "email",
          "description",
          "approval"
        ]);
        // Mengurutkan data berdasarkan id
        const sortedRequests = response.data.data.sort((a, b) => a.id - b.id);
        setData(sortedRequests);
        setType("Requests");
        setTimeout(() => {
          setShowOperations(true);
        }, 500);
      }).catch(error => {
        console.error("Error fetching requests data:", error);
      });
    } else if (type === "") {
      setShowOperations(false);
      setHeader([
        <>
          <Statistics />
          <Admin />
        </>
      ]);
      setData([]);
      setType("");
    }
  };
  

  const handleApproval = (id, statuss) => {
    console.log(`Updating approval for ID ${id} to ${statuss}`);
    axios.put(`http://127.0.0.1:8000/api/requests/${id}/approval`, { approval: statuss })
      .then(response => {
        console.log("API response:", response.data); // Debug log
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, approval: statuss } : item
          )
        );
      })
      .catch(error => {
        console.error("Error updating approval status:", error);
      });
  };  
  
  const handleAdminApproval = (id, approvalStatus) => {
    axios.put(`http://127.0.0.1:8000/api/payment/${id}/approve`, {
      admin_approval: approvalStatus, // approvalStatus will be 1 for "Setuju" and 2 for "Tolak"
    })
    .then(response => {
      console.log('Approval status updated:', response.data);
      
      setData(prevData => prevData.map(item => 
        item.id === id ? { ...item, admin_approval: approvalStatus } : item
      ));
  
      // Show a success message
      toast({
        title: approvalStatus === 1 ? 'Permintaan disetujui' : 'Permintaan ditolak',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    })
    .catch(error => {
      console.error('Error updating approval status:', error);
      
      // Show an error message
      toast({
        title: 'Gagal memperbarui status persetujuan',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    });
  };
  

  const handleUpdateItem = (itemId, updatedItem) => {
    const endpoint = `http://127.0.0.1:8000/api/${type}/${itemId}`;

    // Cari item yang ada dalam data untuk mendapatkan email dan photo2
    const existingItem = data.find(item => item.id === itemId);
    
    // Pastikan email dan photo2 tetap ada dalam updatedItem
    if (existingItem) {
        if (existingItem.email) {
            updatedItem.email = existingItem.email; // Menggunakan email yang sudah ada
        }
        if (existingItem.photo2) {
            updatedItem.photo2 = existingItem.photo2; // Menggunakan photo2 yang sudah ada
        }
    }

    axios
      .put(endpoint, updatedItem)
      .then((response) => {
        showToast(toast, `${type} tabel telah diupdate!`, "success", "Success");
        const updatedData = response.data.data;

        // Gabungkan data baru dengan email dan photo2 yang sudah ada
        setData((prevData) =>
          prevData.map((item) => {
            if (item.id === itemId) {
              return { 
                ...updatedData, 
                email: existingItem?.email,  // Menggabungkan data baru dengan email
                photo2: existingItem?.photo2 // Menggabungkan data baru dengan photo2
              };
            }
            return item;
          })
        );
      })
      .catch((error) => {
        showToast(toast, "Error untuk update", "error", "Error");
        console.error("Error updating item:", error);
      });
};


  const handleDelete = (id) => {
    setDeletingItemId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    const endpoint = `http://127.0.0.1:8000/api/${type}/${deletingItemId}`;

    axios
      .delete(endpoint)
      .then((response) => {
        showToast(toast, `${type} berhasil diperbarui!`, "success", "Success");
        setData((prevData) => prevData.filter((item) => item.id !== deletingItemId));
        setIsAlertOpen(false);
        setDeletingItemId(null);
      })
      .catch((error) => {
        showToast(toast, "Gagal dalam menghapus item", "error", "Error");
        console.error("Error deleting item:", error);
        setIsAlertOpen(false);
        setDeletingItemId(null);
      });
  };

  const handleRoleChange = (userId, newRole) => {
    axios
      .put(`http://127.0.0.1:8000/api/users/${userId}`, { level: newRole })
      .then((response) => {
        showToast(toast, "User level berhasil diupdate!", "success", "Success");
        setData((prevData) =>
          prevData.map((item) =>
            item.id === userId ? { ...item, level: newRole } : item
          )
        );
      })
      .catch((error) => {
        showToast(toast, "Error saat update user level", "error", "Error");
        console.error("Error updating user level:", error);
      });
  };

  const filteredData = data.filter((item) => {
    // Filter based on status
    if (statusFilter && item.status !== statusFilter) return false;
    if (gearboxFilter && item.gearbox !== gearboxFilter) return false;
    if (fuelFilter && item.fuel_type !== fuelFilter) return false;
    if (cancelFilter !== "" && item.cancel !== Number(cancelFilter)) return false;
    if (appFilter !== "" && item.approval !== Number(appFilter)) return false;
    if (adappFilter !== "" && item.admin_approval !== Number(adappFilter)) return false;
    if (nameFilter && !(`${item.firstname} ${item.lastname}`.toLowerCase().includes(nameFilter.toLowerCase()))) return false;
    if (returnedFilter && item.returned !== returnedFilter) return false;
    if (type === "cars" && brandFilter && !item.brand.toLowerCase().includes(brandFilter.toLowerCase())) return false;
    if (type === "users" && levelFilter && !item.level.toLowerCase().includes(levelFilter.toLowerCase())) return false;
    // Filter based on created_at range
    if (type === "users") {
      if (
        createdAtRange.start &&
        createdAtRange.end &&
        (new Date(item.created_at) < new Date(createdAtRange.start) ||
          new Date(item.created_at) > new Date(createdAtRange.end))
      ) return false;
    }
    // Filter based on rental_date range
    if (type === "rents") {
      // Filter untuk rental_date
      if (
        rentalDate &&
        new Date(item.rental_date).toDateString() !== new Date(rentalDate).toDateString()
      ) return false;
    
      // Filter untuk return_date
      if (
        returnDate &&
        new Date(item.return_date).toDateString() !== new Date(returnDate).toDateString()
      ) return false;
    }
    if (type === "rents" || type === "users" || type === "historys" ) {
    if (emailFilter && !item.email.toLowerCase().includes(emailFilter.toLowerCase())) return false;
    }
    return true;
  });

  const handleSendNotification = (rentId) => {
    axios
      .post(`http://127.0.0.1:8000/api/rents/${rentId}/send-notification`)
      .then((response) => {
        // Menampilkan notifikasi sukses
        toast({
          title: "Notifikasi Terkirim",
          description: "Email notifikasi berhasil dikirim.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        // Menampilkan notifikasi gagal
        toast({
          title: "Error",
          description: "Gagal mengirim notifikasi.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Error sending notification:", error);
      });
  };  
  

  return (
    <>
      <Navbar
        sidebarContent={<SidebarContent handleData={handleData} />}
        buttons={
          <HStack spacing={4} justifyContent="flex-end" width="100%">
            {/* <SearchInput type={type.toLowerCase()} /> */}
            <AvatarMenu />
          </HStack>
        }
      />
      <Box as="section" minH="100vh">
        <Box
          ml={{
            base: 0,
            md: 60,
          }}
          transition=".3s ease"
        >
          <Box as="main" p={4}>
            <Box borderWidth="4px" borderStyle="dashed" rounded="md" h="auto">
              <Box h={"full"} w={"full"} overflowX="auto">
                <TableContainer p={10}>
                  <Flex align="center" justify="space-between" pb={5}>
                    <Heading fontSize={{ base: "xl", md: "2xl" }} pb="5">
                      {t("header.greeting")}
                    </Heading>
                    {type === "cars" && <CreateItemDrawer dataType={type} />}
                  </Flex>
                  <Flex mb={4} justify="space-between">
                    {type === "rents" && (
                    <>
                    <Box>
                      <FormLabel htmlFor="firstname">Cari Email Penyewa:</FormLabel>
                      <Input
                        placeholder="Filter berdasarkan email"
                        value={emailFilter}
                        onChange={(e) => setemailFilter(e.target.value)}
                        />
                    </Box>
                    <Box>
                    <FormLabel htmlFor="status">Status:</FormLabel>
                    <Select
                      placeholder="Filter berdasarkan Status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      >
                      <option value="">Semua</option>
                      <option value="lunas">Lunas</option>
                      <option value="belum_lunas">Belum Lunas</option>
                      <option value="belum_bayar">Belum Bayar</option>
                    </Select>
                    </Box>
                    <Box>
                    <FormLabel htmlFor="Returned">Pengembalian:</FormLabel>
                    <Select
                      placeholder="Filter berdasarkan Returned"
                      value={returnedFilter}
                      onChange={(e) => setReturnedFilter(e.target.value)}
                      >
                      <option value="">Semua</option>
                      <option value="belum_diambil">Belum Diambil</option>
                      <option value="sedang_disewa">Sedang Disewa</option>
                      <option value="sudah_kembali">Sudah Kembali</option>
                    </Select>
                    </Box>
                    <Box>
                    <FormLabel htmlFor="cancel">Pembatalan:</FormLabel>
                    <Select
                      placeholder="Filter pembatalan"
                      value={cancelFilter}
                      onChange={(e) => setCancelFilter(e.target.value)}
                      >
                      <option value="">Semua</option>
                      <option value={0}>Jadi Disewa</option>
                      <option value={1}>Dibatalkan</option>
                    </Select>
                    </Box>
                    <Flex mb={4} justify="space-between">
                      {/* Input untuk tanggal rental */}
                      <Box>
                        <FormLabel htmlFor="rentalDate">Tanggal Rental:</FormLabel>
                        <Input
                          type="date"
                          id="rentalDate"
                          placeholder="Pilih tanggal rental"
                          value={rentalDate}
                          onChange={(e) => setRentalDate(e.target.value)}
                        />
                      </Box>
                      
                      {/* Input untuk tanggal pengembalian */}
                      <Box>
                        <FormLabel htmlFor="returnDate">Tanggal Pengembalian:</FormLabel>
                        <Input
                          type="date"
                          id="returnDate"
                          placeholder="Pilih tanggal pengembalian"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                        />
                      </Box>
                    </Flex>
                    </>
                    )}
                    {type === "users" && (
                    <>
                    <Box>
                        <FormLabel htmlFor="name">Cari Nama:</FormLabel>
                        <Input
                            placeholder="Filter berdasarkan nama depan atau belakang"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                        />
                    </Box>
                    <Box>
                      <FormLabel htmlFor="email">Cari Email Topup:</FormLabel>
                      <Input
                        placeholder="Filter berdasarkan email"
                        value={emailFilter}
                        onChange={(e) => setemailFilter(e.target.value)}
                      />
                    </Box>
                    <Box>
                    <FormLabel htmlFor="level">Level User:</FormLabel>
                    <Select
                      placeholder="Filter berdasarkan level"
                      value={levelFilter}
                      onChange={(e) => setLevelFilter(e.target.value)}
                    >
                      <option value="">Semua</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </Select>
                    </Box>
                    <Flex mb={4} justify="space-between">
                    <Box>
                      <FormLabel htmlFor="createdStart">Tanggal Dibuat Dari:</FormLabel>
                      <Input
                        type="date"
                        id="createdStart"
                        placeholder="Mulai tanggal dibuat"
                        value={createdAtRange.start}
                        onChange={(e) => setCreatedAtRange((prev) => ({ ...prev, start: e.target.value }))}
                      />
                    </Box>
                    <Box>
                      <FormLabel htmlFor="createdEnd">Tanggal Dibuat Sampai:</FormLabel>
                      <Input
                        type="date"
                        id="createdEnd"
                        placeholder="Akhir tanggal dibuat"
                        value={createdAtRange.end}
                        onChange={(e) => setCreatedAtRange((prev) => ({ ...prev, end: e.target.value }))}
                        />
                    </Box>
                  </Flex>
                  </>
                    )}
                    {type === "cars" && (
                    <>
                    <Box>
                      <FormLabel htmlFor="brand">Cari Merek Mobil:</FormLabel>
                      <Input
                          placeholder="Filter berdasarkan brand"
                          value={brandFilter}
                          onChange={(e) => setBrandFilter(e.target.value)}
                      />
                  </Box>
                    <Box>
                    <FormLabel htmlFor="gearbox">Tipe Mesin:</FormLabel>
                    <Select
                      placeholder="Filter berdasarkan gearbox"
                      value={gearboxFilter}
                      onChange={(e) => setGearboxFilter(e.target.value)}
                    >
                      <option value="">Semua</option>
                      <option value="manual">Manual</option>
                      <option value="automatic">Automatic</option>
                    </Select>
                    </Box>
                    <Box>
                    <FormLabel htmlFor="fuel">Tipe Bahanbakar:</FormLabel>
                    <Select
                      placeholder="Filter bahan bakar"
                      value={fuelFilter}
                      onChange={(e) => setFuelFilter(e.target.value)}
                    >
                      <option value="">Semua</option>
                      <option value="bensin">Bensin</option>
                      <option value="diesel">Diesel</option>
                    </Select>
                    </Box>
                    </>
                  )}
                  {type === "historys" && (
                    <Box>
                    <FormLabel htmlFor="email">Cari Email Topup:</FormLabel>
                    <Input
                      placeholder="Filter berdasarkan email"
                      value={emailFilter}
                      onChange={(e) => setemailFilter(e.target.value)}
                    />
                  </Box>
                  )}
                  {/* {type === "Requests" && (
                    <>
                    <Stack spacing={4} mb={4} direction="row">
                    <Box>
                    <FormLabel htmlFor="approval">Tanggapan:</FormLabel>
                    <Select
                      placeholder="Filter pembatalan"
                      value={appFilter}
                      onChange={(e) => setAppFilter(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value={0}>Belum ditanggapi</option>
                      <option value={1}>Disetujui</option>
                      <option value={2}>Ditolak</option>
                    </Select>
                    </Box>
                  </Stack>
                    </>
                  )} */}
                  </Flex>
                  <Table variant="striped" size={{ base: "sm", md: "md" }}>
                    <Thead>
                      <Tr>
                        {header.map((title) => (
                          <Th key={title}>{title}</Th>
                        ))}
                        {type !== ""&& showOperations && type !== "historys"&&(
                          <Th>operations</Th>
                        )}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {searchResults && searchResults.length > 0
                        ? searchResults.map((item, index) => (
                            <Tr key={item.id}>
                              <Td>{index + 1}</Td>
                              {header.slice(1).map((column) => {
                                if (column === "available") {
                                  return (
                                    <Td key={item.id}>
                                      <Text color={item[column] === 1 ? "green.500" : "red.500"}>
                                      {item[column] === 1 ? "Ya" : "Tidak"}
                                      </Text>
                                    </Td>
                                  );
                                } else if (column === "level") {
                                  return (
                                    <Td key={item.id}>
                                      {item[column]}
                                    </Td>
                                  );
                                } else if (column === "status") {
                                  return <Td key={item.id}>{item[column]}</Td>;
                                } else if (column === "cancel") {
                                  return (
                                    <Td key={item.id}>
                                      <Text color={item.cancel === 0 ? "green.500" : "red.500"}>
                                        {item.cancel === 0 ? "Menyewa" : "Dibatalkan"}
                                      </Text>
                                    </Td>
                                  );
                                } 
                                else if (column === "approval") {
                                  console.log(`Column: ${column}, Approval Value: ${item[column]}`); // Log kolom dan nilai
                    
                                  return (
                                    <Td key={item.id}>
                                      {item[column] == 0 ? (
                                        <>
                                          <Button
                                            onClick={() => handleApproval(item.id, 1)}
                                            colorScheme="green"
                                            ml={1}
                                          >
                                            Setuju
                                          </Button>
                                          <Button
                                            onClick={() => handleApproval(item.id, 2)}
                                            colorScheme="red"
                                            ml={1}
                                          >
                                            Tolak
                                          </Button>
                                        </>
                                      ) : item[column] == 1 ? (
                                        <Text color="green.500">Sudah Disetujui</Text>
                                      ) : item[column] == 2 ? (
                                        <Text color="red.500">Permintaan Ditolak</Text>
                                      ) : (
                                        <Text>Tidak ada status</Text> // Tampilkan jika tidak ada status yang cocok
                                      )}
                                    </Td>
                                  );
                                }
                                else if (column === "photo2") {
                                  return (
                                    <Td key={column}>
                                      <Image
                                        src={`${item.photo2}`}
                                        alt={`Car ${item.brand}`}
                                        size="md" // You can adjust the size as needed
                                        h={"full"}
                                        objectFit="cover"
                                      />
                                    </Td>
                                  );
                                }
                                else if (column === "profile_photo") {
                                  return (
                                    <Td key={column}>
                                      <Avatar
                                          size="md"
                                          name={`${item.firstname} ${item.lastname}`}
                                          src={item.profile_photo}
                                        />
                                    </Td>
                                  );
                                }
                                else if (column === "kondisi") {
                                  return (
                                    <Td key={item.id}>
                                      <Text color={item[column] === 0 ? "red.500" : "blue.500"}>
                                      {item[column] === 0 ? "Nonaktif" : "Aktif"}
                                      </Text>
                                    </Td>
                                  );
                                }
                                else {
                                  return <Td key={column}>{item[column]}</Td>;
                                }
                              })}
                              <Td>
                              {type === "rents" && (
  <>
    {item.cancel === 1 ? (
      <Text color="red.500" fontWeight="bold">
        Pesanan Dibatalkan
      </Text>
    ) : item.status === "lunas" && item.returned === "sudah_kembali" ? (
      <Text color="green.500" fontWeight="bold">
        Transaksi Selesai
      </Text>
    ) : (
      <>
        <EditItemDrawer
          dataType={type}
          item={item}
          onUpdate={(updatedItem) => handleUpdateItem(item.id, updatedItem)}
        />
        <IconButton
          aria-label="Send Notification"
          background={"cyan.400"}
          color={"black.500"}
          _hover={{ background: "blue.500", color: "white" }}
          icon={<FaRegBell />}
          onClick={() => handleSendNotification(item.id)}
          ml={2}
        />
      </>
    )}
  </>
)}

                                {type === "cars" && (
                                  <>
                                  <EditItemDrawer
                                  dataType={type}
                                  item={item}
                                  onUpdate={(updatedItem) =>
                                    handleUpdateItem(item.id, updatedItem)
                                  }
                                  />
                                  <ReviewButton 
                                    comments={comments.filter(comment => comment.car_id === item.id)} 
                                    carId={item.id} 
                                  />
                                  </>
                                )}
                                {type === "users" && (
                                  <>
                                    {item.banned === 1 ? (
                                      <Button
                                        onClick={() => handleUpdateBannedStatus(item.id, item.banned)}
                                        aria-label="Update Banned Status"
                                        ml={1}
                                        colorScheme="red"
                                      >
                                        Banned
                                      </Button>
                                    ) : (
                                      <Button
                                        onClick={() => handleUpdateBannedStatus(item.id, item.banned)}
                                        aria-label="Update Banned Status"
                                        ml={1}
                                        colorScheme="green"
                                      >
                                        Aktif
                                      </Button>
                                    )}
                                    <IconButton
                                      onClick={() => handleRoleChange(item.id, item.level === "admin" ? "user" : "admin")}
                                      aria-label="Change Role"
                                      icon={<FaUser />}
                                      ml={1}
                                      colorScheme={item.level === "admin" ? "blue" : "gray"}
                                    />
                                  </>
                                )}
                                {type==="cars"&&(
                                <IconButton
                                  onClick={() => handleDelete(item.id)}
                                  bg=""
                                  _hover={{ bg: "red.500", color: "white" }}
                                  ml={1}
                                  aria-label="Delete"
                                  icon={<DeleteIcon />}
                                />
                                )}
                                {type==="Requests"&&(
                                <IconButton
                                  onClick={() => handleDelete(item.id)}
                                  bg=""
                                  _hover={{ bg: "red.500", color: "white" }}
                                  ml={1}
                                  aria-label="Delete"
                                  icon={<DeleteIcon />}
                                />
                                )}
                              </Td>
                            </Tr>
                          ))
                        : filteredData.map((item, index) => (
                            <Tr key={item.id}>
                              <Td>{index + 1}</Td>
                              {header.slice(1).map((column) => {
                                if (column === "available") {
                                  return (
                                    <Td key={item.id}>
                                      <Text color={item[column] === 1 ? "green.500" : "red.500"}>
                                      {item[column] === 1 ? "Ya" : "Tidak"}
                                      </Text>
                                    </Td>
                                  );
                                } else if (column === "level") {
                                  return (
                                    <Td key={item.id}>
                                      {item[column]}
                                    </Td>
                                  );
                                } else if (column === "status") {
                                  return <Td key={item.id}>{item[column]}</Td>;
                                } else if (column === "cancel") {
                                  return (
                                    <Td key={item.id}>
                                      <Text color={item.cancel === 0 ? "green.500" : "red.500"}>
                                        {item.cancel === 0 ? "Menyewa" : "Dibatalkan"}
                                      </Text>
                                    </Td>
                                  );
                                } 
                                else if (column === "approval") {
                                  // console.log(`Column: ${column}, Approval Value: ${item[column]}`); // Log kolom dan nilai
                    
                                  return (
                                    <Td key={item.id}>
                                      {item[column] == 0 ? (
                                        <>
                                          <Button
                                            onClick={() => handleApproval(item.id, 1)}
                                            colorScheme="green"
                                            ml={1}
                                          >
                                            Setuju
                                          </Button>
                                          <Button
                                            onClick={() => handleApproval(item.id, 2)}
                                            colorScheme="red"
                                            ml={1}
                                          >
                                            Tolak
                                          </Button>
                                        </>
                                      ) : item[column] == 1 ? (
                                        <Text color="green.500">Sudah Disetujui</Text>
                                      ) : item[column] == 2 ? (
                                        <Text color="red.500">Permintaan Ditolak</Text>
                                      ) : (
                                        <Text>Tidak ada status</Text> // Tampilkan jika tidak ada status yang cocok
                                      )}
                                    </Td>
                                  );
                                }
                                else if (column === "admin_approval") {
                                  // Handle 'admin_approval' column with buttons or approval status
                                  return (
                                    <Td key={item.id}>
                                      {item[column] === 0 ? (
                                        <>
                                          <Button
                                            onClick={() => handleAdminApproval(item.id, 1)}
                                            colorScheme="green"
                                            ml={1}
                                          >
                                            Setuju
                                          </Button>
                                          <Button
                                            onClick={() => handleAdminApproval(item.id, 2)}
                                            colorScheme="red"
                                            ml={1}
                                          >
                                            Tolak
                                          </Button>
                                        </>
                                      ) : item[column] === 1 ? (
                                        <Text color="green.500">Sudah Disetujui</Text>
                                      ) : (
                                        <Text color="red.500">Permintaan Ditolak</Text>
                                      )}
                                    </Td>
                                  );
                                }else if (column === "photo2") {
                                  return (
                                    <Td key={column}>
                                      <Image
                                        src={`${item.photo2}`}
                                        alt={`Car ${item.brand}`}
                                        size="md" // You can adjust the size as needed
                                        h={"full"}
                                        objectFit="cover"
                                      />
                                    </Td>
                                  );
                                } 
                                else if (column === "profile_photo") {
                                  return (
                                    <Td key={column}>
                                       <Avatar
                                          size="md"
                                          name={`${item.firstname} ${item.lastname}`}
                                          src={item.profile_photo}
                                        />
                                    </Td>
                                  );
                                }
                                else if (column === "kondisi") {
                                  return (
                                    <Td key={item.id}>
                                      <Text color={item[column] === 0 ? "red.500" : "blue.500"}>
                                      {item[column] === 0 ? "Nonaktif" : "Aktif"}
                                      </Text>
                                    </Td>
                                  );
                                }
                                 else {
                                  return <Td key={column}>{item[column]}</Td>;
                                }
                              })}
                              <Td>
  {type === "rents" && (
    <>
      {item.cancel === 1 ? (
        <Text color="red.500" fontWeight="bold">
          Pesanan Dibatalkan
        </Text>
      ) : item.status === "lunas" && item.returned === "sudah_kembali" ? (
        <Text color="green.500" fontWeight="bold">
          Transaksi Selesai
        </Text>
      ) : (
        <>
        <EditItemDrawer
          dataType={type}
          item={item}
          onUpdate={(updatedItem) => handleUpdateItem(item.id, updatedItem)}
        />
        <IconButton
          aria-label="Send Notification"
          background={"cyan.400"}
          color={"black.500"}
          _hover={{ background: "blue.500", color: "white" }}
          icon={<FaRegBell />}
          onClick={() => handleSendNotification(item.id)}
          ml={2}
        />
      </>
      )}
    </>
  )}
                                {type === "cars" && (
                                  <>
                                  <EditItemDrawer
                                  dataType={type}
                                  item={item}
                                  onUpdate={(updatedItem) =>
                                    handleUpdateItem(item.id, updatedItem)
                                  }
                                  />
                                  <ReviewButton 
                                    comments={comments.filter(comment => comment.car_id === item.id)} 
                                    carId={item.id} 
                                  />
                                  </>
                                )}
                                {type === "users" && (
                                  <>
                                    {item.banned === 1 ? (
                                      <Button
                                        onClick={() => handleUpdateBannedStatus(item.id, item.banned)}
                                        aria-label="Update Banned Status"
                                        ml={1}
                                        colorScheme="red"
                                      >
                                        Banned
                                      </Button>
                                    ) : (
                                      <Button
                                        onClick={() => handleUpdateBannedStatus(item.id, item.banned)}
                                        aria-label="Update Banned Status"
                                        ml={1}
                                        colorScheme="green"
                                      >
                                        Aktif
                                      </Button>
                                    )}
                                    <IconButton
                                      onClick={() => handleRoleChange(item.id, item.level === "admin" ? "user" : "admin")}
                                      aria-label="Change Role"
                                      icon={<FaUser />}
                                      ml={1}
                                      colorScheme={item.level === "admin" ? "blue" : "gray"}
                                    />
                                  </>
                                )}
                                {type==="cars"&&(
                                <IconButton
                                  onClick={() => handleDelete(item.id)}
                                  bg=""
                                  _hover={{ bg: "red.500", color: "white" }}
                                  ml={1}
                                  aria-label="Delete"
                                  icon={<DeleteIcon />}
                                />
                                )}
                                {type==="Requests"&&(
                                <IconButton
                                  onClick={() => handleDelete(item.id)}
                                  bg=""
                                  _hover={{ bg: "red.500", color: "white" }}
                                  ml={1}
                                  aria-label="Delete"
                                  icon={<DeleteIcon />}
                                />
                                )}
                              </Td>
                            </Tr>
                          ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus {type.slice(0, -1)}
            </AlertDialogHeader>

            <AlertDialogBody>
              Apakah kamu yakin akan menghapus kolom ini? tindakan tidak bisa dibatalkan
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Batal
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDelete}
                ml={3}
              >
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Dashboard;
