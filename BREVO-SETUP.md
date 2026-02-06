# Password-less Email OTP Login with Brevo API

## 🚀 Quick Setup

### 1. Get Brevo API Key

1. **Sign up for Brevo:**
   - Go to https://www.brevo.com/
   - Create a free account (300 emails/day free)

2. **Generate API Key:**
   - Go to https://app.brevo.com/settings/api-keys
   - Click "Generate new API key"
   - Copy the API key

### 2. Update .env File

```bash
# Brevo Email API Configuration
BREVO_API_KEY=your-api-key-here

# Server Configuration
PORT=5500
SECRET_KEY=your_secret_key
```

### 3. Test Configuration

```bash
cd backend
node test-brevo.js
```

### 4. Start Server

```bash
npm run dev
```

## 📱 User Flow (Password-less)

1. **Login Page:** `/login`
   - User enters email ONLY (no password)
   - Clicks "Send Code"

2. **OTP Verification:** `/verify`
   - 6-digit OTP sent via Brevo API
   - User enters OTP
   - Clicks "Verify"

3. **Home Page:** `/home`
   - Successful verification redirects to home
   - Animated welcome page

## ✅ Features

- **No Gmail:** Uses Brevo API instead
- **No Password:** Email-only authentication
- **API Key Only:** No email passwords or OAuth
- **Secure:** OTP expires in 5 minutes
- **Memory Storage:** OTP stored temporarily in server memory
- **Error Handling:** Proper error messages and logging
- **Free Tier:** 300 emails per day free

## 🔧 API Configuration

**Brevo API Benefits:**
- ✅ No email password required
- ✅ No OAuth setup needed
- ✅ Simple API key authentication
- ✅ 300 free emails per day
- ✅ Professional email templates
- ✅ High deliverability

## 📋 API Endpoints

- `POST /send-code` - Send OTP via Brevo API
- `POST /verify-code` - Verify OTP and login
- `GET /login` - Email-only login page
- `GET /verify` - OTP verification page
- `GET /home` - Authenticated home page

## 🔧 Troubleshooting

### 401 Unauthorized
- Check Brevo API key is valid
- Ensure API key has SMTP permissions
- Regenerate API key if needed

### 400 Bad Request
- Verify sender email is configured in Brevo
- Check recipient email format
- Ensure API quota not exceeded

### Connection Issues
- Check internet connection
- Verify Brevo API status
- Check console logs for detailed errors

## 🎯 Advantages over Gmail

- **No App Password:** Simple API key setup
- **No 2FA Required:** No Gmail 2-step verification
- **Higher Limits:** 300 emails/day vs Gmail limits
- **Better Deliverability:** Professional email service
- **No Authentication Issues:** API-based authentication
