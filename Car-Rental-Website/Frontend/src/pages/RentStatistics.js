import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Button, Flex, Box } from "@chakra-ui/react";
import LoadingAnimation from "../components/ui/LoadingAnimation";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, TimeScale);

function RentStatistics() {
  const [rentChartData, setRentChartData] = useState({});
  const [startDate, setStartDate] = useState(new Date());  // Tanggal mulai
  const [endDate, setEndDate] = useState(new Date());      // Tanggal akhir
  const [showCancel0, setShowCancel0] = useState(true);    // State untuk kontrol grafik cancel=0
  const [showCancel1, setShowCancel1] = useState(true);    // State untuk kontrol grafik cancel=1

  // Function untuk mengatur rentang tanggal default (10 hari)
  const setDefaultDateRange = () => {
    const today = new Date();
    setEndDate(today);

    const start = new Date();
    start.setDate(today.getDate() - 10);
    setStartDate(start);
  };

  // Function untuk memindahkan rentang tanggal mundur 10 hari
  const moveToPrevious10Days = () => {
    const newEndDate = new Date(startDate);
    const newStartDate = new Date(newEndDate);
    newStartDate.setDate(newStartDate.getDate() - 10);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Fetching Rent Data
  const fetchRentData = () => {
    axios
      .get("http://127.0.0.1:8000/api/rents")
      .then((response) => {
        const rentsData = response.data.data || [];

        // Data untuk cancel=0 (created_at)
        const cancel0Dates = rentsData
          .filter(rent => rent.cancel === 0)
          .map((rent) => rent.created_at?.split(" ")[0])
          .filter(date => date);

        const cancel0CountByDate = cancel0Dates.reduce((acc, date) => {
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Data untuk cancel=1 (updated_at)
        const cancel1Dates = rentsData
          .filter(rent => rent.cancel === 1)
          .map((rent) => rent.updated_at?.split(" ")[0])
          .filter(date => date);

        const cancel1CountByDate = cancel1Dates.reduce((acc, date) => {
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Buat label tanggal dengan filter berdasarkan rentang tanggal yang ditentukan
        const dateRange = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split("T")[0];
          dateRange.push(dateStr);
        }

        // Isi nilai berdasarkan rent counts
        const filledCancel0Count = dateRange.map(date => cancel0CountByDate[date] || 0);
        const filledCancel1Count = dateRange.map(date => cancel1CountByDate[date] || 0);

        setRentChartData({
          labels: dateRange,
          datasets: [
            {
              label: "Yang disewakan",
              data: showCancel0 ? filledCancel0Count : [],
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              pointBackgroundColor: "rgba(54, 162, 235, 1)",
              borderWidth: 2,
              tension: 0.3,
              fill: true,
            },
            {
              label: "Yang dibatalkan",
              data: showCancel1 ? filledCancel1Count : [],
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              pointBackgroundColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
              tension: 0.3,
              fill: true,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching rents:", error);
      });
  };

  // Call this when component mounts or dates change
  useEffect(() => {
    setDefaultDateRange();
  }, []);

  useEffect(() => {
    fetchRentData();
  }, [startDate, endDate, showCancel0, showCancel1]);

  return (
    <Box p={4}>
      {/* Kontrol tombol */}
      <Flex 
          direction={{ base: 'column', md: 'row' }} // Tombol akan tersusun kolom di perangkat kecil
          wrap="wrap" 
          justify="center" 
          mb={4}
        >
          {/* Tombol untuk memilih rentang tanggal */}
          <Button colorScheme="purple" mx={2} my={2} onClick={moveToPrevious10Days}>
            Lihat 10 hari ke belakang
          </Button>
          <Button colorScheme="orange" mx={2} my={2} onClick={setDefaultDateRange}>
            Kembali 10 hari sekarang
          </Button>

          {/* Tombol untuk menampilkan/senyumikan grafik berdasarkan cancel */}
          {/* <Button colorScheme="blue" mx={2} my={2} onClick={() => setShowCancel0(!showCancel0)}>
            {showCancel0 ? "Sembunyikan yang disewa" : "Tampilkan yang disewa"}
          </Button>
          <Button colorScheme="red" mx={2} my={2} onClick={() => setShowCancel1(!showCancel1)}>
            {showCancel1 ? "Sembunyikan yang dicancel" : "Tampilkan yang dicancel"}
          </Button> */}
        </Flex>


      {/* Rent Chart */}
      {rentChartData && rentChartData.labels && rentChartData.labels.length > 0 ? (
        <Box width="100%" maxW="900px" mx="auto">
          <Line
            data={rentChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Statistik Penyewaan Mobil DAYstore",
                  color: "#333",
                  font: { size: 18, weight: "bold" },
                },
              },
              scales: {
                x: {
                  type: 'time',
                  time: { unit: 'day' },
                  title: { display: true, text: 'Tanggal', color: "#666" },
                },
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Jumlah Penyewaan', color: "#666" },
                },
              },
            }}
          />
        </Box>
      ) : (
        <LoadingAnimation />
      )}
    </Box>
  );
}

export default RentStatistics;
