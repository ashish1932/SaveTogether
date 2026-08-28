import { SecurityService } from '../../src/security/security.service';
import { BookingStateMachine } from '../../src/bookings/state-machine/booking-state-machine';

export function runBookingLifecycleIntegrationTests() {
  console.log('🧪 [TEST] Running Booking Lifecycle & Invariants Integration Tests...');

  // Invariant 2: Ownership Authorization Protection (Step 39.64)
  try {
    SecurityService.verifyObjectOwnership('usr_1', 'usr_2', 'Booking');
    throw new Error('Integration Test Failed: Ownership verification failed to block cross-user access');
  } catch (err: any) {
    if (err.statusCode !== 403) {
      throw err;
    }
  }

  // Invariant 10: Enforce Linear Booking State Machine Transitions (Step 39.18)
  const validTransition = BookingStateMachine.canTransition('PENDING_PAYMENT', 'CONFIRMED');
  if (!validTransition) {
    throw new Error('Integration Test Failed: PENDING_PAYMENT -> CONFIRMED should be valid');
  }

  const invalidTransition = BookingStateMachine.canTransition('COMPLETED', 'PENDING_PAYMENT');
  if (invalidTransition) {
    throw new Error('Integration Test Failed: COMPLETED -> PENDING_PAYMENT should be invalid');
  }

  console.log('✅ [TEST PASSED] Integration Tests (Ownership Guards & Booking State Machine Invariants)');
}
