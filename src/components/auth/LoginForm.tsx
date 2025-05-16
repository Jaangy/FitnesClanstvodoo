import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../ui/Card';
import { UserRound, KeyRound } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const { login, isLoading, error } = useAuth();

  const validateForm = (): boolean => {
    const errors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(email, password);
    } catch (err) {
      // Error is handled in the AuthContext
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={formErrors.email}
              fullWidth
              placeholder="your.email@example.com"
              icon={<UserRound size={18} />}
            />

            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={formErrors.password}
              fullWidth
              placeholder="••••••••"
              icon={<KeyRound size={18} />}
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
              className="mt-4"
            >
              Sign In
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-gray-500">
          <p>Demo accounts:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-xs">
            <div className="p-2 border rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => { setEmail('admin@fitnes.com'); setPassword('password123'); }}>
              <p className="font-semibold">Admin</p>
              <p className="text-blue-600 truncate">admin@fitnes.com</p>
            </div>
            <div className="p-2 border rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => { setEmail('jane.doe@fitnes.com'); setPassword('password123'); }}>
              <p className="font-semibold">Instructor</p>
              <p className="text-blue-600 truncate">jane.doe@fitnes.com</p>
            </div>
            <div className="p-2 border rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => { setEmail('mark.johnson@example.com'); setPassword('password123'); }}>
              <p className="font-semibold">Member</p>
              <p className="text-blue-600 truncate">mark.johnson@example.com</p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;