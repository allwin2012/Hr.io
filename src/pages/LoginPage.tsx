import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Lock, LogIn, Mail, Moon, Sun, Eye, EyeOff, User } from 'lucide-react';
import { useSnackbar } from '../contexts/SnackbarContext';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { theme, toggleTheme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState('');
  // name is the state that handles the name of the user
  const [name, setName] = useState('');
  const { showSnackbar } = useSnackbar();
  // forgotPasswordStage is the state that handles the forgot password flow
  const [forgotPasswordStage, setForgotPasswordStage] = useState<'none' | 'email' | 'otp' | 'reset'>('none');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newPasswordMismatchError, setNewPasswordMismatchError] = useState('');


  // getGreeting is the function that gets the greeting based on the time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };
  // validatePassword is the function that validates the password
  const validatePassword = (pwd: string) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongRegex.test(pwd)) {
      setPasswordError('Password must be at least 8 characters, include uppercase, number, and symbol.');
    } else {
      setPasswordError('');
    }
  };
  // validatePasswordMatch is the function that validates the password match
  const validatePasswordMatch = () => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordMismatchError('Passwords do not match');
    } else {
      setPasswordMismatchError('');
    }
  };


  // API_BASE_URL is the base URL for the API
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // handleSubmit is the function that handles the submission of the form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSignUp) {
      if (password !== confirmPassword) {
        setPasswordMismatchError('Passwords do not match');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          showSnackbar('Registration successful!', 'success');
          localStorage.setItem('token', data.token);
          localStorage.setItem('userName', name);
          onLogin(); // trigger parent login logic
        } else {
          showSnackbar(data.message || 'Registration failed', 'error');
        }
      } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof Error) {
          showSnackbar(error.message || 'Something went wrong', 'error');
        } else {
          showSnackbar('Something went wrong', 'error');
        }
      }
    } else {
      // Login flow
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          const userName = data.user.name;
          const greeting = `Hi, ${getGreeting()} ${userName} 🌞`;
          showSnackbar(greeting, 'success');
          localStorage.setItem('token', data.token);
          localStorage.setItem('userName', data.user.name); 
          localStorage.setItem('UserId',data.user.id);
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('userRole', data.user.role);
          localStorage.setItem('userDepartment', data.user.department);
          onLogin(); // trigger parent login logic
        }
        else {
          showSnackbar(data.message || 'Login failed', 'error');
        }
      } catch (error) {
        console.error('Login error:', error);
        if (error instanceof Error) {
          showSnackbar(error.message || 'Something went wrong', 'error');
        } else {
          showSnackbar('Something went wrong', 'error');
        }
      }
    }
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar(data.message || 'OTP sent to your email!', 'success');
        setForgotPasswordStage('otp');
      } else {
        showSnackbar(data.message || 'Failed to send OTP', 'error');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error instanceof Error) {
        showSnackbar(error.message || 'Something went wrong', 'error');
      } else {
        showSnackbar('Something went wrong', 'error');
      }
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar(data.message || 'OTP verified!', 'success');
        setForgotPasswordStage('reset');
      } else {
        showSnackbar(data.message || 'Invalid OTP', 'error');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error instanceof Error) {
        showSnackbar(error.message || 'Something went wrong', 'error');
      } else {
        showSnackbar('Something went wrong', 'error');
      }
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setNewPasswordMismatchError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar(data.message || 'Password reset successful!', 'success');
        setForgotPasswordStage('none');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        showSnackbar(data.message || 'Password reset failed', 'error');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      if (error instanceof Error) {
        showSnackbar(error.message || 'Something went wrong', 'error');
      } else {
        showSnackbar('Something went wrong', 'error');
      }
    }
  };




  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Welcome section */}
      <div className="md:w-1/2 bg-gradient-to-br from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 p-8 md:p-12 flex flex-col justify-center">
  <div className="max-w-md mx-auto">
    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-['Poppins']">
      Emplyze
    </h1>
    <p className="text-green-100 text-lg md:text-xl mb-8">
      Empower your workforce with a smart HR platform. Simplify management, enhance productivity, and foster employee growth.
    </p>
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <h2 className="text-white text-xl font-semibold mb-3">Key HR Features</h2>
      <ul className="space-y-2 text-green-100">
        <li className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Leave & attendance management</span>
        </li>
        <li className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Employee onboarding & profile tracking</span>
        </li>
        <li className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Salary slips and payroll processing</span>
        </li>
        <li className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Kudos & performance reviews</span>
        </li>
      </ul>
    </div>
  </div>
</div>

      {/* Login/Sign up form */}
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-['Poppins']">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-white" />
              ) : (
                <Moon size={20} className="text-gray-700" />
              )}
            </button>
          </div>

          {forgotPasswordStage === 'none' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-500 dark:text-gray-400" />

                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 text-black dark:text-white"
                    placeholder="Your Name"
                    required
                    disabled={!isSignUp}
                  />
                </div>
              </div>


              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 text-black dark:text-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 text-black dark:text-white"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">{passwordError}</p>
                )}
              </div>


              {isSignUp && (
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={validatePasswordMatch}
                      className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 text-black dark:text-white"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {passwordMismatchError && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{passwordMismatchError}</p>
                  )}
                </div>

              )}

              {!isSignUp && (
                <div className="flex items-center justify-end">
                  <a
                    href="#"
                    onClick={() => setForgotPasswordStage('email')}
                    className="text-sm text-green-600 dark:text-green-400 hover:underline"
                  >
                    Forgot your password?
                  </a>

                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-green-400 transition duration-200"
              >
                <LogIn size={18} />
                <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
              </button>

              <div className="relative flex items-center justify-center mt-6">
                <div className="absolute w-full border-t border-gray-300 dark:border-gray-700"></div>
                <div className="relative bg-gray-50 dark:bg-gray-900 px-4 text-sm text-gray-500 dark:text-gray-400">
                  Or continue with
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition duration-200"
              >
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                  <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Continue with Google</span>
              </button>
            </form>
          ) : forgotPasswordStage === 'email' ? (
            // 🔐 Enter Email
            <form onSubmit={handleSendOTP} className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Forgot Password</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enter your email to receive a reset code.</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-green-500 dark:focus:ring-green-400 text-black dark:text-white"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
              >
                Send OTP
              </button>
              <button
                type="button"
                onClick={() => setForgotPasswordStage('none')}
                className="text-sm text-green-600 dark:text-green-400 hover:underline mt-2"
              >
                Back to login
              </button>
            </form>
          ) : forgotPasswordStage === 'otp' ? (
            // 🔐 Enter OTP
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Verify OTP</h2>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter OTP"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-green-500 dark:focus:ring-green-400 text-black dark:text-white"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={() => setForgotPasswordStage('none')}
                className="text-sm text-green-600 dark:text-green-400 hover:underline mt-2"
              >
                Back to login
              </button>
            </form>
          ) : forgotPasswordStage === 'reset' ? (
            // 🔐 Reset Password
            <form onSubmit={handleResetPassword} className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reset Password</h2>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="New password"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-green-500 dark:focus:ring-green-400 text-black dark:text-white"
              />
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-green-500 dark:focus:ring-green-400 text-black dark:text-white"
              />
              {newPasswordMismatchError && (
                <p className="text-sm text-red-500 dark:text-red-400">{newPasswordMismatchError}</p>
              )}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
              >
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => setForgotPasswordStage('none')}
                className="text-sm text-green-600 dark:text-green-400 hover:underline mt-2"
              >
                Back to login
              </button>
            </form>
          ) : null}



          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
            <button
              onClick={toggleForm}
              className="font-medium text-green-600 dark:text-green-400 hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
