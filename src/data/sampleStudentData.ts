/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentCVData } from '../types/studentCv';

export const OBJECTIVE_PRESETS = [
  {
    field: 'Computer Science & Software',
    text: 'Motivated final-year Computer Science undergraduate with hands-on coursework experience in web development and data structures. Eager to contribute foundational programming skills, team collaboration, and strong problem-solving abilities to an entry-level software engineering internship.',
  },
  {
    field: 'Business & Marketing',
    text: 'Ambitious Business Administration student with strong communication, digital marketing, and data analysis fundamentals. Seeking an entry-level marketing or business development internship to apply classroom insights to real-world customer acquisition and growth initiatives.',
  },
  {
    field: 'Engineering (General)',
    text: 'Dedicated engineering student with strong analytical, CAD design, and project planning capabilities. Passionate about learning industry workflows, safety standards, and practical problem-solving in a fast-paced engineering team environment.',
  },
  {
    field: 'Fresh Graduate (General / Beginner)',
    text: 'Enthusiastic and adaptable fresh graduate with a solid academic foundation, quick learning aptitude, and proven leadership in student clubs. Looking to launch a professional career where I can support organizational goals while developing industry-relevant competencies.',
  },
  {
    field: 'Finance & Accounting',
    text: 'Detail-oriented finance student proficient in financial modeling, Excel spreadsheets, and quantitative analysis. Seeking an accounting or financial analyst internship to assist with reporting, budget audits, and financial research.',
  },
];

export const sampleStudentCV: StudentCVData = {
  id: 'student_cv_sample_01',
  title: 'My College Student CV',
  updatedAt: new Date().toISOString(),
  templateId: 'student-modern',
  personal: {
    fullName: 'Tanvir Ahmed',
    photoUrl: '',
    email: 'tanvir.ahmed.cs@gmail.com',
    phone: '+880 1712-345678',
    city: 'Dhaka',
    country: 'Bangladesh',
    website: 'https://tanvir-portfolio.dev',
    linkedin: 'https://linkedin.com/in/tanvir-ahmed-dev',
    github: 'https://github.com/tanvir-cs',
  },
  objective:
    'Dedicated final-year Computer Science undergraduate with solid fundamentals in JavaScript, Python, and modern web application development. Seeking an entry-level software engineering or frontend development internship to contribute to innovative projects and expand practical industry expertise.',
  education: [
    {
      id: 'edu_1',
      institution: 'University of Dhaka',
      degree: 'Bachelor of Science (B.Sc.)',
      department: 'Computer Science and Engineering',
      currentYearSemester: 'Final Year (8th Semester)',
      gpa: '3.82 / 4.00',
      startYear: '2021',
      graduationYear: '2025 (Expected)',
    },
    {
      id: 'edu_2',
      institution: 'Dhaka City College',
      degree: 'Higher Secondary Certificate (HSC)',
      department: 'Science Group',
      currentYearSemester: '',
      gpa: 'GPA 5.00 / 5.00',
      startYear: '2018',
      graduationYear: '2020',
    },
  ],
  skills: {
    technical: ['Python', 'JavaScript (ES6+)', 'React.js', 'HTML5 & CSS3', 'Tailwind CSS', 'SQL (PostgreSQL)', 'Git & GitHub'],
    computer: ['Visual Studio Code', 'MS Excel (VLOOKUP, Pivot Tables)', 'Canva', 'Figma (Basic UI Wireframing)', 'Linux / Bash'],
    communication: ['Team Collaboration', 'Technical Presentation', 'Active Listening', 'Report Writing'],
    other: ['Problem-Solving', 'Fast Learner', 'Time Management', 'Attention to Detail'],
  },
  projects: [
    {
      id: 'proj_1',
      name: 'Campus Blood Donation & Emergency Finder',
      description: 'Built a responsive web portal allowing campus students to quickly find nearby voluntary blood donors with real-time blood group filtering.',
      technologies: 'React, Node.js, Express, MongoDB, Tailwind CSS',
      projectUrl: 'https://blood-finder-campus.vercel.app',
      githubUrl: 'https://github.com/tanvir-cs/blood-donor-portal',
    },
    {
      id: 'proj_2',
      name: 'Student Expense & Budget Tracker',
      description: 'Designed a lightweight financial tracking web tool with category breakdowns, monthly spending graphs, and local browser storage.',
      technologies: 'JavaScript, Chart.js, HTML5, LocalStorage',
      projectUrl: '',
      githubUrl: 'https://github.com/tanvir-cs/expense-tracker',
    },
  ],
  experience: [
    {
      id: 'exp_1',
      jobTitle: 'Web Development Intern',
      company: 'InnovateTech Solutions',
      duration: 'June 2024 – August 2024 (3 Months)',
      responsibilities: [
        'Collaborated with senior developers to create 5+ responsive landing pages using React and Tailwind CSS.',
        'Assisted in fixing cross-browser styling issues and optimizing mobile viewport responsiveness.',
        'Participated in weekly sprint reviews and team code reviews via GitHub pull requests.',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'Responsive Web Design Certification',
      organization: 'freeCodeCamp',
      link: 'https://freecodecamp.org/certification/tanvir/responsive-web-design',
      year: '2023',
    },
    {
      id: 'cert_2',
      name: 'Python for Beginners & Data Structures',
      organization: 'Coursera (University of Michigan)',
      link: 'https://coursera.org/verify/demo-id',
      year: '2024',
    },
  ],
  extracurricular: [
    {
      id: 'eca_1',
      title: 'General Secretary – DU Computer Club',
      category: 'Leadership Activities',
      description: 'Coordinated campus programming contests, hosted technical workshops for 150+ freshman students, and managed club sponsorships.',
    },
    {
      id: 'eca_2',
      title: 'Volunteer – Red Crescent Youth Blood Camp',
      category: 'Volunteering',
      description: 'Helped organize annual 2-day donation camp registering over 300+ student donors across university faculties.',
    },
  ],
  languages: [
    { id: 'lang_1', name: 'English', proficiency: 'Professional' },
    { id: 'lang_2', name: 'Bengali', proficiency: 'Native' },
  ],
  showReferences: false,
  references: [
    {
      id: 'ref_1',
      name: 'Dr. Mohammad Rafiqul Islam',
      designation: 'Associate Professor, Dept. of CSE',
      institution: 'University of Dhaka',
      email: 'rafiqul.cse@du.ac.bd',
      phone: '+880 2-9661900',
    },
  ],
  customization: {
    accentColor: '#1d4ed8',
    fontFamily: 'modern',
    fontSize: 'base',
  },
};

export const emptyStudentCVData: StudentCVData = {
  id: 'student_cv_blank',
  title: 'My Student CV',
  updatedAt: new Date().toISOString(),
  templateId: 'student-simple',
  personal: {
    fullName: '',
    photoUrl: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    website: '',
    linkedin: '',
    github: '',
  },
  objective: '',
  education: [
    {
      id: 'edu_blank_1',
      institution: '',
      degree: '',
      department: '',
      currentYearSemester: '',
      gpa: '',
      startYear: '',
      graduationYear: '',
    },
  ],
  skills: {
    technical: [],
    computer: [],
    communication: [],
    other: [],
  },
  projects: [],
  experience: [],
  certifications: [],
  extracurricular: [],
  languages: [
    { id: 'lang_blank_1', name: 'English', proficiency: 'Professional' },
  ],
  showReferences: false,
  references: [],
  customization: {
    accentColor: '#1d4ed8',
    fontFamily: 'modern',
    fontSize: 'base',
  },
};
