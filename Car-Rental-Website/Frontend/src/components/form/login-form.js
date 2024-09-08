import {
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Link,
  Textarea,
} from "@chakra-ui/react"; // Import Textarea dari Chakra UI
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import FormButton from "./form-button";
import FormInput from "./form-input";
import useAuthentication from "../../useAuthentication";
import { showToast } from "../toast-alert";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const { t } = useTranslation();
  const { setLoggedIn } = useAuthentication();
  const navigate = useNavigate();
  const toast = useToast();
  const email = useRef();
  const password = useRef();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [description, setDescription] = useState(""); // State untuk menyimpan deskripsi
  const cancelRef = useRef();

  const handleLogin = () => {
    localStorage.setItem("email",email.current.value);
    if (!email.current.value || !password.current.value) {
      showToast(toast, "Email dan password harus diisi.", "error");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/login", {
        email: email.current.value,
        password: password.current.value,
      })
      .then((response) => {
        const { success, message, data } = response.data;
        const status = response.status;

        if (status === 200 && success) {
          showToast(toast, "Kamu telah berhasil login.", "success", "Success");

          localStorage.setItem("id", data.id);
          localStorage.setItem("firstname", data.firstname);
          localStorage.setItem("lastname", data.lastname);
          localStorage.setItem("telephone", data.telephone);
          localStorage.setItem("email", data.email);
          localStorage.setItem("alamat", data.alamat);
          localStorage.setItem("level", data.level);
          localStorage.setItem("profile_photo", data.profile_photo);

          if (data.level === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/cars");
          }

          setLoggedIn(true);
        } else if (status === 403) {
          showToast(toast, "Akun belum terverifikasi, silahkan verifikasi dahulu", "error");
          setAlertType("verify");
          setIsAlertOpen(true);
        } else if (status === 401) {
          showToast(toast, "Password salah, silahkan coba lagi.", "error");
          setAlertType("signup");
          setIsAlertOpen(true);
        } else {
          showToast(toast, "Email tidak ditemukan, silahkan registerasi dahulu.", "error");
          setAlertType("signup");
          setIsAlertOpen(true);
        }
      })
      .catch((error) => {
        const errorStatus = error.response.status;
        if (errorStatus === 402) {
          // Akun diblokir admin
          showToast(toast, "Akun Anda telah diblokir oleh admin.", "error");
          setAlertType("banned");
          setIsAlertOpen(true);
        } else if (errorStatus === 403) {
          showToast(toast, "Akun belum terverifikasi, silahkan verifikasi dahulu", "error");
          setAlertType("verify");
          setIsAlertOpen(true);
        } else if (errorStatus === 401) {
          showToast(toast, "Password salah, silahkan coba lagi.", "error");
        } else {
          showToast(toast, "Email tidak ditemukan, silahkan registerasi dahulu.", "error");
          setAlertType("signup");
          setIsAlertOpen(true);
        }
      });
  };

  const Login = (e) => {
    e.preventDefault();
    setAlertType("login");
    setIsAlertOpen(true);
  };

  const sendVerificationMail = () => {
    axios
      .post("http://127.0.0.1:8000/api/resend-verification", {
        email: email.current.value,
      })
      .then((response) => {
        navigate("/verify");
      });
  };

  const sendAccountReactivationRequest = () => {
    axios
      .post("http://127.0.0.1:8000/api/account-requests", {
        user_id: localStorage.getItem("id"), // Menggunakan ID user dari localStorage
        email: localStorage.getItem("email"), // Mengambil email dari localStorage
        description: description, // Mengirim deskripsi dari form
      })
      .then(() => {
        showToast(toast, "Permintaan aktivasi akun telah dikirim.", "success");
        setIsAlertOpen(false);
      })
      .catch(() => {
        showToast(toast, "Gagal mengirim permintaan aktivasi akun.", "error");
      });
  };

  return (
    <div className="col-md-6 col-lg-6 p-md-5 px-4 py-5">
      <form onSubmit={Login}>
        <FormInput name={t("form.email")} type="email" refe={email} />
        <FormInput name={t("form.password")} type="password" refe={password} />
        <Link mt={4} colorScheme="blue" onClick={() => navigate("/reset-password")}>
          Lupa Password?
        </Link>
        <FormButton bgColor="btn btn-warning" btnText={t("form.signIn")} />
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
              {alertType === "login"
                ? "Konfirmasi Login"
                : alertType === "verify"
                ? "Verifikasi Email"
                : alertType === "banned"
                ? "Akun Diblokir"
                : "Login Gagal"}
            </AlertDialogHeader>
            <AlertDialogBody>
              {alertType === "login"
                ? "Apakah Anda yakin ingin login dengan data yang Anda masukkan?"
                : alertType === "verify"
                ? "Email Anda belum terverifikasi. Silahkan verifikasi email Anda atau minta kode verifikasi ulang."
                : alertType === "banned"
                ? "Akun Anda telah diblokir oleh admin. Silahkan kirim permohonan untuk mengaktifkan kembali akun Anda."
                : "Email Anda tidak terdaftar. Silahkan daftar terlebih dahulu."}

              {/* Formulir untuk permohonan aktivasi akun */}
              {alertType === "banned" && (
                <>
                  <p>Email: {localStorage.getItem("email")}</p>
                  <Textarea
                    placeholder="Jelaskan alasan permohonan aktivasi akun"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Batal
              </Button>
              {alertType === "login" ? (
                <Button
                  colorScheme="green"
                  onClick={() => {
                    setIsAlertOpen(false);
                    handleLogin();
                  }}
                  ml={3}
                >
                  Login
                </Button>
              ) : alertType === "verify" ? (
                <Button
                  colorScheme="orange"
                  onClick={() => {
                    setIsAlertOpen(false);
                    sendVerificationMail();
                  }}
                  ml={3}
                >
                  Verifikasi
                </Button>
              ) : alertType === "banned" ? (
                <Button
                  colorScheme="blue"
                  onClick={sendAccountReactivationRequest}
                  ml={3}
                >
                  Kirim Permohonan
                </Button>
              ) : (
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setIsAlertOpen(false);
                    navigate("/signup");
                  }}
                  ml={3}
                >
                  Buat Akun
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default LoginForm;
