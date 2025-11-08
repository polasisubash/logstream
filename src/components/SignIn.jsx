import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // If redirected from signup, prefill email
    if (location && location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please fill in all fields!' });
      return;
    }

    let users = [];
    try {
      const storedUsers = localStorage.getItem("users");
      users = storedUsers ? JSON.parse(storedUsers) : [];
      if (!Array.isArray(users)) {
        console.warn('Stored users is not an array');
        setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        return;
      }
    } catch (err) {
      console.warn('Unable to parse users from localStorage', err);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      return;
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
      setMessage({ type: 'success', text: 'Login successful! Redirecting...' });

      // Role-based redirection
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/products"); // New Products page for shopping
        }
      }, 500);
    } else {
      setMessage({ type: 'error', text: 'Invalid credentials!' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-3xl font-bold mb-6">Sign In</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        {message && (
          <div className={`mb-3 p-2 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}
        <input type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-3 rounded" required />

        <input type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-3 rounded" required />

        <button type="submit" className="bg-green-500 text-white px-4 py-2 w-full rounded hover:bg-green-600">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;