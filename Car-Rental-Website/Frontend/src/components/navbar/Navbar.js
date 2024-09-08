import { Container, Flex } from "@chakra-ui/react";
import NavbarLinks from "./NavbarLinks";

const Navbar = ({ sidebarContent, links, buttons }) => {
  return (
    <Container maxWidth="1720px" px={[4, 4, 4]} py={0}>
      <nav className="navbar navbar-expand-md my-2">
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          bg="blue.300"
          borderBottom="1px"
          borderColor="blackAlpha.300"
          h="14"
        >
          {sidebarContent}
          {links}
          {buttons}
        </Flex>
      </nav>
    </Container>
  );
};

export default Navbar;
