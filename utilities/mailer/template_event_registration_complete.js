const TEMPLATE_EVENT_REGISTRATION_OTP = (
    userName,
    eventName,
    transactionId,
    totalMembers,
) => {
    return `<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pragati 2025 | Event Registration Confirmation</title>
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
        <p>You have successfully registered for the event ${eventName}.</p>
        <p>Total Members: ${totalMembers}.</p>
        <p>TransactionID: ${transactionId}.</p>
        <br />
        <p>Regards,</p>
        <p>Pragati 2025</p>
    </body>

    </html>`;
};

export default TEMPLATE_EVENT_REGISTRATION_OTP;
