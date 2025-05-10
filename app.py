import streamlit as st
import requests
import io

questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths?",
    "Where do you see yourself in 5 years?"
]

def ask_ollama(prompt):
    try:
        res = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",
                "prompt": prompt,
                "stream": False
            },
            timeout=15
        )
        return res.json().get("response", "").strip()
    except Exception as e:
        return f"❌ Ollama error: {str(e)}"

def simple_score(q, a):
    return 5 if len(set(q.lower().split()) & set(a.lower().split())) > 2 else 2

if "current_q" not in st.session_state:
    st.session_state.current_q = 0
    st.session_state.responses = ["" for _ in questions]
    st.session_state.scores = [0 for _ in questions]
    st.session_state.chat_history = [[] for _ in questions]

st.title("🧠 Job Interview AI (with Ollama Chat Assistant)")

if st.session_state.current_q < len(questions):
    q_index = st.session_state.current_q
    q = questions[q_index]

    st.subheader(f"🎤 Question {q_index + 1}: {q}")

    with st.expander("🤖 Need help answering? Ask the AI Assistant:"):
        user_prompt = st.text_input("Ask your assistant:", key=f"chat_{q_index}")
        if st.button("Ask", key=f"ask_{q_index}"):
            full_prompt = f"You are an interview coach. A candidate is being asked: '{q}'.\n\nThey ask: '{user_prompt}'\n\nGive a helpful, specific response."
            reply = ask_ollama(full_prompt)
            st.session_state.chat_history[q_index].append((user_prompt, reply))

        for u, r in st.session_state.chat_history[q_index][-3:]:
            st.markdown(f"**🧑 You:** {u}")
            st.markdown(f"**🤖 AI:** {r}")

    st.text_area("📝 Your Final Answer", value=st.session_state.responses[q_index], key="answer")

    col1, col2 = st.columns(2)

    with col1:
        if st.button("⬅️ Previous") and st.session_state.current_q > 0:
            st.session_state.responses[q_index] = st.session_state["answer"]
            st.session_state.current_q -= 1

    with col2:
        if st.button("✅ Submit Answer"):
            if not st.session_state["answer"].strip():
                st.warning("Please write your answer.")
            else:
                st.session_state.responses[q_index] = st.session_state["answer"]
                st.session_state.scores[q_index] = simple_score(q, st.session_state["answer"])
                if st.session_state.current_q + 1 < len(questions):
                    st.session_state.current_q += 1

if st.session_state.current_q >= len(questions):
    st.header("✅ Interview Complete")
    total = sum(st.session_state.scores)
    max_score = len(questions) * 5
    st.success(f"Your Total Score: {total} / {max_score}")

    report = io.StringIO()
    report.write("Job Interview Report\n\n")
    for i, (q, a, s) in enumerate(zip(questions, st.session_state.responses, st.session_state.scores)):
        report.write(f"Q{i+1}: {q}\n")
        report.write(f"Answer: {a.strip()}\n")
        report.write(f"Score: {s} / 5\n\n")
    report.write(f"Final Score: {total} / {max_score}\n")

    st.download_button("📄 Download Report (.txt)", report.getvalue(), file_name="interview_report.txt")
    st.balloons()
