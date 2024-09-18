import { Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const HomePageText = () => {
  const { t } = useTranslation();

  return (
    <>
      <Heading size="2xl"color="blue">
        <Text as="span" color="orange">
          {t("homePageText.spanTitle")}
        </Text>
        {t("homePageText.title")}
      </Heading>
      <Text pr={"10%"}>{t("homePageText.description")}</Text>
    </>
  );
};

export default HomePageText;
