# Password-less Email OTP Login Setup Guide

## 🚀 Quick Setup

### 1. Configure Gmail App Password

1. **Enable 2-Step Verification:**
   - Go to Google Account → Security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" for the app
   - Copy the 16-character password (format: xxxx-xxxx-xxxx-xxxx)

### 2. Update .env File

```bash
# Gmail Configuration
GMAIL_EMAIL=your-actual-gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Server Configuration
PORT=5500
SECRET_KEY=your_secret_key
```

### 3. Start Server

```bash
cd backend
npm run dev
```

## 📱 User Flow

1. **Login Page:** `/login`
   - User enters email ONLY (no password)
   - Clicks "Send Code"

2. **OTP Verification:** `/verify`
   - 6-digit OTP sent to email
   - User enters OTP
   - Clicks "Verify"

3. **Home Page:** `/home`
   - Successful verification redirects to home
   - Animated welcome page

## ✅ Features

- **Password-less:** No password fields anywhere
- **Email OTP:** 6-digit code sent via Gmail
- **Secure:** OTP expires in 5 minutes
- **Memory Storage:** OTP stored temporarily in server memory
- **Error Handling:** Proper error messages and logging
- **Animated UI:** CSS animations on home page

## 🔧 Troubleshooting

### EAUTH Error
- Ensure 2-Step Verification is enabled
- Use App Password (not regular password)
- Check .env file has correct credentials

### Connection Issues
- Check internet connection
- Verify Gmail credentials
- Check console logs for detailed errors

### OTP Not Received
- Check spam folder
- Verify email address is correct
- Check console for sending errors

## 📋 API Endpoints

- `POST /send-code` - Send OTP to email
- `POST /verify-code` - Verify OTP and login
- `GET /login` - Login page (email only)
- `GET /verify` - OTP verification page
- `GET /home` - Authenticated home page
