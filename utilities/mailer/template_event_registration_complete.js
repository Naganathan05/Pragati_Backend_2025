const TEMPLATE_EVENT_REGISTRATION_OTP = (userName,   eventName,   transactionId,   totalMembers ) => {
  return `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Pragati 2025</title>
              <style>
                body {
                  font-family: "Times New Roman", serif;
                  margin: 0;
                  padding: 0;
                  background: linear-gradient(135deg, #faf5e6, #e6dec8);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                .container {
                  max-width: 650px;
                  width: 90%;
                  padding: 40px;
                  background: rgba(255, 255, 255, 0.95);
                  border-radius: 15px;
                  border: 2px solid #b58953;
                  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
                  text-align: center;
                }
                .header {
                  font-size: 50px;
                  font-weight: bold;
                  background: linear-gradient(to right, #b58953, #e6b76f);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  text-transform: uppercase;
                  margin-bottom: 20px;
                  font-family: "Trajan Pro", serif;
                }
                .sub-header {
                  font-size: 24px;
                  font-family: "Georgia", serif;
                  color: #6f5136;
                  margin-bottom: 30px;
                  font-style: italic;
                }
                .hero-image {
                  width: 100%;
                  height: 325px;
                  border-radius: 10px;
                  margin-bottom: 20px;
                  object-fit: cover;
                  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
                }
                .details {
                  font-family: "Garamond", serif;
                  font-size: 20px;
                  color: #503a24;
                  line-height: 1.8;
                }
                .divider {
                  height: 2px;
                  background: linear-gradient(to right, #b58953, #d7c2a1);
                  margin: 30px 0;
                }
                .footer {
                  font-size: 18px;
                  color: #6f5136;
                  margin-top: 30px;
                  font-style: italic;
                  font-family: "Palatino", serif;
                }
                p {
                  font-size: 1.25rem;
                }
                strong {
                  font-size: 1.2em;
                  font-weight: bold;
                  color: #8e6e53; 
                  background: linear-gradient(to right, #f0d4a0, #c2a67d); 
                  padding: 5px 10px;
                  border-radius: 5px;
                  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); 
                  text-transform: uppercase;
                  letter-spacing: 1px;
               }
              </style>
            </head>

            <body>
              <div class="container">
                <div class="header">Pragati 2025</div>
                <div class="sub-header">Event Registration Confirmation</div>
                <img
                  class="hero-image"
                  src="registration_hero.jpg"
                  alt="Fresco of Virgin Mary"
                />
                <div class="details">
                  <p>Dear <strong> ${userName},</strong></p>
                  <p>
                    You have successfully registered for the event:
                    <strong>${eventName}</strong>.
                  </p>
                  <p>Total Members: <strong>${totalMembers}</strong></p>
                  <p>Transaction ID: <strong>${transactionId}</strong></p>
                </div>
                <div class="divider"></div>
                <p class="footer">
                  Step into the grandeur of Pragati 2025 - where legends are forged!
                </p>
              </div>
            </body>
          </html>
`;
};

export default TEMPLATE_EVENT_REGISTRATION_OTP;
