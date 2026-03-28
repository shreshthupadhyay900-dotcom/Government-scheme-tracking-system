const mongoose = require('mongoose');
const Scheme = require('./models/Scheme');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartgov')
    .then(() => console.log('Connected to MongoDB for seeding...'))
    .catch(err => console.error(err));

const schemes = [
    {
        name: "Pradhan Mantri Awas Yojana (PMAY)",
        description: "Housing for all by 2024. Provides interest subsidy on home loans for poor and middle-class citizens.",
        benefits: "Interest subsidy up to 6.5% on home loans. Financial assistance for building new houses.",
        eligibility: {
            minAge: 18,
            maxIncome: 1800000,
            state: "All",
            occupation: "All",
            category: "All"
        }
    },
    {
        name: "Ayushman Bharat - PMJAY",
        description: "World's largest health insurance scheme. Provides a cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
        benefits: "Cashless treatment in empaneled hospitals. Covers 3 days of pre-hospitalization and 15 days of post-hospitalization expenses.",
        eligibility: {
            minAge: 0,
            maxIncome: 120000,
            state: "All",
            occupation: "All",
            category: "All"
        }
    },
    {
        name: "PM-Kisan Samman Nidhi",
        description: "Income support to all landholding farmers' families in the country.",
        benefits: "₹6,000 per year in three equal installments directly into bank accounts.",
        eligibility: {
            minAge: 18,
            maxIncome: 999999999,
            state: "All",
            occupation: "Farmer",
            category: "All"
        }
    },
    {
        name: "Sukanya Samriddhi Yojana",
        description: "Small deposit scheme for the girl child. Help parents build a fund for their daughter's education and marriage.",
        benefits: "High interest rate, tax benefits under Section 80C. Partial withdrawal allowed after age 18.",
        eligibility: {
            minAge: 0,
            maxIncome: 999999999,
            state: "All",
            occupation: "All",
            category: "General"
        }
    },
    {
        name: "Stand-Up India Scheme",
        description: "Promotes entrepreneurship among SC/ST and Women. Facilitates bank loans between ₹10 lakh and ₹1 crore.",
        benefits: "Collateral-free loans. Credit guarantee scheme support. Holistic handholding support.",
        eligibility: {
            minAge: 18,
            maxIncome: 999999999,
            state: "All",
            occupation: "Self Employed",
            category: "SC/ST"
        }
    },
    {
        name: "Atal Pension Yojana (APY)",
        description: "Pension scheme for citizens in the unorganized sector. Guaranteed minimum pension of ₹1,000 to ₹5,000 per month.",
        benefits: "Fixed pension for the subscriber, then to the spouse, then return of corpus to the nominee.",
        eligibility: {
            minAge: 18,
            maxIncome: 999999999,
            state: "All",
            occupation: "Labour",
            category: "All"
        }
    },
    {
        name: "PM Mudra Yojana",
        description: "Financing for small business enterprises. Provides loans up to ₹10 lakh for non-corporate, non-farm small/micro enterprises.",
        benefits: "Shishu (up to ₹50k), Kishore (₹50k-₹5L), Tarun (₹5L-₹10L) loan categories. No collateral required.",
        eligibility: {
            minAge: 18,
            maxIncome: 999999999,
            state: "All",
            occupation: "Business",
            category: "All"
        }
    },
    {
        name: "Kanya Sumangala Yojana (UP)",
        description: "Conditional cash transfer scheme for the girl child in Uttar Pradesh.",
        benefits: "₹15,000 in 6 stages from birth to completion of graduation.",
        eligibility: {
            minAge: 0,
            maxIncome: 300000,
            state: "Uttar Pradesh",
            occupation: "All",
            category: "All"
        }
    }
];

const seedDB = async () => {
    await Scheme.deleteMany({});
    await Scheme.insertMany(schemes);
    console.log('Database Seeded with 8 premium schemes!');
    process.exit();
};

seedDB();
