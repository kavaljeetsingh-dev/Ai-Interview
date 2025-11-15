import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LOCAL_URL } from "../api";
import { ALL_LEVELS } from "../constants/categories";
import { useAccess } from "../context/AccessContext";
import categoryPageStyles from "../styles/categoryPage.module.css";

// Mock interview categories and roles
const INTERVIEW_TYPES = [
  { id: 1, name: "Technical", icon: "💻" },
  { id: 2, name: "Behavioral", icon: "🤝" },
  { id: 3, name: "Case Study", icon: "📊" },
  { id: 4, name: "System Design", icon: "🏗️" },
  { id: 5, name: "Product Management", icon: "📱" },
  { id: 6, name: "Sales", icon: "💼" },
  { id: 7, name: "Leadership", icon: "👑" },
  { id: 8, name: "Custom", icon: "⚙️" }
];

const JOB_ROLES = [
  "Software Engineer", "Data Scientist", "Product Manager", "UX Designer",
  "Marketing Manager", "Sales Representative", "Business Analyst", "DevOps Engineer",
  "Project Manager", "Consultant", "Financial Analyst", "HR Manager", "Other"
];

const COMPANY_TYPES = [
  "Startup", "Big Tech (FAANG)", "Fortune 500", "Consulting", "Financial Services",
  "Healthcare", "E-commerce", "Government", "Non-profit", "Other"
];

const INTERVIEW_DURATION = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" }
];

const EXPERIENCE_LEVELS = [
  { id: 1, name: "Entry Level (0-2 years)", value: "entry" },
  { id: 2, name: "Mid Level (3-5 years)", value: "mid" },
  { id: 3, name: "Senior Level (6-10 years)", value: "senior" },
  { id: 4, name: "Lead/Principal (10+ years)", value: "lead" }
];

function CategoryPage() {
  const { setAccessGranted } = useAccess();
  
  // Core interview setup
  const [interviewType, setInterviewType] = useState(INTERVIEW_TYPES[0]);
  const [jobRole, setJobRole] = useState(JOB_ROLES[0]);
  const [companyType, setCompanyType] = useState(COMPANY_TYPES[0]);
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[0]);
  const [duration, setDuration] = useState(INTERVIEW_DURATION[1]);
  const [difficulty, setDifficulty] = useState(ALL_LEVELS[0]);
  
  // Custom scenario fields
  const [customScenario, setCustomScenario] = useState("");
  const [specificSkills, setSpecificSkills] = useState("");
  const [interviewerStyle, setInterviewerStyle] = useState("professional");
  
  // Advanced options
  const [includeFollowUps, setIncludeFollowUps] = useState(true);
  const [includeFeedback, setIncludeFeedback] = useState(true);
  const [recordSession, setRecordSession] = useState(false);
  const [practiceMode, setPracticeMode] = useState("guided"); // guided, realistic, stress

  const handleInterviewTypeChange = (type) => {
    setInterviewType(type);
    // Auto-adjust some settings based on interview type
    if (type.name === "Technical") {
      setIncludeFollowUps(true);
    } else if (type.name === "Case Study") {
      setDuration(INTERVIEW_DURATION[3]); // 60 minutes for case studies
    }
  };

  const generateInterviewPrompt = () => {
    let prompt = `Mock ${interviewType.name} Interview Setup:\n`;
    prompt += `Role: ${jobRole}\n`;
    prompt += `Company Type: ${companyType}\n`;
    prompt += `Experience Level: ${experienceLevel.name}\n`;
    prompt += `Duration: ${duration.label}\n`;
    prompt += `Difficulty: ${difficulty.name}\n`;
    prompt += `Interviewer Style: ${interviewerStyle}\n`;
    prompt += `Practice Mode: ${practiceMode}\n`;
    
    if (specificSkills.trim()) {
      prompt += `Focus Areas: ${specificSkills}\n`;
    }
    
    if (customScenario.trim()) {
      prompt += `Custom Scenario: ${customScenario}\n`;
    }
    
    prompt += `\nInterview Options:\n`;
    prompt += `- Include Follow-up Questions: ${includeFollowUps ? 'Yes' : 'No'}\n`;
    prompt += `- Provide Real-time Feedback: ${includeFeedback ? 'Yes' : 'No'}\n`;
    prompt += `- Record Session: ${recordSession ? 'Yes' : 'No'}\n`;
    
    return prompt;
  };

  const sendCategoryToBackend = async () => {
    setAccessGranted(true);
    
    const interviewData = {
      type: interviewType.name.toLowerCase(),
      jobRole,
      companyType,
      experienceLevel: experienceLevel.value,
      duration: duration.value,
      difficulty: difficulty.name.toLowerCase(),
      customScenario: customScenario.trim(),
      specificSkills: specificSkills.trim(),
      interviewerStyle,
      practiceMode,
      options: {
        includeFollowUps,
        includeFeedback,
        recordSession
      },
      fullPrompt: generateInterviewPrompt()
    };

    const data = {
      topic: specificSkills.trim(), // Use the entered topic
      difficulty: difficulty.name.toLowerCase(),
    };

    try {
      const response = await axios.post(`${LOCAL_URL}/api/category`, { data });
      console.log("Prompt sent to backend:", response.data.message);
    } catch (error) {
      console.error("Error sending prompt to backend:", error);
    }
  };

  return (
    <div className={categoryPageStyles.mainContainer}>
      <div className={categoryPageStyles.headerSection}>
        <h1 className={categoryPageStyles.mainHeading}>
          🎯 Mock Interview Practice
        </h1>
        <p className={categoryPageStyles.subtitle}>
          Practice with AI-powered realistic interview scenarios tailored to your target role
        </p>
      </div>

      <div className={categoryPageStyles.configContainer}>
        
        {/* Interview Type Selection */}
        <div className={categoryPageStyles.sectionCard}>
          <h2 className={categoryPageStyles.sectionHeading}>
            <span className={categoryPageStyles.sectionIcon}>📋</span>
            Interview Type
          </h2>
          <div className={categoryPageStyles.typeGrid}>
            {INTERVIEW_TYPES.map((type) => (
              <button
                key={type.id}
                className={`${categoryPageStyles.typeCard} ${
                  type.id === interviewType.id ? categoryPageStyles.selectedCard : ""
                }`}
                onClick={() => handleInterviewTypeChange(type)}
              >
                <span className={categoryPageStyles.typeIcon}>{type.icon}</span>
                <span className={categoryPageStyles.typeName}>{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Job Details */}
        <div className={categoryPageStyles.sectionCard}>
          <h2 className={categoryPageStyles.sectionHeading}>
            <span className={categoryPageStyles.sectionIcon}>💼</span>
            Job Details
          </h2>
          <div className={categoryPageStyles.formGrid}>
            <div className={categoryPageStyles.formGroup}>
              <label className={categoryPageStyles.formLabel}>Target Role</label>
              <select 
                className={categoryPageStyles.selectField}
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              >
                {JOB_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div className={categoryPageStyles.formGroup}>
              <label className={categoryPageStyles.formLabel}>Company Type</label>
              <select 
                className={categoryPageStyles.selectField}
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
              >
                {COMPANY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Experience & Difficulty */}
        <div className={categoryPageStyles.sectionCard}>
          <h2 className={categoryPageStyles.sectionHeading}>
            <span className={categoryPageStyles.sectionIcon}>📈</span>
            Experience & Difficulty
          </h2>
          
          <div className={categoryPageStyles.formGroup}>
            <label className={categoryPageStyles.formLabel}>Your Experience Level</label>
            <div className={categoryPageStyles.radioGroup}>
              {EXPERIENCE_LEVELS.map((level) => (
                <label key={level.id} className={categoryPageStyles.radioOption}>
                  <input
                    type="radio"
                    name="experienceLevel"
                    checked={experienceLevel.id === level.id}
                    onChange={() => setExperienceLevel(level)}
                  />
                  <span className={categoryPageStyles.radioLabel}>{level.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={categoryPageStyles.formGroup}>
            <label className={categoryPageStyles.formLabel}>Interview Difficulty</label>
            <div className={categoryPageStyles.difficultyButtons}>
              {ALL_LEVELS.map((level) => (
                <button
                  key={level.id}
                  className={`${categoryPageStyles.difficultyBtn} ${
                    level.name.toLowerCase() === difficulty.name.toLowerCase()
                      ? categoryPageStyles.selectedDifficulty
                      : ""
                  }`}
                  onClick={() => setDifficulty(level)}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interview Configuration */}
        <div className={categoryPageStyles.sectionCard}>
          <h2 className={categoryPageStyles.sectionHeading}>
            <span className={categoryPageStyles.sectionIcon}>⚙️</span>
            Interview Configuration
          </h2>
          
          <div className={categoryPageStyles.formGrid}>
            <div className={categoryPageStyles.formGroup}>
              <label className={categoryPageStyles.formLabel}>Duration</label>
              <select 
                className={categoryPageStyles.selectField}
                value={duration.value}
                onChange={(e) => setDuration(INTERVIEW_DURATION.find(d => d.value == e.target.value))}
              >
                {INTERVIEW_DURATION.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            
            <div className={categoryPageStyles.formGroup}>
              <label className={categoryPageStyles.formLabel}>Interviewer Style</label>
              <select 
                className={categoryPageStyles.selectField}
                value={interviewerStyle}
                onChange={(e) => setInterviewerStyle(e.target.value)}
              >
                <option value="professional">Professional & Formal</option>
                <option value="friendly">Friendly & Conversational</option>
                <option value="challenging">Challenging & Probing</option>
                <option value="stress">High-Pressure/Stress Test</option>
              </select>
            </div>
          </div>

          <div className={categoryPageStyles.formGroup}>
            <label className={categoryPageStyles.formLabel}>Practice Mode</label>
            <div className={categoryPageStyles.modeButtons}>
              <button
                className={`${categoryPageStyles.modeBtn} ${
                  practiceMode === "guided" ? categoryPageStyles.selectedMode : ""
                }`}
                onClick={() => setPracticeMode("guided")}
              >
                🎓 Guided (with hints)
              </button>
              <button
                className={`${categoryPageStyles.modeBtn} ${
                  practiceMode === "realistic" ? categoryPageStyles.selectedMode : ""
                }`}
                onClick={() => setPracticeMode("realistic")}
              >
                💼 Realistic (authentic experience)
              </button>
              <button
                className={`${categoryPageStyles.modeBtn} ${
                  practiceMode === "stress" ? categoryPageStyles.selectedMode : ""
                }`}
                onClick={() => setPracticeMode("stress")}
              >
                🔥 Stress Test (challenging)
              </button>
            </div>
          </div>
        </div>

        {/* Custom Scenario */}
        <div className={categoryPageStyles.sectionCard}>
          <h2 className={categoryPageStyles.sectionHeading}>
            <span className={categoryPageStyles.sectionIcon}>✏️</span>
            Customization 
          </h2>
          
          <div className={categoryPageStyles.formGroup}>
            <label className={categoryPageStyles.formLabel}>
              Specific Skills or Topics to Focus On
            </label>
            <input
              type="text"
              className={categoryPageStyles.inputField}
              placeholder="e.g., React, algorithms, leadership, conflict resolution..."
              value={specificSkills}
              onChange={(e) => setSpecificSkills(e.target.value)}
            />
          </div>
              <br></br>
          <div className={categoryPageStyles.formGroup}>
            <label className={categoryPageStyles.formLabel}>
              Custom Scenario or Company Context
            </label>
            <textarea
              className={`${categoryPageStyles.inputField} ${categoryPageStyles.textareaField}`}
              placeholder="Describe a specific scenario, company situation, or context you'd like to practice..."
              rows="4"
              value={customScenario}
              onChange={(e) => setCustomScenario(e.target.value)}
            />
          </div>
        </div>

        {/* Interview Options */}
        <div className={categoryPageStyles.sectionCard}>
          <h2 className={categoryPageStyles.sectionHeading}>
            <span className={categoryPageStyles.sectionIcon}>🎛️</span>
            Interview Options
          </h2>
          
          <div className={categoryPageStyles.optionsGrid}>
            <label className={categoryPageStyles.checkboxOption}>
              <input
                type="checkbox"
                checked={includeFollowUps}
                onChange={(e) => setIncludeFollowUps(e.target.checked)}
              />
              <span className={categoryPageStyles.checkboxLabel}>
                <strong>Include Follow-up Questions</strong>
                <br />
                <small>Deeper dive into your responses</small>
              </span>
            </label>

            <label className={categoryPageStyles.checkboxOption}>
              <input
                type="checkbox"
                checked={includeFeedback}
                onChange={(e) => setIncludeFeedback(e.target.checked)}
              />
              <span className={categoryPageStyles.checkboxLabel}>
                <strong>Real-time Feedback</strong>
                <br />
                <small>Get immediate tips during the interview</small>
              </span>
            </label>

            <label className={categoryPageStyles.checkboxOption}>
              <input
                type="checkbox"
                checked={recordSession}
                onChange={(e) => setRecordSession(e.target.checked)}
              />
              <span className={categoryPageStyles.checkboxLabel}>
                <strong>Record Session</strong>
                <br />
                <small>Save for later review and analysis</small>
              </span>
            </label>
          </div>
        </div>

        {/* Interview Summary */}
        <div className={categoryPageStyles.summaryCard}>
          <h3 className={categoryPageStyles.summaryHeading}>Interview Summary</h3>
          <div className={categoryPageStyles.summaryContent}>
            <div className={categoryPageStyles.summaryItem}>
              <strong>{interviewType.name}</strong> interview for <strong>{jobRole}</strong>
            </div>
            <div className={categoryPageStyles.summaryItem}>
              {companyType} company • {experienceLevel.name} • {duration.label}
            </div>
            <div className={categoryPageStyles.summaryItem}>
              {difficulty.name} difficulty • {interviewerStyle} style • {practiceMode} mode
            </div>
          </div>
        </div>

        {/* Start Interview Button */}
        <div className={categoryPageStyles.startInterviewBtnContainer}>
          <Link to="/interview">
            <button
              className={categoryPageStyles.startInterviewButton}
              onClick={sendCategoryToBackend}
            >
              <span className={categoryPageStyles.buttonIcon}>🚀</span>
              Start Mock Interview
              <span className={categoryPageStyles.buttonSubtext}>
                {duration.label} • {interviewType.name}
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;