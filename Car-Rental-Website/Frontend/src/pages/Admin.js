import { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Flex,
  Stat,
  StatNumber,
  useToast,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const toast = useToast();
  const [usersCount, setUsersCount] = useState(0);
  const [carsCount, setCarsCount] = useState(0);
  const [rentsCount, setRentsCount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [incomeByUser, setIncomeByUser] = useState([]);
  const [incomeUserEmails, setIncomeUserEmails] = useState([]);
  const [todayRents, setTodayRents] = useState(0);
  const [UserAktif, setUserAktif] = useState(0);
  const [UserBanned, setUserBanned] = useState(0);
  const [adminUser, setAdminUser] = useState('');
  const [todayPickups, setTodayPickups] = useState(0);  // State baru untuk rental hari ini
  const [todayReturns, setTodayReturns] = useState(0);  
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));
  const [currentIndex, setCurrentIndex] = useState(0); // Indeks pengguna yang ditampilkan

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://127.0.0.1:8000/api/users");
        setUsersCount(usersResponse.data.data.length);

        const carsResponse = await axios.get("http://127.0.0.1:8000/api/cars");
        setCarsCount(carsResponse.data.data.length);

        const rentsResponse = await axios.get("http://127.0.0.1:8000/api/rents");
        setRentsCount(rentsResponse.data.data.length);

        // Menghitung total pendapatan dan pendapatan per pengguna
        const rentalsData = rentsResponse.data.data;
        const totalIncomeSum = rentalsData.reduce((acc, rent) => acc + rent.pays, 0);
        setTotalIncome(totalIncomeSum);
        
        const cancelled = usersResponse.data.data.filter(user => user.banned === 0 && user.level === 'user');
        const completed = usersResponse.data.data.filter(user => user.banned === 1 && user.level === 'user');
        const admin = usersResponse.data.data.filter(user => user.level === 'admin');
        setUserAktif(cancelled.length);
        setUserBanned(completed.length);
        setAdminUser(admin.length);

        // Menghitung pendapatan per pengguna dengan level 'user' saja
        const incomeByUserMap = {};
        usersResponse.data.data.forEach(user => {
          if (user.level === 'user') {
            const userEmail = user.email;
            const userIncome = rentalsData.reduce((acc, rent) => {
              return rent.email === userEmail ? acc + rent.pays : acc;
            }, 0);
            incomeByUserMap[userEmail] = userIncome;
          }
        });

        // Dapatkan array dari objek incomeByUserMap
        const incomeEntries = Object.entries(incomeByUserMap);
        setIncomeUserEmails(incomeEntries.map(([email]) => email));
        setIncomeByUser(incomeEntries.map(([, income]) => income));

        const today = moment().format("YYYY-MM-DD");
        const todayPickupsData = rentalsData.filter((rent) =>
          moment(rent.rental_date).isSame(today, "day")&& rent.cancel !== 1
        );
        setTodayPickups(todayPickupsData.length);

        // Rental yang dikembalikan hari ini berdasarkan 'return_date'
        const todayReturnsData = rentalsData.filter((rent) =>
          moment(rent.return_date).isSame(today, "day")&& rent.cancel !== 1
        );
        setTodayReturns(todayReturnsData.length);

        const todayRentsData = rentalsData.filter((rent) =>
          moment(rent.created_at).isSame(today, "day")&& rent.cancel !== 1
        );
        setTodayRents(todayRentsData.length);

      } catch (error) {
        toast({
          title: "Kesalahan dalam mengambil data",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setCurrentTime(moment().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, [toast]);

  // Ambil maksimal 4 pengguna untuk ditampilkan di grafik batang
  const displayedUserEmails = incomeUserEmails.slice(currentIndex, currentIndex + 4);
  const displayedIncomeByUser = incomeByUser.slice(currentIndex, currentIndex + 4);

  const handleNext = () => {
    if (currentIndex + 4 < incomeUserEmails.length) {
      setCurrentIndex(currentIndex + 4);
    } else {
      setCurrentIndex(0); // Kembali ke awal jika sudah di akhir
    }
  };

  const pieData = {
    labels: ["User aktif", "User banned", "User admin"],
    datasets: [
      {
        label: "Data User",
        data: [UserAktif, UserBanned, adminUser],
        backgroundColor: ["#00ff00", "#f2003c", "#4169e1"],
        hoverBackgroundColor: ["#00ff00", "#f2003c", "#4169e1"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Data untuk Bar Chart
  const barData = {
    labels: displayedUserEmails.length ? displayedUserEmails : ["No Data"],
    datasets: [
      {
        label: 'Total Pendapatan Per Pengguna',
        data: displayedIncomeByUser.length ? displayedIncomeByUser : [0],
        backgroundColor: 'rgb(177,156,217)',
        borderColor: 'rgb(177,156,217)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box p={6} borderRadius="lg" width="100%">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6} minChildWidth="330px">
        <StatBox title="Total Pengguna" stat={usersCount} icon="👤" />
        <StatBox title="Total Mobil" stat={carsCount} icon="🚗" />
        <StatBox title="Total Rental" stat={rentsCount} icon="📅" />
        <StatBox title="Rental Hari Ini" stat={todayRents} icon="📅" />
        <StatBox title="Pengambilan Hari Ini" stat={todayPickups} icon="🚗" /> {/* Pengambilan hari ini */}
        <StatBox title="Pengembalian Hari Ini" stat={todayReturns} icon="🔙" /> 
        <StatBox title="Total Pendapatan" stat={`${totalIncome.toLocaleString('id-ID')} IDR`} icon="💵" />
        <StatBox title="Waktu Sekarang" stat={currentTime} icon="⏰" />

        {/* Grafik Lingkaran: Status User */}
        <Box p={6} bg="#E0F7FA" borderRadius="lg" shadow="md" width="90%" height="450px">
          <Heading as="h4" size="md" mb={4}>Status User</Heading>
          <Pie data={pieData} options={pieOptions} />
        </Box>

        {/* Grafik Batang: Total Pendapatan Per Pengguna */}
        <Box p={6} bg="#E0F7FA" borderRadius="lg" shadow="md" width="90%" height="450px">
          <Heading as="h6" size="md" mb={2}>Pendapatan dari rental</Heading>
          <Box height="350px"> {/* Membatasi tinggi diagram */}
            <Bar data={barData} options={pieOptions} />
          </Box>
          <Flex justify="center" mt={0}>
            <Button onClick={handleNext} bg={"purple.600"} color="white" _hover={{ background: "rgb(153,50,204)", color: "white" }}>
              Lihat Pengguna Selanjutnya
            </Button>
          </Flex>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

// Komponen kotak statistik
const StatBox = ({ title, stat, icon }) => {
  return (
    <Box
      p={6}
      bg="#E0F7FA"
      borderRadius="lg"
      shadow="md"
      border="1px solid"
      borderColor="gray.200"
    >
      <Heading as="h5" size="sm" mb={2}>
        {title}
      </Heading>
      <Flex align="center">
        <Text fontSize="4xl" mr={4}>
          {icon}
        </Text>
        <Stat>
          <StatNumber>{stat}</StatNumber>
        </Stat>
      </Flex>
    </Box>
  );
};

export default AdminDashboard;