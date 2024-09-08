import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Stack,
  Box,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import axios from "axios";

function EditItemDrawer({ dataType, item, onUpdate }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = useRef();
  const toast = useToast();
  const [formData, setFormData] = useState({ ...item });
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [showPaysInput, setShowPaysInput] = useState(false);
  const cancelRef = useRef();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [id]: value };

      // Update `pays` visibility based on `status`
      if (id === 'status') {
        const newStatus = value;
        if (newStatus === 'lunas') {
          newData.pays = newData.price;
          setShowPaysInput(false);
        } else if (newStatus === 'belum_lunas') {
          setShowPaysInput(true);
        } else {
          newData.pays = 0;
          setShowPaysInput(false);
        }
      }

      return newData;
    });
  };

  const handleSubmit = () => {
    // Validate `pays` value
    const endpoint = `http://127.0.0.1:8000/api/${dataType}/${item.id}`;
    if (formData.status === 'belum_lunas' && (formData.pays <= 0 || formData.pays >= formData.price)) {
      toast({
        title: "Jumlah Pembayaran Tidak Valid",
        description: "Pastikan pembayaran lebih dari 0 dan kurang dari harga.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    axios
      .put(endpoint, formData)
      .then((response) => {
        onUpdate(response.data.data); // Call the onUpdate function to update the UI
        toast({
          title: "Data berhasil diperbarui.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      })
      .catch((error) => {
        toast({
          title: "Terjadi kesalahan saat memperbarui data.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Error updating item:", error);
      });
  };

  const handleDelete = () => {
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    const endpoint = `http://127.0.0.1:8000/api/${dataType}/${item.id}`;

    axios
      .delete(endpoint)
      .then(() => {
        toast({
          title: `${dataType} berhasil dihapus.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      })
      .catch((error) => {
        toast({
          title: "Terjadi kesalahan saat menghapus item.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Error deleting item:", error);
      })
      .finally(() => {
        setIsAlertOpen(false);
      });
  };

  const renderInputFields = () => {
    if (dataType === "cars") {
      return (
        <>
          <Box>
            <FormLabel htmlFor="brand">Merek</FormLabel>
            <Input
              ref={firstField}
              id="brand"
              value={formData.brand}
              onChange={handleChange}
            />
          </Box>

          <Box>
            <FormLabel htmlFor="model">Model</FormLabel>
            <Input id="model" value={formData.model} onChange={handleChange} />
          </Box>

          <Box>
            <FormLabel htmlFor="gearbox">Gearbox</FormLabel>
            <Select
              id="gearbox"
              value={formData.gearbox}
              onChange={handleChange}
            >
              <option value="manual">manual</option>
              <option value="automatic">automatic</option>
            </Select>
          </Box>

          <Box>
            <FormLabel htmlFor="fuel_type">Jenis Bahan Bakar</FormLabel>
            <Select
              id="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
            >
              <option value="bensin">bensin</option>
              <option value="diesel">diesel</option>
            </Select>
          </Box>

          <Box>
            <FormLabel htmlFor="price">Harga</FormLabel>
            <Input id="price" value={formData.price} onChange={handleChange} />
          </Box>

          <Box>
            <FormLabel htmlFor="available">Ketersediaan</FormLabel>
            <Select
              id="available"
              value={formData.available}
              onChange={handleChange}
            >
              <option value="1">Ya</option>
              <option value="0">Tidak</option>
            </Select>
          </Box>
        </>
      );
    } else if (dataType === "users") {
      return (
        <>
          {/* Uncomment if needed */}
          {/* <Box>
            <FormLabel htmlFor="firstname">Nama Depan</FormLabel>
            <Input
              ref={firstField}
              id="firstname"
              value={formData.firstname}
              onChange={handleChange}
            />
          </Box>

          <Box>
            <FormLabel htmlFor="lastname">Nama Belakang</FormLabel>
            <Input
              id="lastname"
              value={formData.lastname}
              onChange={handleChange}
            />
          </Box>

          <Box>
            <FormLabel htmlFor="telephone">Telepon</FormLabel>
            <Input
              id="telephone"
              value={formData.telephone}
              onChange={handleChange}
            />
          </Box>

          <Box>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" value={formData.email} onChange={handleChange} />
          </Box> */}

          <Box>
            <FormLabel htmlFor="level">Level</FormLabel>
            <Select id="level" value={formData.level} onChange={handleChange}>
              <option value="user">Pengguna</option>
              <option value="admin">Admin</option>
            </Select>
          </Box>

          <Box>
            <FormLabel htmlFor="saldo_dana">Saldo Dana</FormLabel>
            <Input
              id="saldo_dana"
              type="number"
              value={formData.saldo_dana || 0}
              onChange={handleChange}
            />
          </Box>
        </>
      );
    } else if (dataType === "rents") {
      return (
        <>
          {/* Uncomment if needed */}
          {/* <Box>
            <FormLabel htmlFor="rental_date">Tanggal Sewa</FormLabel>
            <Input
              ref={firstField}
              id="rental_date"
              type="date"
              value={formData.rental_date}
              onChange={handleChange}
            />
          </Box>

          <Box>
            <FormLabel htmlFor="return_date">Tanggal Kembali</FormLabel>
            <Input
              id="return_date"
              type="date"
              value={formData.return_date}
              onChange={handleChange}
            />
          </Box> */}

          <Box>
            <FormLabel htmlFor="price">Harga</FormLabel>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </Box>

          {/* Uncomment if needed */}
          {/* <Box>
            <FormLabel htmlFor="user_id">ID Pelanggan</FormLabel>
            <Input
              id="user_id"
              type="number"
              value={formData.user_id}
              onChange={handleChange}
            />
          </Box>

          <Box>
            <FormLabel htmlFor="car_id">ID Mobil</FormLabel>
            <Input
              id="car_id"
              type="number"
              value={formData.car_id}
              onChange={handleChange}
            />
          </Box> */}

          <Box>
            <FormLabel htmlFor="status">Status Pembayaran</FormLabel>
            <Select id="status" value={formData.status} onChange={handleChange}>
              <option value="belum_bayar">Belum Bayar</option>
              <option value="belum_lunas">Belum Lunas</option>
              <option value="lunas">Lunas</option>
            </Select>
          </Box>
          <Box>
            <FormLabel htmlFor="returned">Status Pengembalian</FormLabel>
            <Select id="returned" value={formData.returned} onChange={handleChange}>
              <option value="belum_diambil">Belum Diambil</option>
              <option value="sedang_disewa">Sedang Disewa</option>
              <option value="sudah_kembali">Sudah Kembali</option>
            </Select>
          </Box>

          {showPaysInput && (
            <Box>
              <FormLabel htmlFor="pays">Jumlah Pembayaran</FormLabel>
              <Input
                id="pays"
                type="number"
                value={formData.pays || 0}
                onChange={handleChange}
              />
            </Box>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <>
      <Button leftIcon={<EditIcon />} onClick={onOpen} colorScheme="green">
        Edit
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        initialFocusRef={firstField}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit {dataType}</DrawerHeader>
          <DrawerBody>
            <Stack spacing="24px">
              {renderInputFields()}
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Simpan
            </Button>
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            {dataType && (
              <Button
                ml={4}
                colorScheme="red"
                onClick={handleDelete}
                leftIcon={<DeleteIcon />}
              >
                Hapus
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Konfirmasi Hapus</AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus item ini?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsAlertOpen(false)}
              >
                Batal
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default EditItemDrawer;
