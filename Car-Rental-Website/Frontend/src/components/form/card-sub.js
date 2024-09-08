import { Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SubCard = ({
  bgColor,
  question,

}) => {
  const { t } = useTranslation();

  return (
    <div
      className={
        bgColor +
        " p-4 text-white text-center d-flex align-items-center order-md-last"
      }
    >
      <div className="p-lg-5 p-md-0 p-4 w-100">
        <Heading fontFamily="" fontWeight="400" mb={3}>
        {t("form.welcome")}
        </Heading>
        <Text mb={6}>Tolong masukkan code verifikasi anda!</Text>
      </div>
    </div>
  );
};

export default SubCard;
