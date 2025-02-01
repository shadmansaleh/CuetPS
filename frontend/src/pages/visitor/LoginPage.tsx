import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      if (user?.role === "admin") await navigate("/admin");
      else await navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8  ">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">Welcome Back</h2>
          <p className="mt-2 text-gray-800 ">Sign in to your account</p>
        </div>
        <form
          className="bg-white shadow-lg rounded-xl p-8 space-y-6 "
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-center">
              {error}
            </div>
          )}
          <div className="form-control w-full space-y-4">
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
                placeholder="Email address"
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-indigo-600 hover:underline">
                Register now
              </Link>
            </p>
          </div>
          <div>
            <button type="submit" className="btn btn-primary w-full">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
