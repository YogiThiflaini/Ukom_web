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
  Checkbox,
  HStack,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";
import FormButton from "./form-button";
import FormInput from "./form-input";
import { showToast } from "../toast-alert";
import { useTranslation } from "react-i18next";

const SignUpForm = () => {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const navigate = (route) => navigation(route);
  const toast = useToast();
  const firstname = useRef();
  const lastname = useRef();
  const telephone = useRef();
  const email = useRef();
  const alamat = useRef();
  const password = useRef();
  const profilePhoto = useRef(); // Input untuk foto profil
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // State untuk checkbox
  const cancelRef = useRef();
  const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/;

  // Handle upload file
  const [fileUrl, setFileUrl] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const fileUrl = reader.result;
      setFileUrl(fileUrl); // Menyimpan URL file untuk pratinjau atau tujuan lainnya
    };

    reader.readAsDataURL(file);
  };

  const handleSignUp = () => {
    if (!password.current.value.match(passwordRegEx)) {
      showToast(
        toast,
        "Password minimal 3 karakter dan memiliki huruf dan angka."
      );
      return;
    } else {
      // Membuat form data untuk mengirimkan data dan file
      const formData = new FormData();
      formData.append("firstname", firstname.current.value);
      formData.append("lastname", lastname.current.value);
      formData.append("telephone", telephone.current.value);
      formData.append("email", email.current.value);
      formData.append("alamat", alamat.current.value);
      formData.append("password", password.current.value);
      formData.append("profile_photo", profilePhoto.current.files[0]); // Menambahkan file foto profil

      axios
        .post("http://127.0.0.1:8000/api/signup", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Pastikan header diatur untuk mengirimkan file
          },
        })
        .then(() => {
          console.log("Anda sudah berhasil membuat akun");
          showToast(toast, "Akun anda berhasil dibuat.", "success", "Success");
          navigate("/verify");
        })
        .catch((error) => showToast(toast, error.response.data.message));
    }
  };

  const createUserAcccount = (e) => {
    e.preventDefault();
    setIsAlertOpen(true); // Membuka popup konfirmasi
  };

  return (
    <div className="col-md-6 col-lg-6 p-md-5 px-4 py-5">
      <form onSubmit={createUserAcccount}>
        <FormInput name={t("form.firstname")} type="text" refe={firstname} />
        <FormInput name={t("form.lastname")} type="text" refe={lastname} />
        <FormInput name={t("form.telephone")} type="tel" refe={telephone} />
        <FormInput name={t("form.email")} type="email" refe={email} />
        <FormInput name={t("form.alamat")} type="text" refe={alamat} />
        <FormInput name={t("form.password")} type="password" refe={password} />
        
        {/* Tambahkan input untuk upload foto profil */}
        <HStack>
          <FormLabel>Foto Profil: </FormLabel>
          <Input
            id="profile_photo"
            type="file"
            accept="image/*"
            ref={profilePhoto}
            onChange={handleFileChange}
          />
        </HStack>

        <Checkbox
          isChecked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          mb={4}
        >
          Konfirmasi membuat akun
        </Checkbox>

        <FormButton bgColor="btn btn-danger" btnText={t("form.createAccount")} />
      </form>

      {/* Alert Dialog for Confirmation */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Konfirmasi Pendaftaran
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin ingin membuat akun dengan data yang Anda masukkan?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Batal
              </Button>
              <Button
                colorScheme="green"
                onClick={() => {
                  setIsAlertOpen(false);
                  handleSignUp(); // Memanggil fungsi untuk membuat akun jika pengguna mengonfirmasi
                }}
                ml={3}
                isDisabled={!isChecked} // Disable jika checkbox tidak dicentang
              >
                Daftar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default SignUpForm;
