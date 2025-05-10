import streamlit as st
import os
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

import numpy as np
import tempfile
from collections import Counter
from google.cloud import speech
import wave
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# === GOOGLE CLOUD SETUP ===
if not os.path.exists("gcp-key.json"):
    with open("gcp-key.json", "w") as f:
        f.write(st.secrets["GCP_CREDENTIALS"])
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "gcp-key.json"

# === CONFIG ===
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

# === Simple Relevance Scoring ===
def get_relevance_score(question, answer):
    vectorizer = TfidfVectorizer().fit_transform([question, answer])
    vectors = vectorizer.toarray()
    return cosine_similarity([vectors[0]], [vectors[1]])[0][0]

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

            relevance_score = get_relevance_score(questions[st.session_state.current_q], text)
            st.write("📊 Relevance Score:", f"{relevance_score:.2f}")

            score = 0
            if relevance_score > 0.3:
                score += 5

            emotion = "Not Analyzed"
            st.write("📸 Facial Emotion Detection: [Skipped - Not supported in Streamlit Cloud]")

            st.write("🤖 Interviewer Bot Follow-Up:")
            st.write("💬 **Bot:** Try expanding on your previous point in a real interview.")

            st.session_state.responses.append(text)
            st.session_state.scores.append(score)
            st.session_state.emotions.append(emotion)

            st.session_state.current_q += 1

if st.session_state.current_q >= len(questions):
    st.header("🎯 Interview Completed")
    total_score = sum(st.session_state.scores)
    st.success(f"Your Total Score: {total_score} / {len(questions) * 8}")

    if st.button("📄 Download PDF Report"):
        pdf_path = "interview_report.pdf"
        c = canvas.Canvas(pdf_path, pagesize=letter)
        width, height = letter
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredString(width / 2, height - 50, "Job Interview AI - Report")

        y = height - 80
        c.setFont("Helvetica", 11)
        for i, (q, r, s, e) in enumerate(zip(questions, st.session_state.responses, st.session_state.scores, st.session_state.emotions)):
            c.drawString(50, y, f"Q{i+1}: {q}")
            y -= 15
            for line in r.splitlines():
                c.drawString(60, y, f"Answer: {line}")
                y -= 15
            c.drawString(60, y, f"Score: {s} / 8")
            y -= 15
            c.drawString(60, y, f"Emotion: {e}")
            y -= 25

            if y < 100:
                c.showPage()
                y = height - 50
                c.setFont("Helvetica", 11)

        c.drawString(50, y, f"Final Score: {total_score} / {len(questions) * 8}")
        c.save()

        with open(pdf_path, "rb") as f:
            st.download_button("⬇️ Download Report", f, file_name="Interview_Report.pdf")

    st.balloons()
