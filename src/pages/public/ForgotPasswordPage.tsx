import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS'>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 600);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('NEW_PASSWORD');
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('SUCCESS');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center p-4 selection:bg-white selection:text-black">
      <div className="relative w-full max-w-md bg-[#0B0B0B] border border-[#262626] rounded-2xl p-8 shadow-2xl shadow-black/80">
        <Link to="/login" className="inline-flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-white mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>

        {/* Step 1: Email */}
        {step === 'EMAIL' && (
          <div>
            <h2 className="text-xl font-bold text-white">Reset Account Password</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Enter your registered institutional email to receive a 6-digit verification code.
            </p>

            <form onSubmit={handleSendCode} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="student@demo.com"
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <Button variant="primary" type="submit" className="w-full text-xs font-bold" isLoading={isLoading}>
                Send Recovery Token
              </Button>
            </form>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 'OTP' && (
          <div>
            <h2 className="text-xl font-bold text-white">Enter 6-Digit Code</h2>
            <p className="text-xs text-neutral-400 mt-1">
              A temporary token was sent to <strong className="text-white">{email || 'your email'}</strong>.
            </p>

            <form onSubmit={handleVerifyCode} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Security Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="849201"
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-center text-lg tracking-widest font-mono text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <Button variant="primary" type="submit" className="w-full text-xs font-bold" isLoading={isLoading}>
                Verify Token
              </Button>
            </form>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 'NEW_PASSWORD' && (
          <div>
            <h2 className="text-xl font-bold text-white">Set New Password</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Choose a strong password with at least 8 characters.
            </p>

            <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <Button variant="primary" type="submit" className="w-full text-xs font-bold" isLoading={isLoading}>
                Confirm Password Reset
              </Button>
            </form>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'SUCCESS' && (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white">Password Updated</h2>
            <p className="text-xs text-neutral-400 mt-2">
              Your password has been successfully reset. You may now sign into your institutional account.
            </p>
            <Button
              variant="primary"
              className="w-full mt-6 text-xs font-bold"
              onClick={() => navigate('/login')}
            >
              Back to Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
