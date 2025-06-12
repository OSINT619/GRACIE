import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Sparkles, Zap } from 'lucide-react';
import { STRIPE_PRODUCTS, type StripeProduct } from '@/stripe-config';
import { useToast } from '@/hooks/use-toast';

interface PricingSectionProps {
  className?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ className = '' }) => {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCheckout = async (product: StripeProduct) => {
    setLoadingPriceId(product.priceId);

    try {
      // Get the auth token from localStorage or your auth provider
      const token = localStorage.getItem('supabase.auth.token');
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to purchase a subscription.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId: product.priceId,
          mode: product.mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPriceId(null);
    }
  };

  const getCardIcon = (index: number) => {
    return index === 0 ? <Sparkles className="w-6 h-6" /> : <Zap className="w-6 h-6" />;
  };

  const getCardGradient = (index: number) => {
    return index === 0 
      ? 'from-blue-500/20 to-purple-500/20' 
      : 'from-purple-500/20 to-pink-500/20';
  };

  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="illuminated-text text-4xl md:text-5xl font-light tracking-wide text-white mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Unlock the full potential of GRACIE AI with advanced analysis capabilities
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {STRIPE_PRODUCTS.map((product, index) => (
            <Card 
              key={product.priceId} 
              className={`frosted-glass-container relative overflow-hidden border-0 bg-gradient-to-br ${getCardGradient(index)} backdrop-blur-xl`}
            >
              {/* Popular Badge for Pro Plan */}
              {index === 1 && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
                    {getCardIcon(index)}
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-white mb-2">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-gray-300 text-base">
                  {product.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">
                    ${product.price}
                  </span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
              </CardHeader>

              <CardContent className="px-6">
                <ul className="space-y-3">
                  {product.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-200 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="px-6 pt-4">
                <Button
                  onClick={() => handleCheckout(product)}
                  disabled={loadingPriceId === product.priceId}
                  className={`frosted-button w-full py-3 text-base font-medium transition-all duration-300 ${
                    index === 1 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                  } border-0 text-white shadow-lg hover:shadow-xl`}
                >
                  {loadingPriceId === product.priceId ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Get ${product.name}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            All plans include a 7-day free trial. Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </section>
  );
};