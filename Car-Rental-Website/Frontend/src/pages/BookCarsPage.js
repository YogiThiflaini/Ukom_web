import { Box, GridItem, SimpleGrid, VStack, Select, Input, Text, HStack, Stack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";
import CarCard from "../components/ui/car-card";
import Footer from "../components/footer";
import LoadingSpinner from "../components/ui/loading-spinner";
import SearchInput from "../components/search";
import AvatarMenu from "../components/navbar/avatar-menu";
import HomeSidebarContent from "../components/home/home-sidebar-content";
import NavbarLinks from "../components/navbar/NavbarLinks";
import SearchContext from "../SearchContext";
import useAuthentication from "../useAuthentication";
import NavbarLoginButtons from "../components/navbar/login-buttons";
import LoadingAnimation from "../components/ui/LoadingAnimation";
import {Alert, AlertIcon } from "@chakra-ui/react";
import moment from "moment";

function BookCars() {
  const { searchResults } = useContext(SearchContext);
  const [cars, setCars] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingVStack, setLoadingVStack] = useState(true);
  const { isLoggedIn } = useAuthentication();
  const [showNavbarContent, setShowNavbarContent] = useState(false);
  const [rentalData, setRentalData] = useState([]);
  const [filter, setFilter] = useState("all"); // Default ke "all"
  const [brandFilter, setBrandFilter] = useState("");
  const [originalRents, setOriginalRents] = useState([]);
  const [lateReturns, setLateReturns] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/cars").then((response) => {
      setCars(response.data.data);
        const timer = setTimeout(() => {
          setLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingVStack(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNavbarContent(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/rents")
      .then((response) => {
        const rentalData = response.data.data;
        if (Array.isArray(rentalData)) {
          setRentalData(rentalData);
        } else {
          console.error("Data rental yang diterima bukan array");
        }
      })
      .catch((error) => console.error("Gagal mengambil data rental", error));
  }, []);

  // Menghitung mobil yang direkomendasikan
  // Menghitung mobil yang direkomendasikan dengan mempertimbangkan 'kondisi'
useEffect(() => {
  if (rentalData.length > 0 && cars.length > 0) {
    const rentalCounts = rentalData.reduce((acc, rent) => {
      acc[rent.car_id] = (acc[rent.car_id] || 0) + 1;
      return acc;
    }, {});

    // Hanya cari mobil yang kondisi !== 0
    const eligibleCars = cars.filter(car => car.kondisi !== 0);

    // Urutkan mobil berdasarkan rental terbanyak
    const sortedCars = eligibleCars
      .sort((a, b) => (rentalCounts[b.id] || 0) - (rentalCounts[a.id] || 0))
      .slice(0, 2) // Ambil 2 mobil dengan rental terbanyak

    // Tandai mobil yang direkomendasikan
    const updatedCars = cars.map(car => ({
      ...car,
      recommended: sortedCars.some(recommendedCar => recommendedCar.id === car.id),
    }));

    setCars(updatedCars);
  }
}, [rentalData, cars]);

useEffect(() => {
  const user_id = localStorage.getItem("id"); // Ganti dengan user_id yang sesuai
  if (user_id) {
    axios
      .get(`http://127.0.0.1:8000/api/users/${user_id}/rents`)
      .then((response) => {
        const rentData = response.data.data;
        setOriginalRents(rentData); // Simpan data asli
      })
      .catch((error) => {
        console.error("Gagal untuk mengambil data", error);
      });
  }
}, []);

// useEffect untuk mengecek apakah return_date telah lewat dan returned === "sedang_disewa"
useEffect(() => {
  const today = moment(); // Menggunakan moment() untuk tanggal hari ini
  const lateRents = originalRents.filter((rent) => {
    const returnDate = moment(rent.return_date); // Mengubah return_date menjadi objek moment
    return rent.returned === "sedang_disewa" && returnDate.isBefore(today); // Cek apakah return_date sebelum hari ini
  });

  setLateReturns(lateRents); // Simpan data rental yang telat
}, [originalRents]);


  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleBrandInputChange = (e) => {
    setBrandFilter(e.target.value.toLowerCase());
  };

  const filteredCars = () => {
    let filtered = searchResults && searchResults.length > 0 ? [...searchResults] : [...cars];
  
    // Filter berdasarkan brand
    if (brandFilter) {
      filtered = filtered.filter(car => car.brand.toLowerCase().includes(brandFilter));
    }
  
    // Filter berdasarkan rekomendasi
    if (filter === "recommended") {
      filtered = filtered.filter(car => car.recommended);
    }
  
    // Filter berdasarkan harga
    if (filter === "priceLow") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filter === "priceHigh") {
      filtered.sort((a, b) => b.price - a.price);
    }
  
    // Urutkan berdasarkan kepopuleran
    if (filter === "popularity") {
      const rentalCounts = rentalData.reduce((acc, rent) => {
        acc[rent.car_id] = (acc[rent.car_id] || 0) + 1;
        return acc;
      }, {});
  
      filtered.sort((a, b) => {
        const aCount = rentalCounts[a.id] || 0;
        const bCount = rentalCounts[b.id] || 0;
        return bCount - aCount; // Urutkan dari yang paling banyak disewa
      });
    }
  
    // Filter mobil dengan kondisi !== 0
    return filtered.filter(car => car.kondisi !== 0);
  };
  

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box className="box-container">
      <Navbar
        sidebarContent={<HomeSidebarContent />}
        links={<NavbarLinks />}
        buttons={
          showNavbarContent &&
          (isLoggedIn ? (
            <>
              {/* <SearchInput type={"cars"} /> */}
              <AvatarMenu />
            </>
          ) : (
            <NavbarLoginButtons />
          ))
        }
      />
      <Box className="box-container" maxWidth="1200px" mx="auto" p={4}>
      {/* Tampilkan notifikasi jika ada rental yang telat */}
      {lateReturns.length > 0 && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <Text>Ada {lateReturns.length} rental yang telat dikembalikan!</Text>
        </Alert>
      )}

      {/* Render komponen lain, misalnya daftar mobil */}
      {/* Your other JSX code here */}
    </Box>
      <Box flexGrow={1}>
        {isLoadingVStack ? (
          <VStack py={10} m={"100px"}>
            <LoadingAnimation />
          </VStack>
        ) : (
          <VStack>
            {/* Input filter berdasarkan brand dan dropdown filter */}
            <HStack spacing={4} mb={4}>
              <Input
                placeholder="Cari berdasarkan brand"
                value={brandFilter}
                onChange={handleBrandInputChange}
              />
              <Select onChange={handleFilterChange} value={filter}>
                <option value="all">Tampilkan Semua</option>
                <option value="recommended">Direkomendasikan</option>
                <option value="priceLow">Harga: Dari Termurah</option>
                <option value="priceHigh">Harga: Dari Termahal</option>
                <option value="popularity">Kepopuleran</option>
              </Select>
              <Stack w={"full"}>
                <Text>Melayani pukul:</Text>
                <Text>
                  <Text as="span" color={"green.500"}>09.00 - 15.00</Text> WIB
                </Text>
              </Stack>
            </HStack>

            {filteredCars().length === 0 ? (
              <Text p={"100px"}>Tidak ada data</Text>
            ) : (
              <SimpleGrid columns={[1, 1, 2, 2, 3]} rowGap={6} columnGap={8} py={10}>
                {filteredCars()
                  .filter(car => car.kondisi !== 0)  // Filter mobil berdasarkan kondisi
                  .map((car) => (
                    <GridItem key={car.id} colSpan={1}>
                      <CarCard props={car} />
                    </GridItem>
                  ))}
              </SimpleGrid>
            )}
          </VStack>
        )}
      </Box>
      <Footer />
    </Box>
  );
}

export default BookCars;
