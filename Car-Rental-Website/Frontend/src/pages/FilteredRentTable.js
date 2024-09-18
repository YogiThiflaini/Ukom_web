import { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Text,
  HStack,
  VStack,
  Heading,
  Image,
  Spacer,
} from '@chakra-ui/react';
import axios from 'axios';
import CommentModal from '../components/ui/CommentModal'; // Import file CommentModal
import HomeSidebarContent from "../components/home/home-sidebar-content";
import NavbarLinks from "../components/navbar/NavbarLinks";
import AvatarMenu from "../components/navbar/avatar-menu";
import Navbar from "../components/navbar/Navbar";

const FilteredRentTable = ({ user_id }) => {
  const [rents, setRents] = useState([]);
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    const user_id = localStorage.getItem("id");
    if (user_id) {
      axios.get(`http://127.0.0.1:8000/api/users/${user_id}/rents`)
        .then(response => {
          // Filter status 'lunas' dan 'sudah_kembali'
          const filteredRents = response.data.data.filter(
            (rent) => rent.status === 'lunas' && rent.returned === 'sudah_kembali'
          );
  
          // Menghapus duplikat berdasarkan car_id, hanya menyisakan satu entri per car_id
          const uniqueRents = filteredRents.reduce((acc, current) => {
            const x = acc.find(item => item.car_id === current.car_id);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
  
          setRents(uniqueRents); // Menyimpan hasil filtered dan unique rent
        })
        .catch(error => console.error("Gagal untuk mengambil data", error));
    }
  }, [user_id]);  

  useEffect(() => {
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  return (
    <>
      <Navbar
        sidebarContent={<HomeSidebarContent />}
        links={<NavbarLinks />}
        buttons={<AvatarMenu />}
      />
      <Box mt="5px" px="10%"> {/* Tambahkan padding untuk memberikan ruang di kanan dan kiri */}
        <HStack>
          <Heading size="xl" m="25px">Berikan Review Anda</Heading>
          <Spacer />
        </HStack>

        {rents.length === 0 ? (
          <Box textAlign="center" m="20px">Anda belum pernah selesai rental</Box>
        ) : (
          <Box
            mt="10px"
            style={{ maxHeight: '450px', overflowY: 'auto' }}
          >
            {rents.map((rent, index) => (
              <Box
                key={rent.id}
                p={4}
                mb={4}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                bg="gray.50"
                maxWidth="900px"  // Batasi lebar maksimum box
                mx="auto"  // Posisi box berada di tengah
              >
                <HStack>
                  {/* Image Section */}
                  <Image
                    src={rent.car.photo2} // Pastikan kolom photo tersedia
                    alt={`${rent.car.brand} ${rent.car.model}`}
                    boxSize="200px"
                    objectFit="cover"
                    borderRadius="md"
                    ml={4}
                  />
                  
                  {/* Details Section */}
                  <VStack align="start" ml={8} pl={6}>
                    <Heading size="md">{rent.car.brand} {rent.car.model}</Heading>
                    <Text>Bahan bakar: {rent.car.fuel_type}</Text>
                    <Text>Gearbox: {rent.car.gearbox}</Text>
                    <Text>Harga sewa: Rp. {rent.car.price.toLocaleString('id-ID')}</Text>
                    <Spacer />

                    {/* Comment Button */}
                    <CommentModal carId={rent.car_id} email={email} />
                  </VStack>
                </HStack>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default FilteredRentTable;
