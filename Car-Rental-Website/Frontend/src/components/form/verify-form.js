import {
    useToast,
    Button,
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
    const verifyCode = useRef(); // Ref untuk menyimpan input verify code
   // Ganti dengan token yang sesuai

    const handleVerify = () => {
        // Menggunakan token untuk verifikasi verify code
        
        const token = verifyCode.current.value;
        alert(token)
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

    return (
        <div className="col-md-6 col-lg-6 p-md-5 px-4 py-5">
            <form onSubmit={verify}>
                <FormInput name="Verifikasi Code" type="text" refe={verifyCode} />
                <FormButton bgColor="btn btn-primary" btnText="Verifikasi Code" type="submit" />
            </form>
        </div>
    );
};

export default VerifyForm;
