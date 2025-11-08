import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate password length
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long!' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }

    if (!formData.email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address!' });
      return;
    }

    let users = [];
    try {
      const storedUsers = localStorage.getItem("users");
      users = storedUsers ? JSON.parse(storedUsers) : [];
      if (!Array.isArray(users)) {
        console.warn('Stored users is not an array, resetting');
        users = [];
      }
    } catch (err) {
      console.warn('Failed to parse users from localStorage, resetting list.', err);
      users = [];
    }

    const exists = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
    if (exists) {
      setMessage({ type: 'error', text: 'User already exists!' });
      return;
    }

    const newUser = {
      id: Date.now(),
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    users.push(newUser);
    try {
      localStorage.setItem("users", JSON.stringify(users));
    } catch (err) {
      console.error('Failed to save user to localStorage', err);
      setMessage({ type: 'error', text: 'Unable to save user. Check browser storage settings.' });
      return;
    }

    setMessage({ type: 'success', text: 'Sign-up successful! Redirecting to Sign In...' });
    // pass the email to the SignIn page so it's prefilled
    setTimeout(() => navigate("/signin", { state: { email: newUser.email } }), 700);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        {message && (
          <div className={`mb-3 p-2 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}
        <input type="text" name="username" placeholder="Username"
          value={formData.username} onChange={handleChange}
          className="w-full border p-2 mb-3 rounded" required />

        <input type="email" name="email" placeholder="Email"
          value={formData.email} onChange={handleChange}
          className="w-full border p-2 mb-3 rounded" required />

        <input type="password" name="password" placeholder="Password"
          value={formData.password} onChange={handleChange}
          className="w-full border p-2 mb-3 rounded" required />

        <input type="password" name="confirmPassword" placeholder="Confirm Password"
          value={formData.confirmPassword} onChange={handleChange}
          className="w-full border p-2 mb-3 rounded" required />

        <select name="role" value={formData.role} onChange={handleChange}
          className="w-full border p-2 mb-3 rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full rounded hover:bg-blue-600">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;