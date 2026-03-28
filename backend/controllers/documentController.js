const Document = require('../models/Document');
const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const { OpenAI } = require('openai');


// Helper to get OpenAI instance
const getOpenAI = () => {
    return null;
};

// Upload and Extract Text
const uploadDocument = async (req, res) => {
    try {
        const openai = getOpenAI();
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        const parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();
        const text = data.text;

        let extractedData = { name: '', income: 0, idNumbers: [], isComplete: false };

        if (openai) {
            try {
                const extractionPrompt = `
                Extract structured information from this document text:
                "${text.substring(0, 3000)}"
                
                Identify:
                - Full Name
                - Annual/Monthly Income (as a number)
                - ID Numbers (Aadhaar, PAN, etc.)
                - If the document looks like a complete government form.

                Return ONLY JSON:
                {
                  "name": "string",
                  "income": number,
                  "idNumbers": ["string"],
                  "isComplete": boolean
                }
                `;

                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: extractionPrompt }],
                    response_format: { type: "json_object" }
                });
                extractedData = JSON.parse(completion.choices[0].message.content);
            } catch (err) {
                console.error("AI Extraction failed:", err.message);
            }
        }

        const document = await Document.create({
            userId: req.user.id,
            fileName: req.file.originalname,
            fileUrl: req.file.path,
            extractedText: text,
            extractedData: extractedData
        });

        res.status(201).json({
            message: 'Document processed successfully',
            document: document,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// AI Chat with Document & Scheme Verification
const chatWithDocument = async (req, res) => {
    try {
        const { documentId, question, schemeId } = req.body;

        const document = await Document.findById(documentId);
        if (!document) return res.status(404).json({ message: 'Document not found' });

        let schemeContext = "";
        if (schemeId) {
            const Scheme = require('../models/Scheme');
            const scheme = await Scheme.findById(schemeId);
            if (scheme) {
                schemeContext = `Verification target: ${scheme.name}. Required Documents: ${scheme.requiredDocs.join(', ')}.`;
            }
        }

        const openai = getOpenAI();
        if (!openai) return res.status(503).json({ message: 'AI service unavailable' });
        
        const prompt = `
        You are a SmartGov citizen assistant. 
        Analyze the document and answer the user's question.
        
        Document Context:
        ${document.extractedText.substring(0, 4000)}
        
        ${schemeContext}
        
        User Question:
        ${question}

        Return response in JSON format:
        {
          "answer": "string (natural language response)",
          "status": "complete" or "incomplete",
          "missing_documents": ["document names if missing"],
          "suggestions": "string (next steps)",
          "extracted_details": { "name": "...", "income": "..." }
        }
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Expert gov assistant. Provide detailed, helpful structured responses." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content);
        res.status(200).json(aiResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadDocument,
    chatWithDocument,
};
