import { PaymentProvider } from './payment-provider.interface';
import { RazorpayProvider } from './razorpay.provider';

export class PaymentProviderFactory {
  private static defaultInstance: PaymentProvider = new RazorpayProvider();

  public static getProvider(name?: string): PaymentProvider {
    return this.defaultInstance;
  }
}
