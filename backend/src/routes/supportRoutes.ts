import { Router, Response } from 'express';
import { supportTicketsData } from '../data/mockDatabase';
import { SupportTicket } from '../types';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Submit complaint ticket
router.post('/support/complaints', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { bookingId, category, description } = req.body;
  if (!category || !description) {
    return res.status(400).json({ error: 'Category and description are required' });
  }

  const newTicket: SupportTicket = {
    id: `TKT${Math.floor(1000 + Math.random() * 9000)}`,
    bookingId: bookingId || 'BK10245',
    userId: req.user?.id || 'usr_1',
    userName: req.user?.phone ? 'Resident User' : 'Ashish Kumar',
    userPhone: req.user?.phone || '+919876543210',
    category: category || 'Quality',
    description,
    status: 'NEW',
    slaDeadline: 'In 30 mins',
    adminNotes: [],
    createdAt: new Date().toLocaleString(),
  };

  supportTicketsData.unshift(newTicket);
  res.status(201).json({
    status: 'success',
    ticket: newTicket,
  });
});

// GET my complaint tickets
router.get('/support/my-complaints', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const myTickets = supportTicketsData.filter((t) => t.userId === (req.user?.id || 'usr_1'));
  res.json({
    status: 'success',
    count: myTickets.length,
    tickets: myTickets,
  });
});

export default router;
