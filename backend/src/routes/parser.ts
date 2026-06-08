import { Router } from 'express';
import multer from 'multer';
import * as xlsx from 'xlsx';
import { authenticateToken } from '../utils/oauth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Read raw rows
    const rows = xlsx.utils.sheet_to_json<any>(worksheet);

    const parsedQuestions = rows.map((row, idx) => {
      // Find keys case-insensitively
      const findValue = (keys: string[]) => {
        const foundKey = Object.keys(row).find(k => 
          keys.some(key => k.toLowerCase().trim() === key.toLowerCase().trim())
        );
        return foundKey ? row[foundKey] : undefined;
      };

      const title = findValue(['title', 'question', 'question title', 'label', 'text']) || `Question ${idx + 1}`;
      let rawType = String(findValue(['type', 'question type', 'input type']) || 'text').toLowerCase().trim();
      const rawOptions = findValue(['options', 'choices', 'answers', 'values']);
      const rawRequired = findValue(['required', 'is required', 'mandatory']);
      
      // Parse quiz fields
      const rawPoints = findValue(['points', 'score', 'weight', 'point value', 'value']);
      const rawCorrect = findValue(['correct answer', 'correct option', 'correct', 'answer', 'key']);

      // Map raw type to Google Form supported types
      let type = 'TEXT';
      if (rawType.includes('paragraph') || rawType.includes('long') || rawType.includes('area')) {
        type = 'PARAGRAPH';
      } else if (
        rawType.includes('radio') || 
        rawType.includes('multiple') || 
        rawType.includes('single')
      ) {
        type = 'MULTIPLE_CHOICE';
      } else if (rawType.includes('checkbox') || rawType.includes('multi')) {
        type = 'CHECKBOXES';
      } else if (rawType.includes('drop') || rawType.includes('select')) {
        type = 'DROPDOWN';
      } else if (rawOptions) {
        // Smart inference
        type = 'MULTIPLE_CHOICE';
      }

      // Parse choices
      let options: string[] = [];
      if (rawOptions) {
        if (typeof rawOptions === 'string') {
          options = rawOptions.split(',').map(o => o.trim()).filter(Boolean);
        } else if (Array.isArray(rawOptions)) {
          options = rawOptions.map(o => String(o).trim()).filter(Boolean);
        } else {
          options = [String(rawOptions).trim()];
        }
      }

      // Parse required flag
      let required = false;
      if (rawRequired !== undefined) {
        const reqStr = String(rawRequired).toLowerCase().trim();
        required = reqStr === 'true' || reqStr === 'yes' || reqStr === '1' || rawRequired === true;
      }

      // Parse points
      let points = 0;
      if (rawPoints !== undefined) {
        const parsedPoints = parseInt(String(rawPoints).trim(), 10);
        if (!isNaN(parsedPoints)) {
          points = parsedPoints;
        }
      }

      // Parse correct answers
      let correctAnswers: string[] = [];
      if (rawCorrect !== undefined) {
        if (typeof rawCorrect === 'string') {
          correctAnswers = rawCorrect.split(',').map(o => o.trim()).filter(Boolean);
        } else if (Array.isArray(rawCorrect)) {
          correctAnswers = rawCorrect.map(o => String(o).trim()).filter(Boolean);
        } else {
          correctAnswers = [String(rawCorrect).trim()];
        }
      }

      return {
        id: `temp-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
        title: String(title).trim(),
        type,
        options: options.length > 0 ? JSON.stringify(options) : null,
        required,
        points,
        correctAnswers: correctAnswers.length > 0 ? JSON.stringify(correctAnswers) : null,
        order: idx,
      };
    });

    res.json({ questions: parsedQuestions });
  } catch (error: any) {
    console.error('Excel Parsing Error:', error);
    res.status(500).json({ error: 'Failed to parse sheet file', details: error.message });
  }
});

export default router;
