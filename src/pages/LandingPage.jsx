import landingPageStyles from "../styles/landingPage.module.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main className={landingPageStyles.app}>
      <section className={landingPageStyles.container}>
        <div className={landingPageStyles.content}>
          <h1 className={landingPageStyles.heroText}>
            Master your interview skills with EduPathAI's intelligent mock interview system.
          </h1>
          <p className={landingPageStyles.description}>
            Practice with AI-powered interviews tailored to your field and experience level. Get real-time feedback and build confidence for your next career opportunity.
          </p>
          <Link to="/category">
            <button className={landingPageStyles.startButton}>Start Mock Interview</button>
          </Link>
        </div>
      </section>

      <section
        className={`${landingPageStyles.bulletPointsSection} ${landingPageStyles.container}`}
      >
        <div className={landingPageStyles.bulletPoints}>
          <h4 className={landingPageStyles.bulletTitle}>
            Personalized Interview Experience
          </h4>
          <p className={landingPageStyles.bulletDescription}>
            EduPathAI adapts to your industry, role, and experience level to create realistic interview scenarios that mirror real-world hiring processes.
          </p>
        </div>
        <div className={landingPageStyles.bulletPoints}>
          <h4 className={landingPageStyles.bulletTitle}>
            Industry-Specific Questions
          </h4>
          <p className={landingPageStyles.bulletDescription}>
            Practice with curated questions from tech, finance, healthcare, marketing, and dozens of other industries to prepare for your specific field.
          </p>
        </div>
        <div className={landingPageStyles.bulletPoints}>
          <h4 className={landingPageStyles.bulletTitle}>
            Comprehensive Performance Analytics
          </h4>
          <p className={landingPageStyles.bulletDescription}>
            Receive detailed feedback on your responses, communication style, and areas for improvement after each mock interview session.
          </p>
        </div>
      </section>
    </main>
  );
}