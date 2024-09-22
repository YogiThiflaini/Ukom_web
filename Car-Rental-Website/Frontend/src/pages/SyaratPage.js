import React, { useEffect, useState } from 'react';
import { Container, Heading, Text, Divider, VStack, HStack } from '@chakra-ui/react';
import useAuthentication from '../useAuthentication';
import Navbar from '../components/navbar/Navbar';
import NavbarLoginButtons from '../components/navbar/login-buttons';
import Footer from '../components/footer';
import HomeSidebarContent from '../components/home/home-sidebar-content';
import NavbarLinks from '../components/navbar/NavbarLinks';
import AvatarMenu from '../components/navbar/avatar-menu';

const SyaratPage = () => {
    const { isLoggedIn } = useAuthentication();
    const [showNavbarContent, setShowNavbarContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNavbarContent(true);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Navbar
                sidebarContent={<HomeSidebarContent />}
                links={<NavbarLinks />}
                buttons={
                    showNavbarContent &&
                    (isLoggedIn ? <AvatarMenu /> : <NavbarLoginButtons />)
                }
            />
            <Container overflow="hidden" maxWidth="2500vh" pl={14} mb={200}>
                <VStack spacing={4} align="stretch">
                    <Heading as="h1" size="xl" mb={2}>
                        Syarat dan Ketentuan
                    </Heading>
                    <Text fontSize="lg" mb={4}>
                        Selamat datang di DAYstore! Sebelum menggunakan layanan kami, harap baca dan pahami syarat dan ketentuan berikut:
                    </Text>

                    <Divider my={6} />

                    <Heading as="h2" size="lg" mb={3}>
                        1. Penggunaan Layanan
                    </Heading>
                    <Text mb={6}>
                        Dengan mengakses dan menggunakan layanan kami, Anda setuju untuk mematuhi syarat dan ketentuan yang berlaku. Jika Anda tidak setuju dengan syarat dan ketentuan ini, mohon untuk tidak menggunakan layanan kami.
                    </Text>

                    <Heading as="h2" size="lg" mb={3}>
                        2. Kelayakan Sewa
                    </Heading>
                    <Text mb={6}>
                        Untuk menyewa kendaraan dari DAYstore, Anda harus memenuhi syarat berikut:
                        <ul>
                            <li>Berusia di atas 21 tahun.</li>
                            <li>Memiliki kartu identitas yang valid seperti kartu kredit atau kartu debit.</li>
                            <li>Salinan SIM atau KTP juga diperlukan.</li>
                            <li>Pengambilan sesuai tanggal sewa jam 09.00 - 15.00 (jika lebih kami anggap batal)</li>
                            <li>Jika tidak ada kejelasan pengembalian kami akan menghubungi anda</li>
                            <li>Jika sangat lama pengembalian kami akan melaporkan anda ke pihak berwajib</li>
                        </ul>
                    </Text>

                    <Heading as="h2" size="lg" mb={3}>
                        3. Kondisi Kendaraan
                    </Heading>
                    <Text mb={6}>
                        Kendaraan harus dikembalikan dalam kondisi yang sama seperti saat disewa. Segala kerusakan atau kehilangan akan menjadi tanggung jawab penyewa.
                    </Text>

                    <Heading as="h2" size="lg" mb={3}>
                        4. Biaya Keterlambatan
                    </Heading>
                    <Text mb={6}>
                        Jika terjadi keterlambatan dalam pengembalian kendaraan, akan dikenakan biaya tambahan. Biaya keterlambatan adalah sekitar Rp 100.000 hingga Rp 200.000 per hari, tergantung pada jenis kendaraan dan lama keterlambatan.
                    </Text>

                    <Heading as="h2" size="lg" mb={3}>
                        5. Perubahan Syarat dan Ketentuan
                    </Heading>
                    <Text mb={6}>
                        Kami berhak untuk memperbarui atau mengubah syarat dan ketentuan ini kapan saja. Perubahan akan diumumkan melalui situs web kami, dan penggunaan berkelanjutan Anda atas layanan kami setelah perubahan tersebut akan dianggap sebagai penerimaan terhadap perubahan tersebut.
                    </Text>

                    <Heading as="h2" size="lg" mb={3}>
                        6. Kontak
                    </Heading>
                    <Text mb={6}>
                        Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, jangan ragu untuk menghubungi kami melalui email di <a href="mailto:support@daystore.com">support@daystore.com</a> atau melalui formulir kontak di situs web kami.
                    </Text>

                    <Text fontSize="sm" mb={6}>
                        Note* : Terakhir diperbarui pada 20 September 2024.
                    </Text>
                </VStack>
            </Container>
            <br></br>
            <Footer mt={4}/>
        </>
    );
};

export default SyaratPage;
