import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routers
import authRouter from './routes/auth';
import formsRouter from './routes/forms';
import questionBankRouter from './routes/questionBank';
import parserRouter from './routes/parser';

const app = express();
const port = process.env.PORT || 5000;

// Middleware configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup routes
app.use('/api/auth', authRouter);
app.use('/api/forms', formsRouter);
app.use('/api/question-bank', questionBankRouter);
app.use('/api/parser', parserRouter);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Start Express server
app.listen(port, () => {
  console.log(`[Server]: Google Forms Pro backend running on port http://localhost:${port}`);
});
