import { useEffect, useState } from 'react';
import './App.css';
import ScrollProgressBar from './components/ScrollProgressBar';
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Terminal,
  Code,
  Layout,
  Database,
  Server,
  Cpu,
  Award,
  GraduationCap,
  Sparkles,
  Phone,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  FolderGit2,
  Copy,
  Check,
  Menu,
  X,
  ArrowUpRight
} from 'lucide-react';

const VISITOR_API_URL = import.meta.env.VITE_VISITOR_API_URL || 'https://sv0xr478zc.execute-api.ap-south-1.amazonaws.com/count';

const extractVisitorCount = (payload) => {
  if (typeof payload === 'number') return payload;

  if (typeof payload === 'string') {
    const parsedNumber = Number(payload);
    if (!Number.isNaN(parsedNumber)) return parsedNumber;

    try {
      const parsedJson = JSON.parse(payload);
      return extractVisitorCount(parsedJson);
    } catch {
      return null;
    }
  }

  if (payload && typeof payload === 'object') {
    const candidateKeys = ['count', 'visitorCount', 'visitors', 'value'];
    for (const key of candidateKeys) {
      if (payload[key] !== undefined) {
        return extractVisitorCount(payload[key]);
      }
    }

    if (payload.body !== undefined) {
      return extractVisitorCount(payload.body);
    }
  }

  return null;
};

// LeetCode Icon matching Lucide style
const LeetCodeIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8l-4-4-4 4" />
    <path d="M12 4v16" />
    <path d="M8 16l4 4 4-4" />
  </svg>
);

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [visitorCount, setVisitorCount] = useState('...');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedType, setCopiedType] = useState(null);
  const [activeProjectFilter, setActiveProjectFilter] = useState('all');

  // Handle scroll events for navbar styling & spy
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'certifications', 'contact'];
      const scrollPosition = window.scrollY + 220;

      let current = 'home';
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            current = section;
          }
        }
      });

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Visitor API counter logic
  useEffect(() => {
    const controller = new AbortController();

    const loadVisitorCount = async () => {
      try {
        const response = await fetch(VISITOR_API_URL, {
          method: 'GET',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Visitor API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const parsedCount = extractVisitorCount(data);

        if (parsedCount === null || Number.isNaN(parsedCount)) {
          throw new Error('Visitor API response did not include a numeric count');
        }

        setVisitorCount(parsedCount.toLocaleString());
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load visitor count:', error);
          setVisitorCount('1,420+');
        }
      }
    };

    loadVisitorCount();
    return () => controller.abort();
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text, type) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2200);
    }
  };

  const technicalSkills = {
    languages: {
      title: "Programming Languages",
      icon: <Code className="text-teal-400" size={22} />,
      items: ["Python", "JavaScript (ES6+)", "SQL", "C++", "PHP", "HTML5", "CSS3"]
    },
    frameworks: {
      title: "Frameworks & Backend",
      icon: <Server className="text-teal-400" size={22} />,
      items: ["React.js", "Node.js", "Express.js", "FastAPI", "WebSockets", "Tailwind CSS", "NumPy"]
    },
    ai_nlp: {
      title: "AI / ML & NLP",
      icon: <Cpu className="text-teal-400" size={22} />,
      items: ["LLMs", "RAG Pipelines", "Hybrid Search (BM25 + Vector)", "Prompt Engineering", "TF-IDF Vectorization", "Levenshtein Distance"]
    },
    database_devops: {
      title: "Databases & DevOps",
      icon: <Database className="text-teal-400" size={22} />,
      items: ["PostgreSQL (pgvector)", "Redis", "MySQL", "MongoDB", "Supabase", "Docker", "REST APIs", "JWT Auth", "Git & GitHub"]
    }
  };

  const flagshipProjects = [
    {
      id: "code-exec-platform",
      title: "Distributed Real-Time Code Execution & Interview Platform",
      category: "flagship",
      type: "Distributed Systems • Sandboxed Execution",
      period: "Nov 2026 – Present",
      status: "Active Development",
      description: "A collaborative technical interview and code execution platform engineered for high-concurrency, safe multi-language sandboxing and real-time multiplayer code synchrony.",
      highlights: [
        "Architected a browser-based collaborative coding platform using isolated Docker containers for secure, sandboxed multi-language code execution with strict compute and memory limits.",
        "Implemented real-time editor synchronization over WebSockets and a Redis-backed worker queue to process concurrent code submissions asynchronously without blocking API threads.",
        "Built JWT authentication, role-based access control, and PostgreSQL schemas for problem sets, automated test-case evaluation, and execution telemetry."
      ],
      tags: ["React.js", "Node.js", "Docker", "Redis", "WebSockets", "PostgreSQL", "JWT"],
      github: "https://github.com/NITIN080506",
      live: null
    },
    {
      id: "rag-knowledge-assistant",
      title: "Enterprise RAG Knowledge Assistant with Hybrid Search",
      category: "flagship",
      type: "Applied AI • Hybrid Retrieval (BM25 + Vector)",
      period: "Nov 2026 – Present",
      status: "Production Ready",
      description: "An enterprise document intelligence system combining dense vector embeddings with sparse BM25 retrieval to deliver halluncination-resistant answers with inline chunk citations.",
      highlights: [
        "Built an end-to-end Retrieval-Augmented Generation (RAG) pipeline ingesting multi-format PDF and Markdown documents into PostgreSQL (pgvector) with configurable chunking.",
        "Combined dense vector similarity with BM25 keyword retrieval and inline source-chunk citations to improve answer grounding and minimize LLM hallucinations.",
        "Containerized the FastAPI backend and React frontend with Docker Compose and added automated retrieval-precision evaluation scripts."
      ],
      tags: ["Python", "FastAPI", "PostgreSQL (pgvector)", "React.js", "Docker Compose", "BM25", "LLMs"],
      github: "https://github.com/NITIN080506",
      live: null
    },
    {
      id: "ats-resume-parser",
      title: "AI-Powered ATS Resume Parsing & Matching Engine",
      category: "flagship",
      type: "Applied NLP • Document Processing Pipeline",
      period: "Jul 2026 – Present",
      status: "Completed",
      description: "An intelligent applicant tracking and ranking engine analyzing PDF/DOCX resumes against target job descriptions with mathematical similarity and skill-gap diagnostics.",
      highlights: [
        "Engineered a Python-based ATS engine to extract structured text from PDF and DOCX resumes and benchmark candidate profiles against job descriptions.",
        "Implemented TF-IDF vectorization and Levenshtein string-similarity algorithms to compute multi-factor relevance scores and skill-gap diagnostics.",
        "Designed modular OOP document-processing pipelines backed by PostgreSQL to persist resumes, job descriptions, candidate profiles, and match history."
      ],
      tags: ["Python", "PostgreSQL", "NLP", "TF-IDF", "Levenshtein Distance", "OOP", "Git"],
      github: "https://github.com/NITIN080506",
      live: null
    }
  ];

  const otherProjects = [
    {
      title: "SmartQuiz: Full-Stack Quiz Platform",
      category: "other",
      description: "A full-stack quiz management system enabling real-time quiz creation, attempt tracking, and automated score evaluations with optimized client-server traffic flow.",
      tags: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
      github: "https://github.com/NITIN080506/quiz-platform.git",
      live: "https://nitin080506.github.io/quiz-platform"
    },
    {
      title: "Nutrio: Smart Health Recommendation System",
      category: "other",
      description: "Cross-platform mobile application using AI-based image recognition to scan groceries and evaluate nutritional content based on user health parameters.",
      tags: ["React Native", "Google AI API", "Firebase", "Tailwind CSS", "Expo"],
      github: "https://github.com/NITIN080506/nutrio-kitchen.git",
      live: "https://nitin080506.github.io/nutrio-kitchen"
    },
    {
      title: "SkyCast: Weather Forecasting Application",
      category: "other",
      description: "Live weather forecasting web application with asynchronous AccuWeather API integrations, location lookup, and dynamic DOM metric visualizations.",
      tags: ["JavaScript (ES6+)", "HTML5", "CSS3", "AccuWeather API"],
      github: "https://github.com/NITIN080506/weather-project.git",
      live: "https://nitin080506.github.io/weather-project"
    },
    {
      title: "BookNest: Online Bookstore Platform",
      category: "other",
      description: "E-commerce web platform for browsing and purchasing books, featuring relational MySQL cart structures, user-specific orders, and secure authentication.",
      tags: ["React", "MySQL", "Tailwind CSS", "REST API"],
      github: "https://github.com/NITIN080506",
      live: null
    }
  ];

  const achievements = [
    {
      title: "SRIJAN 2026 (Atos) National Hackathon Shortlist",
      subtitle: "Selected for Jury Round MVP Demo",
      date: "2026",
      badge: "National Finalist",
      description: "Selected among thousands of applicants across India to present a working Minimum Viable Product (MVP) demo before the national jury of industry leaders."
    },
    {
      title: "INDIA RUNS (Hack2skill & Redrob AI)",
      subtitle: "Track 1: Code the AI Solution",
      date: "Jul 2026",
      badge: "AI Hackathon",
      description: "Engineered an AI Resume Ranker solution computing semantic match relevance scores, skill gap matrices, and candidate benchmarking algorithms."
    },
    {
      title: "AICTE IDE Bootcamp Volunteer",
      subtitle: "Innovation, Design and Entrepreneurship Bootcamp",
      date: "Sep 2024",
      badge: "Leadership & Volunteering",
      description: "Volunteered and facilitated technical coordination for student innovators and startups during the national entrepreneurship bootcamp by AICTE."
    }
  ];

  const certifications = [
    {
      name: "Generative AI Virtual Internship",
      issuer: "Google Cloud & AICTE",
      focus: "LLMs, Prompt Engineering & Cloud AI Solutions",
      icon: <Cpu className="text-teal-400" size={20} />
    },
    {
      name: "Data Structures & Algorithms",
      issuer: "Microsoft",
      focus: "Algorithmic Complexity, Optimization & Problem Solving",
      icon: <Terminal className="text-teal-400" size={20} />
    },
    {
      name: "Database Management Systems (DBMS)",
      issuer: "NPTEL",
      focus: "Relational Schemas, Normalization, SQL & Indexing",
      icon: <Database className="text-teal-400" size={20} />
    },
    {
      name: "Introduction to Artificial Intelligence",
      issuer: "IBM",
      focus: "Machine Learning Concepts & Neural Foundations",
      icon: <Sparkles className="text-teal-400" size={20} />
    },
    {
      name: "MongoDB & the Document Model",
      issuer: "MongoDB",
      focus: "Document Databases, Aggregations & Atlas Operations",
      icon: <Layers className="text-teal-400" size={20} />
    },
    {
      name: "ServiceNow Micro-Certification",
      issuer: "ServiceNow",
      focus: "Enterprise Cloud Platforms & Workflow Automation",
      icon: <CheckCircle2 className="text-teal-400" size={20} />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-teal-500/30 selection:text-teal-200 relative overflow-x-hidden">
      <ScrollProgressBar />

      {/* Subtle Ambient Background Gradients */}
      <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0"></div>
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed top-1/2 -right-40 w-[500px] h-[400px] bg-cyan-500/5 blur-[160px] rounded-full pointer-events-none z-0"></div>

      {/* Floating Modern Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-900/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => scrollTo('home')}
            className="group text-left text-teal-400 font-mono font-bold text-lg md:text-xl tracking-tight transition-transform hover:scale-105"
          >
            <span className="text-slate-400 group-hover:text-teal-300 transition-colors">&lt;</span>
            <span className="text-slate-100">Nitin</span>
            <span className="text-teal-400">.dev</span>
            <span className="text-slate-400 group-hover:text-teal-300 transition-colors"> /&gt;</span>
          </button>

          {/* Live Visitor Counter Badge */}
          <div className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-slate-300 border border-slate-700/80 rounded-full px-3.5 py-1.5 bg-slate-800/60 backdrop-blur-sm shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">Visitors:</span>
            <span className="text-teal-400 font-semibold">{visitorCount}</span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-7 text-sm font-medium">
            {[
              { id: 'about', label: 'About', num: '01' },
              { id: 'skills', label: 'Skills', num: '02' },
              { id: 'projects', label: 'Projects', num: '03' },
              { id: 'experience', label: 'Experience', num: '04' },
              { id: 'certifications', label: 'Certs', num: '05' },
              { id: 'contact', label: 'Contact', num: '06' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`transition-colors duration-200 flex items-center gap-1.5 font-mono text-xs ${
                  activeSection === item.id ? 'text-teal-400 font-semibold' : 'text-slate-400 hover:text-teal-300'
                }`}
              >
                <span className="text-teal-500/70">{item.num}.</span>
                <span className="font-sans text-sm">{item.label}</span>
              </button>
            ))}

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=nitinkeshav0805@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-teal-400 border border-teal-400/60 px-4 py-2 rounded-lg hover:bg-teal-400/10 hover:border-teal-400 transition-all shadow-glow-teal-sm"
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-teal-400 p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400">Status</span>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-300">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Visitors: <span className="text-teal-400 font-semibold">{visitorCount}</span>
              </div>
            </div>
            {[
              { id: 'about', label: '01. About Me' },
              { id: 'skills', label: '02. Technical Skills' },
              { id: 'projects', label: '03. Featured Projects' },
              { id: 'experience', label: '04. Experience & Hackathons' },
              { id: 'certifications', label: '05. Certifications' },
              { id: 'contact', label: '06. Contact Me' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`block w-full text-left py-2 font-mono text-sm transition-colors ${
                  activeSection === item.id ? 'text-teal-400 font-semibold' : 'text-slate-300 hover:text-teal-300'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 flex gap-3">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=nitinkeshav0805@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-xs font-mono text-slate-900 bg-teal-400 font-semibold py-2.5 rounded-lg hover:bg-teal-300 transition-colors"
              >
                Say Hi
              </a>
              <a
                href="https://github.com/NITIN080506"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 border border-slate-700 rounded-lg text-slate-300 hover:text-teal-400"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/nitin-keshav-673871325"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 border border-slate-700 rounded-lg text-slate-300 hover:text-teal-400"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">

        {/* ===================== HERO SECTION ===================== */}
        <section id="home" className="min-h-screen flex flex-col justify-center pt-28 pb-16">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-mono px-3.5 py-1.5 rounded-full w-fit mb-6 shadow-glow-teal-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
            </span>
            <span>Available for SWE Roles • 2027 Grad • CGPA: 8.4</span>
          </div>

          <p className="text-teal-400 font-mono text-base md:text-lg mb-4 tracking-wide font-medium">
            Hi, my name is
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-100 mb-3 tracking-tight leading-tight">
            Nitin Keshav Puthi.
          </h1>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-slate-400 to-teal-400/80 mb-6 tracking-tight leading-tight">
            Distributed Systems & Applied AI.
          </h2>

          <p className="text-slate-400 max-w-2xl text-base md:text-lg leading-relaxed mb-10">
            Final-year Computer Science undergraduate at <span className="text-slate-200 font-medium">SRM IST (8.4 CGPA)</span> focused on
            <span className="text-teal-300"> Distributed Backend Systems</span>, <span className="text-teal-300">Full-Stack Engineering</span>, and
            <span className="text-teal-300"> Applied AI</span>. Experienced in architecting containerized code-execution sandboxes,
            hybrid-search RAG pipelines, and NLP matching engines backed by national hackathon shortlists
            (<span className="text-slate-200">SRIJAN 2026 Jury Round</span>) and verified cloud certifications.
          </p>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 max-w-3xl mb-10">
            <div className="glass-panel rounded-xl p-4 border border-slate-800 hover:border-teal-400/40 transition-colors">
              <div className="text-2xl md:text-3xl font-bold font-mono text-teal-400">8.4<span className="text-sm text-slate-400 font-normal">/10</span></div>
              <div className="text-xs text-slate-400 mt-1 font-mono">B.Tech CGPA (SRM IST)</div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-slate-800 hover:border-teal-400/40 transition-colors">
              <div className="text-xl md:text-2xl font-bold font-mono text-slate-200">SRIJAN '26</div>
              <div className="text-xs text-slate-400 mt-1 font-mono">National Jury Round Finalist</div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-slate-800 hover:border-teal-400/40 transition-colors">
              <div className="text-2xl md:text-3xl font-bold font-mono text-teal-400">3+</div>
              <div className="text-xs text-slate-400 mt-1 font-mono">Flagship Systems Built</div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-slate-800 hover:border-teal-400/40 transition-colors">
              <div className="text-2xl md:text-3xl font-bold font-mono text-slate-200">6+</div>
              <div className="text-xs text-slate-400 mt-1 font-mono">Verified Certifications</div>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => scrollTo('projects')}
              className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-300 text-slate-900 font-semibold px-7 py-3.5 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-glow-teal-sm font-mono text-sm"
            >
              Explore Featured Work
              <ChevronDown size={18} />
            </button>

            <button
              onClick={() => scrollTo('contact')}
              className="inline-flex items-center gap-2 border border-slate-700 hover:border-teal-400/60 text-slate-300 hover:text-teal-300 px-7 py-3.5 rounded-lg transition-all glass-panel font-mono text-sm"
            >
              <Mail size={18} className="text-teal-400" />
              Contact Details
            </button>

            {/* Social quick links */}
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-800">
              <a
                href="https://github.com/NITIN080506"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-slate-400 hover:text-teal-400 hover:bg-slate-800/60 rounded-lg transition-all"
                title="GitHub Profile"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/nitin-keshav-673871325"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-slate-400 hover:text-teal-400 hover:bg-slate-800/60 rounded-lg transition-all"
                title="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://leetcode.com/u/Nitinkeshav0805"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-slate-400 hover:text-teal-400 hover:bg-slate-800/60 rounded-lg transition-all"
                title="LeetCode Profile"
              >
                <LeetCodeIcon size={20} />
              </a>
            </div>
          </div>
        </section>

        {/* ===================== ABOUT SECTION ===================== */}
        <section id="about" className="py-24 border-t border-slate-800/80">
          <div className="flex items-center gap-4 mb-12">
            <span className="font-mono text-teal-400 text-lg md:text-xl font-semibold">01.</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-100 tracking-tight">About Me & Education</h2>
            <div className="h-px bg-slate-700/80 flex-grow max-w-xs md:max-w-md"></div>
          </div>

          <div className="grid md:grid-cols-12 gap-10 items-start">
            {/* Left Narrative & Education */}
            <div className="md:col-span-7 space-y-6 text-slate-400 text-base md:text-lg leading-relaxed">
              <p>
                Hello! I’m <span className="text-slate-100 font-semibold">Nitin Keshav Puthi</span>, a passionate software engineer based in
                <span className="text-teal-300"> Tiruchirappalli, India</span>. My journey centers around engineering scalable backend systems,
                distributed real-time workflows, and applied machine learning solutions that solve real-world technical challenges.
              </p>
              <p>
                Whether it's orchestrating secure containerized Docker sandboxes for multi-language code execution with strict resource quotas,
                architecting hybrid-search RAG pipelines that unite dense vector similarity with sparse BM25 indices, or building high-throughput
                NLP resume parsing engines, I enjoy designing architectures that are reliable, resilient, and performant.
              </p>

              {/* Education Card */}
              <div className="glass-panel rounded-xl p-6 border border-slate-700/80 hover:border-teal-400/40 transition-all mt-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">B.Tech in Computer Science and Engineering</h3>
                      <p className="text-slate-300 text-sm font-medium">SRM Institute of Science and Technology, Tiruchirappalli</p>
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 bg-teal-500/15 border border-teal-500/30 text-teal-300 font-mono text-xs font-semibold rounded-full whitespace-nowrap">
                    CGPA: 8.4 / 10.0
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4 pl-1">
                  <Calendar size={14} className="text-teal-400" />
                  <span>July 2023 – May 2027 (Expected)</span>
                  <span className="mx-1 text-slate-600">•</span>
                  <MapPin size={14} className="text-teal-400" />
                  <span>Tiruchirappalli, India</span>
                </div>

                <div>
                  <p className="text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">Relevant Core Coursework:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Data Structures & Algorithms", "Object-Oriented Programming (OOP)", "DBMS", "Operating Systems", "NLP"].map((course) => (
                      <span key={course} className="text-xs font-mono bg-slate-800/80 border border-slate-700 text-slate-300 px-2.5 py-1 rounded">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Profile & Details Card */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative group max-w-xs w-full">
                {/* Glowing border backdrop */}
                <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/20 via-cyan-500/10 to-blue-500/20 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300"></div>

                <div className="relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 p-2 shadow-2xl">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-900">
                    <img
                      src={`${import.meta.env.BASE_URL}profile.jpg`}
                      alt="Nitin Keshav Puthi"
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80">
                      <span className="text-slate-300">Software Engineer</span>
                      <span className="text-teal-400 flex items-center gap-1">
                        <MapPin size={12} /> Tiruchirappalli
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Copy Badges */}
                  <div className="mt-3 space-y-2 p-1">
                    <button
                      onClick={() => copyToClipboard('nitinkeshav0805@gmail.com', 'email')}
                      className="w-full flex items-center justify-between text-xs font-mono bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-teal-300 border border-slate-700 hover:border-teal-400/50 px-3 py-2 rounded-lg transition-all"
                    >
                      <span className="truncate">nitinkeshav0805@gmail.com</span>
                      <span className="text-teal-400 flex items-center gap-1 flex-shrink-0 ml-2">
                        {copiedType === 'email' ? (
                          <>
                            <Check size={14} className="text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy</span>
                          </>
                        )}
                      </span>
                    </button>

                    <button
                      onClick={() => copyToClipboard('+919398463545', 'phone')}
                      className="w-full flex items-center justify-between text-xs font-mono bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-teal-300 border border-slate-700 hover:border-teal-400/50 px-3 py-2 rounded-lg transition-all"
                    >
                      <span>+91-9398463545</span>
                      <span className="text-teal-400 flex items-center gap-1 flex-shrink-0 ml-2">
                        {copiedType === 'phone' ? (
                          <>
                            <Check size={14} className="text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Phone size={14} />
                            <span>Copy</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== SKILLS MATRIX SECTION ===================== */}
        <section id="skills" className="py-24 border-t border-slate-800/80">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-teal-400 text-lg md:text-xl font-semibold">02.</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-100 tracking-tight">Technical Arsenal</h2>
            <div className="h-px bg-slate-700/80 flex-grow max-w-xs md:max-w-md"></div>
          </div>
          <p className="text-slate-400 mb-12 max-w-2xl text-base">
            Systematic overview of core programming languages, modern frameworks, applied AI toolsets, and database infrastructure from my technical background.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(technicalSkills).map(([key, category]) => (
              <div
                key={key}
                className="glass-panel glass-panel-hover rounded-xl p-6 border border-slate-800 relative group overflow-hidden"
              >
                {/* Header of skill card */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/30">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-200 group-hover:text-teal-300 transition-colors">
                      {category.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500 bg-slate-800/60 px-2.5 py-1 rounded border border-slate-700/50">
                    {category.items.length} tools
                  </span>
                </div>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-2.5">
                  {category.items.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 text-xs font-mono bg-slate-800/80 text-slate-300 hover:text-teal-300 hover:border-teal-400/50 border border-slate-700/80 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400/70"></span>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== PROJECTS SECTION ===================== */}
        <section id="projects" className="py-24 border-t border-slate-800/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <span className="font-mono text-teal-400 text-lg md:text-xl font-semibold">03.</span>
              <h2 className="text-2xl md:text-4xl font-bold text-slate-100 tracking-tight">Featured Projects</h2>
              <div className="h-px bg-slate-700/80 flex-grow max-w-xs hidden sm:block"></div>
            </div>

            {/* Project Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-800/70 border border-slate-700/80 rounded-lg w-fit">
              <button
                onClick={() => setActiveProjectFilter('all')}
                className={`text-xs font-mono px-3 py-1.5 rounded-md transition-all ${
                  activeProjectFilter === 'all'
                    ? 'bg-teal-400 text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({flagshipProjects.length + otherProjects.length})
              </button>
              <button
                onClick={() => setActiveProjectFilter('flagship')}
                className={`text-xs font-mono px-3 py-1.5 rounded-md transition-all ${
                  activeProjectFilter === 'flagship'
                    ? 'bg-teal-400 text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Flagship Systems ({flagshipProjects.length})
              </button>
              <button
                onClick={() => setActiveProjectFilter('other')}
                className={`text-xs font-mono px-3 py-1.5 rounded-md transition-all ${
                  activeProjectFilter === 'other'
                    ? 'bg-teal-400 text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Web & Mobile ({otherProjects.length})
              </button>
            </div>
          </div>

          <p className="text-slate-400 mb-12 max-w-2xl text-base">
            Flagship distributed systems, hybrid-search RAG architectures, NLP parsing engines, and interactive full-stack platforms.
          </p>

          {/* Flagship Projects Showcase */}
          {(activeProjectFilter === 'all' || activeProjectFilter === 'flagship') && (
            <div className="space-y-10 mb-14">
              {flagshipProjects.map((project, idx) => (
                <div
                  key={project.id}
                  className="glass-panel rounded-2xl p-7 md:p-9 border border-slate-700/80 hover:border-teal-400/50 transition-all duration-300 relative overflow-hidden group shadow-lg"
                >
                  {/* Subtle top corner gradient highlight */}
                  <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-teal-500/10 via-cyan-500/5 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="text-xs font-mono text-teal-400 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full font-semibold">
                          Flagship Project 0{idx + 1}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {project.type}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          • {project.period}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-3 self-start">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 text-slate-400 hover:text-teal-400 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all"
                          title="View GitHub Repository"
                        >
                          <Github size={20} />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 text-slate-400 hover:text-teal-400 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all"
                          title="Live Demo"
                        >
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Architecture & Highlights Bullet Points */}
                  <div className="my-6 space-y-3 relative z-10">
                    {project.highlights.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-3 text-slate-300 text-sm md:text-base leading-relaxed">
                        <span className="text-teal-400 mt-1 flex-shrink-0">▹</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack badge pills */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-2 relative z-10">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono bg-slate-800/90 text-teal-300/90 border border-slate-700/80 px-2.5 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other Notable Projects Grid */}
          {(activeProjectFilter === 'all' || activeProjectFilter === 'other') && (
            <div>
              {activeProjectFilter === 'all' && (
                <div className="flex items-center gap-4 my-8">
                  <h3 className="text-xl font-bold text-slate-200">Other Notable Projects</h3>
                  <div className="h-px bg-slate-800 flex-grow"></div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {otherProjects.map((project) => (
                  <div
                    key={project.title}
                    className="glass-panel glass-panel-hover rounded-xl p-7 border border-slate-800 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                          <FolderGit2 size={24} />
                        </div>
                        <div className="flex items-center gap-3">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-teal-400 transition-colors"
                              title="GitHub Link"
                            >
                              <Github size={18} />
                            </a>
                          )}
                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-teal-400 transition-colors"
                              title="Live Link"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                      </div>

                      <h4 className="text-xl font-bold text-slate-200 group-hover:text-teal-300 transition-colors mb-3">
                        {project.title}
                      </h4>

                      <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/80">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs font-mono text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ===================== EXPERIENCE & HACKATHONS SECTION ===================== */}
        <section id="experience" className="py-24 border-t border-slate-800/80">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-teal-400 text-lg md:text-xl font-semibold">04.</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-100 tracking-tight">Experience & Hackathons</h2>
            <div className="h-px bg-slate-700/80 flex-grow max-w-xs md:max-w-md"></div>
          </div>
          <p className="text-slate-400 mb-12 max-w-2xl text-base">
            National hackathon milestones, jury-round project defenses, and practical industry internships.
          </p>

          <div className="relative pl-6 md:pl-8 border-l border-slate-800 space-y-12 max-w-3xl ml-3 md:ml-4">
            {achievements.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-teal-400 group-hover:bg-teal-400 transition-colors"></div>

                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono bg-teal-500/10 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                    {item.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {item.date}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-200 group-hover:text-teal-300 transition-colors">
                  {item.title}
                </h3>
                <h4 className="text-sm font-medium text-slate-400 mb-3 font-mono">
                  {item.subtitle}
                </h4>

                <p className="text-slate-400 text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CERTIFICATIONS SECTION ===================== */}
        <section id="certifications" className="py-24 border-t border-slate-800/80">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-teal-400 text-lg md:text-xl font-semibold">05.</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-100 tracking-tight">Verified Certifications</h2>
            <div className="h-px bg-slate-700/80 flex-grow max-w-xs md:max-w-md"></div>
          </div>
          <p className="text-slate-400 mb-12 max-w-2xl text-base">
            Industry and academic certifications validating proficiency in Data Structures, AI foundations, Relational Databases, and Cloud systems.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="glass-panel glass-panel-hover rounded-xl p-5 border border-slate-800 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                      {cert.icon}
                    </div>
                    <span className="text-[11px] font-mono text-teal-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      Verified
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-200 group-hover:text-teal-300 transition-colors mb-1">
                    {cert.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mb-3">
                    Issued by <span className="text-slate-300">{cert.issuer}</span>
                  </p>
                </div>
                <p className="text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  {cert.focus}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CONTACT SECTION ===================== */}
        <section id="contact" className="py-24 border-t border-slate-800/80 text-center max-w-3xl mx-auto">
          <span className="font-mono text-teal-400 text-sm tracking-widest uppercase">06. What's Next?</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-100 mt-2 mb-6 tracking-tight">
            Let's Connect & Collaborate
          </h2>
          <p className="text-slate-400 text-base md:text-lg mb-10 leading-relaxed max-w-xl mx-auto">
            Whether you have an opportunity in distributed systems, full-stack development, or applied AI,
            have questions about my projects, or simply want to say hello—my inbox is always open!
          </p>

          {/* Contact Actions Box */}
          <div className="glass-panel rounded-2xl p-8 border border-slate-700/80 shadow-xl max-w-xl mx-auto mb-10">
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => copyToClipboard('nitinkeshav0805@gmail.com', 'email-box')}
                className="flex items-center justify-between p-3.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 hover:border-teal-400/60 rounded-xl transition-all text-left"
              >
                <div className="truncate mr-2">
                  <div className="text-[10px] font-mono uppercase text-slate-500">Email Address</div>
                  <div className="text-xs font-mono text-slate-200 truncate">nitinkeshav0805@gmail.com</div>
                </div>
                <span className="text-teal-400 flex-shrink-0">
                  {copiedType === 'email-box' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </span>
              </button>

              <button
                onClick={() => copyToClipboard('+919398463545', 'phone-box')}
                className="flex items-center justify-between p-3.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 hover:border-teal-400/60 rounded-xl transition-all text-left"
              >
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500">Phone Number</div>
                  <div className="text-xs font-mono text-slate-200">+91-9398463545</div>
                </div>
                <span className="text-teal-400 flex-shrink-0">
                  {copiedType === 'phone-box' ? <Check size={16} className="text-emerald-400" /> : <Phone size={16} />}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=nitinkeshav0805@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-300 text-slate-900 font-semibold px-6 py-3.5 rounded-lg transition-all shadow-glow-teal-sm font-mono text-sm"
              >
                <Mail size={18} />
                Send via Gmail
              </a>

              <a
                href="https://www.linkedin.com/in/nitin-keshav-673871325"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-slate-700 hover:border-teal-400 text-slate-300 hover:text-teal-300 px-6 py-3.5 rounded-lg transition-all font-mono text-sm"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>

              <a
                href="https://leetcode.com/u/Nitinkeshav0805"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-slate-700 hover:border-teal-400 text-slate-300 hover:text-teal-300 px-6 py-3.5 rounded-lg transition-all font-mono text-sm"
              >
                <LeetCodeIcon size={18} />
                LeetCode
              </a>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400">
            <MapPin size={14} className="text-teal-400" />
            <span>Tiruchirappalli, Tamil Nadu, India</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-slate-800/70 relative z-10">
        <div className="flex justify-center items-center gap-6 mb-5 md:hidden">
          <a
            href="https://github.com/NITIN080506"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-teal-400 transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/nitin-keshav-673871325"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-teal-400 transition-colors"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://leetcode.com/u/Nitinkeshav0805"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-teal-400 transition-colors"
          >
            <LeetCodeIcon size={20} />
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=nitinkeshav0805@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-teal-400 transition-colors"
          >
            <Mail size={20} />
          </a>
        </div>

        <p className="text-slate-500 font-mono text-xs hover:text-teal-400 transition-colors cursor-default">
          Designed & Built with React & Tailwind by Nitin Keshav Puthi
        </p>
      </footer>

      {/* Sticky Social Bar (Desktop Left) */}
      <div className="hidden md:flex fixed left-10 bottom-0 flex-col items-center gap-6 z-40 after:content-[''] after:w-px after:h-24 after:bg-slate-700">
        <a
          href="https://github.com/NITIN080506"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-teal-400 hover:-translate-y-1 transition-all"
          title="GitHub"
        >
          <Github size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/nitin-keshav-673871325"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-teal-400 hover:-translate-y-1 transition-all"
          title="LinkedIn"
        >
          <Linkedin size={20} />
        </a>
        <a
          href="https://leetcode.com/u/Nitinkeshav0805"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-teal-400 hover:-translate-y-1 transition-all"
          title="LeetCode"
        >
          <LeetCodeIcon size={20} />
        </a>
      </div>

      {/* Sticky Email Bar (Desktop Right) */}
      <div className="hidden md:flex fixed right-10 bottom-0 flex-col items-center gap-6 z-40 after:content-[''] after:w-px after:h-24 after:bg-slate-700">
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=nitinkeshav0805@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-teal-400 font-mono text-xs tracking-widest hover:-translate-y-1 transition-all"
          style={{ writingMode: 'vertical-rl' }}
          title="Send Email"
        >
          nitinkeshav0805@gmail.com
        </a>
      </div>

      {/* Floating Scroll to Top Button */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 md:right-24 z-40 p-3 rounded-full bg-slate-800/90 text-teal-400 border border-slate-700 hover:border-teal-400 hover:bg-slate-800 transition-all shadow-lg hover:shadow-teal-500/20 hover:-translate-y-1"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
};

export default App;
