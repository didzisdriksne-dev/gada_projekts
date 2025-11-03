import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Heart, ArrowLeft } from 'lucide-react';

interface SignUpProps {
  onSignUp: (ssn: string, name: string, password: string) => void;
  onSwitchToLogin: () => void;
}

export function SignUp({ onSignUp, onSwitchToLogin }: SignUpProps) {
  const [formData, setFormData] = useState({
    ssn: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatSSN = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Format as XXXXXX-XXXXX
    if (digits.length <= 6) return digits;
    return `${digits.slice(0, 6)}-${digits.slice(6, 11)}`;
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value);
    setFormData({ ...formData, ssn: formatted });
    if (errors.ssn) setErrors({ ...errors, ssn: '' });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate SSN (should be XXXXXX-XXXXX format)
    const ssnDigits = formData.ssn.replace(/\D/g, '');
    if (!formData.ssn) {
      newErrors.ssn = 'Social Security Number is required';
    } else if (ssnDigits.length !== 11) {
      newErrors.ssn = 'SSN must be 11 digits';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().split(' ').length < 2) {
      newErrors.name = 'Please enter your full name (first and last)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSignUp(formData.ssn, formData.name, formData.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Student Wellbeing Portal</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              All fields are required to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SSN */}
              <div className="space-y-2">
                <Label htmlFor="ssn">
                  Social Security Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ssn"
                  type="text"
                  placeholder="XXXXXX-XXXXX"
                  value={formData.ssn}
                  onChange={handleSSNChange}
                  maxLength={12}
                  className={errors.ssn ? 'border-red-500' : ''}
                />
                {errors.ssn && <p className="text-sm text-red-500">{errors.ssn}</p>}
                <p className="text-xs text-gray-500">
                  Your SSN is encrypted and securely stored for verification
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="First and Last Name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min. 8 characters)"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">
                  Already have an account?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onSwitchToLogin}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to use this portal responsibly
            <br />
            for mental health and wellbeing day requests only.
          </p>
        </div>
      </div>
    </div>
  );
}
