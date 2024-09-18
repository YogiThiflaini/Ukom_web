import {
    useToast,
    Button,
    Link,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";
import FormButton from "./form-button";
import FormInput from "./form-input";
import { showToast } from "../toast-alert";
import { useTranslation } from "react-i18next";

const VerifyForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast();
    const email = useRef();
    const verifyCode = useRef(); // Ref untuk menyimpan input verify code

    const handleVerify = () => {
        const token = verifyCode.current.value;
        axios
            .get(`http://127.0.0.1:8000/api/verify-email/${token}`)
            .then(({data}) => {
                showToast(toast, "Akun anda berhasil diverifikasi.", "success", "Success");
                navigate('/login');
            })
            .catch((error) => {
                console.error("Verification Error:", error);
                showToast(toast, "Gagal memverifikasi kode, silahkan coba lagi.");
            });
    };

    const verify = (e) => {
        e.preventDefault();
        handleVerify(); // Memanggil fungsi untuk memverifikasi kode
    };

    const sendVerificationMail = () => {
        axios
          .post("http://127.0.0.1:8000/api/resend-verification", {
            email: localStorage.getItem("email"),
          })
          .then((response) => {
            showToast(toast, "Kode verifikasi telah dikirim ulang.", "success", "Success");
            // Redirect jika perlu
            // navigate("/verify");
          })
          .catch((error) => {
            showToast(toast, "Gagal mengirim ulang kode verifikasi, silahkan coba lagi.", "error");
          });
      };
      console.log(localStorage.getItem("email"));

    return (
        <div className="col-md-6 col-lg-6 p-md-5 px-4 py-5">
            <form onSubmit={verify}>
                <FormInput name="Verifikasi Code" type="text" refe={verifyCode} />
                {/* <FormInput name="Email" type="email" refe={email} /> */}
                <Link
                  colorScheme="blue"
                  onClick={() => {
                    sendVerificationMail();
                  }}
                  ml={3}
                >
                  Kirim Ulang Kode Verifikasi
                </Link>
                <FormButton bgColor="btn btn-primary" btnText="Verifikasi Code" type="submit" />
            </form>
        </div>
    );
};

export default VerifyForm;
