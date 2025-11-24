# Task: Add Audio Recording and Transcription Support

## Backend (app/api/gemini-proxy/route.ts)
- [ ] Modify POST handler to accept JSON body with text prompt, optional audioData (base64), and mimeType.
- [ ] Construct contents.parts array with text part and audio inline_data if present.
- [ ] Use the model "gemini-1.5-flash" for the Gemini API.
- [ ] Return Gemini API response or handle errors.

## Frontend (app/page.tsx)
- [ ] Import Mic and Square icons from lucide-react.
- [ ] In ChatInterface component:
  - [ ] Add state: isRecording.
  - [ ] Add ref: mediaRecorderRef to hold MediaRecorder instance.
  - [ ] Implement startRecording:
    - Request microphone access and start MediaRecorder.
    - Accumulate audio chunks.
  - [ ] Implement stopRecording:
    - Stop MediaRecorder.
    - Convert Blob to base64.
    - POST to /api/gemini-proxy with audio data and transcription prompt.
    - Update chat messages with "🎤 [Audio Sent]" and bot transcription.
- [ ] Add button in chat input form:
  - Shows Mic or Square icon depending on recording state.
  - Toggles recording on click.

## Followup
- Test recorded audio transcription flows end-to-end.
- Verify graceful fallback if mic permission denied.
