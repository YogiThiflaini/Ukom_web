<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Token Verifikasi Top-Up Anda</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #007BFF;
        }
        .content {
            font-size: 16px;
            line-height: 1.5;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verifikasi Top-Up Anda</h1>
        </div>
        <div class="content">
            <p>Halo,</p>
            <p>Terima kasih telah melakukan permintaan untuk top-up saldo Anda. Kami ingin memastikan bahwa permintaan ini adalah sah dan dari Anda. Untuk itu, kami telah menghasilkan token verifikasi sebagai bagian dari proses ini.</p>
            <p>Token verifikasi top-up Anda adalah: <strong>{{ $token }}</strong></p>
            <p>Silakan masukkan token tersebut pada aplikasi kami untuk melanjutkan proses top-up. Harap dicatat bahwa token ini hanya berlaku selama 15 menit sejak email ini dikirim. Jika Anda tidak melakukan permintaan ini atau jika token tidak bekerja, silakan abaikan email ini.</p>
            <p>Apabila Anda mengalami kesulitan atau memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi layanan pelanggan kami.</p>
            <p>Terima kasih atas perhatian dan kerjasama Anda.</p>
            <p>Salam hormat,</p>
            <p>Tim Dukungan Pelanggan</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} DAYstore. Semua hak cipta dilindungi.</p>
        </div>
    </div>
</body>
</html>
