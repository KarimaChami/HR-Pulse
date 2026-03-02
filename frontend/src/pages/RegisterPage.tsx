import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import heroImage from "@/assets/image2.jpg";
import { 
  Brain, 
  Eye, 
  EyeOff, 
  Loader2,
  ArrowLeft,
  Mail,
  Lock,
  User,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-navy-900 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Back button */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl">HR Pulse AI</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create your account
            </h1>
            <p className="text-gray-400">
              Start your free trial and transform your recruitment process
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          'h-1 flex-1 rounded-full transition-colors',
                          level <= strength ? strengthColors[strength - 1] : 'bg-white/10'
                        )}
                      />
                    ))}
                  </div>
                  <p className={cn(
                    'text-xs',
                    strength === 0 ? 'text-red-400' :
                    strength === 1 ? 'text-yellow-400' :
                    strength === 2 ? 'text-blue-400' : 'text-green-400'
                  )}>
                    {strengthLabels[strength - 1] || 'Too weak'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-1 border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <Label htmlFor="terms" className="text-sm text-gray-400 leading-relaxed cursor-pointer">
                I agree to the{' '}
                <Link to="#" className="text-blue-400 hover:text-blue-300">Terms of Service</Link>
                {' '}and{' '}
                <Link to="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-6 rounded-xl font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              '14-day free trial',
              'No credit card required',
              'Full feature access',
              'Cancel anytime',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>

          {/* Sign in link */}
          <p className="mt-8 text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      {/* Right side - Visual */}
<div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">

  {/* Background Layers */}
<div
  className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
  style={{ backgroundImage: `url(${heroImage})` }}
/>
  {/* Animated Glow Shapes */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float" />
    <div
      className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float"
      style={{ animationDelay: "4s" }}
    />
  </div>

  {/* Subtle Grid Overlay */}
  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

  {/* Centered Content */}
  <div className="relative z-10 flex flex-col items-center justify-center text-center px-16 max-w-2xl space-y-8">

    <div className="px-5 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm tracking-widest uppercase">
      HR Intelligence Platform
    </div>

    <h2 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight">
      Smarter Hiring <br />
      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Powered by AI
      </span>
    </h2>

    <p className="text-lg xl:text-xl text-gray-300 leading-relaxed">
      Transform recruitment with predictive analytics, skill insights,
      and intelligent salary estimation — all in one powerful dashboard.
    </p>

    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />

  </div>
</div>
    </div>
  );
}
