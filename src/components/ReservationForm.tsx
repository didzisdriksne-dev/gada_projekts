import { useState } from 'react';
import { Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface ReservationFormProps {
  onSubmit: (data: ReservationData) => void;
  onBack: () => void;
}

export interface ReservationData {
  studentName: string;
  className: string;
  date: string;
  reason: string;
  notes: string;
}

export function ReservationForm({ onSubmit, onBack }: ReservationFormProps) {
  const [formData, setFormData] = useState<ReservationData>({
    studentName: '',
    className: '',
    date: '',
    reason: '',
    notes: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [errors, setErrors] = useState<Partial<Record<keyof ReservationData, string>>>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData({ ...formData, date: date.toISOString() });
      setErrors({ ...errors, date: '' });
      setIsCalendarOpen(false);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ReservationData, string>> = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }
    if (!formData.className) {
      newErrors.className = 'Class is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.reason) {
      newErrors.reason = 'Reason is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Request a Mental Health & Wellbeing Day</CardTitle>
            <CardDescription>
              Taking care of your mental health is important. Submit your request and you'll receive a response within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Name */}
              <div className="space-y-2">
                <Label htmlFor="studentName">
                  Student Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="studentName"
                  placeholder="Enter your full name"
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  className={errors.studentName ? 'border-red-500' : ''}
                />
                {errors.studentName && (
                  <p className="text-sm text-red-500">{errors.studentName}</p>
                )}
              </div>

              {/* Class */}
              <div className="space-y-2">
                <Label htmlFor="class">
                  Class <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.className}
                  onValueChange={(value) =>
                    setFormData({ ...formData, className: value })
                  }
                >
                  <SelectTrigger className={errors.className ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select your class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grade 9A">Grade 9A</SelectItem>
                    <SelectItem value="Grade 9B">Grade 9B</SelectItem>
                    <SelectItem value="Grade 10A">Grade 10A</SelectItem>
                    <SelectItem value="Grade 10B">Grade 10B</SelectItem>
                    <SelectItem value="Grade 11A">Grade 11A</SelectItem>
                    <SelectItem value="Grade 11B">Grade 11B</SelectItem>
                    <SelectItem value="Grade 12A">Grade 12A</SelectItem>
                    <SelectItem value="Grade 12B">Grade 12B</SelectItem>
                  </SelectContent>
                </Select>
                {errors.className && (
                  <p className="text-sm text-red-500">{errors.className}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>
                  Date Requested <span className="text-red-500">*</span>
                </Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full justify-start ${
                        errors.date ? 'border-red-500' : ''
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? selectedDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">
                  Primary Reason <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.reason}
                  onValueChange={(value) => setFormData({ ...formData, reason: value })}
                >
                  <SelectTrigger className={errors.reason ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mental Health & Wellbeing">Mental Health & Wellbeing</SelectItem>
                    <SelectItem value="Stress Management">Stress Management</SelectItem>
                    <SelectItem value="Personal Wellness">Personal Wellness</SelectItem>
                    <SelectItem value="Self-Care Day">Self-Care Day</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
              </div>

              {/* Optional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Share any additional context if you'd like (completely optional)..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Submit Request
                </Button>
                <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <p className="text-sm text-purple-800">
              <strong>💙 Remember:</strong> Your mental health matters. Our school supports taking time for self-care and wellbeing. You don't need to provide detailed explanations - your wellbeing is reason enough.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
