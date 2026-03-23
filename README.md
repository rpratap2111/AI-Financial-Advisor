# 🏦 AI Financial Advisor - Smart Wealth Management

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://ai-financial-advisor-six.vercel.app)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://ai-financial-advisor-yo5z.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Empowering your financial future with ML-driven insights and AI-powered advisory.**

AI Financial Advisor Hero Banner<img width="1845" height="857" alt="image" src="https://github.com/user-attachments/assets/13865086-d26a-4f19-a670-52b33e1ce651" />

---

## 🌟 Overview

AI Financial Advisor is a cutting-edge platform designed to simplify complex financial decisions. By combining **Machine Learning models** for risk and investment prediction with a **multi-persona AI chat**, it provides a unique, engaging, and highly personalized user experience.

---

## ✨ Key Features

### 1. 🤖 Multi-Persona AI Chat
Get advice that fits your mood. Switch between three distinct AI personalities:
- **👔 Professional**: Data-driven, formal, and precise.
- **🔥 Savage Mode**: Doesn't hold back—get roasted for your spending habits!
- **✨ Gen-Z Mode**: Speak the language of the future (Slay, Sigma, No Cap).

Chat Interface Screenshot<img width="1846" height="897" alt="image" src="https://github.com/user-attachments/assets/7d620b15-606b-4265-957e-c3ab25019698" />

### 2. 📊 Smart Financial tools
- **🔮 Term Deposit Prediction**: Uses a custom-trained ML model to predict your likelihood of successful investments.
- **🛡️ Credit Risk Assessment**: Automated evaluation of your financial stability based on key metrics.

Deposit Form Screenshot<img width="1790" height="888" alt="image" src="https://github.com/user-attachments/assets/e1f91145-0d11-4658-9a5a-7b8cbb73244c" />
Rish Assessment Form Screenshot<img width="1731" height="830" alt="image" src="https://github.com/user-attachments/assets/28ae63fc-3829-48b0-8f53-f5cd0d2dd1ef" />


### 3. 🔐 Enterprise-Grade Security
- **Google Authentication**: Powered by Firebase for seamless and secure access.
- **Persistent Sessions**: Your chat history is saved and managed within your profile.

---

## 🛠️ Tech Stack

| Frontend | Backend | Intelligence |
| :--- | :--- | :--- |
| **React 18** (Vite) | **Python / Flask** | **Google Gemini 2.0 Flash** |
| **Tailwind CSS** | **Scikit-Learn** | **Firebase Auth** |
| **Framer Motion** | **Pandas / NumPy** | **RESTful API** |

---

## 🚀 Installation & Local Setup

### 📋 Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API Key
- Firebase Project Credentials

### 1. Clone the Repository
```bash
git clone https://github.com/rpratap2111/AI-Financial-Advisor.git
cd AI-Financial-Advisor
```

### 2. Backend Configuration
```bash
cd backend
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Create .env with GEMINI_API_KEY and FRONTEND_URL
python app.py
```

### 3. Frontend Configuration
```bash
cd frontend
npm install
# Create .env.local with Firebase & Vite API config
npm run dev
```

---

## 🌍 Deployment

The application is architected for modern cloud platforms:

- **Frontend**: Optimally deployed on **Vercel** with full CI/CD support.
- **Backend**: Hosted on **Render** using `gunicorn` for high-performance request handling.
- **CORS**: Strictly controlled via environment variables to ensure secure cross-origin communication.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by **Rudra Pratap**  
- GitHub: [@rudra-pratap](https://github.com/rpratap2111/)
- LinkedIn: [Rudra Pratap](https://www.linkedin.com/in/rudra-pratap-a34a6b275/)
