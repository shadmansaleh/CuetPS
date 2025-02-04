import React, { useState } from "react";
import { enqueueSnackbar } from "notistack";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        enqueueSnackbar("Password reset link sent!", { variant: "success" });
      } else {
        enqueueSnackbar(data.error, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", { variant: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        {isSubmitted ? (
          <p className="text-center text-green-600">
            Check your email for the password reset link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
            />
            <button type="submit" className="btn btn-primary w-full">
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
