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
              <p>Dear Candidate,</p>
              <p>Congratulations on your new position! Please click the link below to start your onboarding process.</p>
              <p><a href="http://localhost:3000/html/HR/OnboardingPage.html">Start Onboarding</a></p>
              <p>Best Regards,<br>Your Company</p>
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
