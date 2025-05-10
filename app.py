import streamlit as st
import requests
import io

# === Interview Questions ===
questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths?",
    "Where do you see yourself in 5 years?"
]

# === Simple scoring via word overlap ===
def simple_score(question, answer):
    q_words = set(question.lower().split())
    a_words = set(answer.lower().split())
    return len(q_words & a_words) / max(len(q_words), 1)

# === Ollama Assistant ===
def get_ollama_suggestion(question):
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",  # or llama2, phi, gemma, etc.
                "prompt": f"Suggest a professional job interview answer to: {question}",
                "stream": False
            },
            timeout=15
        )
        return response.json().get("response", "").strip()
    except Exception as e:
        return f"❌ Ollama error: {str(e)}"

# === Streamlit UI ===
st.title("🧠 Job Interview AI – with Ollama Assistant")

if "current_q" not in st.session_state:
    st.session_state.current_q = 0
    st.session_state.responses = []
    st.session_state.scores = []

if st.session_state.current_q < len(questions):
    q = questions[st.session_state.current_q]
    st.subheader(f"🎤 Question {st.session_state.current_q + 1}: {q}")

    with st.spinner("🤖 Generating AI Assistant Suggestion..."):
        suggestion = get_ollama_suggestion(q)
    st.markdown("💡 **AI Assistant Suggestion:**")
    st.info(suggestion)

    answer = st.text_area("📝 Your Answer", height=150)

    if st.button("✅ Submit Answer"):
        if not answer.strip():
            st.warning("Please enter your answer.")
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

    # Generate report
    report = io.StringIO()
    report.write("Job Interview Report\n\n")
    for i, (q, a, s) in enumerate(zip(questions, st.session_state.responses, st.session_state.scores)):
        report.write(f"Q{i+1}: {q}\n")
        report.write(f"Answer: {a.strip()}\n")
        report.write(f"Score: {s} / 5\n\n")
    report.write(f"Final Score: {total} / {max_score}\n")

    st.download_button("📄 Download Report (.txt)", report.getvalue(), file_name="interview_report.txt")

    st.balloons()
