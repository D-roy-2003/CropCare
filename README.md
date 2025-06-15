# 🌾 Crop Care - AI-Powered Agricultural Platform

A comprehensive agricultural platform that uses machine learning and AI to help farmers detect crop diseases, get crop recommendations, and access weather forecasting.

## ✨ Features

- **🔍 Disease Prediction**: Upload crop images to detect diseases using CNN models with 95% accuracy
- **🌱 Crop Recommendation**: Get personalized crop recommendations based on soil and climate data
- **🌤️ Weather Forecasting**: Access accurate weather predictions for farming activities
- **👤 User Authentication**: Secure signup, login, and profile management
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🌙 Dark Mode**: Toggle between light and dark themes

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI components
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **SendGrid** - Email service for verification

### Security & Performance
- **Rate Limiting** - API protection
- **Input Validation** - Zod schema validation
- **Password Security** - bcrypt hashing with salt rounds
- **CORS Protection** - Cross-origin request security
- **Environment Variables** - Secure configuration management

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- SendGrid account (for email features)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/crop-care.git
cd crop-care
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Application URL
NEXTAUTH_URL=http://localhost:3000

# SendGrid Email Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your_verified_email@domain.com

# Security
BCRYPT_ROUNDS=12
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
crop-care/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── (pages)/           # Application pages
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   ├── navbar.tsx        # Navigation component
│   └── footer.tsx        # Footer component
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── mongodb.ts        # Database connection
│   ├── validation.ts     # Zod schemas
│   └── utils.ts          # Helper functions
├── models/               # MongoDB models
│   └── User.ts           # User model
└── middleware.ts         # Next.js middleware
```

## 🔐 Authentication Features

- **User Registration** with email verification
- **Secure Login** with JWT tokens
- **Password Reset** functionality
- **Account Lockout** after failed attempts
- **Rate Limiting** for security
- **Remember Me** option

## 🧪 Testing Authentication

Visit `/test-auth` to run comprehensive authentication tests:
- Database connectivity
- User signup functionality
- Login/logout processes
- Error handling

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Development Team

- **Debangshu Roy** - Full Stack Developer
- **Prasenjit Datta** - ML Engineer
- **Subhrajit Ghosh** - Frontend Developer

## 🙏 Acknowledgments

- Thanks to the agricultural community for inspiration
- OpenAI for AI/ML guidance
- The open-source community for amazing tools

## 📞 Support

For support, email debangshuroy2020@gmail.com or create an issue in this repository.

---

**Made with ❤️ for farmers worldwide** 🌾