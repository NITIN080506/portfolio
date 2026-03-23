import { useEffect, useState } from 'react';
import './App.css';
import ScrollProgressBar from './components/ScrollProgressBar';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  ChevronDown,
  Terminal,
  Code,
  Layout,
  Database,
  Briefcase,
  User
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

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [visitorCount, setVisitorCount] = useState('...');

  // Handle scroll events for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Simple scroll spy logic
      const sections = ['home', 'about', 'learning', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 200; // Offset for navbar
      
      let current = 'home';
      sections.forEach(section => {
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

    handleScroll(); // Call immediately on mount
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          setVisitorCount('N/A');
        }
      }
    };

    loadVisitorCount();
    return () => controller.abort();
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-teal-500/30">
      <ScrollProgressBar />
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="text-teal-400 font-mono font-bold text-xl tracking-tighter">
            <span className="text-slate-200">Nitin</span>.dev
          </div>
          <div className="hidden sm:flex items-center text-xs md:text-sm font-mono text-slate-300 border border-slate-700 rounded-full px-3 py-1 bg-slate-900/60">
            Visitors: <span className="text-teal-400 ml-2">{visitorCount}</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            {['About', 'Learning', 'Projects', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className={`hover:text-teal-400 transition-colors ${activeSection === item.toLowerCase() ? 'text-teal-400' : 'text-slate-400'}`}
              >
                {item}
              </button>
            ))}
          </div>
          {/* Mobile Menu Button - simplified for this template */}
          <div className="md:hidden flex space-x-4">
            <a href="#contact" className="text-sm font-medium text-teal-400 border border-teal-400/50 px-3 py-1.5 rounded hover:bg-teal-400/10 transition-colors">
              Say Hi
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex flex-col justify-center pt-20 pb-10">
          <p className="text-teal-400 font-mono mb-5 pl-1">Hi, my name is</p>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-4 tracking-tight">
            Nitin Keshav Puthi.
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-400 mb-8 tracking-tight">
            I build things for the web.
          </h2>
          <p className="text-slate-400 max-w-xl text-lg md:text-xl leading-relaxed mb-12">
            I'm a software engineer specializing in building (and occasionally designing) exceptional digital experiences. Currently, I'm focused on building accessible, human-centered products.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => scrollTo('projects')}
              className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold px-8 py-4 rounded transition-all transform hover:-translate-y-1"
            >
              Check out my work
            </button>
            <button 
              onClick={() => window.open('https://github.com/NITIN080506', '_blank')}
              className="flex items-center gap-2 border border-slate-600 hover:border-slate-400 text-slate-300 px-8 py-4 rounded transition-all"
            >
              <Github size={20} />
              GitHub
            </button>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 md:py-32 border-t border-slate-800">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">About Me</h2>
            <div className="h-px bg-slate-700 flex-grow max-w-xs"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>
                I’m Nitin Keshav Puthi I build modern web applications that are fast, responsive, and user-friendly. From React-based platforms to AI-driven projects, I enjoy turning ideas into functional digital products. I love experimenting with new technologies, improving performance, and creating clean, intuitive interfaces. Currently exploring AI in Finance, cloud technologies, and scalable full-stack development.
              </p>
              <p>
                Here are a few technologies I've been working with recently:
              </p>
              
              <ul className="grid grid-cols-2 gap-2 font-mono text-sm text-slate-300 mt-4">
                <li className="flex items-center gap-2"><span className="text-teal-400">▹</span> JavaScript (ES6+)</li>
                <li className="flex items-center gap-2"><span className="text-teal-400">▹</span> Firebase (Authentication & Firestore)</li>
                <li className="flex items-center gap-2"><span className="text-teal-400">▹</span> React</li>
                <li className="flex items-center gap-2"><span className="text-teal-400">▹</span> Node.js</li>
                <li className="flex items-center gap-2"><span className="text-teal-400">▹</span> Tailwind CSS</li>
                <li className="flex items-center gap-2"><span className="text-teal-400">▹</span> PostgreSQL</li>
                <li className="flex items-center gap-2"><span className="text-teal-400">▹</span> HTML5 & CSS3</li>
              </ul>
            </div>
            
            {/* Image Placeholder */}
            <div className="relative group max-w-sm mx-auto md:mx-0">
              <div className="absolute -inset-4 border-2 border-teal-400/50 rounded-xl translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 z-0"></div>
              <div className="relative aspect-square bg-slate-800 rounded-xl overflow-hidden z-10 border border-slate-700 flex items-center justify-center">
                <img src={`${import.meta.env.BASE_URL}profile.jpg`} alt="Nitin Keshav Puthi" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-teal-500/10 group-hover:bg-transparent transition-colors duration-300"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="learning" className="py-24 md:py-32 border-t border-slate-800">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Experience & Learning</h2>
            <div className="h-px bg-slate-700 flex-grow max-w-xs"></div>
          </div>

          <div className="space-y-12 max-w-3xl">
            {/* Experience 1 */}
            <div className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-[-40px] top-1.5 w-3 h-3 bg-teal-400 rounded-full ring-4 ring-slate-900 z-10"></div>
              <div className="hidden md:block absolute left-[-35px] top-4 bottom-[-60px] w-px bg-slate-700"></div>
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-2">
                <h3 className="text-xl font-bold text-slate-200">Full-Stack Development <span className="text-teal-400">@ Personal Projects</span></h3>
              </div>
              <p className="text-slate-500 font-mono text-sm mb-4">2024 - Present</p>
              <ul className="space-y-3 text-slate-400 text-base">
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">▹</span>
                  <span>Developed multiple full-stack web applications using React, Node.js, and PostgreSQL/MySQL, implementing complete CRUD operations and RESTful APIs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">▹</span>
                  <span>Built responsive and accessible user interfaces using modern CSS frameworks like Tailwind CSS, ensuring optimal performance across devices.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">▹</span>
                  <span>Integrated third-party APIs including Google AI API and AccuWeather API to enhance application functionality and user experience.</span>
                </li>
              </ul>
            </div>

            {/* Experience 2 */}
            <div className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-[-40px] top-1.5 w-3 h-3 bg-slate-600 rounded-full ring-4 ring-slate-900 z-10"></div>
              <div className="hidden md:block absolute left-[-35px] top-4 bottom-[-60px] w-px bg-slate-700"></div>
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-2">
                <h3 className="text-xl font-bold text-slate-200">Technical Skills Development <span className="text-teal-400">@ Self-Learning</span></h3>
              </div>
              <p className="text-slate-500 font-mono text-sm mb-4">2023 - Present</p>
              <ul className="space-y-3 text-slate-400 text-base">
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">▹</span>
                  <span>Mastered modern web development technologies including JavaScript ES6+, React.js, Node.js, and database management with PostgreSQL and MySQL.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">▹</span>
                  <span>Implemented authentication and authorization systems using Firebase, ensuring secure user data management and access control.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">▹</span>
                  <span>Gained hands-on experience with version control using Git and GitHub, following best practices for collaborative development.</span>
                </li>
              </ul>
            </div>
            
            {/* Experience 3 */}
            <div className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-[-40px] top-1.5 w-3 h-3 bg-slate-600 rounded-full ring-4 ring-slate-900 z-10"></div>
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-2">
                <h3 className="text-xl font-bold text-slate-200">Problem Solving & Development <span className="text-teal-400">@ Continuous Learning</span></h3>
              </div>
              <p className="text-slate-500 font-mono text-sm mb-4">2023 - Present</p>
              <ul className="space-y-3 text-slate-400 text-base">
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">▹</span>
                  <span>Actively solving coding challenges and building projects to strengthen data structures, algorithms, and system design fundamentals.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">▹</span>
                  <span>Exploring AI integration in web applications and experimenting with AI-driven features to create innovative digital solutions.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 md:py-32 border-t border-slate-800">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Some Things I've Built</h2>
            <div className="h-px bg-slate-700 flex-grow max-w-xs"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Project Card 1 */}
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 hover:border-teal-400/50 transition-all hover:-translate-y-2 group flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <Layout className="text-teal-400" size={40} />
                <div className="flex gap-4">
                  <a href="https://github.com/NITIN080506/quiz-platform.git" target="_blank" className="text-slate-400 hover:text-teal-400 transition-colors"><Github size={20} /></a>
                  <a href="https://nitin080506.github.io/quiz-platform" target="_blank" className="text-slate-400 hover:text-teal-400 transition-colors"><ExternalLink size={20} /></a>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-teal-400 transition-colors">SmartQuiz : Full-Stack Quiz Management Platform</h3>
              <p className="text-slate-400 mb-8 flex-grow">
                A full-stack quiz management system that enables users to create, attempt, and evaluate quizzes in real time. Implemented structured logical flows and state transitions for question processing and validation, ensuring accurate evaluation. Optimized client-server communication and request handling to efficiently manage concurrent users and maintain smooth traffic flow. Designed a responsive UI using React and Tailwind CSS with PostgreSQL for reliable data storage and performance tracking.
              </p>
              <ul className="flex flex-wrap gap-3 font-mono text-xs text-slate-500 mt-auto">
                <li>React</li>
                <li>Node.js</li>
                <li>PostgreSQL</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>

            {/* Project Card 2 */}
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 hover:border-teal-400/50 transition-all hover:-translate-y-2 group flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <Database className="text-teal-400" size={40} />
                <div className="flex gap-4">
                  <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors"><Github size={20} /></a>
                  <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors"><ExternalLink size={20} /></a>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-teal-400 transition-colors">BookNest : Online Book Store Platform</h3>
              <p className="text-slate-400 mb-8 flex-grow">
                Developed a full-stack e-commerce web application for browsing and purchasing books online. Implemented secure user authentication and designed a system where each user’s orders are stored and managed separately. Built dynamic cart functionality and structured database relationships in MySQL to ensure accurate order tracking, user-specific data handling, and smooth transaction flow.
              </p>
              <ul className="flex flex-wrap gap-3 font-mono text-xs text-slate-500 mt-auto">
                <li>React</li>
                <li>MySQL</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>

            {/* Project Card 3 */}
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 hover:border-teal-400/50 transition-all hover:-translate-y-2 group flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <Terminal className="text-teal-400" size={40} />
                <div className="flex gap-4">
                  <a href="https://github.com/NITIN080506/weather-project.git" target="_blank" className="text-slate-400 hover:text-teal-400 transition-colors"><Github size={20} /></a>
                  <a href="https://nitin080506.github.io/weather-project" target="_blank" className="text-slate-400 hover:text-teal-400 transition-colors"><ExternalLink size={20} /></a>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-teal-400 transition-colors">SkyCast : Weather Forecasting Web Application</h3>
              <p className="text-slate-400 mb-8 flex-grow">
                Developed a responsive weather forecasting web application that provides real-time weather updates based on user location or search input. Integrated the AccuWeather API to fetch live data including temperature, humidity, wind speed, and weather conditions. Implemented dynamic DOM updates to display forecasts instantly and handled asynchronous API requests efficiently. Added error handling for invalid inputs and optimized data rendering to ensure smooth user experience and reliable performance.
              </p>
              <ul className="flex flex-wrap gap-3 font-mono text-xs text-slate-500 mt-auto">
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
                <li>AccuWeather API</li>
              </ul>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 hover:border-teal-400/50 transition-all hover:-translate-y-2 group flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <Database className="text-teal-400" size={40} />
                <div className="flex gap-4">
                  <a href="https://github.com/NITIN080506/nutrio-kitchen.git" target="_blank" className="text-slate-400 hover:text-teal-400 transition-colors"><Github size={20} /></a>
                  <a href="https://nitin080506.github.io/nutrio-kitchen" target="_blank" className="text-slate-400 hover:text-teal-400 transition-colors"><ExternalLink size={20} /></a>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-200 mb-3 group-hover:text-teal-400 transition-colors">Nutrio : Smart Health & Nutrition Recommendation System</h3>
              <p className="text-slate-400 mb-8 flex-grow">
                Developed a cross-platform mobile application that scans vegetables and grocery items using AI-based image recognition. Integrated the Google AI API to analyze scanned items and extract relevant food information. Implemented a structured recommendation system that evaluates nutritional content and suggests suitable food options based on specific health conditions. Designed a clean and responsive UI using Tailwind CSS to ensure an intuitive user experience.
              </p>
              <ul className="flex flex-wrap gap-3 font-mono text-xs text-slate-500 mt-auto">
                <li>React Native</li>
                <li>TailwindCSS</li>
                <li>FireBase</li>
                <li>Google Ai Studio API</li>
                <li>Expo Go</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 md:py-32 border-t border-slate-800 text-center max-w-2xl mx-auto">
          <p className="text-teal-400 font-mono mb-4">04. What's Next?</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">Get In Touch</h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            I’m always open to discussing new opportunities, collaborations, or innovative ideas. Feel free to reach out if you’d like to work together or just want to connect.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=nitinkeshav0805@gmail.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-teal-400 text-teal-400 hover:bg-teal-400/10 font-medium px-8 py-4 rounded transition-colors"
            >
              <Mail size={20} />
              Gmail
            </a>
            <a 
              href="https://www.linkedin.com/in/nitin-keshav-673871325" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-teal-400 text-teal-400 hover:bg-teal-400/10 font-medium px-8 py-4 rounded transition-colors"
            >
              <Linkedin size={20} />
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-slate-800/50">
        <div className="flex justify-center gap-6 mb-4 md:hidden">
          <a href="https://github.com/NITIN080506" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400"><Github size={24} /></a>
          <a href="https://www.linkedin.com/in/nitin-keshav-673871325" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400"><Linkedin size={24} /></a>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=nitinkeshav0805@gmail.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400"><Mail size={24} /></a>
        </div>
        <p className="text-slate-500 font-mono text-sm hover:text-teal-400 transition-colors cursor-default">
          Designed & Built by Nitin Keshav Puthi
        </p>
      </footer>

      {/* Sticky Social Links (Desktop) */}
      <div className="hidden md:flex fixed left-10 bottom-0 flex-col items-center gap-6 after:content-[''] after:w-px after:h-24 after:bg-slate-500">
        <a href="https://github.com/NITIN080506" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 hover:-translate-y-1 transition-all"><Github size={22} /></a>
        <a href="https://www.linkedin.com/in/nitin-keshav-673871325" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 hover:-translate-y-1 transition-all"><Linkedin size={22} /></a>
      </div>

      {/* Sticky Email Link (Desktop) */}
      <div className="hidden md:flex fixed right-10 bottom-0 flex-col items-center gap-6 after:content-[''] after:w-px after:h-24 after:bg-slate-500">
        <a 
          href="https://mail.google.com/mail/?view=cm&fs=1&to=nitinkeshav0805@gmail.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-teal-400 font-mono text-sm tracking-widest writing-vertical hover:-translate-y-1 transition-all"
          style={{ writingMode: 'vertical-rl' }}
        >
          nitinkeshav0805@gmail.com
        </a>
      </div>
    </div>
  );
};

export default App;