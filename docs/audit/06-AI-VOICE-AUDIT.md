# 06 — AI Voice Engine Audit

## Capabilities & Fallbacks
- **Supported Personas**: Kai (curious/homework), Mia (creative/stories), Lumi (calming/routines), Zayn (science/logic).
- **Audio Pipeline**: Real-time microphone capture via Web Audio API, local Web Speech API synthesis (`SpeechSynthesisUtterance`), cascading to server-side synthesis.
- **Multilingual Support**: English, Urdu (`ur-PK`), and Pakistani Punjabi (`pa-PK`).
- **Interruption Handling**: Instant speech synthesis cancelation when user taps stop or starts speaking.\n