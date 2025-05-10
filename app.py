import streamlit as st
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import tempfile
import os

# === CONFIG ===
questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths?",
    "Where do you see yourself in 5 years?"
]

# === Simple Scoring via Word Overlap ===
def simple_relevance_score(question, answer):
    q_words = set(question.lower().split())
    a_words = set(answer.lower().split())
    common = q_words.intersection(a_words)
    return len(common) / len(q_words) if q_words else 0

# === Streamlit UI ===
st.title("🧠 Job Interview AI – Minimal Version")
st.markdown("Type or upload your response to each interview question.")

if "current_q" not in st.session_state:
    st.session_state.current_q = 0
    st.session_state.responses = []
    st.session_state.scores = []

st.subheader(f"🎤 Question {st.session_state.current_q + 1}:")
st.markdown(f"**{questions[st.session_state.current_q]}**")

uploaded_txt = st.file_uploader("📄 Upload answer (.txt)", type=["txt"])
response_text = ""
if uploaded_txt:
    response_text = uploaded_txt.read().decode("utf-8")
else:
    response_text = st.text_area("📝 Or type your answer here:")

if st.button("✅ Submit Answer"):
    if not response_text.strip():
        st.warning("Please enter or upload your answer.")
    else:
        relevance = simple_relevance_score(questions[st.session_state.current_q], response_text)
        score = 5 if relevance > 0.3 else 2

        st.write(f"📊 Approximate Relevance Score: `{relevance:.2f}`")
        st.write("🤖 Try expanding on this in your next attempt.")

        st.session_state.responses.append(response_text)
        st.session_state.scores.append(score)
        st.session_state.current_q += 1

if st.session_state.current_q >= len(questions):
    st.header("🎯 Interview Completed")
    total_score = sum(st.session_state.scores)
    st.success(f"Your Total Score: {total_score} / {len(questions) * 5}")

    if st.button("📄 Download PDF Report"):
        pdf_path = "interview_report.pdf"
        c = canvas.Canvas(pdf_path, pagesize=letter)
        width, height = letter
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredString(width / 2, height - 50, "Job Interview AI - Report")

        y = height - 80
        c.setFont("Helvetica", 11)
        for i, (q, r, s) in enumerate(zip(questions, st.session_state.responses, st.session_state.scores)):
            c.drawString(50, y, f"Q{i+1}: {q}")
            y -= 15
            for line in r.splitlines():
                c.drawString(60, y, f"Answer: {line}")
                y -= 15
            c.drawString(60, y, f"Score: {s} / 5")
            y -= 25

            if y < 100:
                c.showPage()
                y = height - 50
                c.setFont("Helvetica", 11)

        c.drawString(50, y, f"Final Score: {total_score} / {len(questions) * 5}")
        c.save()

        with open(pdf_path, "rb") as f:
            st.download_button("⬇️ Download Report", f, file_name="Interview_Report.pdf")

    st.balloons()
