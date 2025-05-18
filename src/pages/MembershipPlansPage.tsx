import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const MembershipPlansPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '€49',
      period: '/month',
      features: [
        'Access to all basic classes',
        'Gym access during regular hours',
        'Basic fitness assessment'
      ]
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      price: '€129',
      period: '/3 months',
      popular: true,
      features: [
        'Access to all classes including premium',
        'Extended gym hours access',
        '1 personal training session',
        'Detailed fitness assessment'
      ]
    },
    {
      id: 'annual',
      name: 'Annual',
      price: '€449',
      period: '/year',
      features: [
        'All benefits of Quarterly plan',
        '24/7 gym access',
        '4 personal training sessions',
        'Quarterly progress reviews'
      ]
    }
  ];

  const handleSelectPlan = async (planType: string) => {
    if (!currentUser) return;
    
    setIsLoading(planType);
    try {
      const { data, error } = await supabase.rpc('update_membership', {
        p_user_id: currentUser.id,
        p_type: planType
      });

      if (error) throw error;

      if (data.success) {
        alert('Membership plan updated successfully!');
        window.location.reload();
      }
    } catch (err) {
      console.error('Error updating membership:', err);
      alert('Failed to update membership plan. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Membership Plan</h1>
        <p className="mt-4 text-xl text-gray-600">
          Select the plan that best fits your fitness goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative ${plan.popular ? 'border-2 border-blue-500 transform scale-105' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-medium">
                MOST POPULAR
              </div>
            )}
            <CardHeader className={plan.popular ? 'pt-12' : ''}>
              <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                fullWidth
                onClick={() => handleSelectPlan(plan.id)}
                isLoading={isLoading === plan.id}
              >
                Select Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MembershipPlansPage;