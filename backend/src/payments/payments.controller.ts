import { Router, Request, Response } from 'express';
import { jwtAuthGuard, AuthRequest } from '../auth/guards/jwt-auth.guard';
import { validateCreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { validateVerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentsService } from './payments.service';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// ==========================================
// PUBLIC WEBHOOK ENDPOINT
// ==========================================

// POST /api/v1/payments/webhook (Step 19.15)
router.post('/payments/webhook', async (req: Request, res: Response, next) => {
  try {
    const signature = (req.headers['x-razorpay-signature'] as string) || (req.headers['x-signature'] as string) || 'sig_mock';
    const rawBody = JSON.stringify(req.body);

    const result = await PaymentsService.handleWebhook(rawBody, signature, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// AUTHENTICATED CUSTOMER PAYMENT APIS
// ==========================================

// POST /api/v1/payments/create-order (Step 19.8)
router.post('/payments/create-order', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validateCreatePaymentOrderDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const order = await PaymentsService.createPaymentOrder(userId, val.data);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/payments/verify (Step 19.14)
router.post('/payments/verify', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validateVerifyPaymentDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const verified = await PaymentsService.verifyPayment(userId, val.data);
    res.json(verified);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/payments/:id (Step 19.26)
router.get('/payments/:id', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const payment = await PaymentsService.getPaymentById(userId, req.params.id);
    res.json(payment);
  } catch (err) {
    next(err);
  }
});

export default router;
