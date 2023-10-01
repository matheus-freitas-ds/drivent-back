import { ApplicationError } from '@/protocols';

export function paymentNotFoundError(): ApplicationError {
  return {
    name: 'PaymentNotFoundError',
    message: 'Payment required.',
  };
}
