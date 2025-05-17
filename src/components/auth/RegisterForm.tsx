import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/Card';
import { UserRound, Mail, Phone, MapPin } from 'lucide-react';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const validateForm = () => {
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
    };
    let isValid = true;

    if (!formData.firstName) {
      errors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Insert user data into users table
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              phone: formData.phone || null,
              address: formData.address || null,
              role: 'member',
            },
          ]);

        if (userError) throw userError;

        // 3. Create default membership
        const { error: membershipError } = await supabase
          .from('memberships')
          .insert([
            {
              user_id: authData.user.id,
              type: 'none',
              start_date: new Date().toISOString(),
              end_date: new Date().toISOString(),
              payment_status: 'pending',
            },
          ]);

        if (membershipError) throw membershipError;

        // Success - redirect to login
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please sign in to continue.' 
          } 
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join our fitness community today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              error={formErrors.firstName}
              icon={<UserRound size={18} />}
            />
            <Input
              label="Last Name"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              error={formErrors.lastName}
              icon={<UserRound size={18} />}
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formErrors.email}
            icon={<Mail size={18} />}
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={formErrors.password}
            helperText="Must be at least 6 characters"
          />

          <Input
            label="Phone (optional)"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={formErrors.phone}
            icon={<Phone size={18} />}
          />

          <Input
            label="Address (optional)"
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={formErrors.address}
            icon={<MapPin size={18} />}
          />

          {error && (
            <div className="bg-red-50 p-3 rounded border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
            className="mt-6"
          >
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;