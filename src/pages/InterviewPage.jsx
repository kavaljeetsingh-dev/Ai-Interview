import { useEffect, useRef, useState } from "react";
import interviewStyles from "../styles/interviewPage.module.css";
import interviewer from "../assets/interviewer.png";
import interviewee from "../assets/interviewee.png";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate } from "react-router-dom";
import { LOCAL_URL } from "../api";
import Loader from "../components/ui/Loader";
import CodeEditorModal from "../components/CodeEditorModal";

export default function InterviewPage() {
  const navigate = useNavigate();
  const [aiResponse, setAiResponse] = useState("");
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [glowingEffect, setGlowingEffect] = useState({
    user: false,
    interviewer: false,
  });
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [timer, setTimer] = useState(0); // Timer in seconds
  const isRun = useRef(false);
  const speechSynthesisRef = useRef(null);
  const timerRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Timer functionality
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup function for speech synthesis
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // starting loading before interview starts
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  // send empty script on initial load so that ai starts responding
  useEffect(() => {
    const firstRequestToGemini = async () => {
      try {
        const response = await axios.post(`${LOCAL_URL}/api/chat`, {
          transcript: "",
        });
        setAiResponse(response.data.content);
        speak(response.data.content);
      } catch (error) {
        console.error("Error in first request:", error);
        setIsInterviewerSpeaking(false);
      }
    };

    if (isRun.current === true) return;
    isRun.current = true;

    setTimeout(() => {
      firstRequestToGemini();
    }, 2000);
  }, []);

  useEffect(() => {
    const interviewComplete = "Thank you for interviewing with EduPath AI";

    if (
      aiResponse?.includes(interviewComplete) &&
      isInterviewerSpeaking === false
    ) {
      navigate("/feedback");
    }
  }, [aiResponse, isInterviewerSpeaking, navigate]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition. This project best works on microsoft edge.</span>;
  }

  const handleStartListeningUser = () => {
    setGlowingEffect((prev) => ({ ...prev, user: true }));
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-IN",
      interimResults: true,
    });
  };

  const handleStopListeningUser = async () => {
    setGlowingEffect((prev) => ({ ...prev, user: false }));
    SpeechRecognition.stopListening();

    try {
      const response = await axios.post(`${LOCAL_URL}/api/chat`, {
        transcript,
      });
      setAiResponse(response.data.content);
      speak(response.data.content);
      resetTranscript();
    } catch (error) {
      console.error("Error in chat request:", error);
      setIsInterviewerSpeaking(false);
    }
  };

  const handleOpenCodeEditor = () => {
    setIsCodeEditorOpen(true);
  };

  const handleCloseCodeEditor = () => {
    setIsCodeEditorOpen(false);
  };

  const handleEndInterview = () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // Stop any ongoing speech
    if (speechSynthesisRef.current) {
      speechSynthesis.cancel();
    }
    // Navigate to feedback
    navigate("/feedback");
  };

  function speak(text) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    setGlowingEffect((prev) => ({ ...prev, interviewer: true }));
    setIsInterviewerSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0];
    utterance.lang = "en-IN";

    // Handle both successful completion and errors
    utterance.onend = () => {
      setIsInterviewerSpeaking(false);
      setGlowingEffect((prev) => ({ ...prev, interviewer: false }));
      speechSynthesisRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsInterviewerSpeaking(false);
      setGlowingEffect((prev) => ({ ...prev, interviewer: false }));
      speechSynthesisRef.current = null;
    };

    // Store the utterance reference
    speechSynthesisRef.current = utterance;
    
    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Speech synthesis error:", error);
      setIsInterviewerSpeaking(false);
      setGlowingEffect((prev) => ({ ...prev, interviewer: false }));
      speechSynthesisRef.current = null;
    }
  }

  return (
    <>
      {loading ? (
        <Loader text="EduPath is generating your conversation. Almost there...." />
      ) : (
                  <div className={interviewStyles.interviewLayout}>
          {/* Timer and End Interview Button */}
          <div className={interviewStyles.topRightControls}>
            <div className={interviewStyles.timer}>
              {formatTimer(timer)}
            </div>
            <button
              onClick={handleEndInterview}
              className={`${interviewStyles.endInterviewButton} ${interviewStyles.topEndButton}`}
            >
              End Interview
            </button>
          </div>

          <div className={interviewStyles.interviewLHS}>
            <div
              className={`${interviewStyles.sectionBackground} ${interviewStyles.interviewerSection}`}
            >
              <p className={interviewStyles.sectionTitle}>Interviewer</p>
              <img
                src={interviewer}
                alt="AI Interviewer"
                className={`${interviewStyles.interviewerProfile} ${
                  glowingEffect.interviewer ? interviewStyles.glowingEffect : ""
                }`}
              />
            </div>
            <div
              className={`${interviewStyles.sectionBackground} ${interviewStyles.intervieweeSection}`}
            >
              <p className={interviewStyles.sectionTitle}>You</p>
              <img
                src={interviewee}
                alt="AI Interviewee"
                className={`${interviewStyles.intervieweeProfile} ${
                  glowingEffect.user ? interviewStyles.glowingEffect : ""
                }`}
              />
              <div className={interviewStyles.intervieweeControlButtonGroup}>
                <button
                  onClick={handleStartListeningUser}
                  className={`${interviewStyles.intervieweeControlButton} ${
                    isInterviewerSpeaking || listening
                      ? interviewStyles.intervieweeControlButtonInactive
                      : ""
                  }`}
                  disabled={isInterviewerSpeaking || listening}
                >
                  Start answering
                </button>
                <button
                  onClick={handleStopListeningUser}
                  className={`${interviewStyles.intervieweeControlButton} ${
                    isInterviewerSpeaking || !listening
                      ? interviewStyles.intervieweeControlButtonInactive
                      : ""
                  }`}
                  disabled={isInterviewerSpeaking || !listening}
                >
                  Stop answering
                </button>
                <button
                  onClick={handleOpenCodeEditor}
                  className={`${interviewStyles.intervieweeControlButton} ${interviewStyles.codeEditorButton}`}
                  disabled={isInterviewerSpeaking}
                >
                  Write Code
                </button>
              </div>
            </div>
          </div>
          <div className={interviewStyles.interviewRHS}>
            <div
              className={`${interviewStyles.sectionBackground} ${interviewStyles.qASection}`}
            >
              <p className={interviewStyles.sectionTitle}>Question</p>
              <p className={interviewStyles.sectionContent}>{aiResponse}</p>
            </div>
            <div
              className={`${interviewStyles.sectionBackground} ${interviewStyles.qASection} ${interviewStyles.answerSection}`}
            >
              <p className={interviewStyles.sectionTitle}>Answer</p>
              <p className={interviewStyles.sectionContent}>{transcript}</p>
            </div>
          </div>

          {/* Code Editor Modal */}
          {isCodeEditorOpen && (
            <CodeEditorModal onClose={handleCloseCodeEditor} />
          )}
        </div>
      )}
    </>
  );
}