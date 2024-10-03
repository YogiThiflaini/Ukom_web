import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Select,
  Button,
  Stack,
  Box,
  FormLabel,
  Input,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";

function CreateItemDrawer({ dataType }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = useRef();

  const [formData, setFormData] = useState({});
  const [fileUrl, setFileUrl] = useState('');
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
        const fileUrl = reader.result;
        setFileUrl(fileUrl);
        setFormData({ ...formData, [e.target.id]: file });
    };

    reader.readAsDataURL(file);
}

  

  const handleSubmit = () => {
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    axios
      .post(`http://127.0.0.1:8000/api/cars`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast({
          title: `${dataType} berhasil ditambahkan.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Terjadi kesalahan saat menambah item.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const renderInputFields = () => {
    if (dataType === "cars") {
      return (
        <>
          <Box>
            <FormLabel htmlFor="photo1">Photo 1</FormLabel>
            <Input
              ref={firstField}
              id="photo1"
              type="file"
              onChange={handleFileChange}
            />
          </Box>
          <Box>
            <FormLabel htmlFor="photo2">Photo 2</FormLabel>
            <Input id="photo2" type="file" onChange={handleFileChange} />
          </Box>
          <Box>
            <FormLabel htmlFor="brand">Merek</FormLabel>
            <Input id="brand" onChange={handleChange} />
          </Box>

          <Box>
            <FormLabel htmlFor="model">Model</FormLabel>
            <Input id="model" onChange={handleChange} />
          </Box>

          <Box>
            <FormLabel htmlFor="gearbox">Gearbox</FormLabel>
            {/* <Input id="gearbox" onChange={handleChange} /> */}
            <Select
              id="gearbox"
              value={formData.gearbox}
              onChange={handleChange}
              placeholder="-Pilih gearbox-"
            >
              <option value="manual">manual</option>
              <option value="automatic">automatic</option>
            </Select>
          </Box>

          <Box>
            <FormLabel htmlFor="fuel_type">Jenis Bahan Bakar</FormLabel>
            {/* <Input id="fuel_type" onChange={handleChange} /> */}
            <Select
              id="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              placeholder="-Pilih bahan bakar-"
            >
              <option value="bensin">bensin</option>
              <option value="diesel">diesel</option>
            </Select>
          </Box>
          
          <Box>
            <FormLabel htmlFor="kursi">Kursi</FormLabel>
            <Input id="kursi" onChange={handleChange} />
          </Box>

          <Box>
            <FormLabel htmlFor="price">Harga</FormLabel>
            <Input id="price" onChange={handleChange} />
          </Box>

          <Box>
            <FormLabel htmlFor="available">Ketersediaan</FormLabel>
            <Select
              id="available"
              value={formData.available}
              onChange={handleChange}
              placeholder="-Pilih Ketersediaan-"
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
          <Box>
            <FormLabel htmlFor="firstname">Nama Depan</FormLabel>
            <Input ref={firstField} id="firstname" onChange={handleChange} />
          </Box>

          <Box>
            <FormLabel htmlFor="lastname">Nama Belakang</FormLabel>
            <Input id="lastname" onChange={handleChange} />
          </Box>

          <Box>
            <FormLabel htmlFor="telephone">Telepon</FormLabel>
            <Input id="telephone" onChange={handleChange} />
          </Box>

          <Box>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" onChange={handleChange} />
          </Box>
        </>
      );
    } else if (dataType === "rents") {
      return (
        <>
          <Box>
            <FormLabel htmlFor="rental_date">Tanggal Sewa</FormLabel>
            <Input ref={firstField} id="rental_date" onChange={handleChange} />
          </Box>

          <Box>
            <FormLabel htmlFor="return_date">Tanggal Kembali</FormLabel>
            <Input id="return_date" onChange={handleChange} />
          </Box>

          <Box>
            <FormLabel htmlFor="price">Harga</FormLabel>
            <Input id="price" onChange={handleChange} />
          </Box>

          <Box>
            <FormLabel htmlFor="user_id">ID Pelanggan</FormLabel>
            <Input id="user_id" onChange={handleChange} />
          </Box>

          <Box>
            <FormLabel htmlFor="car_id">ID Mobil</FormLabel>
            <Input id="car_id" onChange={handleChange} />
          </Box>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <Button
        colorScheme="telegram"
        ml={4}
        leftIcon={<AddIcon color="white" />}
        onClick={onOpen}
      >
        Tambah
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerHeader borderBottomWidth="1px">Buat {dataType} baru</DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">{renderInputFields()}</Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Batal
            </Button>
            <Button colorScheme="green" px={7} onClick={handleSubmit} rightIcon={<FaPaperPlane />}>
              Buat
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default CreateItemDrawer;
