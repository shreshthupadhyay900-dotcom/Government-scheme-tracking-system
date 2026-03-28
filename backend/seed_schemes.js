const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Scheme = require('./models/Scheme');

const schemes = [
  // ============ CENTRAL SCHEMES ============
  {
    name: "PM Kisan Samman Nidhi",
    category: "agriculture",
    description: "Provides income support of ₹6000 per year to all landholding farmer families to supplement their financial needs for procurement of various inputs.",
    eligibility: { minAge: 18, maxAge: 80, maxIncome: 200000, gender: "any", occupation: "Farmer", state: "All", category: "All" },
    benefits: "₹6,000 per year in 3 installments of ₹2,000 directly to bank account",
    requiredDocs: ["Aadhaar", "Bank Passbook", "Land Records", "Residence Proof"],
    isActive: true, priorityScore: 10, successRate: 82, avgProcessingTime: "21 days",
    tags: ["farmer", "income-support", "direct-benefit"], applicationMode: "online", deadline: "2027-03-31"
  },
  {
    name: "Ayushman Bharat PM-JAY",
    category: "health",
    description: "Provides health cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization. Covers 50 crore+ beneficiaries.",
    eligibility: { minAge: 0, maxAge: 100, maxIncome: 300000, gender: "any", occupation: "Any", state: "All", category: "All" },
    benefits: "₹5 lakh health insurance coverage per family per year, cashless treatment at empaneled hospitals",
    requiredDocs: ["Aadhaar", "Ration Card", "Income Certificate"],
    isActive: true, priorityScore: 10, successRate: 88, avgProcessingTime: "7 days",
    tags: ["health", "insurance", "hospitalization"], applicationMode: "online", deadline: "2028-03-31"
  },
  {
    name: "PM Awas Yojana (Urban)",
    category: "housing",
    description: "Provides affordable housing to homeless and slum dwellers in urban areas through credit-linked subsidy and in-situ slum redevelopment.",
    eligibility: { minAge: 18, maxAge: 70, maxIncome: 600000, gender: "any", occupation: "Any", state: "All", category: "All" },
    benefits: "Subsidy up to ₹2.67 lakh on home loans and direct housing unit allocation",
    requiredDocs: ["Aadhaar", "Income Certificate", "Bank Passbook", "Residence Proof"],
    isActive: true, priorityScore: 9, successRate: 74, avgProcessingTime: "45 days",
    tags: ["housing", "subsidy", "loan"], applicationMode: "online", deadline: "2026-12-31"
  },
  {
    name: "PM Awas Yojana (Gramin)",
    category: "housing",
    description: "Provides pucca housing to homeless and kutcha house dwellers in rural areas with financial assistance.",
    eligibility: { minAge: 18, maxAge: 75, maxIncome: 300000, gender: "any", occupation: "Any", state: "All", category: "Any" },
    benefits: "₹1.20 lakh in plains, ₹1.30 lakh in hills/NE states as construction assistance",
    requiredDocs: ["Aadhaar", "BPL Card", "Bank Passbook", "Land Records"],
    isActive: true, priorityScore: 9, successRate: 79, avgProcessingTime: "60 days",
    tags: ["housing", "rural", "subsidy"], applicationMode: "both", deadline: "2026-12-31"
  },
  {
    name: "Pradhan Mantri Mudra Yojana",
    category: "startup",
    description: "Provides micro-finance loans to non-corporate, non-farm small/micro enterprises through MUDRA loans—Shishu (₹50K), Kishor (₹5L), Tarun (₹10L).",
    eligibility: { minAge: 18, maxAge: 60, maxIncome: 1500000, gender: "any", occupation: "Entrepreneur", state: "All", category: "All" },
    benefits: "Collateral-free business loans up to ₹10 lakh at low interest rates",
    requiredDocs: ["Aadhaar", "Bank Passbook", "Business Plan", "Residence Proof"],
    isActive: true, priorityScore: 8, successRate: 70, avgProcessingTime: "20 days",
    tags: ["loan", "startup", "business", "micro-finance"], applicationMode: "both", deadline: "2027-03-31"
  },
  {
    name: "Startup India Seed Fund",
    category: "startup",
    description: "Financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.",
    eligibility: { minAge: 18, maxAge: 45, maxIncome: 5000000, gender: "any", occupation: "Entrepreneur", state: "All", category: "All" },
    benefits: "Grant up to ₹20 lakh for PoC; Investment up to ₹50 lakh for commercialization",
    requiredDocs: ["Aadhaar", "Business Plan", "Bank Passbook", "DPIIT Recognition Certificate"],
    isActive: true, priorityScore: 8, successRate: 55, avgProcessingTime: "45 days",
    tags: ["startup", "grant", "entrepreneurship"], applicationMode: "online", deadline: "2027-03-31"
  },
  {
    name: "National Scholarship Portal - Central Sector Scheme",
    category: "education",
    description: "Scholarship for meritorious students from low-income families who are pursuing higher education (post 12th and post-graduation).",
    eligibility: { minAge: 17, maxAge: 30, maxIncome: 800000, gender: "any", occupation: "Student", state: "All", category: "All" },
    benefits: "₹10,000 to ₹20,000 per year depending on course level",
    requiredDocs: ["Aadhaar", "Marksheet", "Income Certificate", "Bank Passbook"],
    isActive: true, priorityScore: 9, successRate: 75, avgProcessingTime: "30 days",
    tags: ["scholarship", "education", "merit-based"], applicationMode: "online", deadline: "2026-11-30"
  },
  {
    name: "Post-Matric Scholarship for SC Students",
    category: "education",
    description: "Financial assistance to SC students studying at post-matriculation (Class XI onwards) level to enable them to complete their education.",
    eligibility: { minAge: 15, maxAge: 30, maxIncome: 250000, gender: "any", occupation: "Student", state: "All", category: "SC" },
    benefits: "Full course fees reimbursement + maintenance allowance of ₹190 to ₹550 per month",
    requiredDocs: ["Aadhaar", "Caste Certificate", "Marksheet", "Income Certificate", "Bank Passbook"],
    isActive: true, priorityScore: 8, successRate: 78, avgProcessingTime: "25 days",
    tags: ["scholarship", "SC", "education"], applicationMode: "online", deadline: "2026-11-30"
  },
  {
    name: "PM Skill Development Scheme (PMKVY)",
    category: "skill",
    description: "Enables large number of Indian youth to take up industry-relevant skill training that will help them to secure a better livelihood.",
    eligibility: { minAge: 15, maxAge: 45, maxIncome: 500000, gender: "any", occupation: "Any", state: "All", category: "All" },
    benefits: "Free skill training + ₹8,000 reward on certification + job placement assistance",
    requiredDocs: ["Aadhaar", "Marksheet", "Bank Passbook"],
    isActive: true, priorityScore: 8, successRate: 68, avgProcessingTime: "15 days",
    tags: ["skill", "training", "employment"], applicationMode: "both", deadline: "2026-12-31"
  },
  {
    name: "PM Fasal Bima Yojana",
    category: "insurance",
    description: "Crop insurance scheme that provides financial support to farmers suffering crop loss/damage due to unforeseen events like floods, drought, pests.",
    eligibility: { minAge: 18, maxAge: 75, maxIncome: 500000, gender: "any", occupation: "Farmer", state: "All", category: "All" },
    benefits: "Insurance coverage for crop losses; premium as low as 2% for Kharif and 1.5% for Rabi crops",
    requiredDocs: ["Aadhaar", "Land Records", "Bank Passbook", "Sowing Certificate"],
    isActive: true, priorityScore: 9, successRate: 72, avgProcessingTime: "30 days",
    tags: ["insurance", "farmer", "crop"], applicationMode: "both", deadline: "2026-07-31"
  },
  {
    name: "Atal Pension Yojana",
    category: "pension",
    description: "Guaranteed pension scheme focused on unorganized sector workers. Guarantees minimum pension of ₹1000-₹5000 per month after age 60.",
    eligibility: { minAge: 18, maxAge: 40, maxIncome: 1000000, gender: "any", occupation: "Any", state: "All", category: "All" },
    benefits: "Guaranteed monthly pension of ₹1,000–₹5,000 after age 60; Government co-contributes 50% for 5 years",
    requiredDocs: ["Aadhaar", "Bank Passbook", "Mobile Number"],
    isActive: true, priorityScore: 7, successRate: 85, avgProcessingTime: "7 days",
    tags: ["pension", "retirement", "unorganized-sector"], applicationMode: "both", deadline: "2027-03-31"
  },
  {
    name: "Beti Bachao Beti Padhao",
    category: "women",
    description: "Aims to address declining child sex ratio, promote the welfare and education of girl children across India.",
    eligibility: { minAge: 0, maxAge: 18, maxIncome: 800000, gender: "female", occupation: "Student", state: "All", category: "All" },
    benefits: "Education benefits, conditional cash transfers, and community mobilization support for girl children",
    requiredDocs: ["Aadhaar", "Birth Certificate", "Bank Passbook", "School Enrollment Proof"],
    isActive: true, priorityScore: 8, successRate: 70, avgProcessingTime: "21 days",
    tags: ["women", "girl-child", "education"], applicationMode: "both", deadline: "2027-03-31"
  },
  {
    name: "PM Matru Vandana Yojana",
    category: "women",
    description: "Maternity benefit program that provides partial wage compensation to pregnant and lactating women for the first living child.",
    eligibility: { minAge: 18, maxAge: 45, maxIncome: 500000, gender: "female", occupation: "Any", state: "All", category: "All" },
    benefits: "₹5,000 cash incentive in 3 installments for pregnant women and nursing mothers",
    requiredDocs: ["Aadhaar", "Bank Passbook", "MCP Card", "KYC Documents"],
    isActive: true, priorityScore: 8, successRate: 80, avgProcessingTime: "14 days",
    tags: ["women", "maternity", "cash-transfer"], applicationMode: "both", deadline: "2027-03-31"
  },
  {
    name: "ICCR International Cultural Exchange Scholarship",
    category: "education",
    description: "Indian Council for Cultural Relations offers scholarships to international students from 160+ countries for studying in India across all disciplines.",
    eligibility: { minAge: 18, maxAge: 35, maxIncome: 1000000, gender: "any", occupation: "Student", state: "All", category: "All" },
    benefits: "Full tuition waiver + monthly stipend of ₹15,000–₹30,000 + accommodation allowance",
    requiredDocs: ["Aadhaar", "Marksheet", "Language Test Certificate", "Bank Passbook"],
    isActive: true, priorityScore: 7, successRate: 45, avgProcessingTime: "60 days",
    tags: ["international", "scholarship", "cultural"], applicationMode: "online", deadline: "2026-08-31"
  },
  {
    name: "Pradhan Mantri Rozgar Protsahan Yojana",
    category: "employment",
    description: "Incentivizes employers for job creation by the government paying the full employers' EPF contribution (8.33%) for new employees for 3 years.",
    eligibility: { minAge: 18, maxAge: 35, maxIncome: 300000, gender: "any", occupation: "Any", state: "All", category: "All" },
    benefits: "Government pays 8.33% EPF contribution for new employees earning up to ₹15,000/month",
    requiredDocs: ["Aadhaar", "EPFO Registration", "Bank Passbook"],
    isActive: true, priorityScore: 7, successRate: 65, avgProcessingTime: "30 days",
    tags: ["employment", "EPF", "wage-subsidy"], applicationMode: "online", deadline: "2026-12-31"
  },
  {
    name: "PM SVANidhi Scheme",
    category: "employment",
    description: "Provides affordable working capital loans to street vendors to resume their livelihoods post COVID-19 lockdowns.",
    eligibility: { minAge: 18, maxAge: 60, maxIncome: 300000, gender: "any", occupation: "Worker", state: "All", category: "All" },
    benefits: "Working capital loan of ₹10,000 (1st), ₹20,000 (2nd), ₹50,000 (3rd tranche) at subsidized rates",
    requiredDocs: ["Aadhaar", "Bank Passbook", "Vendor Certificate"],
    isActive: true, priorityScore: 7, successRate: 75, avgProcessingTime: "15 days",
    tags: ["loan", "street-vendor", "self-employment"], applicationMode: "both", deadline: "2026-12-31"
  },
  {
    name: "Sukanya Samriddhi Yojana",
    category: "women",
    description: "Small deposit scheme for the girl child, opened by parents/guardians in the name of a girl child aged up to 10 years, with attractive interest rate.",
    eligibility: { minAge: 0, maxAge: 10, maxIncome: 1000000, gender: "female", occupation: "Any", state: "All", category: "All" },
    benefits: "High interest rate (8.2% p.a.), tax benefits under Section 80C, guaranteed returns",
    requiredDocs: ["Aadhaar", "Birth Certificate", "Bank Passbook"],
    isActive: true, priorityScore: 8, successRate: 90, avgProcessingTime: "3 days",
    tags: ["girl-child", "savings", "tax-benefit"], applicationMode: "both", deadline: "2027-03-31"
  },
  {
    name: "PM Garib Kalyan Anna Yojana",
    category: "employment",
    description: "Provides free foodgrains (5 kg rice/wheat per person) to beneficiaries covered under National Food Security Act.",
    eligibility: { minAge: 0, maxAge: 100, maxIncome: 200000, gender: "any", occupation: "Any", state: "All", category: "All" },
    benefits: "5 kg free foodgrain per person per month under NFSA",
    requiredDocs: ["Aadhaar", "Ration Card"],
    isActive: true, priorityScore: 8, successRate: 92, avgProcessingTime: "1 day",
    tags: ["food", "BPL", "ration"], applicationMode: "offline", deadline: "2027-12-31"
  },
  {
    name: "PM Jeevan Jyoti Bima Yojana",
    category: "insurance",
    description: "Life insurance scheme covering death due to any reason. Provides ₹2 lakh life cover at annual premium of just ₹436.",
    eligibility: { minAge: 18, maxAge: 50, maxIncome: 1000000, gender: "any", occupation: "Any", state: "All", category: "All" },
    benefits: "₹2 lakh life insurance cover at annual premium of ₹436 only",
    requiredDocs: ["Aadhaar", "Bank Passbook"],
    isActive: true, priorityScore: 8, successRate: 88, avgProcessingTime: "7 days",
    tags: ["insurance", "life-cover", "low-premium"], applicationMode: "both", deadline: "2027-03-31"
  },
  {
    name: "PM Suraksha Bima Yojana",
    category: "insurance",
    description: "Accidental insurance scheme offering ₹2 lakh for accidental death or total disability at just ₹20 per year premium.",
    eligibility: { minAge: 18, maxAge: 70, maxIncome: 1000000, gender: "any", occupation: "Any", state: "All", category: "All" },
    benefits: "₹2 lakh accidental death/total disability cover, ₹1 lakh partial disability at ₹20/year",
    requiredDocs: ["Aadhaar", "Bank Passbook"],
    isActive: true, priorityScore: 8, successRate: 87, avgProcessingTime: "5 days",
    tags: ["insurance", "accident", "low-premium"], applicationMode: "both", deadline: "2027-03-31"
  },

  // ============ EDUCATION SCHEMES ============
  {
    name: "National Means-cum-Merit Scholarship",
    category: "education",
    description: "To arrest the dropout rate at Class VIII and encourage talented student from economically weaker sections to continue education till Class XII.",
    eligibility: { minAge: 13, maxAge: 16, maxIncome: 150000, gender: "any", occupation: "Student", state: "All", category: "All" },
    benefits: "₹12,000 per year scholarship for Class IX–XII students",
    requiredDocs: ["Aadhaar", "Marksheet", "Income Certificate", "Bank Passbook"],
    isActive: true, priorityScore: 8, successRate: 72, avgProcessingTime: "20 days",
    tags: ["scholarship", "merit", "secondary-school"], applicationMode: "online", deadline: "2026-11-30"
  },
  {
    name: "Commonwealth Scholarship for India",
    category: "education",
    description: "UK government-funded scholarships enabling talented Indians to study in the UK, offered for Masters and PhD programs.",
    eligibility: { minAge: 20, maxAge: 40, maxIncome: 800000, gender: "any", occupation: "Student", state: "All", category: "All" },
    benefits: "Airfare, tuition fees, monthly stipend of £1,236 for Masters and £1,347 for PhD",
    requiredDocs: ["Aadhaar", "Marksheet", "Bank Passbook", "English Proficiency Certificate"],
    isActive: true, priorityScore: 7, successRate: 30, avgProcessingTime: "90 days",
    tags: ["international", "scholarship", "UK", "postgraduate"], applicationMode: "online", deadline: "2026-12-31"
  },
  {
    name: "Fulbright-Nehru Scholarship",
    category: "education",
    description: "US-India joint scholarship program for Indians to pursue academic research, graduate study or teaching in the United States.",
    eligibility: { minAge: 22, maxAge: 45, maxIncome: 1500000, gender: "any", occupation: "Student", state: "All", category: "All" },
    benefits: "Full scholarship including travel, stipend, medical insurance, and tuition at US universities",
    requiredDocs: ["Aadhaar", "Marksheet", "Bank Passbook", "Reference Letters"],
    isActive: true, priorityScore: 7, successRate: 20, avgProcessingTime: "120 days",
    tags: ["international", "scholarship", "USA", "research"], applicationMode: "online", deadline: "2026-07-15"
  },
  {
    name: "OBC Pre-Matric Scholarship",
    category: "education",
    description: "Financial assistance to OBC students studying in Class I–X to prevent early dropout and encourage education.",
    eligibility: { minAge: 6, maxAge: 15, maxIncome: 100000, gender: "any", occupation: "Student", state: "All", category: "OBC" },
    benefits: "₹225 to ₹525 per month maintenance allowance + book/ad-hoc grants",
    requiredDocs: ["Aadhaar", "Caste Certificate", "Marksheet", "Bank Passbook", "Income Certificate"],
    isActive: true, priorityScore: 7, successRate: 74, avgProcessingTime: "20 days",
    tags: ["scholarship", "OBC", "primary-school"], applicationMode: "online", deadline: "2026-11-30"
  },

  // ============ WOMEN SCHEMES ============
  {
    name: "Mahila Shakti Kendra",
    category: "women",
    description: "Provides one-stop convergent services for empowering rural women with opportunities for skill development, employment, digital literacy.",
    eligibility: { minAge: 18, maxAge: 55, maxIncome: 300000, gender: "female", occupation: "Any", state: "All", category: "All" },
    benefits: "Free skill training, legal awareness, digital literacy, and employment linkages",
    requiredDocs: ["Aadhaar", "Income Certificate", "Residence Proof"],
    isActive: true, priorityScore: 7, successRate: 66, avgProcessingTime: "10 days",
    tags: ["women", "skill", "empowerment"], applicationMode: "offline", deadline: "2027-03-31"
  },
  {
    name: "PM Mahila Kisan Sashaktikaran Pariyojana",
    category: "women",
    description: "Sustainable agriculture practices-based program to improve the socioeconomic status of female farmers.",
    eligibility: { minAge: 18, maxAge: 60, maxIncome: 200000, gender: "female", occupation: "Farmer", state: "All", category: "All" },
    benefits: "Training, inputs support, and cluster-level support worth ₹15,000 per SHG",
    requiredDocs: ["Aadhaar", "Land Records", "Bank Passbook", "SHG Membership Card"],
    isActive: true, priorityScore: 7, successRate: 62, avgProcessingTime: "21 days",
    tags: ["women", "farmer", "SHG"], applicationMode: "offline", deadline: "2027-03-31"
  },

  // ============ STATE: MADHYA PRADESH ============
  {
    name: "MP Ladli Laxmi Yojana 2.0",
    category: "women",
    description: "Scheme for girl children of MP to encourage higher education by providing scholarship for college admission. Invests ₹1.43 lakh at birth.",
    eligibility: { minAge: 0, maxAge: 21, maxIncome: 300000, gender: "female", occupation: "Student", state: "Madhya Pradesh", category: "All" },
    benefits: "₹1.43 lakh investment at birth; scholarship of ₹6,000/semester in college; ₹1 lakh on Class XII completion",
    requiredDocs: ["Aadhaar", "Birth Certificate", "Income Certificate", "Bank Passbook"],
    isActive: true, priorityScore: 9, successRate: 75, avgProcessingTime: "30 days",
    tags: ["women", "girl-child", "scholarship", "MP"], applicationMode: "online", deadline: "2027-03-31"
  },
  {
    name: "MP Mukhyamantri Kisan Kalyan Yojana",
    category: "agriculture",
    description: "Madhya Pradesh state supplement to PM-KISAN providing additional ₹4,000 per year to farmers in 2 installments.",
    eligibility: { minAge: 18, maxAge: 80, maxIncome: 200000, gender: "any", occupation: "Farmer", state: "Madhya Pradesh", category: "All" },
    benefits: "Additional ₹4,000 per year in 2 equal installments of ₹2,000 (on top of PM-KISAN)",
    requiredDocs: ["Aadhaar", "Land Records", "Bank Passbook", "PM-KISAN registration"],
    isActive: true, priorityScore: 8, successRate: 80, avgProcessingTime: "14 days",
    tags: ["farmer", "MP", "direct-benefit"], applicationMode: "online", deadline: "2027-03-31"
  },
  {
    name: "MP Free Laptop Yojana",
    category: "education",
    description: "Free laptops provided to meritorious Class XII students who scored 85%+ in MP Board exams to encourage digital learning.",
    eligibility: { minAge: 15, maxAge: 22, maxIncome: 600000, gender: "any", occupation: "Student", state: "Madhya Pradesh", category: "All" },
    benefits: "Free laptop worth ₹25,000 + ₹25,000 cash prize for meritorious students",
    requiredDocs: ["Aadhaar", "Marksheet", "Income Certificate", "Bank Passbook"],
    isActive: true, priorityScore: 7, successRate: 65, avgProcessingTime: "30 days",
    tags: ["education", "laptop", "MP", "merit"], applicationMode: "online", deadline: "2026-10-31"
  },

  // ============ STATE: UTTAR PRADESH ============
  {
    name: "UP Mukhyamantri Abhyudaya Yojana",
    category: "education",
    description: "Free coaching for competitive exams (UPSC, JEE, NEET, etc.) to students of UP who cannot afford private coaching.",
    eligibility: { minAge: 16, maxAge: 30, maxIncome: 400000, gender: "any", occupation: "Student", state: "Uttar Pradesh", category: "All" },
    benefits: "Free coaching for competitive exams (UPSC/JEE/NEET/NDA etc.) at government centers",
    requiredDocs: ["Aadhaar", "Marksheet", "Income Certificate", "Residence Proof"],
    isActive: true, priorityScore: 8, successRate: 58, avgProcessingTime: "15 days",
    tags: ["education", "coaching", "competitive-exam", "UP"], applicationMode: "online", deadline: "2026-08-31"
  },
  {
    name: "UP Kanya Sumangala Yojana",
    category: "women",
    description: "Provides financial support at each stage of a girl child's development—birth, vaccination, school enrollment, and higher education.",
    eligibility: { minAge: 0, maxAge: 18, maxIncome: 300000, gender: "female", occupation: "Student", state: "Uttar Pradesh", category: "All" },
    benefits: "Total benefit of ₹15,000 in 6 stages from birth to higher education",
    requiredDocs: ["Aadhaar", "Birth Certificate", "Income Certificate", "Bank Passbook"],
    isActive: true, priorityScore: 8, successRate: 72, avgProcessingTime: "21 days",
    tags: ["women", "girl-child", "UP", "education"], applicationMode: "online", deadline: "2027-03-31"
  },
  {
    name: "UP Vishwakarma Shram Samman Yojana",
    category: "skill",
    description: "Provides free skill training and financial assistance to traditional craftsmen and artisans of UP.",
    eligibility: { minAge: 18, maxAge: 55, maxIncome: 300000, gender: "any", occupation: "Worker", state: "Uttar Pradesh", category: "All" },
    benefits: "6-day free training + tool kit worth ₹10,000 + loan up to ₹10 lakh at subsidized rates",
    requiredDocs: ["Aadhaar", "Caste Certificate", "Bank Passbook", "Residence Proof"],
    isActive: true, priorityScore: 7, successRate: 68, avgProcessingTime: "30 days",
    tags: ["artisan", "craft", "UP", "skill"], applicationMode: "online", deadline: "2026-12-31"
  },

  // ============ STATE: MAHARASHTRA ============
  {
    name: "Maharashtra Atal Saur Krishi Pump Yojana",
    category: "agriculture",
    description: "Solar pump scheme for farmers providing subsidized solar-powered water pumps to reduce electricity expenditure.",
    eligibility: { minAge: 18, maxAge: 70, maxIncome: 300000, gender: "any", occupation: "Farmer", state: "Maharashtra", category: "All" },
    benefits: "75–90% subsidy on solar pumps (3 HP to 7.5 HP capacity) for irrigation",
    requiredDocs: ["Aadhaar", "Land Records", "Bank Passbook", "Electricity Bill"],
    isActive: true, priorityScore: 7, successRate: 70, avgProcessingTime: "45 days",
    tags: ["farmer", "solar", "Maharashtra", "agriculture"], applicationMode: "online", deadline: "2026-09-30"
  },
  {
    name: "Maharashtra Annasaheb Patil Entrepreneurship Loan",
    category: "startup",
    description: "Loan and interest subsidy scheme for Maharashtra SC/ST/OBC/SBC entrepreneurs to start or expand their business.",
    eligibility: { minAge: 18, maxAge: 50, maxIncome: 800000, gender: "any", occupation: "Entrepreneur", state: "Maharashtra", category: "OBC" },
    benefits: "Loan up to ₹10 lakh with 6% interest subvention for OBC entrepreneurs",
    requiredDocs: ["Aadhaar", "Caste Certificate", "Business Plan", "Bank Passbook", "Income Certificate"],
    isActive: true, priorityScore: 7, successRate: 60, avgProcessingTime: "30 days",
    tags: ["startup", "OBC", "loan", "Maharashtra"], applicationMode: "online", deadline: "2026-12-31"
  },

  // ============ STATE: TAMIL NADU ============
  {
    name: "TN Chief Minister's Breakfast Scheme",
    category: "education",
    description: "Provides free nutritious breakfast to government school students (Class I–V) to improve nutrition levels and school attendance.",
    eligibility: { minAge: 5, maxAge: 12, maxIncome: 200000, gender: "any", occupation: "Student", state: "Tamil Nadu", category: "All" },
    benefits: "Free nutritious breakfast every school day for government school students",
    requiredDocs: ["Aadhaar", "School Enrollment Proof"],
    isActive: true, priorityScore: 7, successRate: 95, avgProcessingTime: "1 day",
    tags: ["nutrition", "school", "Tamil Nadu", "food"], applicationMode: "offline", deadline: "2027-03-31"
  },
  {
    name: "TN Kalaignar Magalir Urimai Thittam",
    category: "women",
    description: "Universal basic income scheme for all women heads of household in Tamil Nadu providing monthly cash transfer.",
    eligibility: { minAge: 21, maxAge: 70, maxIncome: 250000, gender: "female", occupation: "Any", state: "Tamil Nadu", category: "All" },
    benefits: "₹1,000 per month direct cash transfer to women heads of families",
    requiredDocs: ["Aadhaar", "Ration Card", "Bank Passbook"],
    isActive: true, priorityScore: 9, successRate: 85, avgProcessingTime: "14 days",
    tags: ["women", "income-support", "Tamil Nadu", "cash-transfer"], applicationMode: "online", deadline: "2027-03-31"
  },
  {
    name: "TN Moovalur Ramamirtham Ammaiyar Scholarship",
    category: "education",
    description: "Scholarship for first-generation girl graduates from economically backward families pursuing higher education.",
    eligibility: { minAge: 17, maxAge: 25, maxIncome: 72000, gender: "female", occupation: "Student", state: "Tamil Nadu", category: "All" },
    benefits: "₹1,000/month stipend + free hostel accommodation for eligible college students",
    requiredDocs: ["Aadhaar", "Marksheet", "Income Certificate", "Bank Passbook"],
    isActive: true, priorityScore: 7, successRate: 68, avgProcessingTime: "21 days",
    tags: ["scholarship", "women", "Tamil Nadu", "higher-education"], applicationMode: "online", deadline: "2026-11-30"
  },

  // ============ STATE: GUJARAT ============
  {
    name: "Gujarat Kisan Suryodaya Yojana",
    category: "agriculture",
    description: "Provides 3-phase electricity connection to agricultural consumers for daytime irrigation from 5 AM to 9 PM.",
    eligibility: { minAge: 18, maxAge: 70, maxIncome: 400000, gender: "any", occupation: "Farmer", state: "Gujarat", category: "All" },
    benefits: "Daytime 3-phase electricity for irrigation, reducing crop damage from nocturnal power cuts",
    requiredDocs: ["Aadhaar", "Land Records", "Electricity Connection Application"],
    isActive: true, priorityScore: 7, successRate: 78, avgProcessingTime: "30 days",
    tags: ["farmer", "electricity", "Gujarat", "agriculture"], applicationMode: "both", deadline: "2027-03-31"
  },
  {
    name: "Gujarat Atmanirbhar Scholarship",
    category: "education",
    description: "Scholarship for SC/ST/SEBC students of Gujarat pursuing professional courses in engineering, medical, law, etc.",
    eligibility: { minAge: 17, maxAge: 25, maxIncome: 150000, gender: "any", occupation: "Student", state: "Gujarat", category: "SC" },
    benefits: "Full fee reimbursement + ₹1,200/month stipend for professional course students",
    requiredDocs: ["Aadhaar", "Caste Certificate", "Marksheet", "Income Certificate", "Bank Passbook"],
    isActive: true, priorityScore: 7, successRate: 71, avgProcessingTime: "25 days",
    tags: ["scholarship", "SC", "professional", "Gujarat"], applicationMode: "online", deadline: "2026-11-30"
  },

  // ============ STATE: RAJASTHAN ============
  {
    name: "Rajasthan Palanhar Yojana",
    category: "women",
    description: "Provides financial assistance to relatives/neighbors raising orphaned or destitute children in Rajasthan.",
    eligibility: { minAge: 0, maxAge: 18, maxIncome: 120000, gender: "any", occupation: "Any", state: "Rajasthan", category: "All" },
    benefits: "₹500/month for children aged 0–6, ₹1,000/month for children aged 6–18",
    requiredDocs: ["Aadhaar", "Income Certificate", "Birth Certificate", "Bank Passbook"],
    isActive: true, priorityScore: 7, successRate: 76, avgProcessingTime: "21 days",
    tags: ["child-welfare", "Rajasthan", "orphan"], applicationMode: "both", deadline: "2027-03-31"
  },
  {
    name: "Rajasthan Indira Gandhi Shahri Credit Card Yojana",
    category: "employment",
    description: "Interest-free loan scheme for urban street vendors, artisans, and the unemployed in Rajasthan for self-employment.",
    eligibility: { minAge: 18, maxAge: 45, maxIncome: 200000, gender: "any", occupation: "Worker", state: "Rajasthan", category: "All" },
    benefits: "Interest-free loan up to ₹50,000 for micro-enterprise/self-employment activities",
    requiredDocs: ["Aadhaar", "Income Certificate", "Residence Proof", "Bank Passbook"],
    isActive: true, priorityScore: 7, successRate: 65, avgProcessingTime: "21 days",
    tags: ["loan", "self-employment", "Rajasthan", "urban"], applicationMode: "online", deadline: "2026-12-31"
  },

  // ============ STATE: WEST BENGAL ============
  {
    name: "West Bengal Kanyashree Prakalpa",
    category: "women",
    description: "Conditional cash transfer scheme to improve status and wellbeing of girls by incentivizing educational enrolment and discouraging child marriage.",
    eligibility: { minAge: 13, maxAge: 18, maxIncome: 120000, gender: "female", occupation: "Student", state: "West Bengal", category: "All" },
    benefits: "₹1,000/year annual scholarship (K1) + ₹25,000 one-time grant at 18 (K2)",
    requiredDocs: ["Aadhaar", "School Enrollment Proof", "Income Certificate", "Bank Passbook"],
    isActive: true, priorityScore: 9, successRate: 80, avgProcessingTime: "14 days",
    tags: ["women", "girl-child", "scholarship", "West Bengal"], applicationMode: "online", deadline: "2026-11-30"
  },
  {
    name: "West Bengal Swastha Sathi",
    category: "health",
    description: "State health insurance scheme providing cashless health coverage of ₹5 lakh per family per year at government and empaneled private hospitals.",
    eligibility: { minAge: 0, maxAge: 100, maxIncome: 300000, gender: "any", occupation: "Any", state: "West Bengal", category: "All" },
    benefits: "₹5 lakh cashless health coverage per family for all secondary and tertiary care",
    requiredDocs: ["Aadhaar", "Ration Card", "Bank Passbook"],
    isActive: true, priorityScore: 8, successRate: 79, avgProcessingTime: "10 days",
    tags: ["health", "insurance", "West Bengal"], applicationMode: "online", deadline: "2027-03-31"
  },

  // ============ TELANGANA ============
  {
    name: "Telangana Rythu Bandhu",
    category: "agriculture",
    description: "Investment support scheme providing upfront cash to farmer for each crop season to meet agricultural input costs.",
    eligibility: { minAge: 18, maxAge: 70, maxIncome: 500000, gender: "any", occupation: "Farmer", state: "Telangana", category: "All" },
    benefits: "₹10,000 per acre per season (₹5,000 Kharif + ₹5,000 Rabi) directly to farmer bank accounts",
    requiredDocs: ["Aadhaar", "Land Records", "Bank Passbook", "Pattadar Passbook"],
    isActive: true, priorityScore: 9, successRate: 85, avgProcessingTime: "14 days",
    tags: ["farmer", "Telangana", "investment-support"], applicationMode: "online", deadline: "2027-03-31"
  },
  {
    name: "Telangana Kalyana Lakshmi Shaadi Mubarak",
    category: "women",
    description: "Financial assistance for marriages of girls from SC/ST/BC/Minority communities and economically weaker sections in Telangana.",
    eligibility: { minAge: 18, maxAge: 35, maxIncome: 200000, gender: "female", occupation: "Any", state: "Telangana", category: "SC" },
    benefits: "₹1,00,116 financial assistance for marriage of eligible girl from SC/ST/BC/Minorities",
    requiredDocs: ["Aadhaar", "Caste Certificate", "Income Certificate", "Bank Passbook"],
    isActive: true, priorityScore: 7, successRate: 73, avgProcessingTime: "30 days",
    tags: ["women", "marriage", "SC", "Telangana"], applicationMode: "online", deadline: "2027-03-31"
  },

  // ============ KARNATAKA ============
  {
    name: "Karnataka Raitha Siri Scheme",
    category: "agriculture",
    description: "Financial assistance to Karnataka farmers for crop diversification, seed distribution, and input subsidies.",
    eligibility: { minAge: 18, maxAge: 70, maxIncome: 300000, gender: "any", occupation: "Farmer", state: "Karnataka", category: "All" },
    benefits: "Input subsidy of ₹5,000 per acre + free quality seeds worth ₹10,000",
    requiredDocs: ["Aadhaar", "Land Records", "Bank Passbook", "RTC Extract"],
    isActive: true, priorityScore: 7, successRate: 68, avgProcessingTime: "21 days",
    tags: ["farmer", "Karnataka", "seed-subsidy"], applicationMode: "both", deadline: "2026-09-30"
  },
  {
    name: "Karnataka Gyanaganga Vedike",
    category: "education",
    description: "Free competitive exam coaching program for SC/ST students in Karnataka aspiring for civil services, banking, and other exams.",
    eligibility: { minAge: 18, maxAge: 32, maxIncome: 250000, gender: "any", occupation: "Student", state: "Karnataka", category: "SC" },
    benefits: "Free coaching for UPSC/KPSC/Banking/Railway exams + study materials + stipend of ₹3,000/month",
    requiredDocs: ["Aadhaar", "Caste Certificate", "Marksheet", "Bank Passbook", "Income Certificate"],
    isActive: true, priorityScore: 7, successRate: 55, avgProcessingTime: "15 days",
    tags: ["education", "coaching", "SC", "Karnataka"], applicationMode: "online", deadline: "2026-08-31"
  },

  // ============ ADDITIONAL CENTRAL SCHEMES ============
  {
    name: "National Apprenticeship Training Scheme",
    category: "skill",
    description: "On-the-job training for ITI graduates and diploma holders for 1–3 years with stipend to bridge the gap between education and employment.",
    eligibility: { minAge: 14, maxAge: 25, maxIncome: 500000, gender: "any", occupation: "Student", state: "All", category: "All" },
    benefits: "Monthly stipend of ₹6,000–₹9,000 + industry experience + certificate recognized by National Council",
    requiredDocs: ["Aadhaar", "Marksheet", "Bank Passbook", "ITI/Diploma Certificate"],
    isActive: true, priorityScore: 7, successRate: 70, avgProcessingTime: "21 days",
    tags: ["apprenticeship", "ITI", "skill", "stipend"], applicationMode: "online", deadline: "2026-12-31"
  },
  {
    name: "Stand-Up India Scheme",
    category: "startup",
    description: "Provides bank loans between ₹10 lakh to ₹1 crore to at least one SC or ST borrower and at least one woman borrower per bank branch.",
    eligibility: { minAge: 18, maxAge: 65, maxIncome: 5000000, gender: "any", occupation: "Entrepreneur", state: "All", category: "SC" },
    benefits: "Composite bank loan of ₹10 lakh to ₹1 crore for greenfield enterprise",
    requiredDocs: ["Aadhaar", "Caste Certificate", "Business Plan", "Bank Passbook", "Income Certificate"],
    isActive: true, priorityScore: 7, successRate: 58, avgProcessingTime: "45 days",
    tags: ["startup", "loan", "SC", "women"], applicationMode: "online", deadline: "2027-03-31"
  },
  {
    name: "Deen Dayal Antyodaya Yojana - NRLM",
    category: "employment",
    description: "Mobilizes rural poor families into self-help groups (SHGs) for economic empowerment through skill development and microfinance.",
    eligibility: { minAge: 18, maxAge: 60, maxIncome: 150000, gender: "any", occupation: "Any", state: "All", category: "All" },
    benefits: "SHG formation + revolving fund of ₹15,000 + bank credit + skill training",
    requiredDocs: ["Aadhaar", "Bank Passbook", "BPL Card"],
    isActive: true, priorityScore: 7, successRate: 72, avgProcessingTime: "30 days",
    tags: ["SHG", "rural", "employment", "microfinance"], applicationMode: "offline", deadline: "2027-03-31"
  },
  {
    name: "MGNREGS (Mahatma Gandhi NREGA)",
    category: "employment",
    description: "Guarantees at least 100 days of employment in a financial year to adult members of rural households willing to do unskilled manual work.",
    eligibility: { minAge: 18, maxAge: 60, maxIncome: 200000, gender: "any", occupation: "Worker", state: "All", category: "All" },
    benefits: "100 days guaranteed employment at state-notified wage rates (₹202–₹374/day)",
    requiredDocs: ["Aadhaar", "Bank Passbook", "Job Card"],
    isActive: true, priorityScore: 9, successRate: 86, avgProcessingTime: "15 days",
    tags: ["employment", "rural", "guaranteed-wage"], applicationMode: "offline", deadline: "2027-03-31"
  },
  {
    name: "PM E-Bus Sewa",
    category: "employment",
    description: "Employment generation scheme for operating electric buses in cities under public-private partnership to create green transport jobs.",
    eligibility: { minAge: 21, maxAge: 45, maxIncome: 600000, gender: "any", occupation: "Worker", state: "All", category: "All" },
    benefits: "Employment as driver/conductor with government-supported wages and EV skill training certification",
    requiredDocs: ["Aadhaar", "Driving License", "Bank Passbook", "Residence Proof"],
    isActive: true, priorityScore: 6, successRate: 60, avgProcessingTime: "30 days",
    tags: ["employment", "green-energy", "transport"], applicationMode: "online", deadline: "2026-12-31"
  },
  {
    name: "PM Vishwakarma Yojana",
    category: "skill",
    description: "Recognition and support for traditional artisans and craftspeople (18 trades) with training, tool kit support, and credit access.",
    eligibility: { minAge: 18, maxAge: 60, maxIncome: 300000, gender: "any", occupation: "Worker", state: "All", category: "All" },
    benefits: "₹15,000 tool kit + free 5/15-day training + credit up to ₹3 lakh + certification",
    requiredDocs: ["Aadhaar", "Bank Passbook", "Artisan Declaration", "Residence Proof"],
    isActive: true, priorityScore: 8, successRate: 75, avgProcessingTime: "15 days",
    tags: ["artisan", "craftsperson", "skill", "loan"], applicationMode: "online", deadline: "2027-03-31"
  },
  {
    name: "Soil Health Card Scheme",
    category: "agriculture",
    description: "Provides soil health cards to farmers showing soil nutrient status and recommending appropriate nutrients to improve crop productivity.",
    eligibility: { minAge: 18, maxAge: 80, maxIncome: 500000, gender: "any", occupation: "Farmer", state: "All", category: "All" },
    benefits: "Free soil testing + customized fertilizer recommendation card to maximize yield",
    requiredDocs: ["Aadhaar", "Land Records"],
    isActive: true, priorityScore: 6, successRate: 80, avgProcessingTime: "14 days",
    tags: ["farmer", "soil", "agriculture", "free-service"], applicationMode: "offline", deadline: "2027-03-31"
  },
  {
    name: "Pradhan Mantri Awas Yojana CLSS MIG",
    category: "housing",
    description: "Credit linked subsidy for middle income group (MIG-I and MIG-II) homebuyers for affordable home loans in urban areas.",
    eligibility: { minAge: 21, maxAge: 65, maxIncome: 1800000, gender: "any", occupation: "Any", state: "All", category: "All" },
    benefits: "Interest subsidy of 4% (MIG-I) or 3% (MIG-II) on home loan up to ₹9–12 lakh",
    requiredDocs: ["Aadhaar", "Income Certificate", "Bank Passbook", "Salary Slips"],
    isActive: true, priorityScore: 7, successRate: 65, avgProcessingTime: "30 days",
    tags: ["housing", "loan-subsidy", "MIG"], applicationMode: "online", deadline: "2026-12-31"
  },
  {
    name: "Antyodaya Anna Yojana",
    category: "health",
    description: "Provides highly subsidized foodgrains (35 kg/month) to the poorest of poor families identified from BPL category.",
    eligibility: { minAge: 0, maxAge: 100, maxIncome: 100000, gender: "any", occupation: "Any", state: "All", category: "All" },
    benefits: "35 kg rice/wheat per month at ₹2–3 per kg (heavily subsidized)",
    requiredDocs: ["Aadhaar", "Antyodaya Card", "BPL Certificate"],
    isActive: true, priorityScore: 8, successRate: 90, avgProcessingTime: "3 days",
    tags: ["food", "BPL", "subsidized-ration"], applicationMode: "offline", deadline: "2027-12-31"
  },
  {
    name: "Sarva Shiksha Abhiyan - Mid Day Meal",
    category: "education",
    description: "Provides hot cooked meals to government & government-aided school students (Class I–VIII) to improve nutrition and school attendance.",
    eligibility: { minAge: 5, maxAge: 14, maxIncome: 200000, gender: "any", occupation: "Student", state: "All", category: "All" },
    benefits: "Free daily hot cooked meal with prescribed nutrition standards for all school days",
    requiredDocs: ["Aadhaar", "School Enrollment Proof"],
    isActive: true, priorityScore: 7, successRate: 94, avgProcessingTime: "1 day",
    tags: ["education", "nutrition", "mid-day-meal", "school"], applicationMode: "offline", deadline: "2027-03-31"
  },
  {
    name: "PM Jan Aushadhi Pariyojana",
    category: "health",
    description: "Provides quality generic medicines at affordable prices through Jan Aushadhi Kendras (PMBJKs) across India.",
    eligibility: { minAge: 0, maxAge: 100, maxIncome: 1000000, gender: "any", occupation: "Any", state: "All", category: "All" },
    benefits: "Generic medicines at 50–90% less than branded drug prices (2000+ medicines available)",
    requiredDocs: ["Aadhaar"],
    isActive: true, priorityScore: 8, successRate: 95, avgProcessingTime: "1 day",
    tags: ["health", "medicine", "affordable", "generic"], applicationMode: "offline", deadline: "2027-03-31"
  },
  {
    name: "PMEGP - PM Employment Generation Programme",
    category: "startup",
    description: "Credit-linked subsidy programme to generate employment opportunities in rural and urban areas via setting up micro-enterprises.",
    eligibility: { minAge: 18, maxAge: 55, maxIncome: 1000000, gender: "any", occupation: "Entrepreneur", state: "All", category: "All" },
    benefits: "25–35% subsidy on project cost up to ₹50 lakh (manufacturing) and ₹20 lakh (services)",
    requiredDocs: ["Aadhaar", "Bank Passbook", "Business Plan", "Income Certificate"],
    isActive: true, priorityScore: 8, successRate: 62, avgProcessingTime: "45 days",
    tags: ["startup", "subsidy", "manufacturing", "employment"], applicationMode: "online", deadline: "2027-03-31"
  },
  {
    name: "National Rural Health Mission",
    category: "health",
    description: "Provides effective healthcare to rural population, especially vulnerable groups including women and children.",
    eligibility: { minAge: 0, maxAge: 100, maxIncome: 300000, gender: "any", occupation: "Any", state: "All", category: "All" },
    benefits: "Free healthcare, medicines, diagnostics, and emergency services at government health centers",
    requiredDocs: ["Aadhaar"],
    isActive: true, priorityScore: 7, successRate: 82, avgProcessingTime: "1 day",
    tags: ["health", "rural", "free-healthcare"], applicationMode: "offline", deadline: "2027-03-31"
  },
];

async function seedSchemes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
    await Scheme.deleteMany({});
    console.log('Old schemes cleared...');
    const result = await Scheme.insertMany(schemes);
    console.log(`✅ ${result.length} schemes seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
}

seedSchemes();
