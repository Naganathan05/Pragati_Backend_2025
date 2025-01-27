const TEMPLATE_OTP = (otp, userName) => {
    return `<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pragati 2025 | Registration OTP</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Trebutchet MS', sans-serif;
            }
        </style>
    </head>

    <body>
        <p>Dear ${userName},</p>
        <br />
        <p>Thank you for registering for Pragati '25. Please use the following OTP to verify your account.</p>
        <br />
        <h1>${otp}</h1>
        <br />
        <p>Regards,</p>
        <p>Pragati 2025</p>
    </body>

    </html>`;
};

export default TEMPLATE_OTP;
