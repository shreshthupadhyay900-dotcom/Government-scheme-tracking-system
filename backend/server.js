const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/schemes', require('./routes/schemeRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

// Aliases for Document AI Feature
const { uploadDocument, chatWithDocument } = require('./controllers/documentController');
const upload = require('./middleware/uploadMiddleware');
const { protect } = require('./middleware/authMiddleware');

app.post('/api/upload', protect, upload.single('file'), uploadDocument);
app.post('/api/doc-chat', protect, chatWithDocument);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
