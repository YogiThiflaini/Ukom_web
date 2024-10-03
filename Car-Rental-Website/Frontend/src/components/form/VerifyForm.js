import { useState } from "react";
import { useToast, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/users/send-topup-token`, { email });
      toast({
        title: "OTP Terkirim",
        description: "Kode OTP telah dikirim ke email Anda.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setOtpSent(true);
    } catch (error) {
      toast({
        title: "Gagal Mengirim OTP",
        description: "Terjadi kesalahan saat mengirim kode OTP.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/users/validate-topup-token`, { email, otp });
      toast({
        title: "Verifikasi Berhasil",
        description: "OTP valid, Anda dapat melanjutkan untuk mengubah password.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/reset-password", { state: { email } });  // Mengarahkan ke halaman reset password dengan email yang sudah diverifikasi
    } catch (error) {
      toast({
        title: "Verifikasi Gagal",
        description: "Kode OTP yang Anda masukkan salah atau telah kadaluarsa.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-6 col-lg-6 p-md-5 px-4 py-5">
      {!otpSent ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
          <FormControl id="email" mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <Button
            colorScheme="blue"
            isLoading={loading}
            type="submit"
          >
            Kirim OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
          <FormControl id="otp" mb={4}>
            <FormLabel>Masukkan OTP</FormLabel>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </FormControl>
          <Button
            colorScheme="green"
            isLoading={loading}
            type="submit"
          >
            Verifikasi OTP
          </Button>
        </form>
      )}
    </div>
  );
};

export default VerifyForm;
