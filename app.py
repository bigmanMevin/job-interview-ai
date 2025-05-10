import streamlit as st
import io

# === Interview Questions ===
questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths?",
    "Where do you see yourself in 5 years?"
]

def simple_score(question, answer):
    q_words = set(question.lower().split())
    a_words = set(answer.lower().split())
    return len(q_words & a_words) / max(len(q_words), 1)

st.title("🧠 Job Interview AI – Streamlit-Only Version")

if "current_q" not in st.session_state:
    st.session_state.current_q = 0
    st.session_state.responses = []
    st.session_state.scores = []

if st.session_state.current_q < len(questions):
    q = questions[st.session_state.current_q]
    st.subheader(f"🎤 Question {st.session_state.current_q + 1}: {q}")
    answer = st.text_area("📝 Your Answer", height=150)

    if st.button("✅ Submit Answer"):
        if not answer.strip():
            st.warning("Please write your answer.")
        else:
            score = 5 if simple_score(q, answer) > 0.3 else 2
            st.session_state.responses.append(answer)
            st.session_state.scores.append(score)
            st.session_state.current_q += 1

if st.session_state.current_q >= len(questions):
    st.header("✅ Interview Complete")
    total = sum(st.session_state.scores)
    max_score = len(questions) * 5
    st.success(f"Your Total Score: {total} / {max_score}")

    # Generate report text
    output = io.StringIO()
    output.write("Job Interview Report\n\n")
    for i, (q, a, s) in enumerate(zip(questions, st.session_state.responses, st.session_state.scores)):
        output.write(f"Q{i+1}: {q}\n")
        output.write(f"Answer: {a.strip()}\n")
        output.write(f"Score: {s} / 5\n\n")
    output.write(f"Final Score: {total} / {max_score}\n")

    # Download as text file
    st.download_button("📄 Download Report (.txt)", output.getvalue(), file_name="interview_report.txt")

    st.balloons()

