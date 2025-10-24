import { Router, Request, Response } from 'express';
import { CustomerTagModel } from '../models/CustomerTag';

const router = Router();

// Get all unique tags
router.get('/', (req: Request, res: Response) => {
  try {
    const tags = CustomerTagModel.getAllTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

export default router;
