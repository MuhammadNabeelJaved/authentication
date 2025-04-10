import React, { useState, useEffect, useRef } from 'react';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  // Set up the countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Focus the first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;
    
    // Update the OTP array
    const newOtp = [...otp];
    
    // Take only the last character if multiple are pasted or entered
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    // Clear error when user types
    if (error) setError('');
    
    // Auto-focus next input if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace - clear current field and focus previous
    if (e.key === 'Backspace') {
      if (index > 0 && !otp[index]) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
    
    // Handle left arrow - focus previous input
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    
    // Handle right arrow - focus next input
    else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle pasting of the entire OTP code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted content is numeric and has the right length
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  const resendOTP = () => {
    setIsResending(true);
    // Simulate API call to resend OTP
    setTimeout(() => {
      setTimeLeft(30);
      setIsResending(false);
      setError('');
    }, 1500);
  };

  const verifyOTP = () => {
    // Check if all digits are filled
    if (otp.some(digit => digit === '')) {
      setError('Please enter all 6 digits');
      return;
    }
    
    setLoading(true);
    const completeOtp = otp.join('');
    
    // Simulate API verification call
    setTimeout(() => {
      console.log('Verifying OTP:', completeOtp);
      
      // For demo purposes, we'll consider "123456" as the correct OTP
      if (completeOtp === '123456') {
        console.log('OTP verified successfully!');
        // You would redirect or continue the flow here
      } else {
        setError('Invalid OTP. Please try again.');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Verification Code
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a 6-digit code to your email address
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Enter verification code
                </label>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
              </div>
              
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : null}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                    />
                ))}
                </div>
              </div>
            <div className="flex items-center justify-between mt-4">
                <button
                    type="button"
                    onClick={resendOTP}
                    disabled={isResending || timeLeft > 0}
                    className={`text-sm font-medium text-indigo-600 hover:text-indigo-500 ${isResending ? 'cursor-not-allowed' : ''}`}
                >
                    {isResending ? 'Resending...' : `Resend OTP (${timeLeft}s)`}
                </button>
                <button
                    type="button"
                    onClick={verifyOTP}
                    disabled={loading}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;