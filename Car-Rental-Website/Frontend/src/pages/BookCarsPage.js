import { Box, GridItem, SimpleGrid, VStack } from "@chakra-ui/react";
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

function BookCars() {
  const { searchResults } = useContext(SearchContext);
  const [cars, setCars] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingVStack, setLoadingVStack] = useState(true);
  const { isLoggedIn } = useAuthentication();
  const [showNavbarContent, setShowNavbarContent] = useState(false);

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
    }, 6500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNavbarContent(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

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
              <SearchInput type={"cars"} />
              <AvatarMenu />
            </>
          ) : (
            <NavbarLoginButtons />
          ))
        }
      />
      <Box flexGrow={1}>
        {isLoadingVStack ? (
          <VStack py={10}>
            <LoadingAnimation />
          </VStack>
        ) : (
          <VStack>
            <SimpleGrid
              columns={[1, 1, 2, 2, 3]}
              rowGap={6}
              columnGap={8}
              py={10}
            >
              {searchResults && searchResults.length > 0
                ? searchResults.map((car) => (
                    <GridItem key={car.id} colSpan={1}>
                      <CarCard props={car} />
                    </GridItem>
                  ))
                : cars.map((car) => (
                    <GridItem key={car.id} colSpan={1}>
                      <CarCard props={car} />
                    </GridItem>
                  ))}
            </SimpleGrid>
          </VStack>
        )}
      </Box>
      <Footer />
    </Box>
  );
}

export default BookCars;
