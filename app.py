import streamlit as st
import io
import random

# === Interview Questions ===
questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths?",
    "Where do you see yourself in 5 years?"
]

# Sample AI responses
ai_feedback = [
    "That's a good start, but try to be more specific with examples.",
    "Great answer! You've covered the key points well.",
    "Consider adding more details about your experience.",
    "Your answer shows good self-awareness.",
    "Try to connect your answer more directly to the job requirements."
]

def simple_score(question, answer):
    q_words = set(question.lower().split())
    a_words = set(answer.lower().split())
    return len(q_words & a_words) / max(len(q_words), 1)

st.title("🧠 Job Interview AI Assistant")

# Initialize session state
if "current_q" not in st.session_state:
    st.session_state.current_q = 0
    st.session_state.responses = []
    st.session_state.scores = []
    st.session_state.ai_help = False

# AI Assistant sidebar
with st.sidebar:
    st.header("AI Assistant")
    if st.button("💡 Get AI Help"):
        st.session_state.ai_help = True
    
    if st.session_state.ai_help and st.session_state.current_q < len(questions):
        current_question = questions[st.session_state.current_q]
        st.write(f"**Help for:** {current_question}")
        
        # Sample tips for each question
        if "Tell me about yourself" in current_question:
            st.write("Focus on your professional background, key skills, and achievements.")
        elif "Why should we hire you" in current_question:
            st.write("Highlight what makes you unique and how you can solve the company's problems.")
        elif "strengths" in current_question.lower():
            st.write("Mention 3-4 strengths with specific examples from your experience.")
        elif "5 years" in current_question.lower():
            st.write("Show ambition but also alignment with the company's growth.")
        
        st.write("Remember to keep your answers concise and relevant to the job.")

# Main interview flow
if st.session_state.current_q < len(questions):
    q = questions[st.session_state.current_q]
    st.subheader(f"🎤 Question {st.session_state.current_q + 1}: {q}")
    
    # Answer box - not stored in session state so it auto-clears
    answer = st.text_area("📝 Your Answer", height=150, key=f"answer_{st.session_state.current_q}")
    
    if st.button("✅ Submit Answer"):
        if not answer.strip():
            st.warning("Please write your answer.")
        else:
            score = 5 if simple_score(q, answer) > 0.3 else 2
            st.session_state.responses.append(answer)
            st.session_state.scores.append(score)
            st.session_state.current_q += 1
            st.session_state.ai_help = False
            st.rerun()  # This will clear the text area automatically
    
    # Show AI feedback after submission if enabled
    if st.session_state.ai_help and answer.strip():
        st.markdown("---")
        st.subheader("🤖 AI Feedback")
        st.write(random.choice(ai_feedback))

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

    if st.button("🔄 Start New Interview"):
        st.session_state.current_q = 0
        st.session_state.responses = []
        st.session_state.scores = []
        st.session_state.ai_help = False
        st.rerun()

    st.balloons()
