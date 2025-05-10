import streamlit as st
import os
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'  # Force DeepFace to use CPU only

import numpy as np
import tempfile
import librosa
from transformers import pipeline
from deepface import DeepFace
from collections import Counter
from fpdf import FPDF
import openai
from google.cloud import speech
import wave
import json

# === GOOGLE CLOUD SETUP ===
if not os.path.exists("gcp-key.json"):
    with open("gcp-key.json", "w") as f:
        f.write(st.secrets["GCP_CREDENTIALS"])
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "gcp-key.json"

# === CONFIG ===
openai.api_key = os.getenv("OPENAI_API_KEY")
qa_model = pipeline("question-answering")
questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths?",
    "Where do you see yourself in 5 years?"
]

# === Transcription using Google Cloud ===
def transcribe_google(audio_path):
    client = speech.SpeechClient()
    with open(audio_path, "rb") as f:
        content = f.read()
    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=44100,
        language_code="en-US",
    )
    response = client.recognize(config=config, audio=audio)
    return " ".join([r.alternatives[0].transcript for r in response.results])

# === Streamlit UI ===
st.title("🧠 Job Interview AI – Multimodal NLP System")
st.markdown("Upload your response as a .wav file to simulate a real interview experience.")

if "current_q" not in st.session_state:
    st.session_state.current_q = 0
    st.session_state.responses = []
    st.session_state.scores = []
    st.session_state.emotions = []

uploaded_file = st.file_uploader("📤 Upload your .wav response", type=["wav"])

if st.session_state.current_q < len(questions):
    st.subheader(f"🎤 Question {st.session_state.current_q + 1}:")
    st.markdown(f"**{questions[st.session_state.current_q]}**")

    if uploaded_file is not None:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_audio:
            tmp_audio.write(uploaded_file.read())
            path = tmp_audio.name
            st.audio(path)

            text = transcribe_google(path)
            st.write("📝 **Transcribed Text:**", text)

            relevance = qa_model(question=questions[st.session_state.current_q], context=text)
            st.write("📊 Relevance Score:", f"{relevance['score']:.2f}")

            y, sr = librosa.load(path, sr=None)
            pitch = librosa.yin(y, fmin=75, fmax=300, sr=sr)
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            avg_pitch = np.mean(pitch)
            st.write("🎼 Avg Pitch:", f"{avg_pitch:.2f} Hz | Tempo: {tempo:.2f} BPM")

            score = 0
            if relevance['score'] > 0.5: score += 5
            if avg_pitch > 150: score += 1

            st.write("📸 Capture your facial expression:")
            image = st.camera_input("Take a snapshot")
            emotion = "Unknown"
            if image:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as img_tmp:
                    img_tmp.write(image.getbuffer())
                    try:
                        analysis = DeepFace.analyze(img_tmp.name, actions=['emotion'], enforce_detection=False)
                        emotion = analysis[0]['dominant_emotion']
                        if emotion == 'happy': score += 2
                    except:
                        pass
            st.write("Detected Emotion:", emotion)

            st.write("🤖 Interviewer Bot Follow-Up:")
            try:
                completion = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You're a professional interviewer."},
                        {"role": "user", "content": f"This was the candidate's response: {text}. Suggest one insightful follow-up question."}
                    ]
                )
                follow_up = completion['choices'][0]['message']['content']
            except Exception:
                follow_up = "Could not generate follow-up."
            st.write(f"💬 **Bot:** {follow_up}")

            st.session_state.responses.append(text)
            st.session_state.scores.append(score)
            st.session_state.emotions.append(emotion)

            st.session_state.current_q += 1

if st.session_state.current_q >= len(questions):
    st.header("🎯 Interview Completed")
    total_score = sum(st.session_state.scores)
    st.success(f"Your Total Score: {total_score} / {len(questions) * 8}")

    if st.button("📄 Download PDF Report"):
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.cell(200, 10, "Job Interview AI - Report", ln=True, align='C')

        for i, (q, r, s, e) in enumerate(zip(questions, st.session_state.responses, st.session_state.scores, st.session_state.emotions)):
            pdf.set_font("Arial", "B", 12)
            pdf.cell(200, 10, f"\nQuestion {i+1}: {q}", ln=True)
            pdf.set_font("Arial", "", 11)
            pdf.multi_cell(0, 10, f"Response: {r}")
            pdf.cell(200, 10, f"Score: {s} / 8", ln=True)
            pdf.cell(200, 10, f"Emotion: {e}", ln=True)

        pdf.cell(200, 10, f"\nFinal Score: {total_score} / {len(questions) * 8}", ln=True)

        pdf_path = "interview_report.pdf"
        pdf.output(pdf_path)
        with open(pdf_path, "rb") as f:
            st.download_button("⬇️ Download Report", f, file_name="Interview_Report.pdf")

    st.balloons()
