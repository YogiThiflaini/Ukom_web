<!DOCTYPE html>
<html>

<head>
    <title>Status Permintaan</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #0066CC;
            text-align: center;
        }
        p {
            font-size: 18px;
            color: #333333;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #666666;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Status Permintaan Anda</h1>
        <p>{{ $statusMessage }}</p>
        <p>Terima kasih telah menggunakan DAYstore. Jika Anda memiliki pertanyaan lebih lanjut, silakan hubungi kami.</p>
    </div>
    <div class="footer">
        <p>© 2024 DAYstore. Semua hak dilindungi.</p>
    </div>
</body>

</html>
