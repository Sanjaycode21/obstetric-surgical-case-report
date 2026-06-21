"use client";
// Rebuilt styles for PillNav
import React, { useState, useEffect, useRef } from "react";
import Aurora from "@/components/Aurora";
import TargetCursor from "@/components/TargetCursor";
import PillNav from "@/components/PillNav";
import GradualBlur from "@/components/GradualBlur";
import SpotlightCard from "@/components/SpotlightCard";
import BorderGlow from "@/components/BorderGlow";
import Orb from "@/components/Orb";

const logoSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/></svg>`;

// Types
interface Message {
  sender: "ai" | "user";
  text: string;
}

interface LeaderboardEntry {
  rank: number | string;
  name: string;
  score: number;
  level: "Expert" | "Advanced" | "Intermediate" | "Review Needed";
  badgeClass: "expert" | "advanced" | "intermediate" | "review";
  isUser?: boolean;
}

export default function Home() {
  // Navigation State
  const [activeNav, setActiveNav] = useState("patient");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Tab State (Section 03)
  const [activeTab, setActiveTab] = useState(1);
  const [activeTabRect, setActiveTabRect] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeBtn = tabRefs.current[activeTab - 1];
    if (activeBtn) {
      setActiveTabRect({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }

    const handleResize = () => {
      const activeBtn = tabRefs.current[activeTab - 1];
      if (activeBtn) {
        setActiveTabRect({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    // Extra timeout to make sure fonts are fully loaded/layout is computed on mount
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [activeTab]);

  // Findings Animation State
  const [animateFindings, setAnimateFindings] = useState(false);

  // Quiz State (Section 08)
  const [quizStep, setQuizStep] = useState<"start" | "quiz" | "result">("start");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizNameError, setQuizNameError] = useState("");

  // AI Tutor State (Section 09)
  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I'm your AI tutor for this case. I can help you understand midgut volvulus in pregnancy, the significance of the Ladd's procedure, cervical incompetence management, or any clinical reasoning questions about this case. What would you like to explore?",
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Leaderboard State (Section 10)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: "Dr. R. Kumar", score: 10, level: "Expert", badgeClass: "expert" },
    { rank: 2, name: "Dr. S. Patel", score: 9, level: "Expert", badgeClass: "expert" },
    { rank: 3, name: "Dr. A. Nair", score: 8, level: "Advanced", badgeClass: "advanced" },
    { rank: 4, name: "Dr. M. Verma", score: 8, level: "Advanced", badgeClass: "advanced" },
    { rank: 5, name: "Dr. T. Rao", score: 6, level: "Intermediate", badgeClass: "intermediate" },
  ]);
  const [userName, setUserName] = useState("");
  const [leaderboardSubmitted, setLeaderboardSubmitted] = useState(false);

  // Histopathology Microscope State (Section 06)
  const [magnification, setMagnification] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const histoViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (magnification === 1) {
      setPanOffset({ x: 0, y: 0 });
    }
  }, [magnification]);

  const handleHistoPointerDown = (e: React.PointerEvent) => {
    const scale = 1 + (magnification - 1) * 0.05;
    if (scale <= 1) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleHistoPointerMove = (e: React.PointerEvent) => {
    if (!isPanning) return;
    const newX = e.clientX - panStartRef.current.x;
    const newY = e.clientY - panStartRef.current.y;

    const scale = 1 + (magnification - 1) * 0.05;
    let limitX = 0;
    let limitY = 0;

    if (histoViewportRef.current) {
      const rect = histoViewportRef.current.getBoundingClientRect();
      limitX = (rect.width * scale - rect.width) / 2;
      limitY = (rect.height * scale - rect.height) / 2;
    }

    const constrainedX = Math.max(-limitX, Math.min(limitX, newX));
    const constrainedY = Math.max(-limitY, Math.min(limitY, newY));

    setPanOffset({ x: constrainedX, y: constrainedY });
  };

  const handleHistoPointerUp = (e: React.PointerEvent) => {
    setIsPanning(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Scroll Reveal & Active Navigation Intersection Observer
  useEffect(() => {
    // Scroll Reveal
    const reveals = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.05 }
    );
    reveals.forEach((r) => revealObserver.observe(r));

    // Active Nav Highlighting
    const sections = document.querySelectorAll("section[id]");
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
            if (entry.target.id === "findings") {
              setAnimateFindings(true);
            }
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s));

    return () => {
      revealObserver.disconnect();
      navObserver.disconnect();
    };
  }, []);

  // Auto Scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, isAiTyping]);

  // Quiz Questions Data
  const quizQuestions = [
    {
      q: "What is the most pathognomonic radiological sign of midgut volvulus on ultrasound?",
      options: ["A) Coffee bean sign", "B) Whirlpool sign", "C) Bird's beak sign", "D) Target sign"],
      correct: 1,
      explanation: "The whirlpool sign on Doppler ultrasound — mesenteric vessels swirling around the SMA axis — is the most specific sign for midgut volvulus. Coffee bean and bird's beak signs are associated with sigmoid volvulus.",
    },
    {
      q: "A pregnant woman at 20 weeks presents with bilious vomiting and periumbilical pain. First imaging modality of choice?",
      options: ["A) CT abdomen with contrast", "B) Plain X-ray abdomen", "C) Abdominal ultrasound", "D) Upper GI endoscopy"],
      correct: 2,
      explanation: "Ultrasound is first-line in pregnancy — safe, readily available, assesses bowel and fetal wellbeing simultaneously. MRI is the second step for confirmation.",
    },
    {
      q: "In a Ladd's procedure, what is the correct bowel repositioning after detorsion?",
      options: ["A) Small bowel left, colon right", "B) Small bowel right, colon left", "C) Small bowel centre, colon periphery", "D) No repositioning needed"],
      correct: 1,
      explanation: "After detorsion and division of Ladd's bands, small bowel goes right and colon goes left — the 'non-rotation' position — widening the mesenteric base and reducing recurrence risk.",
    },
    {
      q: "Why is incidental appendicectomy performed during Ladd's procedure for malrotation?",
      options: ["A) To prevent future torsion", "B) Because the appendix lies ectopically in malrotation, making future appendicitis diagnosis unreliable", "C) Appendicitis always co-exists", "D) Mandatory surgical protocol"],
      correct: 1,
      explanation: "In malrotation, the appendix lies in an ectopic position (often left-sided or central). Future appendicitis would not present with classic right iliac fossa pain — prophylactic appendicectomy prevents this diagnostic dilemma.",
    },
    {
      q: "What Hb value constitutes 'moderate anaemia' in pregnancy per WHO?",
      options: ["A) < 11.0 g/dL", "B) < 9.0 g/dL", "C) 7.0–9.9 g/dL", "D) < 7.0 g/dL"],
      correct: 2,
      explanation: "WHO defines anaemia in pregnancy as Hb < 11 g/dL. Moderate anaemia = 7.0–9.9 g/dL. This patient's Hb of 8.8 g/dL falls in the moderate range.",
    },
    {
      q: "McDonald cerclage differs from Shirodkar cerclage primarily in that it:",
      options: ["A) Uses a permanent non-absorbable suture", "B) Is a purse-string suture at the cervicovaginal junction without tissue dissection", "C) Requires general anaesthesia", "D) Is placed transabdominally"],
      correct: 1,
      explanation: "McDonald cerclage is a simple purse-string at the cervicovaginal junction without extensive tissue dissection — faster and preferred in emergency settings. Shirodkar involves dissection and is placed higher at the internal os.",
    },
    {
      q: "Cervical insufficiency at 22 weeks is best diagnosed by:",
      options: ["A) Digital cervical examination", "B) Transabdominal ultrasound", "C) Transvaginal ultrasound showing cervical length < 25mm with funnelling", "D) MRI pelvis"],
      correct: 2,
      explanation: "Transvaginal ultrasound (TVS) is the gold standard. Cervical length < 25mm at ≤24 weeks with funnelling (internal os opening) confirms cervical insufficiency, as seen in this case.",
    },
    {
      q: "The 'whirlpool sign' in midgut volvulus represents:",
      options: ["A) Air-fluid levels in dilated bowel", "B) Clockwise rotation of the SMV and mesentery around the SMA", "C) Peritoneal free fluid", "D) Bowel wall thickening"],
      correct: 1,
      explanation: "The whirlpool sign = SMV and mesentery rotating around the SMA. Normally the SMV lies to the right of the SMA; in malrotation with volvulus, it rotates around it.",
    },
    {
      q: "Primary risk of delayed diagnosis of midgut volvulus in pregnancy?",
      options: ["A) Preterm labour only", "B) Bowel ischaemia and necrosis leading to maternal and fetal death", "C) Cervical incompetence", "D) Placental abruption"],
      correct: 1,
      explanation: "Bowel ischaemia and necrosis is the primary risk — twisted mesentery compresses mesenteric vessels, causing rapid bowel infarction. Maternal mortality from intestinal necrosis approaches 20–35%.",
    },
    {
      q: "Which statement about intestinal malrotation in adults is TRUE?",
      options: ["A) It always presents in childhood", "B) It is always symptomatic", "C) It may be asymptomatic for decades before presenting with volvulus in adulthood", "D) Laparoscopic approach is contraindicated in pregnancy"],
      correct: 2,
      explanation: "Malrotation can remain completely asymptomatic until adulthood, when physiological stress (such as pregnancy) alters bowel mechanics and precipitates volvulus. Laparoscopic Ladd's is safe in pregnancy with appropriate positioning.",
    },
  ];

  // Quiz Handlers
  const handleQuizAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    setShowExplanation(true);
    if (optionIdx === quizQuestions[currentQuestionIdx].correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const submitToLeaderboard = (nameToSubmit: string, scoreToSubmit: number) => {
    if (!nameToSubmit.trim()) return;

    let userLevel: "Expert" | "Advanced" | "Intermediate" | "Review Needed" = "Review Needed";
    let userBadgeClass: "expert" | "advanced" | "intermediate" | "review" = "review";

    if (scoreToSubmit >= 9) {
      userLevel = "Expert";
      userBadgeClass = "expert";
    } else if (scoreToSubmit >= 7) {
      userLevel = "Advanced";
      userBadgeClass = "advanced";
    } else if (scoreToSubmit >= 5) {
      userLevel = "Intermediate";
      userBadgeClass = "intermediate";
    }

    const newUserEntry: LeaderboardEntry = {
      rank: 0,
      name: nameToSubmit,
      score: scoreToSubmit,
      level: userLevel,
      badgeClass: userBadgeClass,
      isUser: true,
    };

    const merged = [...leaderboard.filter((item) => !item.isUser), newUserEntry];
    merged.sort((a, b) => b.score - a.score);

    const ranked = merged.map((entry, idx) => {
      let medal: string | number = idx + 1;
      if (idx === 0) medal = "🥇";
      else if (idx === 1) medal = "🥈";
      else if (idx === 2) medal = "🥉";
      return {
        ...entry,
        rank: medal,
      };
    });

    setLeaderboard(ranked);
    setLeaderboardSubmitted(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setQuizStep("result");
      setQuizCompleted(true);
      submitToLeaderboard(userName, quizScore);
    }
  };

  const resetQuiz = () => {
    setQuizStep("start");
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setQuizScore(0);
    setShowExplanation(false);
    setQuizCompleted(false);
    setLeaderboardSubmitted(false);
  };

  // AI Tutor Handlers
  const handleSendMessage = async (customMessage?: string) => {
    const messageText = customMessage || aiInput;
    if (!messageText.trim()) return;

    // Add user message to log
    setAiMessages((prev) => [...prev, { sender: "user", text: messageText }]);
    if (!customMessage) setAiInput("");
    setIsAiTyping(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You are a clinical AI tutor for a medical case report titled "Between Obstruction and Loss: A rare case of midgut volvulus with cervical incompetence at 20 weeks gestation." 
          Case summary: 23-year-old primigravida at 20+1 weeks presented with acute abdominal pain, bilious vomiting, and bleeding per vaginum. Diagnosed with midgut volvulus secondary to intestinal malrotation (MRI whirlpool sign). Emergency laparoscopic Ladd's procedure performed. Incidental acute appendicitis found on histopathology. Postoperative cervical insufficiency managed with McDonald cerclage. Live birth at 37 weeks.
          Answer questions about this case, its pathophysiology, surgical management, and clinical reasoning. Be educational, accurate, and concise (under 120 words per response).`,
          messages: [{ role: "user", content: messageText }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.content[0].text;
        setAiMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      } else {
        throw new Error("Failed to connect to API");
      }
    } catch {
      // Fallback local response handler based on keywords
      setTimeout(() => {
        const reply = getFallbackAiResponse(messageText);
        setAiMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      }, 800);
    } finally {
      setIsAiTyping(false);
    }
  };

  const getFallbackAiResponse = (text: string): string => {
    const normalized = text.toLowerCase();
    if (normalized.includes("vomit") || normalized.includes("bilious")) {
      return "Bilious vomiting in a pregnant patient is a red flag indicating a proximal gastrointestinal obstruction rather than typical morning sickness (gravid dyspepsia). In this case, it was caused by the midgut volvulus twisting the duodenum, leading to complete upper digestive block. In pregnancy, any recurrent bilious emesis must be investigated with imaging to rule out surgical emergencies.";
    }
    if (normalized.includes("ladd") || normalized.includes("procedure") || normalized.includes("detorsion")) {
      return "Ladd's procedure is the definitive surgical treatment for intestinal malrotation with midgut volvulus. It involves: 1. Counterclockwise detorsion of the twisted bowel loops. 2. Division of Ladd's bands (abnormal peritoneal attachments crossing the duodenum). 3. Mobilisation of the duodenum and right colon. 4. Bowel repositioning in a 'non-rotation' state (small bowel to the right, colon to the left) to widen the mesentery base and prevent re-twisting. 5. Prophylactic appendicectomy.";
    }
    if (normalized.includes("whirlpool") || normalized.includes("sign")) {
      return "The 'whirlpool sign' is the classic pathognomonic radiological sign of midgut volvulus. On ultrasound or MRI, it shows the mesenteric vessels (specifically the superior mesenteric vein and mesentery) swirling clockwise around the superior mesenteric artery (SMA) axis. This represents the actual torsion of the gut on its narrow vascular pedicle.";
    }
    if (normalized.includes("cerclage") || normalized.includes("mcdonald") || normalized.includes("cervix") || normalized.includes("cervical")) {
      return "An emergency McDonald cerclage was performed in this case due to cervical incompetence detected at postoperative day 12 (absent cervical length with funnelling). A McDonald cerclage involves placing a purse-string non-absorbable suture at the cervicovaginal junction without dissecting tissue. This is faster and simpler than a Shirodkar cerclage, making it ideal for acute or emergency cervical insufficiency in high-risk pregnancies.";
    }
    if (normalized.includes("appendicitis") || normalized.includes("appendix") || normalized.includes("histopathology")) {
      return "Histopathology confirmed co-existing acute appendicitis. Although the midgut volvulus was the primary cause of obstruction, the appendix was inflamed and ulcerated. Incidental appendicectomy is standard during Ladd's procedure to avoid future diagnostic confusion due to ectopic appendix placement.";
    }
    return "That is an excellent clinical question. Regarding this case, remember that the co-existence of midgut volvulus (a surgical emergency) and cervical insufficiency (an obstetric emergency) required a coordinated multi-specialty approach. The patient was successfully managed with laparoscopic Ladd's procedure, followed by a McDonald cerclage, ensuring both maternal recovery and a full-term pregnancy.";
  };

  // Scroll to section helper
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 110; // Clearance for sticky navbar + spacing
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Horizontal Progress Meter Generator
  const renderProgressMeter = (title: string, percentage: number, badgeText: string, badgeType: "red" | "teal" | "amber") => {
    let barColor = "teal";
    if (badgeType === "red") barColor = "red";
    else if (badgeType === "amber") barColor = "amber";

    // Dynamic color variations for red flags to show contrast according to severity percentage
    const cardStyle: React.CSSProperties = {};
    if (badgeType === "red") {
      const p = Math.max(70, Math.min(100, percentage));
      const factor = (p - 70) / 30; // 0 to 1
      const hue = 358;
      const saturation = Math.round(50 + factor * 25); // 50% to 75%
      const lightness = Math.round(50 - factor * 18); // 50% down to 32%
      
      const themeColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      const themeColorShimmer = `hsl(${hue}, ${saturation}%, ${lightness + 12}%)`;
      const themeColorLight = `hsl(${hue}, ${saturation}%, 94%)`;

      (cardStyle as any)["--theme-color"] = themeColor;
      (cardStyle as any)["--theme-color-shimmer"] = themeColorShimmer;
      (cardStyle as any)["--theme-color-light"] = themeColorLight;
    }

    return (
      <SpotlightCard className={`finding-card ${badgeType}-flag`} style={cardStyle}>
        <div className="finding-header">
          <h4 className="finding-title">{title}</h4>
          <span className={`finding-badge ${badgeType}`}>
            {badgeType === "red" ? "▲ " : ""}
            {badgeText}
          </span>
        </div>
        <div className="progress-meter-container">
          <div
            className={`progress-meter-fill ${barColor}`}
            style={{ width: animateFindings ? `${percentage}%` : "0%" }}
          ></div>
        </div>
        <div className="finding-severity-label">
          Severity {percentage}%
        </div>
      </SpotlightCard>
    );
  };

  return (
    <>
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
      />
      <GradualBlur
        target="page"
        position="top"
        height="8rem"
        strength={2.5}
        divCount={6}
        curve="bezier"
        exponential={true}
        opacity={1}
        zIndex={990}
      />
      <PillNav
        logo={logoSvg}
        logoAlt="Case Report"
        items={[
          { label: "Patient", href: "#patient", onClick: (e) => { e.preventDefault(); scrollTo("patient"); } },
          { label: "Findings", href: "#findings", onClick: (e) => { e.preventDefault(); scrollTo("findings"); } },
          { label: "Diagnosis", href: "#diagnosis", onClick: (e) => { e.preventDefault(); scrollTo("diagnosis"); } },
          { label: "Differentials", href: "#differentials", onClick: (e) => { e.preventDefault(); scrollTo("differentials"); } },
          { label: "Surgery", href: "#surgery", onClick: (e) => { e.preventDefault(); scrollTo("surgery"); } },
          { label: "HistoPathology", href: "#pathology", onClick: (e) => { e.preventDefault(); scrollTo("pathology"); } },
          { label: "Outcome", href: "#outcome", onClick: (e) => { e.preventDefault(); scrollTo("outcome"); } },
          { label: "Quiz", href: "#quiz", onClick: (e) => { e.preventDefault(); scrollTo("quiz"); } },
          { label: "AI Tutor", href: "#tutor", onClick: (e) => { e.preventDefault(); scrollTo("tutor"); } },
          { label: "Leaderboard", href: "#leaderboard", onClick: (e) => { e.preventDefault(); scrollTo("leaderboard"); } },
        ]}
        activeHref={`#${activeNav}`}
        baseColor="#0F6E56"
        pillColor="rgba(255, 255, 255, 0.75)"
        pillTextColor="#0C2340"
        hoveredPillTextColor="#ffffff"
        ease="power3.easeOut"
      />

      {/* Main Page Layout */}
      <main style={{ position: "relative" }}>
        
        {/* HERO SECTION */}
        <section id="hero" className="hero has-blobs">
          {/* WebGL Aurora Background */}
          <div className="hero-aurora-bg">
            <Aurora
              colorStops={["#E1F5EE", "#C7ebd4", "#e0f2fe"]}
              blend={0.6}
              amplitude={0.6}
              speed={0.3}
            />
          </div>
          <div className="blob-bg blob-1"></div>
          <div className="blob-bg blob-2"></div>
          <Orb top="-150px" right="-100px" size="600px" color="rgba(15, 110, 86, 0.08)" opacity={0.6} />
          <Orb bottom="-150px" left="-150px" size="500px" color="rgba(70, 120, 255, 0.06)" opacity={0.4} />
          <div className="container">
            <div className="hero-premium-panel">
              <div className="hero-card-header">
                <span className="hero-card-tag">CASE REPORT</span>
                <span className="hero-card-meta">Obstetrics & General Surgery · 2026</span>
              </div>
              <hr className="hero-card-divider" />
              <h1 className="hero-card-title">
                <span className="title-row-1">Between</span>
                <span className="title-row-2-focus">Obstruction</span>
                <span className="title-row-3">and Loss</span>
              </h1>
              <p className="hero-summary-text">
                A rare case of midgut volvulus with concurrent acute appendicitis and cervical incompetence at 20 weeks gestation.
              </p>
              <div className="hero-actions">
                <button onClick={() => scrollTo("patient")} className="btn-hero-primary">
                  Begin the case →
                </button>
                <button onClick={() => scrollTo("quiz")} className="btn-hero-secondary">
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  Take the quiz
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CASE TIMELINE BAR */}
        <div className="timeline-strip-container">
          <div className="container">
            <div className="timeline-strip">
              <div className="timeline-strip-item reveal">
                <div className="timeline-strip-dot teal">✓</div>
                <div className="timeline-strip-label">6 Weeks</div>
                <div className="timeline-strip-sublabel">Pregnancy confirmed</div>
              </div>
              <div className="timeline-strip-item reveal">
                <div className="timeline-strip-dot amber">!</div>
                <div className="timeline-strip-label">11 Weeks</div>
                <div className="timeline-strip-sublabel">Enteric fever</div>
              </div>
              <div className="timeline-strip-item reveal">
                <div className="timeline-strip-dot red">▲</div>
                <div className="timeline-strip-label">20+1 Weeks</div>
                <div className="timeline-strip-sublabel">Acute abdomen & diagnosis</div>
              </div>
              <div className="timeline-strip-item reveal">
                <div className="timeline-strip-dot red">▲</div>
                <div className="timeline-strip-label">20+2 Weeks</div>
                <div className="timeline-strip-sublabel">Emergency Ladd&apos;s procedure</div>
              </div>
              <div className="timeline-strip-item reveal">
                <div className="timeline-strip-dot amber">!</div>
                <div className="timeline-strip-label">22 Weeks</div>
                <div className="timeline-strip-sublabel">Cervical insufficiency & cerclage</div>
              </div>
              <div className="timeline-strip-item reveal">
                <div className="timeline-strip-dot teal">✓</div>
                <div className="timeline-strip-label">24+1 Weeks</div>
                <div className="timeline-strip-sublabel">Recovery & discharge</div>
              </div>
              <div className="timeline-strip-item reveal">
                <div className="timeline-strip-dot teal">✓</div>
                <div className="timeline-strip-label">37 Weeks</div>
                <div className="timeline-strip-sublabel">Live birth via LSCS</div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 01 — PATIENT PROFILE */}
        <section id="patient" className="section reveal">
          <div className="container">
            <span className="section-eyebrow">Section 01 · Patient Profile</span>
            <h2 className="section-heading">A primigravida at 20 weeks presenting with the unexpected.</h2>
            
            <div className="grid-2col">
              {/* Left Card - Patient Identity */}
              <BorderGlow className="card" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={18} glowRadius={38} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                <div className="card-header-navy">
                  <h3>23/F</h3>
                  <span className="nav-badge">
                    PRIMIGRAVIDA
                  </span>
                </div>
                <div className="card-body">
                  <div className="detail-row">
                    <span className="detail-label">Gestation</span>
                    <span className="detail-value teal">20 weeks + 1 day</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Presenting</span>
                    <span className="detail-value red">Acute abdominal pain</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Associated</span>
                    <span className="detail-value red">Recurrent bilious vomiting</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">P/V</span>
                    <span className="detail-value red">Bleeding per vaginum</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Prior surgery</span>
                    <span className="detail-value">None</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Comorbidities</span>
                    <span className="detail-value">None significant</span>
                  </div>
                </div>
              </BorderGlow>

              {/* Right Card - Symptom Progression */}
              <BorderGlow className="card" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={18} glowRadius={38} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                <div className="card-body">
                  <span className="card-title-muted">SYMPTOM PROGRESSION</span>
                  <div className="v-timeline">
                    <div className="v-timeline-item">
                      <div className="v-timeline-dot critical"></div>
                      <span className="v-timeline-time red">Day 0</span>
                      <p className="v-timeline-desc">
                        Persistent abdominal pain and bilious vomiting; presented to the emergency department at 20+1 weeks gestation.
                      </p>
                    </div>
                    <div className="v-timeline-item">
                      <div className="v-timeline-dot critical"></div>
                      <span className="v-timeline-time red">Emergency Evaluation</span>
                      <p className="v-timeline-desc">
                        MRI revealed midgut malrotation with volvulus.
                      </p>
                    </div>
                    <div className="v-timeline-item">
                      <div className="v-timeline-dot"></div>
                      <span className="v-timeline-time teal">Emergency Intervention</span>
                      <p className="v-timeline-desc">
                        Underwent laparoscopic Ladd&apos;s procedure with detorsion.
                      </p>
                    </div>
                    <div className="v-timeline-item">
                      <div className="v-timeline-dot"></div>
                      <span className="v-timeline-time teal">Postoperative Course</span>
                      <p className="v-timeline-desc">
                        Symptoms resolved with uneventful maternal and fetal recovery.
                      </p>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </div>
          </div>
        </section>

        {/* SECTION 02 — CLINICAL PRESENTATION */}
        <section id="findings" className="section reveal has-blobs">
          <div className="blob-bg blob-2"></div>
          <div className="blob-bg blob-3"></div>
          <div className="container">
            <span className="section-eyebrow">Section 02 · Clinical Presentation</span>
            <h2 className="section-heading">Six findings that demanded immediate action.</h2>
            
            <div className="grid-findings">
              {renderProgressMeter("Progressive abdominal pain", 95, "Red flag", "red")}
              {renderProgressMeter("Recurrent bilious vomiting", 90, "Red flag", "red")}
              {renderProgressMeter("Abdominal tenderness with guarding", 90, "Red flag", "red")}
              {renderProgressMeter("MRI-confirmed midgut volvulus", 100, "Confirmatory", "red")}
              {renderProgressMeter("Pallor (Hb 8.8 g/dL)", 75, "Moderate anaemia", "amber")}
              {renderProgressMeter("Absent cervical length with funneling", 95, "Red flag", "red")}
            </div>
          </div>
        </section>

        {/* SECTION 03 — DIAGNOSTIC JOURNEY */}
        <section id="diagnosis" className="section reveal has-blobs">
          <Orb top="150px" left="-200px" size="650px" color="rgba(70, 120, 255, 0.08)" opacity={0.5} />
          <div className="container">
            <span className="section-eyebrow">Section 03 · Diagnostic Journey</span>
            <h2 className="section-heading">From bedside to the unifying diagnosis — six investigative steps.</h2>
            
            <div className="tab-header" style={{ position: "relative" }}>
              <button
                ref={(el) => { tabRefs.current[0] = el; }}
                onClick={() => setActiveTab(1)}
                className={`tab-btn ${activeTab === 1 ? "active" : ""}`}
              >
                Step 1: History
              </button>
              <button
                ref={(el) => { tabRefs.current[1] = el; }}
                onClick={() => setActiveTab(2)}
                className={`tab-btn ${activeTab === 2 ? "active" : ""}`}
              >
                Step 2: Examination
              </button>
              <button
                ref={(el) => { tabRefs.current[2] = el; }}
                onClick={() => setActiveTab(3)}
                className={`tab-btn ${activeTab === 3 ? "active" : ""}`}
              >
                Step 3: Laboratory
              </button>
              <button
                ref={(el) => { tabRefs.current[3] = el; }}
                onClick={() => setActiveTab(4)}
                className={`tab-btn ${activeTab === 4 ? "active" : ""}`}
              >
                Step 4: Ultrasound
              </button>
              <button
                ref={(el) => { tabRefs.current[4] = el; }}
                onClick={() => setActiveTab(5)}
                className={`tab-btn ${activeTab === 5 ? "active" : ""}`}
              >
                Step 5: MRI / CT
              </button>
              <button
                ref={(el) => { tabRefs.current[5] = el; }}
                onClick={() => setActiveTab(6)}
                className={`tab-btn ${activeTab === 6 ? "active" : ""}`}
              >
                Step 6: Final Diagnosis
              </button>
              <div
                className="tab-underline"
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: "2px",
                  backgroundColor: "var(--teal)",
                  left: `${activeTabRect.left}px`,
                  width: `${activeTabRect.width}px`,
                  transition: "left 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />
            </div>

            {/* Tab Panels */}
            {/* Step 1: History */}
            <div className={`tab-panel ${activeTab === 1 ? "active" : ""}`}>
              <div className="tab-grid">
                <BorderGlow className="info-block" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={14} glowRadius={35} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                  <div className="info-block-title">Clinical History</div>
                  <div className="info-block-content">
                    <p><strong>Age/Parity:</strong> 23-year-old primigravida at 20+1 weeks gestation.</p>
                    <p><strong>Presentation:</strong> 2-day history of acute periumbilical abdominal pain and persistent bilious vomiting.</p>
                    <p><strong>Obstetric History:</strong> Pregnancy confirmed at 45 days of amenorrhoea. Reassuring prior prenatal scans.</p>
                    <p><strong>Medical History:</strong> Episode of enteric fever at 11 weeks gestation, treated conservatively. No prior surgical interventions or chronic comorbidities.</p>
                  </div>
                </BorderGlow>
                <BorderGlow className="info-block" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={14} glowRadius={35} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                  <div className="info-block-title">Key Clinical Flags</div>
                  <div className="info-block-content">
                    <p>🔴 <strong>Bilious vomiting:</strong> Strongly points to proximal gastrointestinal mechanical obstruction.</p>
                    <p>🔴 <strong>Periumbilical pain:</strong> Localises pathology to midgut structures.</p>
                    <p>🔴 <strong>Oral intolerance:</strong> Complete obstruction pattern.</p>
                    <p>🔴 <strong>PV bleeding:</strong> Demanded immediate exclusion of concurrent obstetric emergencies (placental abruption or cervical dilation).</p>
                  </div>
                </BorderGlow>
              </div>
            </div>

            {/* Step 2: Examination */}
            <div className={`tab-panel ${activeTab === 2 ? "active" : ""}`}>
              <div className="tab-grid">
                <BorderGlow className="info-block" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={14} glowRadius={35} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                  <div className="info-block-title">General & Abdominal Examination</div>
                  <div className="info-block-content">
                    <p><strong>Systemic Status:</strong> Conscious, oriented, but visibly distressed and in acute pain.</p>
                    <p><strong>Vital Signs:</strong> Severe pallor, mild tachycardia (106 bpm), blood pressure 110/70 mmHg, afebrile.</p>
                    <p><strong>Abdomen:</strong> Uterus corresponds to 20 weeks size. Diffuse abdominal tenderness, guarding localized maximal in the periumbilical region. No signs of generalised peritonitis.</p>
                  </div>
                </BorderGlow>
                <BorderGlow className="info-block" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={14} glowRadius={35} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                  <div className="info-block-title">Obstetric Assessment</div>
                  <div className="info-block-content">
                    <p><strong>Fetal Heart Rate:</strong> 144 bpm, reassuring and regular.</p>
                    <p><strong>Speculum & Vaginal Examination:</strong> Minimal fresh blood noted per vaginum. Digital examination revealed a soft cervix with the external os starting to funnel/open.</p>
                  </div>
                </BorderGlow>
              </div>
            </div>

            {/* Step 3: Laboratory */}
            <div className={`tab-panel ${activeTab === 3 ? "active" : ""}`}>
              <BorderGlow className="card" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={18} glowRadius={38} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                <div className="card-body" style={{ padding: 0 }}>
                  <table className="lab-table">
                    <thead>
                      <tr>
                        <th>Investigation</th>
                        <th>Value</th>
                        <th>Reference Range</th>
                        <th>Clinical Significance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="lab-row amber">
                        <td>Hemoglobin (Hb)</td>
                        <td>
                          <span className="lab-indicator down">8.8 g/dL ↓</span>
                        </td>
                        <td>11.0 – 15.0 g/dL</td>
                        <td>Moderate anaemia in pregnancy</td>
                      </tr>
                      <tr className="lab-row amber">
                        <td>Serum Potassium</td>
                        <td>
                          <span className="lab-indicator down">3.4 mmol/L ↓</span>
                        </td>
                        <td>3.5 – 5.1 mmol/L</td>
                        <td>Mild hypokalaemia (secondary to vomiting)</td>
                      </tr>
                      <tr className="lab-row teal">
                        <td>WBC Count</td>
                        <td>
                          <span className="lab-indicator ok">9,800 /mm³</span>
                        </td>
                        <td>5,000 – 12,000 /mm³</td>
                        <td>Within normal limits for pregnancy</td>
                      </tr>
                      <tr className="lab-row teal">
                        <td>Serum Amylase</td>
                        <td>
                          <span className="lab-indicator ok">58 U/L</span>
                        </td>
                        <td>25 – 125 U/L</td>
                        <td>Normal; pancreatic etiology excluded</td>
                      </tr>
                      <tr className="lab-row teal">
                        <td>Serum Lipase</td>
                        <td>
                          <span className="lab-indicator ok">32 U/L</span>
                        </td>
                        <td>10 – 140 U/L</td>
                        <td>Normal</td>
                      </tr>
                      <tr className="lab-row teal">
                        <td>LFT & RFT</td>
                        <td>
                          <span className="lab-indicator ok">Normal</span>
                        </td>
                        <td>—</td>
                        <td>Preserved hepatic and renal function</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </BorderGlow>
            </div>

            {/* Step 4: Ultrasound */}
            <div className={`tab-panel ${activeTab === 4 ? "active" : ""}`}>
              <div className="tab-grid">
                <BorderGlow className="info-block" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={14} glowRadius={35} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                  <div className="info-block-title">Abdominal Ultrasound (USG)</div>
                  <div className="info-block-content">
                    <p>🌀 <strong>The Whirlpool Sign:</strong> Doppler USG demonstrated clockwise swirling of mesenteric vessels and mesentery around the axis of the superior mesenteric artery (SMA).</p>
                    <p><strong>Bowel Loops:</strong> Dilated, fluid-filled small bowel loops in the central and upper abdomen.</p>
                    <p><strong>Solid Organs:</strong> Normal gallbladder, liver, pancreas, and kidneys. No free fluid.</p>
                  </div>
                </BorderGlow>
                <BorderGlow className="info-block" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={14} glowRadius={35} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                  <div className="info-block-title">Obstetric Ultrasound</div>
                  <div className="info-block-content">
                    <p>👶 <strong>Fetal Viability:</strong> Single live intrauterine pregnancy corresponding to 20 weeks 1 day.</p>
                    <p><strong>Fetal Heart:</strong> Regular cardiac activity at 142 bpm.</p>
                    <p><strong>Placenta:</strong> Anterior placenta showing no evidence of retroplacental hematoma or abruption.</p>
                    <p><strong>Adnexa:</strong> Bilateral ovaries appear completely normal; no masses or cysts.</p>
                  </div>
                </BorderGlow>
              </div>
            </div>

            {/* Step 5: MRI / CT */}
            <div className={`tab-panel ${activeTab === 5 ? "active" : ""}`}>
              <div className="tab-grid">
                <BorderGlow className="info-block" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={14} glowRadius={35} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                  <div className="info-block-title">Abdominal MRI (No Contrast)</div>
                  <div className="info-block-content">
                    <p>🌀 <strong>Mesenteric Twisting:</strong> Clear confirmation of the &apos;whirlpool sign&apos; around the SMA pedicle.</p>
                    <p><strong>Obstruction:</strong> Closed-loop obstruction involving the mid-jejunum with distended proximal loops.</p>
                    <p><strong>Viability Indicators:</strong> Preserved bowel wall enhancement rules out complete transmural necrosis at this stage.</p>
                    <p><strong>Positioning:</strong> Right-sided small bowel loops and left-sided colon, confirming underlying congenital intestinal malrotation.</p>
                  </div>
                </BorderGlow>
                <BorderGlow className="info-block" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={14} glowRadius={35} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                  <div className="info-block-title">Cervical & Pelvic MRI</div>
                  <div className="info-block-content">
                    <p>⚠️ <strong>Cervical Funnelling:</strong> Severe internal os funnelling (&gt;50% of cervical length) with near-complete loss of measurable cervical length.</p>
                    <p><strong>Interpretation:</strong> Highly consistent with cervical insufficiency/incompetence secondary to increased intra-abdominal pressure and underlying pathology.</p>
                    <p><strong>Pregnancy:</strong> Intrauterine viable single fetus in breech presentation; amniotic fluid index within normal limits.</p>
                  </div>
                </BorderGlow>
              </div>
            </div>

            {/* Step 6: Final Diagnosis */}
            <div className={`tab-panel ${activeTab === 6 ? "active" : ""}`}>
              <BorderGlow className="final-diagnosis-card" edgeSensitivity={25} glowColor="210 70 35" backgroundColor="rgba(12, 35, 64, 0.96)" borderRadius={18} glowRadius={50} glowIntensity={1.5} coneSpread={28} colors={['#0F6E56', '#1D9E75', '#1a5276']} fillOpacity={0.07}>
                <span className="final-diagnosis-label">FINAL DIAGNOSIS</span>
                <p className="final-diagnosis-text">
                  &ldquo;Acute midgut volvulus secondary to congenital intestinal malrotation in a 20+1-week primigravida, successfully managed with emergency laparoscopic Ladd&apos;s procedure, followed by emergency McDonald cervical cerclage for cervical insufficiency.&rdquo;
                </p>
              </BorderGlow>
            </div>
          </div>
        </section>

        {/* SECTION 04 — DIFFERENTIAL DIAGNOSIS */}
        <section id="differentials" className="section reveal">
          <div className="container">
            <span className="section-eyebrow">Section 04 · Differential Diagnosis</span>
            <h2 className="section-heading">Reasoning through the acute abdomen in pregnancy.</h2>
            
            <BorderGlow className="diff-table-container" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={18} glowRadius={38} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
              <table className="diff-table">
                <thead>
                  <tr>
                    <th>Differential Diagnosis</th>
                    <th>Status</th>
                    <th>Clinical / Imaging Basis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Midgut volvulus secondary to intestinal malrotation</td>
                    <td>
                      <span className="diff-badge confirmed">CONFIRMED</span>
                    </td>
                    <td>MRI demonstrated malrotation with volvulus; confirmed intraoperatively during emergency laparoscopic Ladd&apos;s procedure.</td>
                  </tr>
                  <tr>
                    <td>Acute appendicitis</td>
                    <td>
                      <span className="diff-badge co-existing">CO-EXISTING PATHOLOGY</span>
                    </td>
                    <td>Histopathology showed acute appendicitis with mucosal ulceration and neutrophilic infiltration following appendectomy; however, it did not explain the intestinal obstruction.</td>
                  </tr>
                  <tr>
                    <td>Acute cholecystitis</td>
                    <td>
                      <span className="diff-badge excluded">EXCLUDED</span>
                    </td>
                    <td>Abdominal ultrasound showed a normal gallbladder without calculi or wall thickening.</td>
                  </tr>
                  <tr>
                    <td>Acute pancreatitis</td>
                    <td>
                      <span className="diff-badge excluded">EXCLUDED</span>
                    </td>
                    <td>Pancreas appeared normal on ultrasound; serum amylase and lipase within normal limits.</td>
                  </tr>
                  <tr>
                    <td>Ovarian torsion</td>
                    <td>
                      <span className="diff-badge excluded">EXCLUDED</span>
                    </td>
                    <td>MRI demonstrated both ovaries were normal in size and signal intensity with no evidence of torsion.</td>
                  </tr>
                  <tr>
                    <td>Placental abruption / Obstetric cause</td>
                    <td>
                      <span className="diff-badge excluded">EXCLUDED</span>
                    </td>
                    <td>MRI showed a single live intrauterine pregnancy with a normal anterior placenta and no imaging features of placental pathology.</td>
                  </tr>
                  <tr>
                    <td>Hyperemesis gravidarum</td>
                    <td>
                      <span className="diff-badge excluded">EXCLUDED</span>
                    </td>
                    <td>Pain dominant over vomiting; onset after 16 weeks; bilious (not bilious-free) emesis; obstruction pattern confirmed on imaging.</td>
                  </tr>
                </tbody>
              </table>
            </BorderGlow>
          </div>
        </section>

        {/* SECTION 05 — SURGICAL MANAGEMENT */}
        <section id="surgery" className="section reveal has-blobs">
          <Orb top="200px" right="-150px" size="600px" color="rgba(15, 110, 86, 0.08)" opacity={0.5} />
          <div className="container">
            <span className="section-eyebrow">Section 05 · Surgical Management</span>
            <h2 className="section-heading">A combined general surgery & obstetric management approach.</h2>
            
            <div className="surgical-steps">
              {/* Step 1 */}
              <BorderGlow className="surgical-step-card" edgeSensitivity={30} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={16} glowRadius={36} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                <div className="surgical-step-header">
                  <div className="surgical-step-number">1</div>
                  <h4 className="surgical-step-title">Initial Stabilisation</h4>
                </div>
                <div className="surgical-step-body">
                  <p className="surgical-step-desc">
                    Maternal resuscitation with intravenous fluids, electrolyte correction, analgesia, antiemetics, and fetal well-being assessment. Nasogastric tube placed for decompression.
                  </p>
                </div>
              </BorderGlow>

              {/* Step 2 */}
              <BorderGlow className="surgical-step-card" edgeSensitivity={30} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={16} glowRadius={36} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                <div className="surgical-step-header">
                  <div className="surgical-step-number">2</div>
                  <h4 className="surgical-step-title">Diagnostic Evaluation</h4>
                </div>
                <div className="surgical-step-body">
                  <p className="surgical-step-desc">
                    Abdominal ultrasound followed by MRI confirming <strong>midgut malrotation with midgut volvulus</strong>, prompting emergency surgical intervention.
                  </p>
                </div>
              </BorderGlow>

              {/* Step 3 */}
              <BorderGlow className="surgical-step-card" edgeSensitivity={30} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={16} glowRadius={36} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                <div className="surgical-step-header">
                  <div className="surgical-step-number">3</div>
                  <h4 className="surgical-step-title">Emergency Laparoscopic Exploration</h4>
                </div>
                <div className="surgical-step-body">
                  <p className="surgical-step-desc">
                    Intraoperative confirmation of midgut volvulus with assessment of bowel viability and exclusion of bowel ischaemia. 180° clockwise volvulus noted; bowel viable post-detorsion.
                  </p>
                </div>
              </BorderGlow>

              {/* Step 4 */}
              <BorderGlow className="surgical-step-card" edgeSensitivity={30} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={16} glowRadius={36} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                <div className="surgical-step-header">
                  <div className="surgical-step-number">4</div>
                  <h4 className="surgical-step-title">Definitive Surgical Management — Laparoscopic Ladd&apos;s Procedure</h4>
                </div>
                <div className="surgical-step-body">
                  <p className="surgical-step-desc">
                    Comprising: detorsion of the volvulus (counterclockwise rotation), division of Ladd&apos;s bands (release of duodenal obstruction), widening of the mesenteric base, bowel repositioning (small bowel right, colon left), and incidental appendicectomy.
                  </p>
                </div>
              </BorderGlow>

              {/* Step 5 */}
              <BorderGlow className="surgical-step-card" edgeSensitivity={30} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={16} glowRadius={36} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                <div className="surgical-step-header">
                  <div className="surgical-step-number">5</div>
                  <h4 className="surgical-step-title">Postoperative Obstetric Care</h4>
                </div>
                <div className="surgical-step-body">
                  <p className="surgical-step-desc">
                    Continuous maternal monitoring, serial fetal heart rate assessment, gradual enteral nutrition, tocolysis initiated, and routine antenatal surveillance.
                  </p>
                </div>
              </BorderGlow>

              {/* Step 6 */}
              <BorderGlow className="surgical-step-card" edgeSensitivity={30} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={16} glowRadius={36} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                <div className="surgical-step-header">
                  <div className="surgical-step-number">6</div>
                  <h4 className="surgical-step-title">Cervical Insufficiency Management — Emergency McDonald Cerclage</h4>
                </div>
                <div className="surgical-step-body">
                  <p className="surgical-step-desc">
                    Detection of absent cervical length with internal os funnelling on follow-up scan at postoperative day 12, followed by <strong>emergency McDonald purse-string cervical cerclage</strong> at the cervicovaginal junction, continuation of high-risk antenatal care and progesterone support.
                  </p>
                </div>
              </BorderGlow>
            </div>
          </div>
        </section>

        {/* SECTION 06 — HISTOPATHOLOGY */}
        <section id="pathology" className="section reveal">
          <div className="container">
            <span className="section-eyebrow">Section 06 · Histopathology</span>
            <h2 className="section-heading">Confirming concurrent acute appendicitis.</h2>
            
            <BorderGlow className="histo-container" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={18} glowRadius={40} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
              <div className="microscope-viewer">
                {/* Visual Microscopy Simulation Viewport */}
                <div 
                  className={`microscope-viewport ${isPanning ? 'grabbing' : magnification > 1 ? 'grab' : ''}`}
                  ref={histoViewportRef}
                  onPointerDown={handleHistoPointerDown}
                  onPointerMove={handleHistoPointerMove}
                  onPointerUp={handleHistoPointerUp}
                  onDoubleClick={() => setMagnification(1)}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    width: "100%",
                    height: "260px",
                    backgroundColor: "#ffdce6",
                    userSelect: "none",
                    touchAction: "none"
                  }}
                >
                  {/* Microscope HUD crosshairs */}
                  <div className="microscope-hud" style={{ pointerEvents: 'none' }}>
                    <div className="hud-line-h"></div>
                    <div className="hud-line-v"></div>
                    <div className="hud-circle-outer"></div>
                    <div className="hud-circle-inner"></div>
                  </div>

                  {/* Fixed Label Info Badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "12px",
                      backgroundColor: "rgba(12, 35, 64, 0.72)",
                      backdropFilter: "blur(4px)",
                      color: "var(--white)",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontFamily: "var(--font-mono-family)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      pointerEvents: "none",
                      zIndex: 10
                    }}
                  >
                    H&E · 100× · Appendix · Acute suppurative appendicitis
                  </div>

                  {/* Zoomable / pannable slide container */}
                  <div
                    className="microscope-slide"
                    style={{
                      width: "100%",
                      height: "100%",
                      transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${1 + (magnification - 1) * 0.05})`,
                      transformOrigin: "center center",
                      transition: isPanning ? "none" : "transform 0.15s ease-out"
                    }}
                  >
                    {/* Pink tissue matrix base with H&E staining simulation */}
                    <svg className="histo-sim-svg" viewBox="0 0 800 220" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
                      <rect width="800" height="220" fill="#ffdce6" />
                      
                      {/* Wavy mucosal layers */}
                      <path d="M -50 80 C 100 20, 200 120, 400 60 C 600 0, 700 100, 850 40" fill="none" stroke="#e07a90" strokeWidth="12" opacity="0.6" strokeLinecap="round"/>
                      <path d="M -50 140 C 150 80, 250 180, 450 120 C 650 60, 750 160, 850 100" fill="none" stroke="#e07a90" strokeWidth="16" opacity="0.5" strokeLinecap="round"/>
                      <path d="M -50 180 C 100 140, 300 220, 500 160 C 700 100, 780 200, 850 150" fill="none" stroke="#e07a90" strokeWidth="10" opacity="0.4" strokeLinecap="round"/>
                      
                      {/* RBCs with drifting animation */}
                      <circle cx="120" cy="50" r="4" className="histo-drift-1" fill="none" stroke="#d32f2f" strokeWidth="1.5" />
                      <circle cx="280" cy="150" r="4" className="histo-drift-2" fill="none" stroke="#d32f2f" strokeWidth="1.5" />
                      <circle cx="340" cy="40" r="4" className="histo-drift-1" fill="none" stroke="#d32f2f" strokeWidth="1.5" />
                      <circle cx="560" cy="180" r="4" className="histo-drift-2" fill="none" stroke="#d32f2f" strokeWidth="1.5" />
                      <circle cx="680" cy="80" r="4" className="histo-drift-1" fill="none" stroke="#d32f2f" strokeWidth="1.5" />
                      
                      {/* Glands with pulsing animation */}
                      <circle cx="200" cy="100" r="22" className="histo-pulse" fill="none" stroke="#9c27b0" strokeWidth="2" strokeDasharray="4,8" />
                      <circle cx="200" cy="100" r="18" fill="none" stroke="#b0bec5" strokeWidth="1" />
                      <circle cx="600" cy="130" r="25" className="histo-pulse" fill="none" stroke="#9c27b0" strokeWidth="2.5" strokeDasharray="5,7" />
                      
                      {/* Scattered neutrophils & lymphocytes grouped for motion graphics */}
                      <g fill="#1a237e">
                        {/* Neutrophils cluster 1 - Drift 1 */}
                        <g className="histo-drift-1">
                          <circle cx="150" cy="80" r="2" /><circle cx="153" cy="82" r="2.2" /><circle cx="149" cy="84" r="1.8" />
                          <circle cx="250" cy="120" r="2" /><circle cx="254" cy="121" r="2" /><circle cx="252" cy="124" r="1.8" />
                          <circle cx="310" cy="90" r="2" /><circle cx="308" cy="93" r="2.1" /><circle cx="312" cy="94" r="1.9" />
                        </g>
                        {/* Neutrophils cluster 2 - Drift 2 */}
                        <g className="histo-drift-2">
                          <circle cx="420" cy="50" r="2" /><circle cx="423" cy="48" r="2.2" /><circle cx="421" cy="52" r="2" />
                          <circle cx="480" cy="140" r="2.2" /><circle cx="484" cy="142" r="2" /><circle cx="481" cy="145" r="1.8" />
                          <circle cx="650" cy="70" r="2" /><circle cx="653" cy="73" r="2" /><circle cx="649" cy="72" r="2" />
                        </g>
                        
                        {/* Heavy inflammatory infiltrate - Pulsating */}
                        <g className="histo-pulse">
                          <circle cx="370" cy="130" r="2" /><circle cx="373" cy="132" r="1.8" /><circle cx="371" cy="135" r="2.1" />
                          <circle cx="376" cy="128" r="2" /><circle cx="379" cy="131" r="1.9" />
                          <circle cx="510" cy="90" r="2" /><circle cx="513" cy="93" r="1.8" /><circle cx="511" cy="96" r="2" />
                          <circle cx="515" cy="88" r="2" /><circle cx="518" cy="91" r="2.1" />
                        </g>

                        {/* Lymphocytes - Drift 2 */}
                        <g className="histo-drift-2">
                          <circle cx="80" cy="40" r="3" />
                          <circle cx="95" cy="160" r="2.5" />
                          <circle cx="170" cy="180" r="3" />
                          <circle cx="410" cy="170" r="3.2" />
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Magnification Slider Control Panel */}
                <div className="microscope-controls">
                  <span className="slider-label">MAGNIFICATION</span>
                  <div className="slider-track-wrapper">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={magnification}
                      onChange={(e) => setMagnification(Number(e.target.value))}
                      className="microscope-slider"
                      style={{
                        background: `linear-gradient(to right, var(--teal) 0%, var(--teal) ${magnification}%, #cbd5e1 ${magnification}%, #cbd5e1 100%)`
                      }}
                    />
                  </div>
                  <span className="slider-value">{magnification}x</span>
                </div>
              </div>

              {/* Pathology Details */}
              <div className="card-body" style={{ padding: 0 }}>
                <table className="lab-table" style={{ borderTop: "1px solid var(--border)" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "25%" }}>Feature</th>
                      <th>Pathological Evaluation Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Specimen</strong></td>
                      <td>Appendix (incidental appendicectomy performed during Ladd&apos;s procedure)</td>
                    </tr>
                    <tr>
                      <td><strong>Staining</strong></td>
                      <td>H&E (Haematoxylin and Eosin) slide analysis</td>
                    </tr>
                    <tr>
                      <td><strong>Microscopy</strong></td>
                      <td>Mucosal ulceration with dense transmural neutrophilic infiltration and acute inflammatory changes throughout all layers of the appendiceal wall.</td>
                    </tr>
                    <tr>
                      <td><strong>Impression</strong></td>
                      <td>
                        <span style={{ color: "var(--red)", fontWeight: 700 }}>
                          Features consistent with acute suppurative appendicitis, confirming concurrent appendiceal inflammation.
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </BorderGlow>
          </div>
        </section>

        {/* SECTION 07 — OUTCOME */}
        <section id="outcome" className="section reveal has-blobs">
          <Orb top="250px" left="-180px" size="650px" color="rgba(70, 120, 255, 0.07)" opacity={0.4} />
          <div className="container">
            <span className="section-eyebrow">Section 07 · Outcome</span>
            <h2 className="section-heading">From operating room to antenatal surveillance.</h2>
            
            <div className="outcome-timeline">
              {/* Event 1 */}
              <div className="outcome-event">
                <div className="outcome-event-dot navy"></div>
                <div className="outcome-event-header">
                  <span className="outcome-event-title">POD 0 · Surgery</span>
                  <span className="outcome-event-time">Emergency</span>
                </div>
                <p className="outcome-event-desc">
                  Emergency laparoscopic Ladd&apos;s procedure with detorsion and appendicectomy.
                </p>
                <ul className="outcome-event-details">
                  <li>Intraoperative finding: midgut malrotation with volvulus</li>
                  <li>Bowel viability satisfactory post-detorsion</li>
                  <li>Fetal heart rate monitored throughout — reassuring</li>
                </ul>
              </div>

              {/* Event 2 */}
              <div className="outcome-event">
                <div className="outcome-event-dot teal"></div>
                <div className="outcome-event-header">
                  <span className="outcome-event-title">POD 1–3 · Recovery</span>
                  <span className="outcome-event-time">Postoperative</span>
                </div>
                <p className="outcome-event-desc">
                  Uneventful postoperative recovery and stabilization.
                </p>
                <ul className="outcome-event-details">
                  <li>Gradual return of bowel function</li>
                  <li>Oral feeds resumed as tolerated from POD 2</li>
                  <li>Maternal and fetal status remained stable</li>
                </ul>
              </div>

              {/* Event 3 */}
              <div className="outcome-event">
                <div className="outcome-event-dot amber"></div>
                <div className="outcome-event-header">
                  <span className="outcome-event-title">POD 12 · Cervical Assessment</span>
                  <span className="outcome-event-time">Diagnostic</span>
                </div>
                <p className="outcome-event-desc">
                  Cervical insufficiency diagnosed on routine follow-up scan.
                </p>
                <ul className="outcome-event-details">
                  <li>Absent cervical length with internal os funnelling</li>
                  <li>No uterine contractions or vaginal bleeding reported</li>
                </ul>
              </div>

              {/* Event 4 */}
              <div className="outcome-event">
                <div className="outcome-event-dot amber"></div>
                <div className="outcome-event-header">
                  <span className="outcome-event-title">POD 12 · Obstetric Intervention</span>
                  <span className="outcome-event-time">Therapeutic</span>
                </div>
                <p className="outcome-event-desc">
                  Emergency McDonald cervical cerclage performed.
                </p>
                <ul className="outcome-event-details">
                  <li>Indication: cervical insufficiency with absent cervical length and funnelling</li>
                  <li>Procedure uneventful and well-tolerated</li>
                  <li>Tocolysis and progesterone support initiated</li>
                </ul>
              </div>

              {/* Event 5 */}
              <div className="outcome-event">
                <div className="outcome-event-dot teal"></div>
                <div className="outcome-event-header">
                  <span className="outcome-event-title">Discharge · After Recovery and Cerclage</span>
                  <span className="outcome-event-time">Post-procedure</span>
                </div>
                <p className="outcome-event-desc">
                  Discharged in stable maternal condition with viable intrauterine pregnancy.
                </p>
                <ul className="outcome-event-details">
                  <li>Tolerating oral diet, pain controlled</li>
                  <li>No obstetric or surgical complications</li>
                  <li>Activity modification and regular follow-up advised</li>
                </ul>
              </div>

              {/* Event 6 */}
              <div className="outcome-event">
                <div className="outcome-event-dot teal"></div>
                <div className="outcome-event-header">
                  <span className="outcome-event-title">Follow-up · Antenatal Surveillance</span>
                  <span className="outcome-event-time">Outpatient</span>
                </div>
                <p className="outcome-event-desc">
                  Regular antenatal follow-up.
                </p>
                <ul className="outcome-event-details">
                  <li>Serial cervical length monitoring every 2 weeks</li>
                  <li>Fetal growth and well-being assessment</li>
                  <li>Continued progesterone and necessary supplements</li>
                </ul>
              </div>
            </div>

            {/* Outcomes Summary Cards */}
            <div className="outcome-results">
              <BorderGlow className="outcome-card teal" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={16} glowRadius={36} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
                <h4>💙 Maternal Outcome</h4>
                <p>Uneventful postoperative recovery with preserved maternal health. Stable at 6-week review.</p>
              </BorderGlow>
              <BorderGlow className="outcome-card purple" edgeSensitivity={28} glowColor="220 70 55" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={16} glowRadius={36} glowIntensity={1.4} coneSpread={26} colors={['#6B21A8', '#A855F7', '#0C2340']} fillOpacity={0.05}>
                <h4>👶 Fetal Outcome</h4>
                <p>Pregnancy continued; live birth at 37 weeks by elective LSCS with healthy neonate.</p>
              </BorderGlow>
            </div>
          </div>
        </section>

        {/* SECTION 08 — QUIZ MODULE */}
        <section id="quiz" className="section reveal has-blobs">
          <Orb top="150px" right="-150px" size="650px" color="rgba(70, 120, 255, 0.08)" opacity={0.5} />
          <div className="container">
            <span className="section-eyebrow">Section 08 · Quiz Module</span>
            <h2 className="section-heading">Test your clinical reasoning — ten case-based questions.</h2>
            
            <BorderGlow className="quiz-container" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={18} glowRadius={40} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
              {quizStep === "start" && (
                <div className="quiz-result-screen" style={{ padding: "4rem 2rem" }}>
                  <h3 className="quiz-question" style={{ marginBottom: "2.5rem", fontSize: "1.75rem" }}>
                    Ready to test your knowledge?
                  </h3>
                  <p style={{ color: "var(--slate)", marginBottom: "2rem", maxWidth: "480px", margin: "0 auto 2rem" }}>
                    This quiz consists of 10 clinical case questions designed to test your diagnostic and surgical management skills for midgut volvulus and cervical incompetence in pregnancy.
                  </p>
                  
                  {/* Name Input Field */}
                  <div style={{ marginBottom: "2rem", width: "100%", maxWidth: "320px", margin: "0 auto 2rem" }}>
                    <input
                      type="text"
                      placeholder="Enter your name..."
                      value={userName}
                      onChange={(e) => {
                        setUserName(e.target.value);
                        if (e.target.value.trim()) {
                          setQuizNameError("");
                        }
                      }}
                      className="quiz-name-input"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        border: quizNameError ? "1px solid var(--red)" : "1px solid var(--border)",
                        backgroundColor: "rgba(255, 255, 255, 0.62)",
                        color: "var(--navy)",
                        fontSize: "14px",
                        textAlign: "center",
                        outline: "none",
                        transition: "all 0.2s ease"
                      }}
                    />
                    {quizNameError && (
                      <div style={{ color: "var(--red)", fontSize: "12px", marginTop: "0.5rem", fontWeight: 500 }}>
                        {quizNameError}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => {
                      if (!userName.trim()) {
                        setQuizNameError("Please enter your name before starting the quiz.");
                      } else {
                        setQuizStep("quiz");
                      }
                    }} 
                    className="btn btn-primary"
                  >
                    Start Quiz
                  </button>
                </div>
              )}

              {quizStep === "quiz" && (
                <>
                  <div className="quiz-header">
                    <span className="quiz-header-title">Question {currentQuestionIdx + 1} of 10</span>
                    <span className="quiz-header-score">Score: {quizScore}</span>
                  </div>
                  <div className="quiz-progress-bar">
                    <div
                      className="quiz-progress-fill"
                      style={{ width: `${((currentQuestionIdx + 1) / 10) * 100}%` }}
                    ></div>
                  </div>
                  <div className="quiz-body">
                    <h3 className="quiz-question">{quizQuestions[currentQuestionIdx].q}</h3>
                    <div className="quiz-options">
                      {quizQuestions[currentQuestionIdx].options.map((opt, idx) => {
                        let optionClass = "";
                        let symbol = "";
                        if (selectedOption !== null) {
                          const isCorrect = idx === quizQuestions[currentQuestionIdx].correct;
                          const isSelected = idx === selectedOption;
                          if (isCorrect) {
                            optionClass = "correct";
                            symbol = "✓";
                          } else if (isSelected) {
                            optionClass = "incorrect";
                            symbol = "✗";
                          } else {
                            optionClass = "disabled";
                          }
                        }
                        return (
                          <div
                            key={idx}
                            onClick={() => handleQuizAnswer(idx)}
                            className={`quiz-option-card ${optionClass}`}
                            style={{ pointerEvents: selectedOption !== null ? "none" : "auto" }}
                          >
                            <span>{opt}</span>
                            {symbol && <span className="quiz-option-indicator">{symbol}</span>}
                          </div>
                        );
                      })}
                    </div>

                    {showExplanation && (
                      <div className="quiz-explanation">
                        <p><strong>Rationale:</strong> {quizQuestions[currentQuestionIdx].explanation}</p>
                      </div>
                    )}

                    {selectedOption !== null && (
                      <div className="quiz-footer">
                        <button onClick={handleNextQuestion} className="btn btn-primary">
                          {currentQuestionIdx < quizQuestions.length - 1 ? "Next Question →" : "Finish Quiz"}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {quizStep === "result" && (
                <div className="quiz-result-screen">
                  <div className="quiz-result-score">{quizScore}/10</div>
                  <div className="quiz-result-grade">
                    {quizScore >= 9 && "Expert — Outstanding clinical reasoning!"}
                    {quizScore >= 7 && quizScore <= 8 && "Advanced — Well done!"}
                    {quizScore >= 5 && quizScore <= 6 && "Intermediate — Good effort."}
                    {quizScore < 5 && "Keep studying — review the case sections above."}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                    <button onClick={resetQuiz} className="btn btn-secondary">
                      Retry Quiz
                    </button>
                    <button onClick={() => scrollTo("leaderboard")} className="btn btn-primary">
                      View Leaderboard
                    </button>
                  </div>
                </div>
              )}
            </BorderGlow>
          </div>
        </section>

        {/* SECTION 09 — AI TUTOR */}
        <section id="tutor" className="section reveal has-blobs">
          <Orb bottom="-150px" right="-150px" size="600px" color="rgba(70, 120, 255, 0.07)" opacity={0.4} />
          <div className="container">
            <span className="section-eyebrow">Section 09 · AI Tutor</span>
            <h2 className="section-heading">Ask anything about this case.</h2>
            
            <BorderGlow
              className="tutor-container"
              edgeSensitivity={30}
              glowColor="166 76 45"
              backgroundColor="rgba(253, 252, 250, 0.85)"
              borderRadius={18}
              glowRadius={45}
              glowIntensity={1.5}
              coneSpread={28}
              animated={true}
              colors={['#0F6E56', '#1D9E75', '#0C2340']}
              fillOpacity={0.06}
            >
              <div className="tutor-header">
                <div className="tutor-header-left">
                  <div className="tutor-status-dot"></div>
                  <span className="tutor-title">Clinical AI Tutor</span>
                </div>
                <span className="tutor-header-right">Powered by Claude</span>
              </div>

              {/* Chat Area */}
              <div className="tutor-chat-area">
                {aiMessages.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.sender === "ai" ? "ai" : "user"}`}>
                    {msg.text}
                  </div>
                ))}
                {isAiTyping && (
                  <div className="chat-message ai">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Shortcut helper pills */}
              <div className="tutor-shortcuts">
                <button onClick={() => handleSendMessage("Explain the clinical significance of bilious vomiting here.")} className="shortcut-pill">
                  Bilious vomiting significance
                </button>
                <button onClick={() => handleSendMessage("What are the steps of Ladd's procedure?")} className="shortcut-pill">
                  Ladd&apos;s procedure
                </button>
                <button onClick={() => handleSendMessage("What is the whirlpool sign and how does it form?")} className="shortcut-pill">
                  Whirlpool sign
                </button>
                <button onClick={() => handleSendMessage("Why was a McDonald cerclage chosen over Shirodkar?")} className="shortcut-pill">
                  Cerclage choice
                </button>
              </div>

              {/* Input field */}
              <div className="tutor-input-area">
                <input
                  type="text"
                  placeholder="Ask a clinical question about this case..."
                  className="tutor-input"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
                <button onClick={() => handleSendMessage()} className="tutor-send-btn">
                  Send
                </button>
              </div>
            </BorderGlow>
          </div>
        </section>

        {/* SECTION 10 — LEADERBOARD */}
        <section id="leaderboard" className="section reveal">
          <div className="container">
            <span className="section-eyebrow">Section 10 · Leaderboard</span>
            <h2 className="section-heading">Top performers on this case.</h2>
            
            <BorderGlow className="leaderboard-container" edgeSensitivity={28} glowColor="166 76 45" backgroundColor="rgba(253, 252, 250, 0.9)" borderRadius={18} glowRadius={40} glowIntensity={1.4} coneSpread={26} colors={['#0F6E56', '#1D9E75', '#0C2340']} fillOpacity={0.05}>
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Clinician</th>
                    <th>Score</th>
                    <th>Level Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, idx) => (
                    <tr key={idx} className={`leaderboard-row ${entry.isUser ? "highlighted" : ""}`}>
                      <td>{entry.rank}</td>
                      <td>
                        <span className="leaderboard-avatar">
                          {entry.name.replace("Dr. ", "").substring(0, 2).toUpperCase()}
                        </span>
                        {entry.name}
                      </td>
                      <td>{entry.score}/10</td>
                      <td>
                        <span className={`level-badge ${entry.badgeClass}`}>
                          {entry.level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Leaderboard status message */}
              {!quizCompleted && (
                <div className="leaderboard-alert info" style={{ margin: "1.5rem 1rem 1rem", textAlign: "center", backgroundColor: "rgba(15, 110, 86, 0.04)", border: "1px dashed var(--teal)", color: "var(--navy)" }}>
                  💡 Complete the Quiz Module above to automatically submit your score and rank on the leaderboard!
                </div>
              )}

              {quizCompleted && leaderboardSubmitted && (
                <div className="leaderboard-alert" style={{ margin: "1.5rem 1rem 1rem" }}>
                  ✓ Your final score of <strong>{quizScore}/10</strong> has been automatically added to the leaderboard!
                </div>
              )}
            </BorderGlow>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer">
          <div className="container">
            <div className="site-footer-container">
              <div className="site-footer-left">
                <div className="site-footer-title">Between Obstruction and Loss</div>
                <div className="site-footer-muted">
                  An interactive case report · For educational use only · © 2026
                </div>
              </div>
              <div className="site-footer-right">
                Cite as: Mehta A, Iyer R, Khan S. 2026.
              </div>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
