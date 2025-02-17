const TEMPLATE_FORGOT_PASSWORD_OTP = (otp, userName) => {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pragati 2025 | Forgot Password OTP</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
        }
        body {
            background: linear-gradient(135deg, #f0e6d2, #e6d8c3);
            color: #2c3e50;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            padding: 35px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border: 2px solid #a78b5c;
            text-align: center;
        }
        .header {
            font-size: 36px;
            font-weight: bold;
            text-transform: uppercase;
            color: #5d4037;
            margin-bottom: 10px;
            background: linear-gradient(to right, #8e6e53, #c2a67d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 2px;
        }
        .sub-header {
            font-size: 18px;
            font-style: italic;
            color: #6f5136;
            margin-bottom: 20px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .hero-image {
            width: 90px;
            height: auto;
            margin-bottom: 20px;
        }
        strong {
            font-size: 1.1em;
            font-weight: bold;
            color: #8e6e53;
        }
        .otp {
            font-size: 32px;
            font-weight: bold;
            color: #5d4037;
            background: linear-gradient(to right, #f2d7b3, #d1af8a);
            padding: 10px 20px;
            border-radius: 10px;
            display: inline-block;
            margin: 20px 0;
            letter-spacing: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .footer {
            font-size: 14px;
            color: #6f5136;
            margin-top: 20px;
            opacity: 0.8;
        }
        p {
            margin: 10px 0;
            line-height: 1.5;
        }
        @media (max-width: 600px) {
            .header {
                font-size: 28px;
            }
            .otp {
                font-size: 24px;
                letter-spacing: 3px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">Pragati 2025</div>
        <div class="sub-header">Reset Your Password</div>

        <img class="hero-image" src="https://b4ia3y8s78.ufs.sh/f/1rBJ3VmOgbeLRTo2PP4BcQ9dJivoLyXlq4CzWHZ8eSAR130p" alt="Pragati Logo" />

        <p>Dear <strong>${userName}</strong>,</p>

        <p>Use this OTP to reset your password:</p>

        <div class="otp">${otp}</div>

        <p>If you didn’t request this, you can safely ignore this email.</p>

        <p class="footer">Best regards, <br>Team Pragati 2025</p>
    </div>
</body>

</html>
`;
};

export default TEMPLATE_FORGOT_PASSWORD_OTP;
