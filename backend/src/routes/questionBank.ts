import { Router } from 'express';
import prisma from '../db';
import { authenticateToken, AuthenticatedRequest } from '../utils/oauth';

const router = Router();

// Get all reusable questions in the user's bank
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const items = await prisma.questionBankItem.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve question bank items', details: error.message });
  }
});

// Save a question to the user's bank
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { title, type, options, category } = req.body;
  if (!title || !type) {
    return res.status(400).json({ error: 'Question title and type are required' });
  }

  try {
    const item = await prisma.questionBankItem.create({
      data: {
        userId: req.userId!,
        title,
        type,
        options: options ? (typeof options === 'string' ? options : JSON.stringify(options)) : null,
        category: category || 'General',
      },
    });
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to save question to bank', details: error.message });
  }
});

// Delete a question from the bank
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const item = await prisma.questionBankItem.findFirst({
      where: { id, userId: req.userId },
    });

    if (!item) {
      return res.status(404).json({ error: 'Question not found in your bank' });
    }

    await prisma.questionBankItem.delete({
      where: { id },
    });

    res.json({ message: 'Question deleted from bank successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete question from bank', details: error.message });
  }
});

export default router;
