import { Router } from 'express';
import { sendContactEmail } from '../middleware/contact';

const router = Router();

// This becomes /api/v1/contact
router.post('/contact', sendContactEmail);

export default router;