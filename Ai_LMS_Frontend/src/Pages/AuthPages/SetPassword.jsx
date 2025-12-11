import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const SetPassword = () => {
  const { token, email } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const baseUrl = import.meta.env.VITE_BASE_URL;

  //Validate password strength
  const isValidPassword = (pwd) => {
    const length = pwd.length >= 6;
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[@#$%^&*!_]/.test(pwd);
    return length && hasLetter && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidPassword(password)) {
      setError("Password must be at least 6 characters and contain letters, numbers, and special characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/api/set-password/`, {
        email,
        token,
        password,
      });

      setMessage(response.data.message || 'Password set successfully');
      setError('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-orange-200">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl border border-orange-200/60">

        <h2 className="text-2xl font-bold text-center text-orange-700 mb-4">
          Set Your Password
        </h2>

        {message && <p className="text-green-600 text-center mb-2">{message}</p>}
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col items-center">

          {/* New Password */}
          <div className="mb-4 w-full flex flex-col items-center relative">
            <label className="self-start ml-[10%] mb-1 font-medium text-orange-700">New Password</label>
            <input
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-orange-300 rounded-md w-[80%] p-2 pr-10 bg-white shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <div
              className="absolute right-10 top-[38px] text-orange-600 cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4 w-full flex flex-col items-center relative">
            <label className="self-start ml-[10%] mb-1 font-medium text-orange-700">Confirm Password</label>
            <input
              type={showConfirmPass ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-orange-300 rounded-md w-[80%] p-2 pr-10 bg-white shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <div
              className="absolute right-10 top-[38px] text-orange-600 cursor-pointer"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
            >
              {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white 
                       px-6 py-2 rounded-lg shadow-md hover:shadow-xl transition-transform 
                       hover:scale-[1.02]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
