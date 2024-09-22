<!DOCTYPE html>
<html>

<head>
    <title>Konfirmasi Akun Anda</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }
        }
        body, table, td, a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
        }
        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            font-family: 'Lato', Helvetica, Arial, sans-serif;
            background-color: #f4f4f4;
        }
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        @media screen and (max-width:600px) {
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }
        .otp-box {
            font-size: 36px;
            font-weight: bold;
            color: #0066CC;
            border: 2px solid #0066CC;
            padding: 20px;
            text-align: center;
            letter-spacing: 2px;
            border-radius: 10px;
            display: inline-block;
            margin-top: 20px;
        }
        .content {
            color: #666666;
            font-size: 18px;
            line-height: 25px;
        }
    </style>
</head>

<body>
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Kami sangat senang memiliki Anda di sini! Bersiaplah untuk memulai akun baru Anda.
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#0066CC" align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#0066CC" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top"
                            style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                            <h1 style="font-size: 48px; font-weight: 400; margin: 2; text-align: center; color: #0066CC;">Selamat Datang!</h1>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px;" class="content">
                            <p style="margin: 0;">
                                Kami sangat senang Anda telah bergabung dengan DAYstore! Sebelum melanjutkan, kami hanya perlu mengonfirmasi akun Anda.
                                Ini adalah langkah penting untuk memastikan akun Anda aman. Jangan khawatir, kami hanya akan memakan waktu sebentar.
                            </p>
                            <p style="margin: 0; padding-top: 15px;">
                                Akun Anda telah siap digunakan untuk berbagai layanan DAYstore. Kami berkomitmen untuk memberikan pengalaman terbaik dan kemudahan dalam transaksi online. 
                                Jangan lewatkan kesempatan untuk menikmati layanan eksklusif yang telah kami siapkan hanya untuk Anda.
                            </p>
                            <p style="margin: 0; padding-top: 15px;">
                                Untuk melengkapi proses ini, masukkan kode OTP berikut untuk memverifikasi akun Anda. Kode ini bersifat rahasia, jadi pastikan untuk tidak membagikannya kepada siapa pun.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 40px 30px;">
                            <div class="otp-box">
                                {{ $token }}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" class="content" style="padding: 0px 30px 0px 30px;">
                            <p style="margin: 0;">
                                Jika Anda tidak meminta kode ini, silakan abaikan email ini. Namun, jika Anda memiliki pertanyaan atau memerlukan bantuan, jangan ragu untuk menghubungi tim dukungan kami.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px;" class="content">
                            <p style="margin: 0;">
                                Harap diingat bahwa tautan ini akan kedaluwarsa dalam 24 jam. Jangan menunggu terlalu lama untuk mengonfirmasi akun Anda. Klik <a href="{{ url('/verify-email/'.$token) }}" target="_blank" style="color: #0066CC; font-weight: bold;">di sini</a> untuk memverifikasi.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="center" style="padding: 30px 30px 40px 30px;" class="content">
                            <h2 style="font-size: 20px; font-weight: 400; color: #0066CC;">Butuh Bantuan?</h2>
                            <p style="margin: 0;">Jika Anda mengalami kesulitan atau memiliki pertanyaan, balas saja email ini atau kunjungi <a href="#" target="_blank" style="color: #0066CC; text-decoration: underline;">Pusat Bantuan kami</a>.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-size: 14px; line-height: 18px;">
                                        <p style="margin: 0;">Jika email ini mulai mengganggu, silakan <a href="#" target="_blank" style="color: #0066CC; font-weight: 700;">berhenti berlangganan</a>.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px;">
                <p style="font-size: 12px; color: #666666;">© 2024 DAYstore. Semua hak dilindungi.</p>
            </td>
        </tr>
    </table>
</body>

</html>
