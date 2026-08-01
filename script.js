// Premium interactivity: theme persistence, motion, reveals, counters, roadmap tabs, and tactile UI.
document.documentElement.classList.add('js-enabled');
document.body.classList.add('is-transitioning');

const storageKey = 'tech-learning-theme';
const lessonProgressKey = 'tech-learning-lesson-progress';
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#nav-menu');
const loader = document.querySelector('.loader');
const coursesSection = document.querySelector('#courses');
const courseDetailsSection = document.querySelector('#course-details');
const courseList = document.querySelector('#course-list');
const courseSearch = document.querySelector('#course-search');
const courseFilters = document.querySelector('#course-filters');
const courseEmpty = document.querySelector('#course-empty');
const courseDetailCard = document.querySelector('#course-detail-card');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const supabaseConfig = {
  url: window.TECH_LEARNING_SUPABASE_URL || '',
  anonKey: window.TECH_LEARNING_SUPABASE_ANON_KEY || '',
};

const fallbackCourses = [
  {
    "id": "web-fundamentals-bootcamp",
    "category": "Web",
    "thumbnail": "🌐",
    "title": "Web Fundamentals Bootcamp",
    "description": "Build accessible pages with semantic HTML, modern CSS, and responsive layouts.",
    "instructor": "Maya Chen",
    "duration": "6 hours",
    "difficulty": "Beginner",
    "price": "Free",
    "outcomes": [
      "Structure pages with semantic HTML",
      "Create responsive CSS layouts",
      "Publish a polished landing page"
    ],
    "modules": [
      {
        "id": "module-1",
        "title": "Start here",
        "description": "Set up the core workflow and understand the learning goal.",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "HTML foundations",
            "description": "Write meaningful page structure with headings, landmarks, and reusable content sections.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-2",
            "title": "CSS layout practice",
            "description": "Use modern CSS spacing, grid, and responsive rules to adapt the course project.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      },
      {
        "id": "module-2",
        "title": "Apply and ship",
        "description": "Turn the new concept into practical project progress.",
        "lessons": [
          {
            "id": "lesson-3",
            "title": "Publish the page",
            "description": "Review accessibility checks and prepare the finished landing page for sharing.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-4",
            "title": "Practice review",
            "description": "Review the important decisions, complete the checklist, and prepare for the next course step.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      }
    ]
  },
  {
    "id": "javascript-ui-essentials",
    "category": "JavaScript",
    "thumbnail": "⚡",
    "title": "JavaScript UI Essentials",
    "description": "Practice DOM events, state, browser debugging, and delightful interactive patterns.",
    "instructor": "Jordan Lee",
    "duration": "8 hours",
    "difficulty": "Beginner",
    "price": "$29",
    "outcomes": [
      "Handle user events confidently",
      "Update UI from reusable data",
      "Debug common browser issues"
    ],
    "modules": [
      {
        "id": "module-1",
        "title": "Start here",
        "description": "Set up the core workflow and understand the learning goal.",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "DOM selection basics",
            "description": "Connect JavaScript to visible interface elements and read useful browser state.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-2",
            "title": "Events and UI state",
            "description": "Respond to user actions and keep interface state predictable.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      },
      {
        "id": "module-2",
        "title": "Apply and ship",
        "description": "Turn the new concept into practical project progress.",
        "lessons": [
          {
            "id": "lesson-3",
            "title": "Debugging workflow",
            "description": "Use browser developer tools to inspect errors and verify interaction behavior.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-4",
            "title": "Practice review",
            "description": "Review the important decisions, complete the checklist, and prepare for the next course step.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      }
    ]
  },
  {
    "id": "github-pages-launch",
    "category": "GitHub",
    "thumbnail": "🚀",
    "title": "GitHub Pages Launch",
    "description": "Learn commits, branches, pull requests, and a repeatable GitHub Pages workflow.",
    "instructor": "Priya Sharma",
    "duration": "5 hours",
    "difficulty": "Beginner",
    "price": "Free",
    "outcomes": [
      "Track work with Git commits",
      "Collaborate with pull requests",
      "Deploy a project site"
    ],
    "modules": [
      {
        "id": "module-1",
        "title": "Start here",
        "description": "Set up the core workflow and understand the learning goal.",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "Git commit routine",
            "description": "Create small commits that document each step of project progress.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-2",
            "title": "Branch and pull request flow",
            "description": "Practice a safe collaboration workflow with branches and review notes.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      },
      {
        "id": "module-2",
        "title": "Apply and ship",
        "description": "Turn the new concept into practical project progress.",
        "lessons": [
          {
            "id": "lesson-3",
            "title": "Deploy with Pages",
            "description": "Publish a static project and validate the public GitHub Pages URL.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-4",
            "title": "Practice review",
            "description": "Review the important decisions, complete the checklist, and prepare for the next course step.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      }
    ]
  },
  {
    "id": "portfolio-project-lab",
    "category": "Projects",
    "thumbnail": "💼",
    "title": "Portfolio Project Lab",
    "description": "Turn lessons into a professional portfolio piece with copy, polish, and launch checks.",
    "instructor": "Alex Rivera",
    "duration": "10 hours",
    "difficulty": "Intermediate",
    "price": "$49",
    "outcomes": [
      "Plan a portfolio-ready project",
      "Polish interactions and content",
      "Prepare a launch checklist"
    ],
    "modules": [
      {
        "id": "module-1",
        "title": "Start here",
        "description": "Set up the core workflow and understand the learning goal.",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "Project scope map",
            "description": "Define audience, goals, sections, and success criteria before building.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-2",
            "title": "Polish pass",
            "description": "Improve copy, hierarchy, interactions, and responsive presentation.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      },
      {
        "id": "module-2",
        "title": "Apply and ship",
        "description": "Turn the new concept into practical project progress.",
        "lessons": [
          {
            "id": "lesson-3",
            "title": "Launch checklist",
            "description": "Package the project with final QA, README notes, and sharing steps.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-4",
            "title": "Practice review",
            "description": "Review the important decisions, complete the checklist, and prepare for the next course step.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      }
    ]
  },
  {
    "id": "artificial-intelligence",
    "category": "AI",
    "thumbnail": "🤖",
    "title": "Artificial Intelligence",
    "description": "Learn core AI concepts, practical use cases, and responsible workflows for modern tools.",
    "instructor": "Dr. Neha Kapoor",
    "duration": "9 hours",
    "difficulty": "Beginner",
    "price": "Free",
    "outcomes": [
      "Explain essential AI concepts",
      "Identify practical AI use cases",
      "Apply responsible AI practices"
    ],
    "modules": [
      {
        "id": "module-1",
        "title": "AI Foundations",
        "description": "Understand what AI is and where it creates value.",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "What is artificial intelligence?",
            "description": "Explore AI terminology, model types, and common examples in everyday products.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-2",
            "title": "AI use cases and limits",
            "description": "Compare useful AI applications with limitations, risks, and human oversight needs.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      },
      {
        "id": "module-2",
        "title": "Practical AI Workflow",
        "description": "Use AI tools thoughtfully to support real tasks.",
        "lessons": [
          {
            "id": "lesson-3",
            "title": "Prompting essentials",
            "description": "Write clear prompts with context, goals, constraints, and evaluation criteria.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-4",
            "title": "Responsible AI review",
            "description": "Check AI outputs for accuracy, bias, privacy, and safe publishing decisions.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      }
    ]
  },
  {
    "id": "ai-powered-digital-marketing",
    "category": "Marketing",
    "thumbnail": "📣",
    "title": "AI-Powered Digital Marketing",
    "description": "Use AI tools to plan campaigns, create content, and improve marketing performance.",
    "instructor": "Aarav Mehta",
    "duration": "8 hours",
    "difficulty": "Intermediate",
    "price": "$39",
    "outcomes": [
      "Plan AI-assisted campaigns",
      "Generate content briefs faster",
      "Measure and improve campaign output"
    ],
    "modules": [
      {
        "id": "module-1",
        "title": "AI Marketing Strategy",
        "description": "Connect AI assistance with clear marketing goals.",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "Campaign planning with AI",
            "description": "Use AI to shape audiences, messages, channels, and campaign calendars.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-2",
            "title": "Customer insights prompts",
            "description": "Create prompts that summarize customer research and uncover content opportunities.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      },
      {
        "id": "module-2",
        "title": "Content and Optimization",
        "description": "Apply AI across content creation and measurement.",
        "lessons": [
          {
            "id": "lesson-3",
            "title": "AI content production",
            "description": "Draft ads, emails, posts, and landing page copy with brand and quality controls.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-4",
            "title": "Performance improvement",
            "description": "Analyze campaign metrics and use AI-assisted experiments to improve results.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      }
    ]
  },
  {
    "id": "digital-marketing",
    "category": "Marketing",
    "thumbnail": "📈",
    "title": "Digital Marketing",
    "description": "Build a practical foundation in SEO, social media, email, and analytics.",
    "instructor": "Sara Williams",
    "duration": "7 hours",
    "difficulty": "Beginner",
    "price": "Free",
    "outcomes": [
      "Understand key digital channels",
      "Create basic marketing campaigns",
      "Read core performance metrics"
    ],
    "modules": [
      {
        "id": "module-1",
        "title": "Marketing Channels",
        "description": "Learn the core channels used in digital campaigns.",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "SEO and content basics",
            "description": "Understand keywords, search intent, on-page content, and helpful publishing habits.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-2",
            "title": "Social and email fundamentals",
            "description": "Plan social posts and email campaigns that match audience needs.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      },
      {
        "id": "module-2",
        "title": "Campaign Measurement",
        "description": "Track results and improve future campaigns.",
        "lessons": [
          {
            "id": "lesson-3",
            "title": "Analytics essentials",
            "description": "Read traffic, engagement, conversion, and retention metrics for campaign decisions.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-4",
            "title": "Campaign review",
            "description": "Summarize results, identify lessons learned, and plan the next improvement cycle.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      }
    ]
  },
  {
    "id": "python-programming",
    "category": "Programming",
    "thumbnail": "🐍",
    "title": "Python Programming",
    "description": "Learn Python syntax, data structures, functions, and simple automation projects.",
    "instructor": "Rohan Patel",
    "duration": "10 hours",
    "difficulty": "Beginner",
    "price": "$29",
    "outcomes": [
      "Write Python scripts",
      "Use core data structures",
      "Build small automation tasks"
    ],
    "modules": [
      {
        "id": "module-1",
        "title": "Python Basics",
        "description": "Start writing clear Python programs.",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "Syntax and variables",
            "description": "Practice Python values, variables, operators, input, and output.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-2",
            "title": "Control flow",
            "description": "Use conditions and loops to make programs respond to different situations.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      },
      {
        "id": "module-2",
        "title": "Build with Python",
        "description": "Organize logic and solve practical problems.",
        "lessons": [
          {
            "id": "lesson-3",
            "title": "Functions and data structures",
            "description": "Work with functions, lists, dictionaries, and reusable problem-solving patterns.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-4",
            "title": "Mini automation project",
            "description": "Create a small script that processes data and reports useful results.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      }
    ]
  },
  {
    "id": "ms-excel",
    "category": "Productivity",
    "thumbnail": "📊",
    "title": "MS Excel",
    "description": "Master spreadsheets, formulas, formatting, charts, and essential data analysis workflows.",
    "instructor": "Anika Rao",
    "duration": "6 hours",
    "difficulty": "Beginner",
    "price": "Free",
    "outcomes": [
      "Build organized spreadsheets",
      "Use formulas and functions",
      "Create charts and summaries"
    ],
    "modules": [
      {
        "id": "module-1",
        "title": "Excel Foundations",
        "description": "Create clean, useful spreadsheets.",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "Workbook navigation",
            "description": "Use sheets, cells, ranges, formatting, and basic data entry efficiently.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-2",
            "title": "Formulas and functions",
            "description": "Apply arithmetic, relative references, SUM, AVERAGE, COUNT, and IF functions.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      },
      {
        "id": "module-2",
        "title": "Analyze and Present Data",
        "description": "Turn spreadsheet data into insights.",
        "lessons": [
          {
            "id": "lesson-3",
            "title": "Sorting, filtering, and charts",
            "description": "Organize data and create charts that communicate important patterns.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-4",
            "title": "Practice dashboard",
            "description": "Build a simple summary sheet with formulas, formatting, and visuals.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      }
    ]
  },
  {
    "id": "ms-word",
    "category": "Productivity",
    "thumbnail": "📝",
    "title": "MS Word",
    "description": "Create polished documents with formatting, styles, tables, references, and review tools.",
    "instructor": "Emily Carter",
    "duration": "5 hours",
    "difficulty": "Beginner",
    "price": "Free",
    "outcomes": [
      "Format professional documents",
      "Use styles and tables",
      "Review and prepare files for sharing"
    ],
    "modules": [
      {
        "id": "module-1",
        "title": "Document Basics",
        "description": "Build readable, professional documents.",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "Text formatting and layout",
            "description": "Use fonts, spacing, margins, headers, footers, and page setup controls.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-2",
            "title": "Styles and structure",
            "description": "Apply headings, lists, and styles to keep documents consistent and easy to update.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      },
      {
        "id": "module-2",
        "title": "Professional Word Workflow",
        "description": "Prepare documents for collaboration and delivery.",
        "lessons": [
          {
            "id": "lesson-3",
            "title": "Tables and references",
            "description": "Add tables, links, captions, and simple references for organized content.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-4",
            "title": "Review and export",
            "description": "Use comments, track changes, spelling checks, and PDF export before sharing.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      }
    ]
  },
  {
    "id": "ms-powerpoint",
    "category": "Productivity",
    "thumbnail": "🖥️",
    "title": "MS PowerPoint",
    "description": "Design clear presentations with slide structure, visuals, transitions, and delivery practice.",
    "instructor": "Michael Brown",
    "duration": "5 hours",
    "difficulty": "Beginner",
    "price": "$19",
    "outcomes": [
      "Create structured slide decks",
      "Use visuals effectively",
      "Prepare confident presentations"
    ],
    "modules": [
      {
        "id": "module-1",
        "title": "Presentation Foundations",
        "description": "Plan and build effective slide decks.",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "Slide structure",
            "description": "Create title, agenda, content, and closing slides with a clear message.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-2",
            "title": "Visual design basics",
            "description": "Use images, icons, charts, alignment, and contrast to support the story.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      },
      {
        "id": "module-2",
        "title": "Delivery Ready Decks",
        "description": "Polish and present with confidence.",
        "lessons": [
          {
            "id": "lesson-3",
            "title": "Transitions and speaker notes",
            "description": "Add simple transitions, notes, and timing without distracting from the content.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-4",
            "title": "Presentation rehearsal",
            "description": "Review flow, practice delivery, and prepare a final shareable deck.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      }
    ]
  },
  {
    "id": "personality-development",
    "category": "Career",
    "thumbnail": "🌟",
    "title": "Personality Development",
    "description": "Strengthen communication, confidence, habits, and professional presence.",
    "instructor": "Kavita Singh",
    "duration": "6 hours",
    "difficulty": "Beginner",
    "price": "Free",
    "outcomes": [
      "Communicate with confidence",
      "Build professional habits",
      "Improve self-presentation"
    ],
    "modules": [
      {
        "id": "module-1",
        "title": "Self Awareness and Confidence",
        "description": "Understand strengths and build a confident mindset.",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "Personal strengths map",
            "description": "Identify strengths, improvement areas, values, and personal growth goals.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-2",
            "title": "Confidence habits",
            "description": "Practice routines for positive body language, mindset, and consistent self-improvement.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      },
      {
        "id": "module-2",
        "title": "Communication and Presence",
        "description": "Develop professional interpersonal skills.",
        "lessons": [
          {
            "id": "lesson-3",
            "title": "Effective communication",
            "description": "Practice listening, clarity, tone, and respectful workplace conversations.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-4",
            "title": "Personal action plan",
            "description": "Create a practical development plan with measurable weekly habits.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      }
    ]
  },
  {
    "id": "interview-hacking",
    "category": "Career",
    "thumbnail": "🎯",
    "title": "Interview Hacking",
    "description": "Prepare strong resumes, answers, practice routines, and follow-up strategies for interviews.",
    "instructor": "Daniel Kim",
    "duration": "7 hours",
    "difficulty": "Intermediate",
    "price": "$29",
    "outcomes": [
      "Prepare targeted interview answers",
      "Practice common interview formats",
      "Follow up professionally"
    ],
    "modules": [
      {
        "id": "module-1",
        "title": "Interview Preparation",
        "description": "Build a focused plan before the interview.",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "Resume and role research",
            "description": "Match your resume, projects, and examples to the target role and company.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-2",
            "title": "Answer frameworks",
            "description": "Use STAR and concise storytelling to answer behavioral and experience questions.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      },
      {
        "id": "module-2",
        "title": "Practice and Follow Up",
        "description": "Improve performance through rehearsal and reflection.",
        "lessons": [
          {
            "id": "lesson-3",
            "title": "Mock interview practice",
            "description": "Practice introductions, technical explanations, and common questions under realistic timing.",
            "videoUrl": "",
            "notesUrl": ""
          },
          {
            "id": "lesson-4",
            "title": "Follow-up strategy",
            "description": "Send thoughtful follow-ups and track lessons learned for future interviews.",
            "videoUrl": "",
            "notesUrl": ""
          }
        ]
      }
    ]
  }
];
let courses = fallbackCourses;
let categories = [];
let activeCategory = 'All';
let selectedLessonId = '';
let completedLessons = loadLessonProgress();

const getPreferredTheme = () => localStorage.getItem(storageKey) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
  if (themeToggle) themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

applyTheme(getPreferredTheme());

window.addEventListener('load', () => {
  window.setTimeout(() => loader?.classList.add('loaded'), motionQuery.matches ? 0 : 520);
});

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(storageKey, nextTheme);
  applyTheme(nextTheme);
});

menuToggle?.addEventListener('click', () => {
  const isOpen = navMenu?.classList.toggle('open') || false;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#course/')) {
      navMenu?.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      return;
    }
    if (href === '#courses' && courseDetailsSection && !courseDetailsSection.hidden) {
      navMenu?.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      return;
    }
    const target = document.getElementById(href.slice(1));
    navMenu?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (!target || motionQuery.matches) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const counters = document.querySelectorAll('[data-counter]');
function animateCounter(counter) {
  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || '';
  const duration = 1300;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progressValue = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progressValue, 3);
    counter.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progressValue < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (entry.target.matches('[data-counter]')) animateCounter(entry.target);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

function observeRevealElements(scope = document) {
  scope.querySelectorAll('.reveal, [data-counter]').forEach((element) => revealObserver.observe(element));
}
observeRevealElements();

const timelineItems = document.querySelectorAll('.timeline-item');
const timelineDetail = document.querySelector('.timeline-detail');
timelineItems.forEach((item) => {
  item.addEventListener('click', () => {
    timelineItems.forEach((button) => {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
    });
    item.classList.add('active');
    item.setAttribute('aria-selected', 'true');
    if (timelineDetail) timelineDetail.textContent = item.dataset.detail || '';
  });
});

let ticking = false;
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;

function updateFrame() {
  ticking = false;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  document.documentElement.style.setProperty('--scroll-progress', ratio.toFixed(4));

  if (!motionQuery.matches) {
    document.documentElement.style.setProperty('--mouse-x', `${pointerX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${pointerY}px`);
    document.documentElement.style.setProperty('--cursor-x', `${pointerX}px`);
    document.documentElement.style.setProperty('--cursor-y', `${pointerY}px`);

    document.querySelectorAll('[data-parallax]').forEach((element) => {
      const speed = Number(element.dataset.parallax || 0);
      element.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
    });
  }
}

function requestFrame() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateFrame);
}

window.addEventListener('scroll', requestFrame, { passive: true });
window.addEventListener('resize', requestFrame);
window.addEventListener('pointermove', (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  document.body.classList.add('pointer-active');
  requestFrame();
}, { passive: true });
requestFrame();

function enableTilt(scope = document) {
  if (!canHover || motionQuery.matches) return;
  scope.querySelectorAll('.tilt-card').forEach((card) => {
    if (card.dataset.tiltReady) return;
    card.dataset.tiltReady = 'true';
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 9;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -9;
      card.style.transform = `perspective(950px) rotateY(${x}deg) rotateX(${y}deg) translate3d(0,-7px,0)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

if (canHover && !motionQuery.matches) {
  enableTilt();

  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      button.style.transform = `translate3d(${x}px, ${y - 2}px, 0)`;
    });
    button.addEventListener('pointerleave', () => {
      button.style.transform = '';
    });
  });
}

function enableRipple(scope = document) {
  scope.querySelectorAll('.button, .timeline-item, summary, .theme-toggle, .menu-toggle, .nav-links a, .social-links a, .course-filter').forEach((element) => {
    if (element.dataset.rippleReady) return;
    element.dataset.rippleReady = 'true';
  element.addEventListener('click', (event) => {
    if (motionQuery.matches) return;
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    element.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
});
}
enableRipple();

function getCourseHref(course, lessonId = '') {
  return `#course/${course.id}${lessonId ? `/${lessonId}` : ''}`;
}

function loadLessonProgress() {
  try {
    return JSON.parse(localStorage.getItem(lessonProgressKey)) || {};
  } catch (error) {
    return {};
  }
}

function persistLessonProgress() {
  localStorage.setItem(lessonProgressKey, JSON.stringify(completedLessons));
}

function getCourseLessons(course) {
  return (course.modules || []).flatMap((module) => (module.lessons || []).map((lesson) => ({ ...lesson, moduleTitle: module.title })));
}

function getCourseProgress(course) {
  const lessons = getCourseLessons(course);
  const completed = lessons.filter((lesson) => completedLessons[`${course.id}:${lesson.id}`]).length;
  return { completed, total: lessons.length, percent: lessons.length ? Math.round((completed / lessons.length) * 100) : 0 };
}

function getSelectedLesson(course, requestedLessonId = '') {
  const lessons = getCourseLessons(course);
  return lessons.find((lesson) => lesson.id === requestedLessonId) || lessons[0] || null;
}

function createCourseCard(course) {
  return `
    <article class="card course-card tilt-card reveal slide-up">
      <div class="course-thumb" aria-hidden="true">${renderThumbnail(course.thumbnail)}</div>
      <div class="course-meta"><span>${course.category}</span><span>${course.duration}</span><span>${course.difficulty}</span></div>
      <div>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p class="course-instructor">Instructor: ${course.instructor}</p>
      </div>
      <div class="course-card-footer">
        <span class="course-price">${course.price}</span>
        <a class="button primary magnetic" href="${getCourseHref(course)}">Enroll <span>→</span></a>
      </div>
    </article>
  `;
}

function renderCourseFilters() {
  if (!courseFilters) return;
  const categoryNames = categories.length > 0 ? categories.map((category) => category.name) : [...new Set(courses.map((course) => course.category))];
  const filterNames = ['All', ...categoryNames];
  courseFilters.innerHTML = filterNames.map((category) => `<button class="course-filter${category === activeCategory ? ' active' : ''}" type="button" data-category="${category}">${category}</button>`).join('');
  courseFilters.querySelectorAll('.course-filter').forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category || 'All';
      renderCourseFilters();
      renderCourses();
    });
  });
  enableRipple(courseFilters);
}

function getFilteredCourses() {
  const query = (courseSearch?.value || '').trim().toLowerCase();
  return courses.filter((course) => {
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    const haystack = `${course.title} ${course.description} ${course.instructor} ${course.category} ${course.difficulty}`.toLowerCase();
    return matchesCategory && haystack.includes(query);
  });
}

function renderCourses() {
  if (!courseList) return;
  const filteredCourses = getFilteredCourses();
  courseList.innerHTML = filteredCourses.map(createCourseCard).join('');
  if (courseEmpty) courseEmpty.hidden = filteredCourses.length > 0;
  observeRevealElements(courseList);
  enableTilt(courseList);
  enableRipple(courseList);
}

function renderCourseSidebar(course, activeLesson) {
  return `
    <aside class="course-lesson-sidebar" aria-label="Course modules and lessons">
      ${(course.modules || []).map((module, moduleIndex) => `
        <section class="course-module">
          <p class="mini-label">Module ${moduleIndex + 1}</p>
          <h3>${escapeHtml(module.title)}</h3>
          <p>${escapeHtml(module.description || '')}</p>
          <ul>
            ${(module.lessons || []).map((lesson) => {
              const isActive = lesson.id === activeLesson?.id;
              const isComplete = completedLessons[`${course.id}:${lesson.id}`];
              return `<li><a class="lesson-link${isActive ? ' active' : ''}" href="${getCourseHref(course, lesson.id)}" aria-current="${isActive ? 'page' : 'false'}"><span>${isComplete ? '✓' : '○'}</span>${escapeHtml(lesson.title)}</a></li>`;
            }).join('')}
          </ul>
        </section>
      `).join('')}
    </aside>
  `;
}

function renderLessonPanel(course, lesson) {
  if (!lesson) return '<p class="empty-state">Lessons are being prepared for this course.</p>';
  const progress = getCourseProgress(course);
  const progressLabel = `${progress.completed} of ${progress.total} lessons completed`;
  const lessonKey = `${course.id}:${lesson.id}`;
  const isComplete = Boolean(completedLessons[lessonKey]);
  const videoContent = lesson.videoUrl
    ? `<iframe src="${escapeHtml(lesson.videoUrl)}" title="${escapeHtml(lesson.title)} video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
    : '<div class="lesson-placeholder" role="status">Content will be added soon.</div>';
  const notesContent = lesson.notesUrl
    ? `<iframe src="${escapeHtml(lesson.notesUrl)}" title="${escapeHtml(lesson.title)} handwritten notes" loading="lazy"></iframe>`
    : '<div class="lesson-placeholder" role="status">Content will be added soon.</div>';
  const notesAction = lesson.notesUrl
    ? `<a class="button secondary magnetic" href="${escapeHtml(lesson.notesUrl)}" download>Download Notes</a>`
    : '<button class="button secondary magnetic" type="button" disabled>Download Notes</button>';
  return `
    <article class="course-lesson-panel">
      <div class="lesson-progress" aria-label="Lesson progress">
        <div><strong>${progress.percent}% complete</strong><small>${progressLabel}</small></div>
        <div class="progress-card"><span style="width: ${progress.percent}%"></span></div>
      </div>
      <div class="lesson-video">
        ${videoContent}
      </div>
      <p class="eyebrow">${escapeHtml(lesson.moduleTitle || 'Lesson')}</p>
      <h3>${escapeHtml(lesson.title)}</h3>
      <p>${escapeHtml(lesson.description)}</p>
      <div class="lesson-notes">
        <h3>Handwritten notes</h3>
        ${notesContent}
      </div>
      <div class="lesson-actions">
        ${notesAction}
        <button class="button primary magnetic" type="button" data-complete-lesson="${escapeHtml(lesson.id)}">${isComplete ? 'Completed ✓' : 'Mark as Completed'} <span>→</span></button>
      </div>
    </article>
  `;
}

function renderCourseDetail(courseId, requestedLessonId = '') {
  const course = courses.find((item) => item.id === courseId);
  if (!course || !courseDetailCard) return false;
  const lesson = getSelectedLesson(course, requestedLessonId);
  selectedLessonId = lesson?.id || '';
  courseDetailCard.innerHTML = `
    <div class="course-detail-summary">
      <div class="course-thumb" aria-hidden="true">${renderThumbnail(course.thumbnail)}</div>
      <div>
        <p class="eyebrow">${escapeHtml(course.category)} course</p>
        <h2>${escapeHtml(course.title)}</h2>
        <p>${escapeHtml(course.description)}</p>
        <div class="course-meta"><span>${escapeHtml(course.instructor)}</span><span>${escapeHtml(course.duration)}</span><span>${escapeHtml(course.difficulty)}</span><span>${escapeHtml(course.price)}</span></div>
        <ul class="course-outcomes">${(course.outcomes || []).map((outcome) => `<li>${escapeHtml(outcome)}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="course-learning-layout">
      ${renderCourseSidebar(course, lesson)}
      ${renderLessonPanel(course, lesson)}
    </div>
  `;
  courseDetailCard.querySelector('[data-complete-lesson]')?.addEventListener('click', () => {
    if (!lesson) return;
    completedLessons[`${course.id}:${lesson.id}`] = true;
    persistLessonProgress();
    renderCourseDetail(course.id, lesson.id);
  });
  courseDetailsSection.hidden = false;
  coursesSection.hidden = true;
  courseDetailsSection.scrollIntoView({ behavior: motionQuery.matches ? 'auto' : 'smooth', block: 'start' });
  observeRevealElements(courseDetailsSection);
  enableTilt(courseDetailsSection);
  enableRipple(courseDetailsSection);
  return true;
}

function handleCourseRoute() {
  if (window.location.hash === '#admin') {
    showAdminDashboard();
    return;
  }
  hideAdminDashboard();
  const match = window.location.hash.match(/^#course\/([^/]+)(?:\/(.+))?$/);
  if (!match) {
    if (coursesSection) coursesSection.hidden = false;
    if (courseDetailsSection) courseDetailsSection.hidden = true;
    return;
  }
  if (!renderCourseDetail(match[1], match[2] || selectedLessonId)) window.location.hash = '#courses';
}


function mapSupabaseCourse(course) {
  return {
    id: course.slug || course.id,
    category: course.categories?.name || course.category || 'General',
    thumbnail: course.thumbnail || '📚',
    title: course.title,
    description: course.description,
    instructor: course.instructor,
    duration: course.duration,
    difficulty: course.difficulty,
    price: course.price,
    outcomes: Array.isArray(course.outcomes) ? course.outcomes : [],
    modules: Array.isArray(course.modules) ? course.modules : [],
  };
}

async function fetchSupabaseTable(table, query = 'select=*') {
  if (!supabaseConfig.url || !supabaseConfig.anonKey) return null;
  const endpoint = `${supabaseConfig.url.replace(/\/$/, '')}/rest/v1/${table}?${query}`;
  const response = await fetch(endpoint, {
    headers: {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${supabaseConfig.anonKey}`,
    },
  });
  if (!response.ok) throw new Error(`Unable to fetch ${table}`);
  return response.json();
}

async function loadCourses() {
  try {
    const [remoteCategories, remoteCourses] = await Promise.all([
      fetchSupabaseTable('categories', 'select=id,name,slug&order=name.asc'),
      fetchSupabaseTable('courses', 'select=id,slug,title,description,instructor,duration,difficulty,price,thumbnail,outcomes,categories(name)&order=created_at.desc'),
    ]);

    if (remoteCourses?.length) {
      categories = remoteCategories || [];
      courses = remoteCourses.map(mapSupabaseCourse);
    } else {
      const response = await fetch('./courses.json');
      if (response.ok) courses = await response.json();
    }
  } catch (error) {
    console.warn('Using bundled course data because the remote course store is unavailable.', error);
    courses = fallbackCourses;
  }
  loadAdminState();
  renderCourseFilters();
  renderCourses();
  handleCourseRoute();
}

const adminStorageKey = 'tech-learning-admin-unlocked';
const adminCoursesKey = 'tech-learning-admin-courses';
const adminEnrollmentsKey = 'tech-learning-admin-enrollments';
const adminPasscode = window.TECH_LEARNING_ADMIN_PASSCODE || 'admin123';
const adminSection = document.querySelector('#admin');
const adminLock = document.querySelector('#admin-lock');
const adminPanel = document.querySelector('#admin-panel');
const adminLoginForm = document.querySelector('#admin-login-form');
const adminLoginMessage = document.querySelector('#admin-login-message');
const adminCourseForm = document.querySelector('#admin-course-form');
const adminFormTitle = document.querySelector('#admin-form-title');
const adminCourseList = document.querySelector('#admin-course-list');
const adminEnrollmentForm = document.querySelector('#admin-enrollment-form');
const adminEnrollmentCourse = document.querySelector('#admin-enrollment-course');
const adminEnrollmentList = document.querySelector('#admin-enrollment-list');
const adminSaveMessage = document.querySelector('#admin-save-message');
let enrollments = [];

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `course-${Date.now()}`;
}

function renderThumbnail(thumbnail) {
  const value = thumbnail || '📚';
  if (/^(data:image\/|https?:\/\/|\.\/|\/)/.test(value)) {
    return `<img src="${escapeHtml(value)}" alt="" loading="lazy" />`;
  }
  return escapeHtml(value);
}

function persistAdminCourses() {
  localStorage.setItem(adminCoursesKey, JSON.stringify(courses));
}

function persistEnrollments() {
  localStorage.setItem(adminEnrollmentsKey, JSON.stringify(enrollments));
}

function loadAdminState() {
  const savedCourses = localStorage.getItem(adminCoursesKey);
  const savedEnrollments = localStorage.getItem(adminEnrollmentsKey);
  if (savedCourses) courses = JSON.parse(savedCourses);
  if (savedEnrollments) enrollments = JSON.parse(savedEnrollments);
}

function setAdminMessage(element, message) {
  if (!element) return;
  element.textContent = message;
}

function isAdminUnlocked() {
  return sessionStorage.getItem(adminStorageKey) === 'true';
}

function setAdminVisibility() {
  const unlocked = isAdminUnlocked();
  if (adminLock) adminLock.hidden = unlocked;
  if (adminPanel) adminPanel.hidden = !unlocked;
  if (unlocked) renderAdminDashboard();
}

function showAdminDashboard() {
  if (!adminSection) return;
  adminSection.hidden = false;
  document.querySelectorAll('main > section:not(#admin)').forEach((section) => { section.hidden = true; });
  setAdminVisibility();
  adminSection.scrollIntoView({ behavior: motionQuery.matches ? 'auto' : 'smooth', block: 'start' });
  observeRevealElements(adminSection);
  enableRipple(adminSection);
}

function hideAdminDashboard() {
  if (adminSection) adminSection.hidden = true;
  document.querySelectorAll('main > section:not(#admin):not(#course-details)').forEach((section) => { section.hidden = false; });
}

function resetAdminForm() {
  adminCourseForm?.reset();
  document.querySelector('#admin-course-id').value = '';
  if (adminFormTitle) adminFormTitle.textContent = 'Add course';
  setAdminMessage(adminSaveMessage, '');
}

function getAdminFormCourse() {
  const title = document.querySelector('#admin-title-input').value.trim();
  const existingId = document.querySelector('#admin-course-id').value;
  return {
    id: existingId || slugify(title),
    category: document.querySelector('#admin-category-input').value.trim(),
    thumbnail: document.querySelector('#admin-thumbnail-input').value.trim() || '📚',
    title,
    description: document.querySelector('#admin-description-input').value.trim(),
    instructor: document.querySelector('#admin-instructor-input').value.trim(),
    duration: document.querySelector('#admin-duration-input').value.trim(),
    difficulty: document.querySelector('#admin-difficulty-input').value.trim(),
    price: document.querySelector('#admin-price-input').value.trim(),
    outcomes: document.querySelector('#admin-outcomes-input').value.split('\n').map((item) => item.trim()).filter(Boolean),
    modules: courses.find((item) => item.id === existingId)?.modules || [],
  };
}

function editAdminCourse(courseId) {
  const course = courses.find((item) => item.id === courseId);
  if (!course) return;
  document.querySelector('#admin-course-id').value = course.id;
  document.querySelector('#admin-title-input').value = course.title;
  document.querySelector('#admin-category-input').value = course.category;
  document.querySelector('#admin-instructor-input').value = course.instructor;
  document.querySelector('#admin-duration-input').value = course.duration;
  document.querySelector('#admin-difficulty-input').value = course.difficulty;
  document.querySelector('#admin-price-input').value = course.price;
  document.querySelector('#admin-description-input').value = course.description;
  document.querySelector('#admin-outcomes-input').value = course.outcomes.join('\n');
  document.querySelector('#admin-thumbnail-input').value = course.thumbnail;
  if (adminFormTitle) adminFormTitle.textContent = 'Edit course';
}

function deleteAdminCourse(courseId) {
  const course = courses.find((item) => item.id === courseId);
  if (!course || !window.confirm(`Delete ${course.title}?`)) return;
  courses = courses.filter((item) => item.id !== courseId);
  enrollments = enrollments.filter((item) => item.courseId !== courseId);
  persistAdminCourses();
  persistEnrollments();
  renderCourseFilters(); renderCourses(); renderAdminDashboard(); resetAdminForm();
}

function renderAdminDashboard() {
  if (adminCourseList) {
    adminCourseList.innerHTML = courses.map((course) => `<article class="admin-list-item"><span class="admin-thumb">${renderThumbnail(course.thumbnail)}</span><div><strong>${escapeHtml(course.title)}</strong><small>${escapeHtml(course.category)} • ${escapeHtml(course.instructor)}</small></div><button class="button secondary" type="button" data-edit-course="${escapeHtml(course.id)}">Edit</button><button class="button secondary" type="button" data-delete-course="${escapeHtml(course.id)}">Delete</button></article>`).join('');
    adminCourseList.querySelectorAll('[data-edit-course]').forEach((button) => button.addEventListener('click', () => editAdminCourse(button.dataset.editCourse)));
    adminCourseList.querySelectorAll('[data-delete-course]').forEach((button) => button.addEventListener('click', () => deleteAdminCourse(button.dataset.deleteCourse)));
  }
  if (adminEnrollmentCourse) adminEnrollmentCourse.innerHTML = courses.map((course) => `<option value="${escapeHtml(course.id)}">${escapeHtml(course.title)}</option>`).join('');
  if (adminEnrollmentList) {
    adminEnrollmentList.innerHTML = enrollments.length ? enrollments.map((enrollment) => {
      const course = courses.find((item) => item.id === enrollment.courseId);
      return `<article class="admin-list-item"><div><strong>${escapeHtml(enrollment.name || enrollment.email)}</strong><small>${escapeHtml(enrollment.email)} • ${escapeHtml(course?.title || 'Deleted course')}</small></div><span class="course-price">${escapeHtml(enrollment.status)}</span><button class="button secondary" type="button" data-remove-enrollment="${escapeHtml(enrollment.id)}">Remove</button></article>`;
    }).join('') : '<p class="empty-state">No enrollments yet.</p>';
    adminEnrollmentList.querySelectorAll('[data-remove-enrollment]').forEach((button) => button.addEventListener('click', () => {
      enrollments = enrollments.filter((item) => item.id !== button.dataset.removeEnrollment);
      persistEnrollments(); renderAdminDashboard();
    }));
  }
  observeRevealElements(adminPanel || document);
  enableRipple(adminPanel || document);
}

adminLoginForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#admin-passcode');
  if (input.value !== adminPasscode) {
    setAdminMessage(adminLoginMessage, 'Invalid passcode.');
    return;
  }
  sessionStorage.setItem(adminStorageKey, 'true');
  input.value = '';
  setAdminMessage(adminLoginMessage, 'Dashboard unlocked.');
  setAdminVisibility();
});

document.querySelector('#admin-logout')?.addEventListener('click', () => {
  sessionStorage.removeItem(adminStorageKey);
  setAdminVisibility();
});

document.querySelector('#admin-add-course')?.addEventListener('click', resetAdminForm);
document.querySelector('#admin-reset-form')?.addEventListener('click', resetAdminForm);

document.querySelector('#admin-thumbnail-file')?.addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => { document.querySelector('#admin-thumbnail-input').value = reader.result; });
  reader.readAsDataURL(file);
});

adminCourseForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const course = getAdminFormCourse();
  const existingIndex = courses.findIndex((item) => item.id === course.id);
  if (existingIndex >= 0) courses[existingIndex] = course;
  else courses.unshift(course);
  persistAdminCourses();
  renderCourseFilters(); renderCourses(); renderAdminDashboard(); resetAdminForm();
  setAdminMessage(adminSaveMessage, 'Course saved locally.');
});

adminEnrollmentForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  enrollments.unshift({
    id: `enrollment-${Date.now()}`,
    courseId: adminEnrollmentCourse.value,
    name: document.querySelector('#admin-learner-name').value.trim(),
    email: document.querySelector('#admin-learner-email').value.trim(),
    status: document.querySelector('#admin-enrollment-status').value,
  });
  persistEnrollments();
  adminEnrollmentForm.reset();
  renderAdminDashboard();
});


courseSearch?.addEventListener('input', renderCourses);
window.addEventListener('hashchange', handleCourseRoute);
loadCourses();
