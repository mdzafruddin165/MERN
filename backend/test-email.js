// Test script to verify email configuration
require('dotenv').config({ path: '../.env' });
const nodemailer = require('nodemailer');

console.log('🔧 Testing email configuration...');
console.log('GMAIL_EMAIL:', process.env.GMAIL_EMAIL);
console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '***' : 'NOT SET');

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      debug: true,
      logger: true
    });

    // Verify the connection
    await transporter.verify();
    console.log('✅ Gmail connection verified successfully!');

    // Test sending email
    const testCode = '123456';
    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: process.env.GMAIL_EMAIL, // Send to self for testing
      subject: "Test OTP Code",
      text: `Your test OTP code is: ${testCode}`,
      html: `<h2>Test OTP Code</h2><p><strong>${testCode}</strong></p>`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
  }
}

testEmail();
