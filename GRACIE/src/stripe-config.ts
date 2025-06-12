export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  price: number;
  mode: 'subscription' | 'payment';
  features: string[];
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    priceId: 'price_monthly_plus', // Replace with your actual Stripe price ID
    name: 'Monthly Plus',
    description: 'Advanced text and audio analysis with enhanced features',
    price: 9.99,
    mode: 'subscription',
    features: [
      'Advanced text and audio analysis',
      '30 day history retention',
      'Up to 1,000 tokens per month',
      'Detailed analysis reports',
      'Export functionality (coming soon)',
      'Priority support'
    ]
  },
  {
    priceId: 'price_monthly_pro', // Replace with your actual Stripe price ID
    name: 'Monthly Pro',
    description: 'Premium analysis with unlimited features and API access',
    price: 24.99,
    mode: 'subscription',
    features: [
      'Premium text and audio analysis',
      'Unlimited history retention',
      'Up to 3,000 tokens per month',
      'Advanced analytics',
      'Export functionality (coming soon)',
      'API access (coming soon)',
      'Custom analysis rules (coming soon)',
      'Priority support'
    ]
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};