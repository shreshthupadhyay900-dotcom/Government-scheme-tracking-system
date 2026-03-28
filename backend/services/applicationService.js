const OpenAI = require('openai');
const Document = require('../models/Document');

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// Helper to get OpenAI instance
const getOpenAI = () => {
    try {
        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_api_key_here') {
            return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        }
    } catch (error) {
        console.error("OpenAI initialization failed:", error.message);
    }
    return null;
};


// Fallback guide generator when AI is unavailable
const generateFallbackGuide = (scheme, user, uploadedDocNames) => {
    const requiredDocs = scheme.requiredDocs || [];
    const docChecklist = requiredDocs.map(doc => ({
        name: doc,
        status: uploadedDocNames.includes(doc.toLowerCase()) ? 'uploaded' : 'missing',
        reason: `Required for ${scheme.name} verification.`
    }));

    return {
        eligibilityStatus: "Potentially Eligible",
        eligibilityReason: `Based on your profile, you meet the primary criteria for ${scheme.name}.`,
        requiredDocuments: docChecklist,
        applicationSteps: [
            "Step 1: Gather all required documents listed in the checklist.",
            `Step 2: Visit the ${scheme.applicationMode === 'online' ? 'official portal' : 'nearest government office'}.`,
            "Step 3: Fill out the application form with accurate details.",
            "Step 4: Attach/Upload the required verified documents.",
            "Step 5: Submit the application and note down the acknowledgment number."
        ],
        submissionMode: scheme.applicationMode || "both",
        submissionDetails: {
            website: "https://www.india.gov.in/my-government/schemes",
            officeAddress: "Visit your nearest Common Service Centre (CSC) or District Magistrate office."
        },
        commonMistakes: [
            "Incorrect bank account details for direct benefit transfer.",
            "Using expired or blurred document copies.",
            "Mismatch between Aadhaar name and application name."
        ],
        tips: [
            "Keep your mobile number linked with Aadhaar updated.",
            "Save a digital copy of the submission receipt immediately.",
            "Check application status every 15 days."
        ],
        estimatedTime: scheme.avgProcessingTime || "30-45 days"
    };
};

const generateGuide = async (scheme, user) => {
    try {
        // Fetch user's documents to check status
        const userDocs = await Document.find({ userId: user._id });
        const uploadedDocNames = userDocs.map(d => d.fileName.toLowerCase());

        const openai = getOpenAI();
        if (!openai) {
            console.warn("OpenAI not configured, providing fallback guide");
            return generateFallbackGuide(scheme, user, uploadedDocNames);
        }

        const prompt = `
        You are a SmartGov AI specialist. Generate a detailed application guide for a citizen.
        
        SCHEME DETAILS:
        Name: ${scheme.name}
        Description: ${scheme.description}
        Benefits: ${scheme.benefits}
        Required Documents: ${scheme.requiredDocs.join(', ')}
        Mode: ${scheme.applicationMode}
        State: ${scheme.eligibility.state}
        
        USER PROFILE:
        Age: ${user.age}
        Income: ${user.income}
        Occupation: ${user.occupation}
        State: ${user.state}
        Uploaded Documents: ${uploadedDocNames.join(', ')}

        Generate exactly one JSON object with:
        {
          "eligibilityStatus": "eligible | partially eligible | not eligible",
          "eligibilityReason": "short explanation",
          "requiredDocuments": [
            { "name": "Aadhaar", "status": "uploaded | missing", "reason": "why needed" }
          ],
          "applicationSteps": [
            "Step 1: ...",
            "Step 2: ..."
          ],
          "submissionMode": "online | offline | both",
          "submissionDetails": {
             "website": "url if online",
             "officeAddress": "description if offline"
          },
          "commonMistakes": ["mistake 1", "mistake 2"],
          "tips": ["tip 1", "tip 2"],
          "estimatedTime": "e.g. 15-20 days"
        }
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Expert government consultant. Professional and structured." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error("Guide Generation Error:", error);
        // Fallback in case of AI error
        const userDocs = await Document.find({ userId: user._id });
        const uploadedDocNames = userDocs.map(d => d.fileName.toLowerCase());
        return generateFallbackGuide(scheme, user, uploadedDocNames);
    }
};

module.exports = { generateGuide };
