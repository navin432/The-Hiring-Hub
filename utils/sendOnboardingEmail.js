const nodemailer = require('nodemailer');
const config = require('config');
const app = require('express');
const router = app.Router();

router.post("/", async (req, res) => {
    const hhhMail = config.get("thhEmail");
    const hhhPass = config.get("password"); 
    const email = req.body.email; 
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: hhhMail, pass: hhhPass }
    });
  
    const mailOptions = {
      from: '"The Hiring Hub" <thehiringhubx@gmail.com>',
      to: email,
      subject: "Congratulations, You’re Hired! Start Your Onboarding Process",
      html: `
              <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #f4f4f4;
              border-radius: 8px;
            }
            .header {
              text-align: center;
              background-color: #007bff;
              color: white;
              padding: 10px;
              border-radius: 5px;
            }
            .content {
              padding: 20px;
              background-color: white;
              border-radius: 5px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .footer {
              text-align: center;
              padding: 10px;
              font-size: 12px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Congrats, You’re Hired! </h2>
            </div>
            <div class="content">
              
              <p>Dear Candidate,</p>
              <p>Congratulations on your new position! Please click the link below to start your onboarding process.</p>
              <p><a href="http://localhost:3000/html/HR/OnboardingPage.html">Start Onboarding</a></p>
              <p>Best Regards</p>
           
              <p>HR</p>
              <p>The Hiring Hub Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 The Hiring Hub. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
          `
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Onboarding email sent to ${email}`);
  } catch (error) {
      console.error('Error sending onboarding email:', error);
  }
  
  
})
module.exports = router;
