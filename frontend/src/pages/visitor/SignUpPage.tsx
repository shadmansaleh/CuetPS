import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, name);
      navigate("/profile");
    } catch (err) {
      setError("Failed to create account");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Create Your Account
          </h2>
          <p className="text-gray-600 mt-2">Start your journey with us</p>
        </div>
        <form className="space-y-6 rounded-xl" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center">
              {error}
            </div>
          )}
          <div className="form-control w-full space-y-4">
            <div>
              <label htmlFor="name" className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter a secure password"
              />
            </div>
          </div>
          <div>
            <button type="submit" className="btn btn-primary w-full">
              Sign Up
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
