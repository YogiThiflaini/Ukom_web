import { useRef, useState } from "react";
import {
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormButton from "./form-button";

const PasswordForm = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [cancelRef, setCancelRef] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();

  const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/; // Password harus memiliki minimal 3 huruf dan 3 angka

  const handleOpenAlert = () => setIsAlertOpen(true);
  const handleCloseAlert = () => setIsAlertOpen(false);

  const handleConfirmResetPassword = () => {
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password tidak cocok.",
        description: "Pastikan password baru dan konfirmasi password cocok.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      handleCloseAlert();
      return;
    }

    if (!newPassword.match(passwordRegEx)) {
      toast({
        title: "Password tidak memenuhi syarat.",
        description: "Password harus terdiri dari minimal 3 huruf dan 3 angka.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      handleCloseAlert();
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/reset-password", {
        email: email,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      })
      .then((response) => {
        toast({
          title: "Password berhasil diubah.",
          description: "Password baru Anda telah disimpan.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/login");
      })
      .catch((error) => {
        toast({
          title: "Gagal mengubah password.",
          description: "Terjadi kesalahan saat mengubah password.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
        handleCloseAlert();
      });
  };

  return (
    <div className="col-md-6 col-lg-6 p-md-5 px-4 py-5">
      <form onSubmit={(e) => {
        e.preventDefault();
        handleOpenAlert();
      }}>
        <FormControl id="email" mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <FormControl id="new-password" mb={4}>
          <FormLabel>Password Baru</FormLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </FormControl>
        <FormControl id="confirm-password" mb={4}>
          <FormLabel>Konfirmasi Password</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormControl>
        <FormButton bgColor="btn btn-warning" colorText="white" btnText="Riset Password" />
      </form>

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={handleCloseAlert}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Konfirmasi</AlertDialogHeader>
          <AlertDialogBody>
            Apakah Anda yakin ingin mengubah password? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleCloseAlert}>
              Batal
            </Button>
            <Button
              colorScheme="green"
              onClick={handleConfirmResetPassword}
              ml={3}
              isDisabled={loading} // Disable jika proses loading
            >
              Konfirmasi
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PasswordForm;
