// ─────────────────────────────────────────────────────────────
//  ALL PORTFOLIO CONTENT LIVES HERE.
//  Edit this file to change text, links, projects, skills, etc.
//  Anything marked "TODO" is placeholder content to replace.
// ─────────────────────────────────────────────────────────────

const devicon = (name, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${name}/${name}-${variant}.svg`
const simpleIcon = (slug) => `https://cdn.simpleicons.org/${slug}`

export const profile = {
  name: 'Sanskruti Kale',
  shortName: 'Sanskruti',
  roles: ['Full Stack Developer', 'AI / ML Enthusiast', 'Problem Solver'], // TODO
  tagline:
    'I build clean, functional web applications that solve real-world problems. Let’s build something amazing together.', // TODO
  avatar: '/images/avatar.svg', // TODO: put your photo in public/images and update the path
  resume: '/resume.pdf', // TODO: add your resume as public/resume.pdf
  meetingLink: 'https://calendly.com/your-handle', // TODO
  email: 'your.email@example.com', // TODO
  phone: '+91 00000 00000', // TODO
  location: 'City, State', // TODO
}

export const about = {
  // "Show Original" toggles between these two images
  illustration: '/images/avatar.svg', // TODO: avatar / illustrated version
  photo: '/images/avatar.svg', // TODO: real photo
  greetings: ["Hey, I'm Sanskruti", 'Developer', 'Lifelong Learner'], // TODO
  paragraphs: [
    'TODO: Introduce yourself here — who you are, what you study or work on, and what excites you about technology.',
    'TODO: Talk about your journey, what you specialise in, what you are currently learning, and what kind of opportunities you are looking for.',
  ],
}

// Infinite scrolling strip under "About Me"
export const techStack = [
  { name: 'JavaScript', icon: devicon('javascript') },
  { name: 'TypeScript', icon: devicon('typescript') },
  { name: 'Python', icon: devicon('python') },
  { name: 'Java', icon: devicon('java') },
  { name: 'React', icon: devicon('react') },
  { name: 'Node.js', icon: devicon('nodejs') },
  { name: 'Express', icon: devicon('express') },
  { name: 'MongoDB', icon: devicon('mongodb') },
  { name: 'MySQL', icon: devicon('mysql') },
  { name: 'PostgreSQL', icon: devicon('postgresql') },
  { name: 'Tailwind CSS', icon: devicon('tailwindcss') },
  { name: 'Git', icon: devicon('git') },
  { name: 'Docker', icon: devicon('docker') },
  { name: 'Figma', icon: devicon('figma') },
]

// Skill cards. `level` (0–100) shows as a tooltip on hover.
export const skillCategories = [
  {
    title: 'Frontend',
    glow: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'React', icon: devicon('react'), level: 80 },
      { name: 'JavaScript', icon: devicon('javascript'), level: 80 },
      { name: 'HTML', icon: devicon('html5'), level: 90 },
      { name: 'CSS', icon: devicon('css3'), level: 85 },
      { name: 'Tailwind', icon: devicon('tailwindcss'), level: 80 },
    ],
  },
  {
    title: 'Backend',
    glow: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Node.js', icon: devicon('nodejs'), level: 70 },
      { name: 'Express', icon: devicon('express'), level: 70 },
      { name: 'Python', icon: devicon('python'), level: 75 },
      { name: 'MongoDB', icon: devicon('mongodb'), level: 70 },
      { name: 'MySQL', icon: devicon('mysql'), level: 70 },
    ],
  },
  {
    title: 'Design',
    glow: 'from-brand-500 to-glow-500',
    skills: [
      { name: 'Figma', icon: devicon('figma'), level: 70 },
      { name: 'Canva', icon: devicon('canva'), level: 75 },
    ],
  },
  {
    title: 'Tools',
    glow: 'from-orange-500 to-red-500',
    skills: [
      { name: 'Git', icon: devicon('git'), level: 80 },
      { name: 'GitHub', icon: devicon('github'), level: 80 },
      { name: 'VS Code', icon: devicon('vscode'), level: 85 },
      { name: 'Docker', icon: devicon('docker'), level: 50 },
    ],
  },
]

// Project filter tabs
export const projectCategories = [
  { id: 'freelance', label: 'Freelancing Project', active: 'from-brand-600 to-glow-600' },
  { id: 'academic', label: 'Academic Project', active: 'from-glow-600 to-glow-600' },
  { id: 'opensource', label: 'Open Source Contribution', active: 'from-green-600 to-emerald-600' },
]

export const projects = [
  {
    category: 'freelance',
    title: 'Project One', // TODO
    description: 'Short description of what this project does and the problem it solves.',
    image: '/images/project-placeholder.svg',
    tags: ['React', 'Node.js', 'MongoDB'],
    live: '#',
    github: '#',
    featured: true,
  },
  {
    category: 'freelance',
    title: 'Project Two',
    description: 'Short description of what this project does and the problem it solves.',
    image: '/images/project-placeholder.svg',
    tags: ['Next.js', 'Tailwind'],
    live: '#',
    github: '#',
  },
  {
    category: 'academic',
    title: 'Academic Project One',
    description: 'Short description of what this project does and the problem it solves.',
    image: '/images/project-placeholder.svg',
    tags: ['Python', 'Machine Learning'],
    live: '',
    github: '#',
    featured: true,
  },
  {
    category: 'academic',
    title: 'Academic Project Two',
    description: 'Short description of what this project does and the problem it solves.',
    image: '/images/project-placeholder.svg',
    tags: ['Java', 'MySQL'],
    live: '',
    github: '#',
  },
  {
    category: 'opensource',
    title: 'Open Source Contribution',
    description: 'Which repository you contributed to and what you added or fixed.',
    image: '/images/project-placeholder.svg',
    tags: ['Open Source', 'GitHub'],
    live: '',
    github: '#',
  },
]

export const experience = [
  {
    title: 'Role / Position', // TODO
    org: 'Company Name',
    period: 'Mon YYYY – Mon YYYY',
    location: 'City, India',
    points: [
      'What you built or owned in this role.',
      'An impact or result, ideally with a number.',
      'Technologies you used.',
    ],
  },
  {
    title: 'Intern',
    org: 'Company Name',
    period: 'Mon YYYY – Mon YYYY',
    location: 'Remote',
    points: ['What you worked on.', 'What you learned or delivered.'],
  },
]

export const education = [
  {
    title: 'Degree; Branch', // TODO
    org: 'College / University Name',
    period: 'YYYY – YYYY',
    location: 'City, India',
    points: ['University: Name', 'CGPA: 0.0/10', 'Relevant coursework or highlights.'],
  },
  {
    title: 'Higher Secondary (HSC)',
    org: 'School / Junior College',
    period: 'YYYY – YYYY',
    location: 'City, India',
    points: ['Board: Name', 'Percentage: 00%'],
  },
]

// Achievements section has a toggle between these two lists
export const achievements = [
  {
    title: 'Hackathon / Competition Name', // TODO
    description: 'What you achieved — rank, award, or selection — and what you built.',
    tags: ['Hackathon'],
    link: '',
  },
  {
    title: 'Coding Platform Badge',
    description: 'E.g. 5-star on HackerRank, 300+ problems solved on LeetCode.',
    tags: ['Problem Solving'],
    link: '',
  },
]

export const certifications = [
  {
    title: 'Certification Name', // TODO
    description: 'Issuing organisation and what the certification covers.',
    tags: ['Certification'],
    link: '#', // credential URL
  },
  {
    title: 'Another Certification',
    description: 'Issuing organisation and what the certification covers.',
    tags: ['Certification'],
    link: '#',
  },
]

// Social handle cards + "Follow Me" icons in Contact. TODO: update URLs
export const socials = [
  { name: 'GitHub', url: 'https://github.com/kalesanskruti', icon: devicon('github'), follow: true },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/your-handle', icon: devicon('linkedin', 'plain'), follow: true },
  { name: 'LeetCode', url: 'https://leetcode.com/your-handle', icon: simpleIcon('leetcode') },
  { name: 'HackerRank', url: 'https://www.hackerrank.com/your-handle', icon: simpleIcon('hackerrank') },
  { name: 'X (Twitter)', url: 'https://x.com/your-handle', icon: simpleIcon('x'), follow: true },
  { name: 'Discord', url: 'https://discord.com/users/your-id', icon: simpleIcon('discord') },
]

export const contact = {
  heading: 'Get In Touch',
  subheading: 'Have a project or opportunity in mind? Let’s discuss how we can work together.',
  blurb:
    "I'm always open to discussing new opportunities and interesting projects. Feel free to reach out if you have any questions or just want to say hello!",
  // Create a free form at https://formspree.io and paste its ID (e.g. "xyzabcd").
  // Leave empty to fall back to opening the visitor's email app.
  formspreeId: '',
}

export const footer = {
  tagline: 'Creating beautiful, functional web experiences that make a difference.',
  // Static for now — can be wired to a real counter later.
  stats: [
    { label: 'Projects', value: projects.length },
    { label: 'Certifications', value: certifications.length },
    { label: 'Achievements', value: achievements.length },
  ],
}

// Floating chat assistant (answers from this file — no API needed)
export const chat = {
  botName: 'Sanskruti AI',
  welcome: "Hi! I'm Sanskruti's assistant. Ask me about skills, projects, experience, education or how to get in touch.",
  quickReplies: ['Skills', 'Projects', 'Experience', 'Education', 'Contact', 'Resume'],
}

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'experience', label: 'Experience' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
]
