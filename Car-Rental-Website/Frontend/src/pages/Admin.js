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
} from "@chakra-ui/react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
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
  PointElement,
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
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));

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

        const incomeByUserMap = rentalsData.reduce((acc, rent) => {
          const userEmail = rent.email;
          if (!acc[userEmail]) {
            acc[userEmail] = 0;
          }
          acc[userEmail] += rent.pays;
          return acc;
        }, {});

        setIncomeByUser(Object.values(incomeByUserMap));
        setIncomeUserEmails(Object.keys(incomeByUserMap));

        const today = moment().format("YYYY-MM-DD");
        const todayRentsData = rentalsData.filter((rent) =>
          moment(rent.created_at).isSame(today, "day")
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
    labels: incomeUserEmails,
    datasets: [
      {
        label: 'Total Pendapatan Per Pengguna',
        data: incomeByUser,
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
        <StatBox title="Total Pendapatan" stat={`${totalIncome.toLocaleString('id-ID')} IDR`} icon="💵" />
        <StatBox title="Waktu Sekarang" stat={currentTime} icon="⏰" />

        {/* Grafik Lingkaran: Status User */}
        <Box p={6} bg="#E0F7FA" borderRadius="lg" shadow="md" width="90%" height="450px">
          <Heading as="h4" size="md" mb={4}>Status User</Heading>
          <Pie data={pieData} options={pieOptions} />
        </Box>

        {/* Grafik Batang: Total Pendapatan Per Pengguna */}
        <Box p={6} bg="#E0F7FA" borderRadius="lg" shadow="md" width="90%" height="450px">
          <Heading as="h6" size="md" mb={4}>Pendapatan Per Pengguna</Heading>
          <Bar data={barData} options={pieOptions} />
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
