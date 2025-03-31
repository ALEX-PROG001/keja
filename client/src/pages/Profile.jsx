import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: currentUser?.email || "",
    username: currentUser?.username || "",
    password: "",
    avatar: currentUser?.avatar || "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));
      if (storedUser) {
        dispatch(updateUserSuccess(storedUser));
      } else {
        navigate("/sign-in");
      }
    }
  }, [currentUser, navigate, dispatch]);

  useEffect(() => {
    const fetchGoogleAvatar = async () => {
      try {
        const res = await fetch(`/api/auth/google/avatar?email=${currentUser.email}`);
        const data = await res.json();
        if (data.avatar && !formData.avatar) {
          setFormData((prev) => ({ ...prev, avatar: data.avatar }));
        }
      } catch (error) {
        console.error("Error fetching Google avatar:", error);
      }
    };

    if (currentUser?.email?.includes("gmail.com") && !formData.avatar) {
      fetchGoogleAvatar();
    }
  }, [currentUser, formData.avatar]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
  
      const data = await res.json();
      console.log('Update response:', data);
  
      if (res.status === 401) {
        dispatch(updateUserFailure('Authentication failed. Please login again.'));
        navigate('/sign-in');
        return;
      }
  
      if (!res.ok) {
        dispatch(updateUserFailure(data.message || 'Update failed'));
        return;
      }
  
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      // Clear password field after successful update
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (error) {
      console.error('Update error:', error);
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: 'include'
      });

      const data = await res.json();
      
      if (res.ok) {
        localStorage.removeItem('currentUser');
        navigate('/sign-in');
      } else {
        throw new Error(data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Delete error:', error);
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Always clear local data and redirect
      localStorage.removeItem('currentUser');
      dispatch(signOutUserSuccess());
      navigate('/sign-in');
  
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local data even if API call fails
      localStorage.removeItem('currentUser');
      dispatch(signOutUserSuccess());
      navigate('/sign-in');
    }
  };
  return (
    <div className="relative flex flex-col min-h-screen bg-white w-full max-w-screen-2xl mx-auto px-4 pb-20">
      <div className="flex flex-col items-center justify-center w-full mt-6">
        <img
          src={formData.avatar || currentUser?.avatar}
          alt="profile"
          className="rounded-xl object-cover"
          style={{ height: "6em", width: "6em" }}
        />
        <h2 className="text-black text-xl font-bold mt-3">Profile</h2>
        <p className="text-gray-500 text-sm mt-1">ID: {currentUser?._id}</p>
        {updateSuccess && <p className="text-green-600 mt-2">Profile updated successfully!</p>}
      </div>

      <form className="w-full max-w-md mx-auto mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl text-black focus:outline-none bg-gray-200 h-14 p-4 text-base"
          />

          <input
            type="text"
            placeholder="Username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full rounded-xl text-black focus:outline-none bg-gray-200 h-14 p-4 text-base"
          />

          <input
            type="password"
            placeholder="Password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl text-black focus:outline-none bg-gray-200 h-14 p-4 text-base"
          />

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-black text-white text-base font-bold transition-all duration-200 mt-4"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </div>
      </form>

      <div className="flex justify-between max-w-md mx-auto mt-12 mb-16 px-4">
  <button onClick={handleSignOut} className="text-gray-600 hover:underline">
    Sign Out
  </button>
  <button onClick={handleDeleteUser} className="text-red-600 hover:underline">
    Delete Account
  </button>
</div>
    </div>
  );
}
