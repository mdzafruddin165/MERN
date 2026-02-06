const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const dotenv = require("dotenv");
const app = express();

dotenv.config({ path: '../.env' });

require("./http");

app.use(express.json());

const PORT = process.env.PORT || 5500;
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
const authCodes = {};

// ================= BREVO EMAIL API =================
// Verify environment variables are loaded
console.log('🔍 Checking environment variables:');
console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? '***FOUND***' : 'NOT FOUND');

if (!process.env.BREVO_API_KEY) {
  console.error('❌ Brevo API key not found in .env file!');
  console.error('Please update .env file with your Brevo API key:');
  console.error('BREVO_API_KEY=your-api-key-here');
}

// Brevo API configuration
const brevoApi = axios.create({
  baseURL: 'https://api.brevo.com/v3',
  headers: {
    'api-key': process.env.BREVO_API_KEY,
    'Content-Type': 'application/json'
  }
});

// Test Brevo API connection on startup
const testBrevoConnection = async () => {
  try {
    const response = await brevoApi.get('/account');
    console.log('✅ Brevo API connection successful!');
    console.log('Account email:', response.data.email);
  } catch (error) {
    console.error('❌ Brevo API connection failed:');
    console.error('Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('🔧 Fix: Check your Brevo API key');
      console.error('1. Go to https://app.brevo.com/settings/api-keys');
      console.error('2. Generate a new API key');
      console.error('3. Add it to your .env file');
    }
  }
};

testBrevoConnection();

// ================= OTP GENERATOR =================
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ================= SEND OTP =================
app.post("/send-code", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const code = generateCode();
    authCodes[email] = { code, timestamp: Date.now() };

    console.log(`🔢 Generated OTP for ${email}: ${code}`);

    // Brevo API email payload
    const emailData = {
      sender: {
        name: 'OTP App',
        email: 'noreply@otpapp.com' // You can change this to your verified sender
      },
      to: [{
        email: email
      }],
      subject: 'Your OTP Code',
      htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px;">${code}</span>
        </div>
        <p style="color: #666;">This code will expire in 5 minutes.</p>
        <p style="color: #999; font-size: 14px;">If you didn't request this, please ignore this email.</p>
      </div>`
    };

    console.log('📤 Sending email via Brevo API...');
    console.log('To:', email);

    const response = await brevoApi.post('/smtp/email', emailData);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', response.data.messageId);
    
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error('Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    
    // Provide specific error messages
    let errorMessage = "Failed to send OTP. ";
    if (error.response?.status === 401) {
      errorMessage += "Brevo API authentication failed. Check your API key.";
      console.error('🔧 To fix API key error:');
      console.error('1. Go to https://app.brevo.com/settings/api-keys');
      console.error('2. Generate a new API key');
      console.error('3. Add it to your .env file');
    } else if (error.response?.status === 400) {
      errorMessage += "Invalid email address or sender configuration.";
    } else if (error.response?.status === 403) {
      errorMessage += "API access forbidden. Check your plan limits.";
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage += "Connection failed. Check internet connection.";
    } else {
      errorMessage += error.response?.data?.message || error.message || "Unknown error occurred.";
    }
    
    res.status(500).json({ message: errorMessage, error: error.message });
  }
});

// ================= VERIFY OTP + JWT =================
app.post("/verify-code", (req, res) => {
  const { email, code } = req.body;

  const savedCodeData = authCodes[email];

  if (!savedCodeData) {
    return res.status(400).json({ message: "No OTP found for this email" });
  }

  const { code: savedCode, timestamp } = savedCodeData;
  const currentTime = Date.now();
  const otpExpirationTime = 5 * 60 * 1000; // 5 minutes

  if (currentTime - timestamp > otpExpirationTime) {
    delete authCodes[email];
    return res.status(400).json({ message: "OTP has expired" });
  }

  if (savedCode !== code) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  delete authCodes[email];

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

// =================================================
// 🔐 JWT AUTH MIDDLEWARE (IMAGE CODE ADDED HERE)
// =================================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // No token

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token

    req.user = user;
    next();
  });
}

// ================= PROTECTED ROUTE =================
app.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: "This is protected data",
    user: req.user,
  });
});

// ================= HOME =================
app.get("/home", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Home</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
.welcome-container {
  animation: fadeInScale 1s ease-out;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.welcome-title {
  animation: slideInUp 0.8s ease-out 0.3s both;
}

@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-message {
  animation: fadeIn 1s ease-out 0.6s both;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
</head>
<body>
<nav class="navbar navbar-dark bg-dark px-4">
  <span class="navbar-brand">OTP Auth App</span>
  <a href="/login" class="btn btn-outline-light">Login</a>
</nav>
<div class="container mt-5 welcome-container">
  <div class="text-center">
    <h2 class="welcome-title text-primary mb-4">Welcome to Home</h2>
    <p class="welcome-message lead text-muted">Successfully authenticated with OTP!</p>
    <div class="mt-4">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</div>
</body>
</html>
`);
});

// ================= LOGIN =================
app.get("/login", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Login</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container vh-100 d-flex justify-content-center align-items-center">
<div class="card p-4 shadow" style="width:360px">
<h4 class="text-center mb-3">Login</h4>
<form id="emailForm">
<input type="email" class="form-control mb-3" id="email" placeholder="Enter email" required />
<button class="btn btn-primary w-100">Send Code</button>
</form>
</div>
</div>

<script>
document.getElementById("emailForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;

  const res = await fetch("/send-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  if(res.ok){
    window.location.href = "/verify?email=" + email;
  }
});
</script>
</body>
</html>
`);
});

// ================= VERIFY OTP =================
app.get("/verify", (req, res) => {
  const email = req.query.email;

  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Verify Code</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container vh-100 d-flex justify-content-center align-items-center">
<div class="card p-4 shadow" style="width:360px">
<h4 class="text-center mb-3">Verify OTP</h4>
<form id="codeForm">
<input type="text" class="form-control mb-3" id="code" placeholder="Enter OTP" required />
<button class="btn btn-success w-100">Verify</button>
</form>
</div>
</div>

<script>
document.getElementById("codeForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const code = document.getElementById("code").value;

  const res = await fetch("/verify-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "${email}", code })
  });

  const data = await res.json();

  if(res.ok){
    alert("Login successful");
    localStorage.setItem("token", data.token);
    window.location.href = "/home";
  } else {
    alert(data.message);
  }
});
</script>
</body>
</html>
`);
});

// ================= SUCCESS =================
app.get("/success", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Success</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-success text-white">
<div class="container vh-100 d-flex justify-content-center align-items-center">
<div class="text-center">
<h2>✅ Login Successful</h2>
<p>JWT Token stored in localStorage</p>
<button class="btn btn-light" onclick="testProtected()">Test Protected API</button>
</div>
</div>

<script>
async function testProtected(){
  const token = localStorage.getItem("token");

  const res = await fetch("/protected", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();
  alert(JSON.stringify(data));
}
</script>

</body>
</html>
`);
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/home`);
});
