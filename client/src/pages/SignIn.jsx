import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

const LoadingDots = () => (
  <div className="flex gap-2 justify-center items-center">
    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
  </div>
);

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden w-full max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center bg-white p-4 pb-2 justify-between">
        <h2 className="text-black text-lg font-bold text-center flex-1">Sign In</h2>
      </div>

      {/* Form */}
      <form className="w-full max-w-md mx-auto px-4">
        {/* Email Input */}
        <div className="flex flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col flex-1">
            <input
              type="email"
              placeholder="Email"
              id="email"
              onChange={handleChange}
              className="form-input w-full rounded-xl text-black focus:outline-none border-none bg-gray-200 h-14 p-4 text-base"
            />
          </label>
        </div>

        {/* Password Input */}
        <div className="flex flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col flex-1">
            <input
              type="password"
              placeholder="Password"
              id="password"
              onChange={handleChange}
              className="form-input w-full rounded-xl text-black focus:outline-none border-none bg-gray-200 h-14 p-4 text-base"
            />
          </label>
        </div>

        {/* Submit Button */}
        {/* Submit and OAuth Buttons */}
<div className="flex flex-col gap-4 px-4 py-3">
  <button
    type="submit"
    onClick={handleSubmit}
    className="w-full h-12 rounded-xl bg-black text-white text-base font-bold transition-all duration-200"
  >
    {loading ? <LoadingDots /> : 'Sign in'}
  </button>
  <OAuth />
</div>

{/* Error Message */}
{error && <p className="text-red-500 text-center mt-5">{error}</p>}

{/* Signup Link */}
<div className="text-center mt-4">
  <button 
    onClick={() => navigate('/sign-up')} 
    className="text-gray-600 text-sm hover:underline"
  >
    Don't have an account? Sign up
  </button>
</div>
      </form>
    </div>
  );
}
