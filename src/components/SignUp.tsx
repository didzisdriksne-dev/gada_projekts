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
      newErrors.ssn = 'Personas kods ir obligāts';
    } else if (ssnDigits.length !== 11) {
      newErrors.ssn = 'Personas kodam jābūt 11 cipariem';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Pilns vārds ir obligāts';
    } else if (formData.name.trim().split(' ').length < 2) {
      newErrors.name = 'Lūdzu, ievadiet savu pilnu vārdu (vārdu un uzvārdu)';
    }

    if (!formData.password) {
      newErrors.password = 'Parole ir obligāta';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Parolei jābūt vismaz 8 rakstzīmēm';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Lūdzu, apstipriniet savu paroli';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Paroles nesakrīt';
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
          <h1 className="text-gray-900 mb-2">Skolēnu labklājības portāls</h1>
          <p className="text-gray-600">Izveidojiet savu kontu, lai sāktu</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Izveidot kontu</CardTitle>
            <CardDescription>
              Visi lauki ir obligāti, lai izveidotu kontu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SSN */}
              <div className="space-y-2">
                <Label htmlFor="ssn">
                  Personas kods <span className="text-red-500">*</span>
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
                  Jūsu personas kods ir šifrēts un droši uzglabāts verificēšanai
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Pilns vārds <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Vārds un uzvārds"
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
                  Parole <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Izveidojiet paroli (min. 8 rakstzīmes)"
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
                  Apstipriniet paroli <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ievadiet paroli vēlreiz"
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
                Izveidot kontu
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">
                  Jau ir konts?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onSwitchToLogin}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Atpakaļ uz pieteikšanos
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Izveidojot kontu, jūs piekrītat izmantot šo portālu atbildīgi
            <br />
            tikai garīgās veselības un labklājības dienu pieprasījumiem.
          </p>
        </div>
      </div>
    </div>
  );
}
