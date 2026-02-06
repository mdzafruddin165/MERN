// Test Brevo API configuration
require('dotenv').config({ path: '../.env' });
const axios = require('axios');

console.log('🔧 Testing Brevo API configuration...');
console.log('API Key:', process.env.BREVO_API_KEY ? '***FOUND***' : 'NOT FOUND');

async function testBrevoAPI() {
  try {
    const brevoApi = axios.create({
      baseURL: 'https://api.brevo.com/v3',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    // Test account connection
    console.log('📡 Testing API connection...');
    const accountResponse = await brevoApi.get('/account');
    console.log('✅ API connection successful!');
    console.log('Account email:', accountResponse.data.email);

    // Test sending email
    console.log('📧 Testing email sending...');
    const testCode = '123456';
    const emailData = {
      sender: {
        name: 'OTP App Test',
        email: 'noreply@otpapp.com'
      },
      to: [{
        email: accountResponse.data.email // Send to account owner
      }],
      subject: 'Test OTP Code',
      htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Test OTP Code</h2>
        <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px;">${testCode}</span>
        </div>
        <p style="color: #666;">This is a test email from your OTP application.</p>
      </div>`
    };

    const emailResponse = await brevoApi.post('/smtp/email', emailData);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', emailResponse.data.messageId);
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    
    if (error.response?.status === 401) {
      console.error('🔧 Fix: Get a valid Brevo API key');
      console.error('1. Sign up at https://www.brevo.com/');
      console.error('2. Go to Settings → API Keys');
      console.error('3. Generate a new API key');
      console.error('4. Add it to your .env file');
    }
  }
}

testBrevoAPI();
