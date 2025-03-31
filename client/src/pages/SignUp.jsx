
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';



const LoadingDots = () => (
  <div className="flex gap-2 justify-center items-center">
    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
  </div>
);

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }; 

  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden w-full max-w-screen-2xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center bg-white p-4 pb-2 justify-between">
        <h2 className="text-black text-lg font-bold text-center flex-1">Sign Up</h2>
      </div>

      {/* Form */}
      <form className="w-full max-w-md mx-auto px-4">
        {/* Username Input */}
<div className="flex flex-wrap items-end gap-4 px-4 py-3">
  <label className="flex flex-col flex-1">
    <input
      type="text"
      placeholder="Username"
      id="username"
      onChange={handleChange}
      className="form-input w-full rounded-xl text-black focus:outline-none border-none bg-gray-200 h-14 p-4 text-base"
    />
  </label>
</div>

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

{/* Submit and OAuth Buttons */}
<div className="flex flex-col gap-4 px-4 py-3">
  <button
    type="submit"
    onClick={handleSubmit}
    className="w-full h-12 rounded-xl bg-black text-white text-base font-bold transition-all duration-200"
  >
    {loading ? <LoadingDots /> : 'Sign up'}
  </button>
  <OAuth />
</div>

{/* Error Message */}
{error && <p className="text-red-500 text-center mt-5">{error}</p>}

        {/* Login Link */}
        <div className="text-center mt-4">
          <Link to="/signin" className="text-gray-600 text-sm hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
