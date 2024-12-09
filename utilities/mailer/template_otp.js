const TEMPLATE_OTP = (otp, userName) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pragati 2025</title>
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
            background-image: 
                linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.1) 100%),
                linear-gradient(135deg, #f0e6d2, #e6d8c3);
        }

        .container {
        max-width: 600px;
        padding: 40px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        border: 2px solid #a78b5c;
        text-align: center;
        position: relative;
        overflow: hidden;
    }
    
        .header {
            font-size: 40px;
            font-weight: bold;
            text-transform: uppercase;
            color: #5d4037;
            margin-bottom: 15px;
            background: linear-gradient(to right, #8e6e53, #c2a67d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 2px;
        }

        .sub-header {
            font-size: 20px;
            font-style: italic;
            color: #6f5136;
            margin-bottom: 25px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        .hero-image {
            width: 100%;
            height: auto;
            border-radius: 15px;
            margin-bottom: 25px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            border: 3px solid #a78b5c;
        }

            strong {
        font-size: 1.2em;
        font-weight: bold;
        color: #8e6e53; /* Subtle golden brown color */
        background: linear-gradient(to right, #f0d4a0, #c2a67d); /* Gradient background */
        padding: 5px 10px;
        border-radius: 5px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); /* Slight shadow effect */
        text-transform: uppercase;
        letter-spacing: 1px;
    }


        .otp {
            font-size: 48px;
            font-weight: bold;
            color: #5d4037;
            background: linear-gradient(to right, #f2d7b3, #d1af8a);
            padding: 15px 25px;
            border-radius: 12px;
            display: inline-block;
            margin: 25px 0;
            letter-spacing: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .mythological-quote {
            font-size: 16px;
            font-style: italic;
            color: #6f5136;
            margin: 20px 0;
            padding: 10px;
            background-color: rgba(210, 180, 140, 0.2);
            border-left: 4px solid #a78b5c;
        }

        .footer {
            font-size: 14px;
            color: #6f5136;
            margin-top: 25px;
            opacity: 0.8;
        }

        p {
            margin: 12px 0;
            line-height: 1.4;
        }

        @media (max-width: 600px) {
            .header {
                font-size: 32px;
            }

            .otp {
                font-size: 36px;
                letter-spacing: 3px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Pragati 2025</div>
            <div class="sub-header">Voyage Through the Neo-Renaissance: A Mythological Odyssey</div>
        
            <img class="hero-image" src="5a_hermes.webp" alt="An artistic interpretation of a mythological scene" />
        
            <p>Greetings, <strong>${userName}</strong>,</p>
        
            <p>As Hermes, the messenger of the gods, once guided travelers, invites you to embark on an extraordinary journey through Pragati 2025 - where ancient wisdom meets modern innovation.</p>
        
            <div class="mythological-quote">"In the realm of creativity, every individual is a hero of their own epic." - Inspired by Homer's Odyssey</div>
        
            <p>Your gateway awaits. Please use the following sacred token to verify your passage:</p>
        
            <div class="otp">${otp}</div>
        
            <p>May the muses of inspiration guide your path,</p>
        
            <p class="footer">Forged with passion by Team Pragati 2025<br>Weaving the tapestry of neo-renaissance imagination</p>
        </div>
    </body>
</html>`;
}

export default TEMPLATE_OTP;
