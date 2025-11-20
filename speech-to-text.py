import streamlit as st
import speech_recognition as sr
from streamlit_mic_recorder import mic_recorder
import io

# --- Configuration ---
st.set_page_config(
    page_title="Indic Speech-to-Text",
    page_icon="🎙️",
    layout="centered"
)

LANGUAGES = {
    "English (India)": "en-IN",
    "Hindi (हिन्दी)": "hi-IN",
    "Bengali (বাংলা)": "bn-IN",
    "Gujarati (ગુજરાતી)": "gu-IN",
    "Kannada (ಕನ್ನಡ)": "kn-IN",
    "Malayalam (മലയാളം)": "ml-IN",
    "Marathi (मराठी)": "mr-IN",
    "Punjabi (ਪੰਜਾਬੀ)": "pa-IN",
    "Tamil (தமிழ்)": "ta-IN",
    "Telugu (తెలుగు)": "te-IN",
    "Urdu (India) (اُردُو)": "ur-IN"
}

def transcribe_audio_data(audio_bytes, language_code):
    """
    Transcribes audio bytes received from the browser.
    """
    r = sr.Recognizer()
    text_output = ""
    
    # Convert bytes to a file-like object for SpeechRecognition
    audio_file = io.BytesIO(audio_bytes)
    
    try:
        with sr.AudioFile(audio_file) as source:
            audio_data = r.record(source)
            
        # Attempt recognition
        text_output = r.recognize_google(audio_data, language=language_code)
        return True, text_output

    except sr.UnknownValueError:
        return False, "⚠️ Could not understand audio. Please try speaking more clearly."
    except sr.RequestError as e:
        return False, f"⚠️ API Error: {e}"
    except Exception as e:
        return False, f"⚠️ Error: {str(e)}"

# --- UI Layout ---
st.title("🎙️ Multilingual Speech-to-Text")
st.markdown("Works in WSL/Cloud by recording in the **Browser**.")

# Sidebar
selected_lang_name = st.sidebar.selectbox("Select Language", list(LANGUAGES.keys()))
selected_lang_code = LANGUAGES[selected_lang_name]

st.subheader("Record Audio")
st.info(f"Language set to: **{selected_lang_name}**")

# --- THE BROWSER RECORDER ---
# This creates a button in the browser. When you stop recording, 
# it sends the audio bytes back to Python.
audio = mic_recorder(
    start_prompt="Start Recording",
    stop_prompt="Stop Recording", 
    just_once=False,
    use_container_width=True
)

if audio:
    # "audio" is a dictionary containing 'bytes' and 'sample_rate'
    st.audio(audio['bytes'])
    
    with st.spinner("Transcribing..."):
        success, result = transcribe_audio_data(audio['bytes'], selected_lang_code)
        
        if success:
            st.success("Transcription:")
            st.markdown(f"### {result}")
        else:
            st.error(result)