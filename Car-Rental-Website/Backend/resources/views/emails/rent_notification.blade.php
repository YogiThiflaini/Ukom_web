<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notifikasi DAYstore</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #e7f3ff;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #007BFF;
            color: white;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 26px;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333333;
            line-height: 1.6;
        }
        .content p {
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #777777;
            background-color: #f4f4f4;
            border-radius: 0 0 8px 8px;
        }
        .footer p {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>DAYstore</h1>
        </div>
        <div class="content">
            <p>Halo {{ $user->firstname }},</p>

            <p>Kami ingin mengingatkan Anda terkait status mobil sewaan Anda:</p>

            <p><strong>{{ $messageContent }}</strong></p>

            <p>Terima kasih telah menggunakan layanan kami. Mohon segera lakukan tindakan yang diperlukan.</p>

            <p>Salam hangat,</p>
            <p><strong>DAYstore</strong></p>
        </div>
        <div class="footer">
            <p>&copy; 2024 DAYstore. Semua hak dilindungi.</p>
        </div>
    </div>
</body>
</html>
