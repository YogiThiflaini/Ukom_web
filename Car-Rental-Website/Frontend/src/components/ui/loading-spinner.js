import React, { useEffect, useState } from "react";
import { Spinner, Center } from "@chakra-ui/react";
import './styles.css'; // Pastikan file CSS sudah sesuai

const LoadingSpinner = () => {
  const [bubbles, setBubbles] = useState([]);
  const [randomPositions, setRandomPositions] = useState([]);

  useEffect(() => {
    const bubbleArray = [];
    for (let i = 0; i < 300; i++) {  // Membuat 200 gelembung
      const size = Math.random() * 40 + 10; // Ukuran acak antara 10px dan 50px
      const top = Math.random() * 100; // Posisi acak dari atas ke bawah
      const left = Math.random() * 100; // Posisi acak dari kiri ke kanan
      const xDir = (Math.random() * 2 - 1) * 100; // Arah acak secara horizontal
      const yDir = (Math.random() * 2 - 1) * 100; // Arah acak secara vertikal
      const scale = Math.random() * 1.5 + 0.5; // Skala acak antara 0.5x dan 2x
      const duration = Math.random() * 5 + 5; // Durasi animasi acak
      const delay = Math.random() * -10; // Delay acak

      bubbleArray.push(
        <div
          key={i}
          className="bubble"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            '--x-dir': `${xDir}vw`,
            '--y-dir': `${yDir}vh`,
            '--scale': scale,
          }}
        />
      );
    }
    setBubbles(bubbleArray);

    // Generate random positions for each letter
    const positions = [];
    for (let i = 0; i < 8; i++) {
      positions.push({
        randomX: Math.random() * 2 - 1,  // Nilai acak antara -1 dan 1 untuk X
        randomY: Math.random() * 2 - 1   // Nilai acak antara -1 dan 1 untuk Y
      });
    }
    setRandomPositions(positions);
  }, []);

  return (
    <div className="loading-container">
      {/* Animasi huruf menyebar */}
      <div className="loading-text">
        {['D', 'A', 'Y', 's', 't', 'o', 'r', 'e'].map((char, index) => (
          <span
            key={index}
            style={{
              '--random-x': randomPositions[index]?.randomX || 0,
              '--random-y': randomPositions[index]?.randomY || 0
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Spinner */}
      <Center className="spinner-container">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>

      {/* Gelembung */}
      {bubbles}
    </div>
  );
};

export default LoadingSpinner;
