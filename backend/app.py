from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import warnings
warnings.filterwarnings("ignore", category=UserWarning)
from google import genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = None
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)

app = Flask(__name__)

# Allow requests from the configured FRONTEND_URL (for production) and local dev environments
frontend_url = os.getenv("FRONTEND_URL")
allowed_origins = [frontend_url]

CORS(app, origins=allowed_origins)

deposit_model = joblib.load('model/deposit_model.pkl')
deposit_encoders = joblib.load('model/deposit_encoders.pkl')

@app.route('/predict/deposit', methods=['POST'])
def predict_deposit():
    try:
        data = request.json
        df = pd.DataFrame([data])

        for col, le in deposit_encoders.items():
            if col in df:
                df[col] = le.transform(df[col])

        cols = deposit_model.feature_names_in_
        df = df[cols]

        prediction = deposit_model.predict(df)
        rec = str(prediction[0])
        rec_text = "Highly Suitable for Term Deposit" if rec == 'yes' else "Not Ideal for Term Deposit (Consider Alternatives)"

        insight = ""
        if client:
            try:
                prompt = (
                    f"User profile: {data}. "
                    f"ML Model Prediction for Term Deposit: '{rec}'. "
                    "Your Task:\n"
                    "1. Provide a 'Personalized Deposit Recommendation' based on their inputs.\n"
                    "2. Provide 'The Butterfly Effect' detailing 1 or 2 small changes that drastically alter their finances.\n"
                    "\n"
                    "CRITICAL FORMATTING INSTRUCTIONS:\n"
                    "You MUST use this EXACT markdown structure (use exactly these headers and bullet points):\n\n"
                    "**Personalized Deposit Recommendation**\n"
                    "[Your paragraph here]\n\n"
                    "**The Butterfly Effect**\n"
                    "* [First change here]\n"
                    "* [Second change here (if applicable)]\n\n"
                    "Keep everything engaging, under 150 words total, using Indian Rupees (₹)."
                )
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt
                )
                insight = response.text
            except Exception as e:
                insight = f"Failed to generate insight: {str(e)}"

        return jsonify({"investment_recommendation": rec_text, "generative_insight": insight})

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

risk_model = joblib.load('model/risk_model.pkl')
risk_encoders = joblib.load('model/risk_encoders.pkl')

@app.route('/predict/risk', methods=['POST'])
def predict_risk():
    try:
        data = request.json
        df = pd.DataFrame([data])

        for col, le in risk_encoders.items():
            if col in df:
                df[col] = le.transform(df[col])

        cols = risk_model.feature_names_in_
        df = df[cols]

        prediction = risk_model.predict(df)
        risk_level = int(prediction[0])

        insight = ""
        if client:
            try:
                prompt = (
                    f"The user provided profile data: {data}. "
                    f"The ML model assessed their credit risk score/level as: '{risk_level}'. "
                    "Novelty Feature: Provide a 'Dual Perspective' analysis. Give two short quotes directly reacting to this user's profile and risk level: \n"
                    "1. 'The Boomer Investor' (like Warren Buffett): Conservative, long-term, slightly condescending but wise advice.\n"
                    "2. 'The Degen Trader' (like Reddit WallStreetBets): Reckless, meme-heavy, high-risk YOLO attitude, either roasting or hyping them up.\n"
                    "Make sure to place each quote on CLEARLY separate lines using bullet points or blockquotes. Use markdown format. ALL monetary amounts must be in Indian Rupees (₹)."
                )
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt
                )
                insight = response.text
            except Exception as e:
                insight = f"Failed to generate insight: {str(e)}"

        return jsonify({"risk_assessment": risk_level, "generative_insight": insight})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/chat', methods=['POST'])
def chat():
    if not client:
        return jsonify({"error": "Gemini API key is not configured on the server."}), 500
    try:
        data = request.json
        user_message = data.get('message', '')
        history = data.get('history', [])
        persona = data.get('persona', 'professional')

        if not user_message:
            return jsonify({"error": "No message provided."}), 400
            
        if persona == 'savage':
            system_instruction = (
                "You are a savage, brutally honest, and sarcastic financial critic (like the Gordon Ramsay of finance). "
                "Roast the user's financial questions and decisions mercilessly, but still provide mathematically correct and helpful financial advice hidden within the insults. Keep it under 150 words. ALL monetary amounts must be in Indian Rupees (₹)."
            )
        elif persona == 'genz':
            system_instruction = (
                "You are an AI Financial Advisor that exclusively speaks in ridiculous Gen-Z internet slang and 'brainrot' terminology (e.g., skibidi, rizz, sigma, no cap, main character energy, based). "
                "Provide actual, good financial advice, but completely coat it in this absurd slang. Keep it under 150 words. ALL monetary amounts must be in Indian Rupees (₹)."
            )
        else:
            system_instruction = (
                "You are a helpful, professional, and knowledgeable AI Financial Advisor. "
                "Provide a concise, practical, and highly relevant financial answer. Keep it under 150 words. ALL monetary amounts must be in Indian Rupees (₹)."
            )

        conversation_context = ""
        recent_history = history[-10:] if len(history) > 10 else history
        for msg in recent_history:
            role_str = "User" if msg.get("role") == "user" else "Advisor"
            text_val = msg.get("text", "")
            if "Hello! I am your AI Financial Advisor." not in text_val:
                conversation_context += f"{role_str}: {text_val}\n\n"

        prompt = f"{system_instruction}\n\n"
        if conversation_context:
            prompt += f"Here is the recent conversation history for context:\n{conversation_context}\n"
        
        prompt += f"Now, the user asks: '{user_message}'. Answer based on the context."
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return jsonify({"reply": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)