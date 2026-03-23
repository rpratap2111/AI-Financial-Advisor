# AI Financial Advisor 🚀

A comprehensive AI-powered financial advisory platform featuring ML-driven investment recommendations, credit risk assessment, and a multi-persona conversational assistant. Built with React, Flask, and Google's Gemini API, integrated with Firebase for secure authentication.

## ✨ Key Features

- **🧠 Multi-Persona AI Chat**: Financial advice delivered through three distinct personas:
    - **Professional**: Direct, formal, and informative.
    - **Savage Mode**: Brutally honest, sarcastic roasting of your financial decisions.
    - **Gen-Z Mode**: Coated in brainrot slang (Slay, Sigma, No Cap).
- **📝 Conversational Context**: Unlike simple chatbots, the advisor remembers your previous messages in a session for smarter follow-up answers.
- **📈 Term Deposit Prediction**: Machine Learning model that analyzes user profiles to predict and recommend high-yield term deposits.
- **🛡️ Credit Risk Assessment**: Automated ML risk profiling to evaluate financial stability.
- **🔐 Secure Google Sign-In**: Integrated with Firebase Authentication for personal profiles and data security.
- **💾 Multi-Session History**: Save, load, and delete multiple chat sessions stored directly in your browser history.
- **📱 Responsive & Animated UI**: Clean, professional landing page with smooth Framer Motion transitions and mobile compatibility.

## 🛠️ Tech Stack

**Frontend:**
- [React (Vite)](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Firebase Auth](https://firebase.google.com/docs/auth)

**Backend:**
- [Flask](https://flask.palletsprojects.com/)
- [Scikit-Learn](https://scikit-learn.org/)
- [Google Gemini API](https://ai.google.dev/) (model: `gemini-2.0-flash`)

## 🚀 Getting Started

### Backend Setup
1. `cd backend`
2. Create and activate a python virtual environment.
3. `pip install -r requirements.txt`
4. Create a `.env` file with `GEMINI_API_KEY`.
5. `python app.py`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env.local` using the `.env.example` template.
4. `npm run dev`

## 🌍 Deployment Ready
- **Frontend**: Configured for Vercel/Netlify with dynamic API endpoints.
- **Backend**: Configured for Render/Railway with `gunicorn` and dynamic port binding.
- **Security**: Strict CORS origin policy to prevent unauthorized API access.
